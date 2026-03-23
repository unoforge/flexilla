import {
  createSelectCore,
  DEFAULT_SELECT_CHECK_ICON,
  renderSelectedValues,
  setupSelectPresentationItem,
  setupSelectValueContainer,
  setupSelectItemIndicator,
  syncSelectEmptyState,
  syncSelectItemIndicator,
  type SelectCore,
  type SelectItem,
  type SelectState,
} from "@flexilla/select-core";
import { CreateOverlay } from "flexipop/create-overlay";
import type { SelectController, SelectDom, SelectOptions } from "./types";
import { SELECT_CLEAR, SELECT_CLEAR_ALL, SELECT_CONTENT, SELECT_INPUT, SELECT_ITEM, SELECT_REMOVE, SELECT_TRIGGER, SELECT_VALUE } from "./constants";
import { defaultFilter, parseItem, resolveOverlayOptions } from "./helpers";

export const createSelect = (options: SelectOptions = {}): SelectController => {
  const core = createSelectCore({ multiple: options.multiple });
  const filter = options.filter ?? defaultFilter;
  let root: HTMLElement | null = null;
  let anchor: HTMLElement | null = null;
  let selectId: string | null = null;
  let triggers: HTMLElement[] = [];
  let contents: HTMLElement[] = [];
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
  let overlay: CreateOverlay | null = null;
  const cleanup: Array<() => void> = [];
  let unsubscribe: (() => void) | null = null;
  let placeholder = "Select";
  let syncingOverlay = false;
  let lastSearch = core.getState().search;
  const checkIconMarkup = options.checkIcon || DEFAULT_SELECT_CHECK_ICON;
  const indicatorPosition = options.indicatorPosition || "start";

  const getScopeElement = () => root ?? anchor ?? contents[0] ?? triggers[0] ?? input;

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
    if (!overlay || syncingOverlay) return;
    const content = contents[0];
    if (!(content instanceof HTMLElement)) return;
    const overlayState = content.dataset.state || "close";
    if (state.open && overlayState !== "open") {
      syncingOverlay = true;
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
    if (!selectId) return;
    const scope = getScopeElement();
    const containers = contents.length ? contents : scope ? [scope] : [];
    const existingItems = containers.flatMap((container) => Array.from(container.querySelectorAll<HTMLElement>(SELECT_ITEM)));

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
      setupSelectPresentationItem(element);
      setupSelectItemIndicator({ element, fallbackIcon: checkIconMarkup });

      if (boundElements.has(element)) return;

      const clickHandler = (event: Event) => {
        event.preventDefault();
        if (item.disabled) return;
        core.toggleValue(item.value);
        const index = itemElements.indexOf(element);
        if (index >= 0) core.highlight(index);
        if (!options.multiple) core.close();
      };

      element.addEventListener("click", clickHandler);
      cleanup.push(() => element.removeEventListener("click", clickHandler));
      boundElements.add(element);
    });
  };

  const updateFromSearch = (query: string) => {
    if (!itemsMeta.length) registerItems();

    const filtered = itemsMeta.filter(({ item }) => filter(query, item));
    const nextValues = new Set(filtered.map(({ item }) => item.value));

    teardownItems();

    filtered.forEach(({ item, element }) => {
      element.removeAttribute("hidden");
      itemElements.push(element);
      renderedValues.add(item.value);
      core.registerItem(item);
    });

    itemsMeta.forEach(({ item, element }) => {
      if (!nextValues.has(item.value)) {
        element.setAttribute("hidden", "");
        element.removeAttribute("data-select-highlighted");
      }
    });

    contents.forEach((panel) => {
      const visibleCount = itemElements.filter((el) => panel.contains(el)).length;
      syncSelectEmptyState({
        content: panel,
        visibleCount,
        query,
      });
    });

    ensureHighlighted();
    if (!filtered.length) core.highlight(null);
  };

  const updateAria = (state: SelectState) => {
    triggers.forEach((btn) => {
      btn.setAttribute("aria-haspopup", "listbox");
      btn.setAttribute("aria-expanded", String(state.open));
    });
    contents.forEach((panel) => {
      panel.setAttribute("role", "listbox");
      if (state.open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  };

  const updateSelectedDisplays = (state: SelectState) => {
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
      syncSelectItemIndicator({
        element,
        isSelected,
        fallbackIcon: checkIconMarkup,
        root: getScopeElement(),
        indicatorPosition,
      });
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        core.open();
        ensureHighlighted();
        core.highlightNext();
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        core.open();
        ensureHighlighted();
        core.highlightPrev();
        break;
      }
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
        if (triggers[0]) triggers[0].focus();
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
    const query = target.value || "";
    core.setSearch(query);
    updateFromSearch(query);
  };

  const bindDom = () => {
    if (!selectId) return;

    triggers = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_TRIGGER}[data-select-id="${selectId}"]`));
    if (!triggers.length && root) triggers = Array.from(root.querySelectorAll<HTMLElement>(SELECT_TRIGGER));

    contents = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${selectId}"]`));
    if (!contents.length) {
      const contentInRoot = root?.querySelector<HTMLElement>(SELECT_CONTENT);
      if (contentInRoot) contents = [contentInRoot];
    }

    input = document.querySelector<HTMLInputElement>(`${SELECT_INPUT}[data-select-id="${selectId}"]`) || root?.querySelector<HTMLInputElement>(SELECT_INPUT) || null;

    selectedValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_VALUE}[data-select-id="${selectId}"]`));
    if (!selectedValueEls.length && root) selectedValueEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_VALUE));
    clearEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CLEAR}[data-select-id="${selectId}"]`));
    if (!clearEls.length && root) clearEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_CLEAR));
    clearAllEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CLEAR_ALL}[data-select-id="${selectId}"]`));
    if (!clearAllEls.length && root) clearAllEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_CLEAR_ALL));
    removeValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_REMOVE}[data-select-id="${selectId}"]`));
    if (!removeValueEls.length && root) removeValueEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_REMOVE));

    const sourceTrigger = triggers[0];
    if (sourceTrigger) {
      const selectedValueSource =
        sourceTrigger.querySelector<HTMLElement>(SELECT_VALUE)?.textContent?.trim() ||
        selectedValueEls[0]?.textContent?.trim() ||
        "";
      const triggerPlaceholder =
        sourceTrigger.getAttribute("data-placeholder") ||
        selectedValueSource ||
        sourceTrigger.textContent?.trim() ||
        placeholder;
      placeholder = triggerPlaceholder || placeholder;
    }

    selectedValueEls.forEach((container) => setupSelectValueContainer(container));

    triggers.forEach((btn) => {
      btn.addEventListener("click", handleTriggerClick);
      btn.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => btn.removeEventListener("click", handleTriggerClick));
      cleanup.push(() => btn.removeEventListener("keydown", handleKeyDown));
    });

    contents.forEach((panel) => {
      panel.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => panel.removeEventListener("keydown", handleKeyDown));
    });

    if (input) {
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => input?.removeEventListener("input", handleInput));
      cleanup.push(() => input?.removeEventListener("keydown", handleKeyDown));
    }

    const clearSelection = () => {
      core.clear();
      core.highlight(null);
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

    clearEls.forEach((el) => bindClick(el, clearSelection));
    clearAllEls.forEach((el) => bindClick(el, clearSelection));
    removeValueEls.forEach((el) => {
      const value = el.getAttribute("data-select-remove");
      if (!value) return;
      bindClick(el, () => core.unselect(value));
    });

    if (triggers[0] && contents[0]) {
      const overlayOptions = resolveOverlayOptions({
        root: getScopeElement() ?? triggers[0],
        content: contents[0],
        options,
      });

      overlay = new CreateOverlay({
        trigger: triggers[0],
        content: contents[0],
        options: {
          triggerStrategy: "manual",
          placement: overlayOptions.placement,
          offsetDistance: overlayOptions.offsetDistance,
          preventFromCloseOutside: overlayOptions.preventFromCloseOutside,
          preventCloseFromInside: overlayOptions.preventCloseFromInside,
          readjustHeight: overlayOptions.readjustHeight,
          minHeight: overlayOptions.minHeight,
          popper: overlayOptions.popper,
          onHide: () => {
            if (core.getState().open) {
              syncingOverlay = true;
              core.close();
              syncingOverlay = false;
            }
          },
        },
      });
      cleanup.push(() => overlay?.cleanup());
    }

    registerItems();
    updateFromSearch(core.getState().search);
  };

  const render = (state: SelectState) => {
    if (state.search !== lastSearch) {
      lastSearch = state.search;
      updateFromSearch(state.search);
    }
    updateAria(state);
    updateItemsState(state);
    updateSelectedDisplays(state);
    syncOverlay(state);
  };

  const destroy = () => {
    teardownItems();
    cleanup.splice(0).forEach((fn) => fn());
    if (unsubscribe) unsubscribe();
    root = null;
    anchor = null;
    selectId = null;
    triggers = [];
    contents = [];
    input = null;
    itemElements = [];
    itemsMeta = [];
    itemsByValue.clear();
    selectedValueEls = [];
    clearEls = [];
    clearAllEls = [];
    removeValueEls = [];
    overlay = null;
  };

  const connect = ({ root: rootElement, id, anchor: anchorElement }: SelectDom) => {
    root = rootElement ?? null;
    anchor = anchorElement ?? rootElement ?? null;
    selectId = id || root?.id || anchor?.getAttribute("data-select-id") || anchor?.id || null;
    if (!selectId) throw new Error("[select] an id is required to connect trigger and content");
    bindDom();
    if (unsubscribe) unsubscribe();
    unsubscribe = core.subscribe(render);
    render(core.getState());
    return { destroy };
  };

  return {
    ...core,
    connect,
  };
};

export type SelectInstanceController = SelectCore;
