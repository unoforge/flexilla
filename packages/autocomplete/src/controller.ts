import {
  createSelectCore,
  renderSelectedValues,
  setupSelectValueContainer,
  syncSelectEmptyState,
  defaultFilter,
  parseDefaultValues,
  serializeSelectedValues,
  setItemVisibility,
  collectItemData,
  AUTOCOMPLETE_HIDDEN_VALUE,
  SELECT_CLEAR,
  SELECT_CLEAR_ALL,
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
import type { AutocompleteController, AutocompleteDom, AutocompleteOptions } from "./types";
import { resolveOverlayOptions } from "./helpers";
import { resolveAutocompleteTarget } from "./target";

const defaultExperimentalOptions = {
  teleport: true,
  teleportMode: "move" as const,
};

type Teleporter = {
  append: () => void;
  remove: () => void;
  restore: () => void;
};

export const createAutocomplete = (options: AutocompleteOptions = {}): AutocompleteController => {
  const core = createSelectCore({ multiple: options.multiple });
  const filter = options.filter ?? defaultFilter;
  let root: HTMLElement | null = null;
  let selectId: string | null = null;
  let trigger: HTMLElement | null = null;
  let content: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let itemElements: HTMLElement[] = [];
  let selectedValueEls: HTMLElement[] = [];
  let clearEls: HTMLElement[] = [];
  let clearAllEls: HTMLElement[] = [];
  let removeValueEls: HTMLElement[] = [];
  let hiddenValueInput: HTMLInputElement | null = null;
  let placeholder = "Select";
  let initialInputValue = "";
  let unsubscribe: (() => void) | null = null;
  let overlay: CreateOverlay | null = null;
  let teleporter: Teleporter | null = null;
  let navigationKeys: { make: () => void; destroy: () => void } | null = null;
  const cleanup: Array<() => void> = [];
  let renderedValues = new Set<string>();
  const searchDebounce = options.searchDebounce ?? 100;
  let lastSearch = core.getState().search;
  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  let syncingOverlay = false;
  const experimentalOptions = { ...defaultExperimentalOptions, ...(options.experimental || {}) };
  type ItemMeta = { item: SelectItem; element: HTMLElement };
  let itemsMeta: ItemMeta[] = [];
  const itemsByValue = new Map<string, ItemMeta>();
  const boundElements = new WeakSet<HTMLElement>();

  const getScopeElement = () => root ?? content ?? trigger ?? input;

  const queryById = <T extends HTMLElement>(selector: string, attribute = "data-select-id") =>
    Array.from(document.querySelectorAll<T>(`${selector}[${attribute}="${selectId}"]`));

  const syncHiddenValueInput = (selectedValues: string[]) => {
    if (!(hiddenValueInput instanceof HTMLInputElement)) return;
    const nextValue = serializeSelectedValues(selectedValues, options.multiple ?? false);
    if (hiddenValueInput.value === nextValue) return;
    hiddenValueInput.value = nextValue;
    hiddenValueInput.dispatchEvent(new Event("input", { bubbles: true }));
    hiddenValueInput.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const resolveHiddenValueInput = () =>
    document.querySelector<HTMLInputElement>(`${AUTOCOMPLETE_HIDDEN_VALUE}[data-select-id="${selectId}"]`) ??
    document.querySelector<HTMLInputElement>(`${AUTOCOMPLETE_HIDDEN_VALUE}[data-autocomplete-id="${selectId}"]`);

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
    attribute = "data-select-id",
    required = true,
  }: {
    selector: string;
    role: string;
    attribute?: string;
    required?: boolean;
  }): T | null => {
    const matches = queryById<T>(selector, attribute);
    if (matches.length > 1) {
      throw new Error(`[autocomplete] expected one ${role} for "${selectId}", found ${matches.length}`);
    }
    if (!matches.length) {
      if (required) throw new Error(`[autocomplete] ${role} is required for "${selectId}"`);
      return null;
    }
    return matches[0] ?? null;
  };

  const resolveContentElement = () => {
    if (!(root instanceof HTMLElement)) return null;
    if (!root.matches(SELECT_INPUT) && root.querySelector(SELECT_ITEM)) return root;

    const matches = Array.from(document.querySelectorAll<HTMLElement>(`[data-select-id="${selectId}"]`))
      .filter((element) => element !== root)
      .filter((element) => element.querySelector(SELECT_ITEM));

    if (matches.length > 1) {
      throw new Error(`[autocomplete] expected one content for "${selectId}", found ${matches.length}`);
    }

    if (!matches.length) {
      throw new Error(`[autocomplete] content is required for "${selectId}"`);
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

  const parseDomItems = () => {
    if (!(content instanceof HTMLElement)) return;
    const existingItems = Array.from(content.querySelectorAll<HTMLElement>(SELECT_ITEM));
    itemsMeta = existingItems
      .map((element): ItemMeta | null => {
        const value = element.dataset.selectItem;
        if (!value) return null;
        const label = (element.getAttribute("data-label") || element.textContent || "").trim() || value;
        const disabled = element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-disabled");
        return { item: { value, label, disabled, data: collectItemData(element) }, element };
      })
      .filter((entry): entry is ItemMeta => Boolean(entry))
      .filter((entry) => {
        const itemId = entry.element.getAttribute("data-select-id");
        return !itemId || itemId === selectId;
      });

    itemsByValue.clear();

    itemsMeta.forEach(({ element, item }) => {
      itemsByValue.set(item.value, { item, element });
      element.setAttribute("role", "option");
      if (item.disabled) element.setAttribute("aria-disabled", "true");
      if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1");
    });
  };

  const teardownItems = () => {
    renderedValues.forEach((value) => core.unregisterItem(value));
    itemElements = [];
    renderedValues = new Set<string>();
  };

  const updateFromSource = (query: string) => {
    if (!itemsMeta.length) parseDomItems();
    const filtered = itemsMeta.filter(({ item }) => filter(query, item));
    const nextValues = new Set(filtered.map(({ item }) => item.value));

    teardownItems();

    filtered.forEach(({ item, element }) => {
      setItemVisibility(element, true);
      if (!boundElements.has(element)) {
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
      }

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

  const updateSelectedDisplays = (state: SelectState) => {
    syncHiddenValueInput(state.selectedValues);
    renderSelectedValues({
      containers: selectedValueEls,
      itemsByValue,
      selectedValues: state.selectedValues,
      multiple: options.multiple,
      placeholder,
      onRemove: (value) => core.unselect(value),
      registerCleanup: (fn) => cleanup.push(fn),
    });

    if (input && !state.open && !options.multiple) {
      input.value =
        state.selectedValues.length === 1
          ? (itemsByValue.get(state.selectedValues[0]!)?.item.label ?? state.selectedValues[0])
          : input.value;
    }
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
        input?.blur();
        break;
      }
      default:
        break;
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!core.getState().open) {
          core.open();
        }
        navigationKeys?.make();
        break;
      }
      default:
        handleContentKeyDown(event);
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
    navigationKeys?.destroy();
    core.setSearch(target.value || "");
    core.open();
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

    trigger = resolveSingleElement<HTMLElement>({
      selector: SELECT_TRIGGER,
      role: "trigger",
      attribute: "data-autocomplete-id",
      required: false,
    });
    content = resolveContentElement();
    input = resolveSingleElement<HTMLInputElement>({
      selector: SELECT_INPUT,
      role: "input",
      attribute: "data-autocomplete-id",
    });
    hiddenValueInput = resolveHiddenValueInput();

    if (!content || !input) {
      throw new Error(`[autocomplete] input and content are required for "${selectId}"`);
    }

    teleporter = domTeleporter(content, document.body, experimentalOptions.teleportMode);
    moveElOnInit();
    refreshKeyboardNavigation();

    selectedValueEls = queryById<HTMLElement>(SELECT_VALUE);
    clearEls = queryById<HTMLElement>(SELECT_CLEAR);
    clearAllEls = queryById<HTMLElement>(SELECT_CLEAR_ALL);
    removeValueEls = queryById<HTMLElement>(SELECT_REMOVE);

    selectedValueEls.forEach((container) => setupSelectValueContainer(container));

    const sourcePlaceholder = input.getAttribute("data-placeholder") || input.getAttribute("placeholder") || placeholder;
    placeholder = sourcePlaceholder || placeholder;
    initialInputValue = input.value;

    if (trigger) {
      trigger.addEventListener("click", handleTriggerClick);
      trigger.addEventListener("keydown", handleTriggerKeyDown);
      cleanup.push(() => trigger?.removeEventListener("click", handleTriggerClick));
      cleanup.push(() => trigger?.removeEventListener("keydown", handleTriggerKeyDown));
    }

    content.addEventListener("keydown", handleContentKeyDown);
    cleanup.push(() => content?.removeEventListener("keydown", handleContentKeyDown));

    const focusHandler = () => {
      navigationKeys?.destroy();
      core.open();
    };
    const clickHandler = (event: Event) => {
      event.stopPropagation();
      event.stopImmediatePropagation();
      navigationKeys?.destroy();
      core.open();
    };
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleInputKeyDown);
    input.addEventListener("focus", focusHandler);
    input.addEventListener("click", clickHandler);
    cleanup.push(() => input?.removeEventListener("input", handleInput));
    cleanup.push(() => input?.removeEventListener("keydown", handleInputKeyDown));
    cleanup.push(() => input?.removeEventListener("focus", focusHandler));
    cleanup.push(() => input?.removeEventListener("click", clickHandler));

    const clearSelection = () => {
      core.clear();
      core.highlight(null);
      core.setSearch("");
      if (input) input.value = initialInputValue;
      updateFromSource("");
    };

    clearEls.forEach((el) => bindClick(el, clearSelection));
    clearAllEls.forEach((el) => bindClick(el, clearSelection));
    removeValueEls.forEach((el) => {
      const value = el.getAttribute("data-select-remove");
      if (!value) return;
      bindClick(el, () => core.unselect(value));
    });

    if (!itemsMeta.length) parseDomItems();
    updateFromSource(core.getState().search);
    applyInitialSelection();

    const overlayTrigger = trigger ?? input;
    const overlayOptions = resolveOverlayOptions({
      root: getScopeElement() ?? overlayTrigger,
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
      trigger: overlayTrigger,
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
        beforeShow: () => {},
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
  };

  const render = (state: SelectState) => {
    if (state.search !== lastSearch) {
      lastSearch = state.search;
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        updateFromSource(state.search);
        searchTimer = null;
      }, searchDebounce);
    }
    updateAria(state);
    updateItemsState(state);
    updateSelectedDisplays(state);
    syncOverlay(state);
  };

  const destroy = () => {
    cleanup.splice(0).forEach((fn) => fn());
    if (searchTimer) clearTimeout(searchTimer);
    unsubscribe?.();
    teardownItems();
    root = null;
    selectId = null;
    trigger = null;
    content = null;
    input = null;
    selectedValueEls = [];
    clearEls = [];
    clearAllEls = [];
    removeValueEls = [];
    hiddenValueInput = null;
    itemsByValue.clear();
    itemsMeta = [];
    overlay = null;
    teleporter?.restore();
    teleporter = null;
    navigationKeys?.destroy();
    navigationKeys = null;
    unsubscribe = null;
  };

  const connect = ({ element }: AutocompleteDom) => {
    const target = resolveAutocompleteTarget(element);
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


