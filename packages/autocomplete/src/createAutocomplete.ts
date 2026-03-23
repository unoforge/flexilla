import { createSelectCore, type SelectItem, type SelectState, type SelectCore } from "@flexilla/select-core";
import type { AutocompleteController, AutocompleteDom, AutocompleteOptions } from "./types";
import { CreateOverlay, type Placement } from "flexipop/create-overlay";
import {
  $$,
  DEFAULT_SELECT_CHECK_ICON,
  renderSelectedValues,
  setupSelectPresentationItem,
  setupSelectValueContainer,
  setupSelectItemIndicator,
  syncSelectEmptyState,
  syncSelectItemIndicator,
} from "@flexilla/utilities";
import { FlexillaManager } from "@flexilla/manager";

const SELECT_TRIGGER = "[data-select-trigger]";
const SELECT_CONTENT = "[data-select-content]";
const SELECT_ITEM = "[data-select-item]";
const SELECT_INPUT = "[data-select-input]";
const SELECT_VALUE = "[data-selected-value]";
const SELECT_CLEAR = "[data-select-clear]";
const SELECT_CLEAR_ALL = "[data-select-clear-all]";
const SELECT_REMOVE = "[data-select-remove]";

const defaultFilter = (query: string, item: SelectItem) => {
  if (!query) return true;
  const text = `${item.label ?? item.value}`.toLowerCase();
  return text.includes(query.toLowerCase());
};

const getBooleanAttr = (element: HTMLElement | null, attr: string): boolean | undefined => {
  if (!(element instanceof HTMLElement)) return undefined;
  if (!element.hasAttribute(attr)) return undefined;
  const value = element.getAttribute(attr);
  return value !== "false";
};

const getNumberAttr = (element: HTMLElement | null, attr: string): number | undefined => {
  if (!(element instanceof HTMLElement)) return undefined;
  const rawValue = element.getAttribute(attr);
  if (!rawValue) return undefined;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : undefined;
};

const resolveOverlayOptions = ({
  root,
  content,
  options,
}: {
  root: HTMLElement;
  content: HTMLElement | null;
  options: AutocompleteOptions;
}) => {
  const source = content ?? root;
  const multiple = options.multiple ?? (root.hasAttribute("data-multiple") || root.dataset.multiple === "true");

  return {
    placement: (content?.dataset.placement as Placement | undefined) || (root.dataset.placement as Placement | undefined) || options.placement || "bottom-start",
    offsetDistance:
      getNumberAttr(content, "data-offset-distance") ??
      getNumberAttr(root, "data-offset-distance") ??
      options.offsetDistance ??
      6,
    preventFromCloseOutside:
      getBooleanAttr(content, "data-prevent-close-outside") ??
      getBooleanAttr(root, "data-prevent-close-outside") ??
      options.preventFromCloseOutside ??
      false,
    preventCloseFromInside:
      getBooleanAttr(content, "data-prevent-close-inside") ??
      getBooleanAttr(root, "data-prevent-close-inside") ??
      options.preventCloseFromInside ??
      multiple,
    readjustHeight:
      getBooleanAttr(source, "data-readjust-height") ??
      options.readjustHeight ??
      true,
    minHeight:
      getNumberAttr(source, "data-min-height") ??
      options.minHeight ??
      140,
    popper: options.popper,
  };
};

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
    if (!root) return;
    const sourceContainers = content ? [content] : [root];
    const existingItems = sourceContainers.flatMap((container) => Array.from(container.querySelectorAll<HTMLElement>(SELECT_ITEM)));
    if (!existingItems.length) return;
    itemsMeta = existingItems
      .map((el): ItemMeta | null => {
        const value = el.dataset.selectItem;
        if (!value) return null;
        const label = (el.getAttribute("data-label") || el.textContent || "").trim() || value;
        const disabled = el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled");
        return { item: { value, label, disabled }, element: el };
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

type AutocompleteInstanceOptions = AutocompleteOptions & {
  multiple?: boolean;
};

const normalizeAutocompleteId = (value: string) => value.replace(/^#/, "");

const resolveAutocompleteTarget = (autocomplete: string | HTMLElement) => {
  if (typeof autocomplete === "string") {
    const element = document.querySelector<HTMLElement>(autocomplete);
    if (element instanceof HTMLElement) {
      return resolveAutocompleteTarget(element);
    }

    const id = normalizeAutocompleteId(autocomplete);
    const input = document.querySelector<HTMLElement>(`${SELECT_INPUT}[data-autocomplete-id="${id}"]`);
    const trigger = document.querySelector<HTMLElement>(`${SELECT_TRIGGER}[data-autocomplete-id="${id}"]`);
    const content = document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${id}"]`);
    const anchorElement = input ?? trigger ?? content;

    if (!anchorElement) {
      throw new Error(`Invalid autocomplete target: ${autocomplete}`);
    }

    const rootElement =
      (anchorElement.matches("[data-fx-autocomplete]") ? anchorElement : anchorElement.closest<HTMLElement>("[data-fx-autocomplete]")) ?? null;

    return {
      root: rootElement,
      anchor: anchorElement,
      id,
    };
  }

  const id = autocomplete.getAttribute("data-autocomplete-id") || autocomplete.getAttribute("data-select-id") || autocomplete.id || "";
  if (!id) {
    throw new Error("Invalid autocomplete root element");
  }

  const rootElement =
    (autocomplete.matches("[data-fx-autocomplete]") ? autocomplete : autocomplete.closest<HTMLElement>("[data-fx-autocomplete]")) ?? null;

  return {
    root: rootElement,
    anchor: autocomplete,
    id,
  };
};

export class Autocomplete implements SelectCore {
  private registryElement: HTMLElement;
  private controller: AutocompleteController;
  private destroyConnection: (() => void) | null = null;

  constructor(autocomplete: string | HTMLElement, options: AutocompleteInstanceOptions = {}) {
    const target = resolveAutocompleteTarget(autocomplete);
    const registryElement = target.anchor ?? target.root;
    if (!(registryElement instanceof HTMLElement)) throw new Error("Invalid autocomplete root element");

    const existingInstance = FlexillaManager.getInstance("autocomplete", registryElement);
    if (existingInstance) {
      return existingInstance;
    }

    const multiple =
      options.multiple ??
      getBooleanAttr(target.root, "data-multiple") ??
      getBooleanAttr(target.anchor, "data-multiple") ??
      getBooleanAttr(document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${target.id}"]`), "data-multiple") ??
      false;
    this.registryElement = registryElement;
    this.controller = createAutocomplete({ ...options, multiple });
    this.destroyConnection = this.controller.connect(target);

    FlexillaManager.register("autocomplete", registryElement, this);
  }

  open = () => this.controller.open();
  close = () => this.controller.close();
  toggle = () => this.controller.toggle();
  select = (value: string) => this.controller.select(value);
  unselect = (value: string) => this.controller.unselect(value);
  clear = () => this.controller.clear();
  toggleValue = (value: string) => this.controller.toggleValue(value);
  highlightNext = () => this.controller.highlightNext();
  highlightPrev = () => this.controller.highlightPrev();
  highlight = (index: number | null) => this.controller.highlight(index);
  setSearch = (query: string) => this.controller.setSearch(query);
  registerItem = (item: SelectItem) => this.controller.registerItem(item);
  unregisterItem = (value: string) => this.controller.unregisterItem(value);
  getState = () => this.controller.getState();
  subscribe = (listener: (state: Readonly<SelectState>) => void) => this.controller.subscribe(listener);

  cleanup = () => {
    this.destroyConnection?.();
    this.destroyConnection = null;
    FlexillaManager.removeInstance("autocomplete", this.registryElement);
  };

  static init = (autocomplete: string | HTMLElement, options: AutocompleteInstanceOptions = {}) => new Autocomplete(autocomplete, options);

  static autoInit = (selector = "[data-fx-autocomplete]") => {
    const roots = $$(selector);
    for (const root of roots) {
      new Autocomplete(root);
    }
  };
}
