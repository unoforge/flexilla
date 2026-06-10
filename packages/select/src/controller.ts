import {
  createSelectCore,
  renderSelectedValues,
  setupSelectValueContainer,
  syncSelectEmptyState,
  defaultFilter,
  parseDefaultValues,
  serializeSelectedValues,
  setItemVisibility,
  SELECT_CLEAR,
  SELECT_CLEAR_ALL,
  SELECT_HIDDEN_VALUE,
  SELECT_INPUT,
  SELECT_ITEM,
  SELECT_REMOVE,
  SELECT_TRIGGER,
  SELECT_VALUE,
  type SelectCore,
  type SelectItem,
  type SelectState,
} from "@flexilla/select-core";
import { keyboardNavigation } from "@flexilla/utilities/accessibility";
import { waitForFxComponents } from "@flexilla/utilities/dom-utilities";
import { domTeleporter } from "@flexilla/utilities/dom-teleport";
import { CreateOverlay } from "flexipop/create-overlay";
import type { SelectController, SelectDom, SelectOptions } from "./types";
import { parseItem, resolveOverlayOptions } from "./helpers";
import { resolveSelectTarget } from "./target";

const defaultExperimentalOptions = {
  teleport: true,
  teleportMode: "move" as const,
};

type Teleporter = {
  append: () => void;
  remove: () => void;
  restore: () => void;
};

export const createSelect = (options: SelectOptions = {}): SelectController => {
  const core = createSelectCore({ multiple: options.multiple });
  const filter = options.filter ?? defaultFilter;
  let root: HTMLElement | null = null;
  let selectId: string | null = null;
  let trigger: HTMLElement | null = null;
  let content: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let itemElements: HTMLElement[] = [];
  type ItemMeta = { item: SelectItem; element: HTMLElement };
  let itemsMeta: ItemMeta[] = [];
  let renderedValues = new Set<string>();
  const itemsByValue = new Map<string, ItemMeta>();
  const boundElements = new WeakSet<HTMLElement>();
  let selectedValueEls: HTMLElement[] = [];
  let clearEls: HTMLElement[] = [];
  let clearAllEls: HTMLElement[] = [];
  let removeValueEls: HTMLElement[] = [];
  let hiddenValueInput: HTMLInputElement | null = null;
  let overlay: CreateOverlay | null = null;
  let teleporter: Teleporter | null = null;
  let navigationKeys: { make: () => void; destroy: () => void } | null = null;
  const cleanup: Array<() => void> = [];
  let unsubscribe: (() => void) | null = null;
  let placeholder = "Select";
  let syncingOverlay = false;
  const searchDebounce = options.searchDebounce ?? 100;
  let lastSearch = core.getState().search;
  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  const experimentalOptions = { ...defaultExperimentalOptions, ...(options.experimental || {}) };

  const getScopeElement = () => root ?? content ?? trigger ?? input;

  const queryById = <T extends HTMLElement>(selector: string) =>
    Array.from(document.querySelectorAll<T>(`${selector}[data-select-id="${selectId}"]`));

  const syncHiddenValueInput = (selectedValues: string[]) => {
    if (!(hiddenValueInput instanceof HTMLInputElement)) return;
    const nextValue = serializeSelectedValues(selectedValues, options.multiple ?? false);
    if (hiddenValueInput.value === nextValue) return;
    hiddenValueInput.value = nextValue;
    hiddenValueInput.dispatchEvent(new Event("input", { bubbles: true }));
    hiddenValueInput.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const resolveInitialValue = () =>
    options.defaultValue ??
    content?.getAttribute("data-default-value") ??
    hiddenValueInput?.value ??
    "";

  const applyInitialSelection = () => {
    if (core.getState().selectedValues.length > 0) return;
    const defaultValues = parseDefaultValues(resolveInitialValue());
    if (!defaultValues.length) return;

    const nextValues = options.multiple ? defaultValues : defaultValues.slice(0, 1);
    nextValues.forEach((value) => core.select(value));
  };

  const resolveSingleElement = <T extends HTMLElement>({
    selector,
    role,
    required = true,
  }: {
    selector: string;
    role: string;
    required?: boolean;
  }): T | null => {
    const matches = queryById<T>(selector);
    if (matches.length > 1) {
      throw new Error(`[select] expected one ${role} for "${selectId}", found ${matches.length}`);
    }
    if (!matches.length) {
      if (required) throw new Error(`[select] ${role} is required for "${selectId}"`);
      return null;
    }
    return matches[0] ?? null;
  };

  const refreshKeyboardNavigation = () => {
    navigationKeys?.destroy();
    if (!(content instanceof HTMLElement)) {
      navigationKeys = null;
      return;
    }

    navigationKeys = keyboardNavigation({
      containerElement: content,
      targetChildren: itemElements,
      direction: "up-down",
    });

    if (core.getState().open && navigationKeys) {
      navigationKeys.make();
    }
  };

  const ensureHighlighted = () => {
    const state = core.getState();
    if (
      state.highlightedIndex !== null &&
      state.highlightedIndex >= 0 &&
      state.highlightedIndex < state.items.length &&
      !state.items[state.highlightedIndex]?.disabled
    ) {
      return;
    }
    const firstEnabled = state.items.findIndex((item) => !item.disabled);
    if (firstEnabled >= 0) core.highlight(firstEnabled);
  };

  const syncOverlay = (state: SelectState) => {
    if (!overlay || syncingOverlay || !(content instanceof HTMLElement)) return;
    const overlayState = content.dataset.state || "close";
    if (state.open && overlayState !== "open") {
      syncingOverlay = true;
      restoreEl();
      overlay.show();
      syncingOverlay = false;
      return;
    }
    if (!state.open && overlayState === "open") {
      syncingOverlay = true;
      overlay.hide();
      syncingOverlay = false;
    }
  };

  const teardownItems = () => {
    renderedValues.forEach((value) => core.unregisterItem(value));
    itemElements = [];
    renderedValues = new Set<string>();
  };

  const registerItems = () => {
    if (!(content instanceof HTMLElement)) return;

    const existingItems = Array.from(content.querySelectorAll<HTMLElement>(SELECT_ITEM));
    itemsMeta = existingItems
      .filter((element) => {
        const itemId = element.getAttribute("data-select-id");
        return !itemId || itemId === selectId;
      })
      .map((element): ItemMeta | null => {
        const item = parseItem(element);
        if (!item) return null;
        return { item, element };
      })
      .filter((entry): entry is ItemMeta => Boolean(entry));

    itemsByValue.clear();

    itemsMeta.forEach(({ element, item }) => {
      itemsByValue.set(item.value, { item, element });
      element.setAttribute("role", "option");
      if (item.disabled) element.setAttribute("aria-disabled", "true");
      if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1");

      if (boundElements.has(element)) return;

      const clickHandler = (event: Event) => {
        event.preventDefault();
        if (item.disabled) return;
        core.toggleValue(item.value);
        const index = itemElements.indexOf(element);
        if (index >= 0) core.highlight(index);
        if (!options.multiple) core.close();
      };
      const focusHandler = () => {
        const index = itemElements.indexOf(element);
        if (index >= 0) core.highlight(index);
      };

      element.addEventListener("click", clickHandler);
      element.addEventListener("focus", focusHandler);
      element.addEventListener("keydown", handleContentKeyDown);
      cleanup.push(() => element.removeEventListener("click", clickHandler));
      cleanup.push(() => element.removeEventListener("focus", focusHandler));
      cleanup.push(() => element.removeEventListener("keydown", handleContentKeyDown));
      boundElements.add(element);
    });
  };

  const updateFromSearch = (query: string) => {
    if (!itemsMeta.length) registerItems();

    const filtered = itemsMeta.filter(({ item }) => filter(query, item));
    const nextValues = new Set(filtered.map(({ item }) => item.value));

    teardownItems();

    filtered.forEach(({ item, element }) => {
      setItemVisibility(element, true);
      itemElements.push(element);
      renderedValues.add(item.value);
      core.registerItem(item);
    });

    itemsMeta.forEach(({ item, element }) => {
      if (nextValues.has(item.value)) return;
      setItemVisibility(element, false);
      element.removeAttribute("data-select-highlighted");
    });

    refreshKeyboardNavigation();

    syncSelectEmptyState({
      content,
      visibleCount: filtered.length,
      query,
    });

    ensureHighlighted();
    if (!filtered.length) core.highlight(null);
  };

  const updateAria = (state: SelectState) => {
    if (trigger) {
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", String(state.open));
    }
    if (content) {
      content.setAttribute("role", "listbox");
    }
  };

  const updateSelectedDisplays = (state: SelectState) => {
    syncHiddenValueInput(state.selectedValues);
    renderSelectedValues({
      containers: selectedValueEls,
      itemsByValue,
      selectedValues: state.selectedValues,
      multiple: options.multiple,
      placeholder,
      summary: options.summary,
      onRemove: (value) => core.unselect(value),
      registerCleanup: (fn) => cleanup.push(fn),
    });
  };

  const updateItemsState = (state: SelectState) => {
    itemElements.forEach((element, index) => {
      const value = element.dataset.selectItem;
      const isHighlighted = state.highlightedIndex === index;
      const isSelected = Boolean(value && state.selectedValues.includes(value));

      if (isHighlighted) element.setAttribute("data-select-highlighted", "true");
      else element.removeAttribute("data-select-highlighted");

      element.setAttribute("aria-selected", String(isSelected));
    });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        navigationKeys?.make();
        core.open();
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        navigationKeys?.make();
        core.open();
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        core.toggle();
        break;
      }
      case "Escape": {
        core.close();
        break;
      }
      default:
        break;
    }
  };

  const handleContentKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Enter": {
        const state = core.getState();
        if (state.highlightedIndex !== null) {
          const item = state.items[state.highlightedIndex];
          if (!item?.disabled) {
            core.toggleValue(item.value);
            if (!options.multiple) core.close();
          }
        }
        break;
      }
      case "Escape": {
        core.close();
        trigger?.focus();
        break;
      }
      default:
        break;
    }
  };

  const handleTriggerClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    core.toggle();
    ensureHighlighted();
  };

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    core.setSearch(target.value || "");
  };

  const bindClick = (el: HTMLElement, action: () => void) => {
    const handler = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      action();
    };
    el.addEventListener("click", handler);
    cleanup.push(() => el.removeEventListener("click", handler));
  };

  const moveElOnInit = () => {
    if (!teleporter || !experimentalOptions.teleport) return;
    const currentTeleporter = teleporter;
    waitForFxComponents(() => {
      if (experimentalOptions.teleportMode === "detachable") currentTeleporter.remove();
      else currentTeleporter.append();
    });
  };

  const moveEl = () => {
    if (!teleporter || !experimentalOptions.teleport || experimentalOptions.teleportMode !== "detachable") return;
    teleporter.remove();
  };

  const restoreEl = () => {
    if (!teleporter || !experimentalOptions.teleport || experimentalOptions.teleportMode !== "detachable") return;
    teleporter.append();
  };

  const bindDom = () => {
    if (!selectId) return;

    trigger = resolveSingleElement<HTMLElement>({ selector: SELECT_TRIGGER, role: "trigger" });
    content = root;
    input = resolveSingleElement<HTMLInputElement>({ selector: SELECT_INPUT, role: "search input", required: false });
    hiddenValueInput = document.querySelector<HTMLInputElement>(`${SELECT_HIDDEN_VALUE}[data-select-id="${selectId}"]`);

    // Find selected-value elements by explicit ID, plus those nested inside trigger (which inherits the ID)
    const explicitSelectedValueEls = queryById<HTMLElement>(SELECT_VALUE);
    const nestedSelectedValueEls = trigger
      ? Array.from(trigger.querySelectorAll<HTMLElement>(`${SELECT_VALUE}:not([data-select-id])`))
      : [];
    selectedValueEls = [...explicitSelectedValueEls, ...nestedSelectedValueEls];

    clearEls = queryById<HTMLElement>(SELECT_CLEAR);
    clearAllEls = queryById<HTMLElement>(SELECT_CLEAR_ALL);
    removeValueEls = queryById<HTMLElement>(SELECT_REMOVE);

    const selectedValueSource =
      trigger?.querySelector<HTMLElement>(SELECT_VALUE)?.textContent?.trim() ||
      selectedValueEls[0]?.textContent?.trim() ||
      "";
    const triggerPlaceholder =
      trigger?.getAttribute("data-placeholder") ||
      selectedValueSource ||
      trigger?.textContent?.trim() ||
      placeholder;
    placeholder = triggerPlaceholder || placeholder;

    if (!trigger || !content) {
      throw new Error(`[select] trigger and content are required for "${selectId}"`);
    }

    teleporter = domTeleporter(content, document.body, experimentalOptions.teleportMode);
    moveElOnInit();
    refreshKeyboardNavigation();

    selectedValueEls.forEach((container) => setupSelectValueContainer(container));

    trigger.addEventListener("click", handleTriggerClick);
    trigger.addEventListener("keydown", handleTriggerKeyDown);
    cleanup.push(() => trigger?.removeEventListener("click", handleTriggerClick));
    cleanup.push(() => trigger?.removeEventListener("keydown", handleTriggerKeyDown));

    content.addEventListener("keydown", handleContentKeyDown);
    cleanup.push(() => content?.removeEventListener("keydown", handleContentKeyDown));

    if (input) {
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleContentKeyDown);
      cleanup.push(() => input?.removeEventListener("input", handleInput));
      cleanup.push(() => input?.removeEventListener("keydown", handleContentKeyDown));
    }

    const clearSelection = () => {
      core.clear();
      core.highlight(null);
    };

    clearEls.forEach((el) => bindClick(el, clearSelection));
    clearAllEls.forEach((el) => bindClick(el, clearSelection));
    removeValueEls.forEach((el) => {
      const value = el.getAttribute("data-select-remove");
      if (!value) return;
      bindClick(el, () => core.unselect(value));
    });

    const overlayOptions = resolveOverlayOptions({
      root: getScopeElement() ?? trigger,
      content,
      options,
    });
    const popperOptions = overlayOptions.popper?.eventEffect
      ? {
        eventEffect: {
          disableOnResize: overlayOptions.popper.eventEffect.disableOnResize,
          disableOnScroll: overlayOptions.popper.eventEffect.disableOnScroll,
        },
      }
      : undefined;

    overlay = new CreateOverlay({
      trigger,
      content,
      options: {
        triggerStrategy: "manual",
        placement: overlayOptions.placement,
        offsetDistance: overlayOptions.offsetDistance,
        preventFromCloseOutside: overlayOptions.preventFromCloseOutside,
        preventCloseFromInside: overlayOptions.preventCloseFromInside,
        readjustHeight: overlayOptions.readjustHeight,
        minHeight: overlayOptions.minHeight,
        popper: popperOptions,
        beforeShow: () => {
          navigationKeys?.make();
        },
        onHide: () => {
          navigationKeys?.destroy();
          if (core.getState().open) {
            syncingOverlay = true;
            core.close();
            syncingOverlay = false;
          }
          moveEl();
        },
      },
    });
    cleanup.push(() => overlay?.cleanup());

    registerItems();
    updateFromSearch(core.getState().search);
    applyInitialSelection();
  };

  const render = (state: SelectState) => {
    if (state.search !== lastSearch) {
      lastSearch = state.search;
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        updateFromSearch(state.search);
        searchTimer = null;
      }, searchDebounce);
    }
    updateAria(state);
    updateItemsState(state);
    updateSelectedDisplays(state);
    syncOverlay(state);
  };

  const destroy = () => {
    teardownItems();
    if (searchTimer) clearTimeout(searchTimer);
    cleanup.splice(0).forEach((fn) => fn());
    unsubscribe?.();
    root = null;
    selectId = null;
    trigger = null;
    content = null;
    input = null;
    itemElements = [];
    itemsMeta = [];
    itemsByValue.clear();
    selectedValueEls = [];
    clearEls = [];
    clearAllEls = [];
    removeValueEls = [];
    hiddenValueInput = null;
    overlay = null;
    teleporter?.restore();
    teleporter = null;
    navigationKeys?.destroy();
    navigationKeys = null;
    unsubscribe = null;
  };

  const connect = ({ element }: SelectDom) => {
    const target = resolveSelectTarget(element);
    root = target.element;
    selectId = target.id;
    bindDom();
    unsubscribe?.();
    unsubscribe = core.subscribe(render);
    render(core.getState());
    return { destroy };
  };

  return {
    ...core,
    connect,
  };
};


