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
import type { AutocompleteController, AutocompleteDom, AutocompleteOptions } from "./types";
import { SELECT_CLEAR, SELECT_CLEAR_ALL, SELECT_CONTENT, SELECT_INPUT, SELECT_ITEM, SELECT_REMOVE, SELECT_TRIGGER, SELECT_VALUE } from "./constants";
import { defaultFilter, resolveOverlayOptions } from "./helpers";

export const createAutocomplete = (options: AutocompleteOptions = {}): AutocompleteController => {
  const core = createSelectCore({ multiple: options.multiple });
  const filter = options.filter ?? defaultFilter;
  let root: HTMLElement | null = null;
  let anchor: HTMLElement | null = null;
  let selectId: string | null = null;
  let trigger: HTMLElement | null = null;
  let content: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let itemElements: HTMLElement[] = [];
  let selectedValueEls: HTMLElement[] = [];
  let clearEls: HTMLElement[] = [];
  let clearAllEls: HTMLElement[] = [];
  let removeValueEls: HTMLElement[] = [];
  let placeholder = "Select";
  let initialInputValue = "";
  let unsubscribe: (() => void) | null = null;
  let overlay: CreateOverlay | null = null;
  const cleanup: Array<() => void> = [];
  let renderedValues = new Set<string>();
  let lastSearch = core.getState().search;
  let syncingOverlay = false;
  const checkIconMarkup = options.checkIcon || DEFAULT_SELECT_CHECK_ICON;
  const indicatorPosition = options.indicatorPosition || "start";
  type ItemMeta = { item: SelectItem; element: HTMLElement };
  let itemsMeta: ItemMeta[] = [];
  const itemsByValue = new Map<string, ItemMeta>();
  const boundElements = new WeakSet<HTMLElement>();

  const getScopeElement = () => root ?? anchor ?? content ?? trigger ?? input;

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
    if (!selectId) return;
    const sourceContainers = content ? [content] : root ? [root] : [];
    const existingItems = sourceContainers.flatMap((container) => Array.from(container.querySelectorAll<HTMLElement>(SELECT_ITEM)));
    if (!existingItems.length) return;
    itemsMeta = existingItems
      .map((element): ItemMeta | null => {
        const value = element.dataset.selectItem;
        if (!value) return null;
        const label = (element.getAttribute("data-label") || element.textContent || "").trim() || value;
        const disabled = element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-disabled");
        return { item: { value, label, disabled }, element };
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
      setupSelectPresentationItem(element);
      setupSelectItemIndicator({ element, fallbackIcon: checkIconMarkup });
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

    renderedValues.forEach((value) => {
      if (!nextValues.has(value)) core.unregisterItem(value);
    });

    teardownItems();

    filtered.forEach(({ item, element }) => {
      element.removeAttribute("hidden");
      if (!boundElements.has(element)) {
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
      }

      itemElements.push(element);
      renderedValues.add(item.value);
      core.registerItem(item);
    });

    itemsMeta.forEach(({ item, element }) => {
      if (!nextValues.has(item.value)) element.setAttribute("hidden", "");
    });

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
      if (state.open) content.removeAttribute("hidden");
      else content.setAttribute("hidden", "");
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
      syncSelectItemIndicator({
        element,
        isSelected,
        fallbackIcon: checkIconMarkup,
        root: getScopeElement(),
        indicatorPosition,
      });
    });
  };

  const updateSelectedDisplays = (state: SelectState) => {
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
        if (input) input.blur();
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
    core.open();
    updateFromSource(query);
  };

  const bindDom = () => {
    if (!selectId) return;
    trigger = document.querySelector<HTMLElement>(`${SELECT_TRIGGER}[data-autocomplete-id="${selectId}"]`) || root?.querySelector(SELECT_TRIGGER) || null;
    content = document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${selectId}"]`) || root?.querySelector(SELECT_CONTENT) || null;
    input = document.querySelector<HTMLInputElement>(`${SELECT_INPUT}[data-autocomplete-id="${selectId}"]`) || root?.querySelector<HTMLInputElement>(SELECT_INPUT) || null;
    selectedValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_VALUE}[data-select-id="${selectId}"]`));
    if (!selectedValueEls.length) {
      selectedValueEls = root ? Array.from(root.querySelectorAll<HTMLElement>(SELECT_VALUE)) : [];
    }
    clearEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CLEAR}[data-select-id="${selectId}"]`));
    if (!clearEls.length) clearEls = root ? Array.from(root.querySelectorAll<HTMLElement>(SELECT_CLEAR)) : [];
    clearAllEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CLEAR_ALL}[data-select-id="${selectId}"]`));
    if (!clearAllEls.length) clearAllEls = root ? Array.from(root.querySelectorAll<HTMLElement>(SELECT_CLEAR_ALL)) : [];
    removeValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_REMOVE}[data-select-id="${selectId}"]`));
    if (!removeValueEls.length) removeValueEls = root ? Array.from(root.querySelectorAll<HTMLElement>(SELECT_REMOVE)) : [];

    selectedValueEls.forEach((container) => setupSelectValueContainer(container));

    const sourcePlaceholder = input?.getAttribute("data-placeholder") || input?.getAttribute("placeholder") || placeholder;
    placeholder = sourcePlaceholder || placeholder;
    if (input) initialInputValue = input.value;

    if (!content) throw new Error("[autocomplete] data-select-content is required");
    if (!input) throw new Error("[autocomplete] input element with data-autocomplete-id is required");

    if (trigger) {
      trigger.addEventListener("click", handleTriggerClick);
      trigger.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => trigger?.removeEventListener("click", handleTriggerClick));
      cleanup.push(() => trigger?.removeEventListener("keydown", handleKeyDown));
    }

    if (content) {
      content.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => content?.removeEventListener("keydown", handleKeyDown));
    }

    if (input) {
      const focusHandler = () => core.open();
      const clickHandler = (event: Event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        core.open();
      };
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeyDown);
      input.addEventListener("focus", focusHandler);
      input.addEventListener("click", clickHandler);
      cleanup.push(() => input?.removeEventListener("input", handleInput));
      cleanup.push(() => input?.removeEventListener("keydown", handleKeyDown));
      cleanup.push(() => input?.removeEventListener("focus", focusHandler));
      cleanup.push(() => input?.removeEventListener("click", clickHandler));
    }

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

    const clearSelection = () => {
      core.clear();
      core.highlight(null);
      core.setSearch("");
      if (input) input.value = initialInputValue;
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

    const overlayTrigger = trigger ?? input;
    if (overlayTrigger && content) {
      const overlayOptions = resolveOverlayOptions({
        root: getScopeElement() ?? overlayTrigger,
        content,
        options,
      });

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
  };

  const render = (state: SelectState) => {
    if (state.search !== lastSearch) {
      lastSearch = state.search;
      void updateFromSource(state.search);
    }
    updateAria(state);
    updateItemsState(state);
    updateSelectedDisplays(state);
    syncOverlay(state);
  };

  const destroy = () => {
    cleanup.splice(0).forEach((fn) => fn());
    if (unsubscribe) unsubscribe();
    teardownItems();
    root = null;
    anchor = null;
    trigger = null;
    content = null;
    input = null;
    selectedValueEls = [];
    clearEls = [];
    clearAllEls = [];
    removeValueEls = [];
    itemsByValue.clear();
    itemsMeta = [];
    overlay = null;
  };

  const connect = ({ root: rootElement, id, anchor: anchorElement }: AutocompleteDom) => {
    root = rootElement ?? null;
    anchor = anchorElement ?? rootElement ?? null;
    selectId = id || root?.id || anchor?.getAttribute("data-autocomplete-id") || anchor?.getAttribute("data-select-id") || anchor?.id || null;
    if (!selectId) throw new Error("[autocomplete] an id is required to connect input and content");
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

export type AutocompleteInstanceController = SelectCore;
