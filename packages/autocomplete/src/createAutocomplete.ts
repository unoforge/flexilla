import { createSelectCore, type SelectItem, type SelectState, type SelectCore } from "@flexilla/select-core";
import type { AutocompleteController, AutocompleteDom, AutocompleteOptions } from "./types";
import { CreateOverlay, type Placement } from "flexipop/create-overlay";
import { $, $$ } from "@flexilla/utilities";
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
  type ItemMeta = { item: SelectItem; el: HTMLElement };
  let itemsMeta: ItemMeta[] = [];
  const boundElements = new WeakSet<HTMLElement>();

  const ensureHighlighted = () => {
    const state = core.getState();
    if (state.highlightedIndex !== null) return;
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
        return { item: { value, label, disabled }, el };
      })
      .filter((entry): entry is ItemMeta => Boolean(entry))
      .filter((entry) => {
        const itemId = entry.el.getAttribute("data-select-id");
        return !itemId || itemId === selectId;
      });

    itemsMeta.forEach(({ el, item }) => {
      el.setAttribute("role", "option");
      if (item.disabled) el.setAttribute("aria-disabled", "true");
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

    filtered.forEach(({ item, el }) => {
      el.removeAttribute("hidden");
      if (!boundElements.has(el)) {
        const clickHandler = (event: Event) => {
          event.preventDefault();
          if (item.disabled) return;
          core.toggleValue(item.value);
          const index = itemElements.indexOf(el);
          if (index >= 0) core.highlight(index);
          if (!options.multiple) core.close();
        };
        el.addEventListener("click", clickHandler);
        cleanup.push(() => el.removeEventListener("click", clickHandler));
        boundElements.add(el);
      }

      itemElements.push(el);
      renderedValues.add(item.value);
      core.registerItem(item);
    });

    itemsMeta.forEach(({ item, el }) => {
      if (!nextValues.has(item.value)) el.setAttribute("hidden", "");
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
    });
  };

  const updateSelectedDisplays = (state: SelectState) => {
    selectedValueEls.forEach((container) => {
      const template = container.querySelector<HTMLElement>("[data-select-template]");
      if (template) template.style.display = "none";
      const keep = template ? [template] : [];
      Array.from(container.children).forEach((child) => {
        if (!keep.includes(child as HTMLElement)) container.removeChild(child);
      });

      const labels = state.selectedValues
        .map((value) => state.items.find((item) => item.value === value)?.label ?? value)
        .filter(Boolean);

      if (!options.multiple) {
        const text = labels[0] ?? placeholder;
        if (template) {
          const node = template.cloneNode(true) as HTMLElement;
          node.removeAttribute("data-select-template");
          node.style.removeProperty("display");
          const labelEl = node.querySelector<HTMLElement>("[data-select-label]");
          if (labelEl) labelEl.textContent = text;
          const removeEl = node.querySelector<HTMLElement>("[data-select-remove]");
          if (removeEl) removeEl.setAttribute("data-select-remove", state.selectedValues[0] ?? "");
          if (removeEl && state.selectedValues[0]) {
            const handler = (event: Event) => {
              event.preventDefault();
              core.unselect(state.selectedValues[0]!);
            };
            removeEl.addEventListener("click", handler);
            cleanup.push(() => removeEl.removeEventListener("click", handler));
          }
          container.appendChild(node);
        } else {
          container.textContent = text;
        }
      } else {
        if (!labels.length) {
          if (template) {
            const emptyNode = template.cloneNode(true) as HTMLElement;
            emptyNode.removeAttribute("data-select-template");
            const labelEl = emptyNode.querySelector<HTMLElement>("[data-select-label]");
            if (labelEl) labelEl.textContent = placeholder;
            container.appendChild(emptyNode);
          } else {
            container.textContent = placeholder;
          }
          return;
        }

        labels.forEach((label, index) => {
          const value = state.selectedValues[index];
          let chip: HTMLElement;
          if (template) {
            chip = template.cloneNode(true) as HTMLElement;
            chip.removeAttribute("data-select-template");
            chip.style.removeProperty("display");
            const labelEl = chip.querySelector<HTMLElement>("[data-select-label]");
            if (labelEl) labelEl.textContent = label;
            const valueEl = chip.querySelector<HTMLElement>("[data-select-value]");
            if (valueEl) valueEl.textContent = value;
          } else {
            chip = document.createElement("span");
            chip.textContent = label;
          }

          const removeTarget =
            chip.querySelector<HTMLElement>("[data-select-remove]") ??
            chip.querySelector<HTMLElement>("[data-select-chip-remove]") ??
            null;
          if (removeTarget) {
            removeTarget.setAttribute("data-select-remove", value);
            const handler = (event: Event) => {
              event.preventDefault();
              core.unselect(value);
            };
            removeTarget.addEventListener("click", handler);
            cleanup.push(() => removeTarget.removeEventListener("click", handler));
          }

          container.appendChild(chip);
        });
      }
    });

    if (input && !state.open && !options.multiple) {
      input.value = state.selectedValues.length === 1 ? (state.items.find((i) => i.value === state.selectedValues[0])?.label ?? state.selectedValues[0]) : input.value;
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
    if (!root || !selectId) return;
    trigger = document.querySelector<HTMLElement>(`${SELECT_TRIGGER}[data-autocomplete-id="${selectId}"]`) || root.querySelector(SELECT_TRIGGER);
    content = document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${selectId}"]`) || root.querySelector(SELECT_CONTENT);
    input = document.querySelector<HTMLInputElement>(`${SELECT_INPUT}[data-autocomplete-id="${selectId}"]`) || root.querySelector<HTMLInputElement>(SELECT_INPUT);
    selectedValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_VALUE}[data-select-id="${selectId}"]`));
    if (!selectedValueEls.length) {
      selectedValueEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_VALUE));
    }
    clearEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CLEAR}[data-select-id="${selectId}"]`));
    if (!clearEls.length) clearEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_CLEAR));
    clearAllEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CLEAR_ALL}[data-select-id="${selectId}"]`));
    if (!clearAllEls.length) clearAllEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_CLEAR_ALL));
    removeValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_REMOVE}[data-select-id="${selectId}"]`));
    if (!removeValueEls.length) removeValueEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_REMOVE));

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
        root,
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
    trigger = null;
    content = null;
    input = null;
    selectedValueEls = [];
    clearEls = [];
    clearAllEls = [];
    removeValueEls = [];
    itemsMeta = [];
    overlay = null;
  };

  const connect = ({ root: rootElement }: AutocompleteDom) => {
    root = rootElement;
    selectId = root.id || null;
    if (!selectId) throw new Error("[autocomplete] root element requires an id attribute");
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

export class Autocomplete implements SelectCore {
  private root: HTMLElement;
  private controller: AutocompleteController;
  private destroyConnection: (() => void) | null = null;

  constructor(autocomplete: string | HTMLElement, options: AutocompleteInstanceOptions = {}) {
    const root = typeof autocomplete === "string" ? $(autocomplete) : autocomplete;
    if (!(root instanceof HTMLElement)) {
      throw new Error("Invalid autocomplete root element");
    }

    const existingInstance = FlexillaManager.getInstance("autocomplete", root);
    if (existingInstance) {
      return existingInstance;
    }

    const multiple = options.multiple ?? getBooleanAttr(root, "data-multiple") ?? false;
    this.root = root;
    this.controller = createAutocomplete({ ...options, multiple });
    this.destroyConnection = this.controller.connect({ root });

    FlexillaManager.register("autocomplete", root, this);
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
    FlexillaManager.removeInstance("autocomplete", this.root);
  };

  static init = (autocomplete: string | HTMLElement, options: AutocompleteInstanceOptions = {}) => new Autocomplete(autocomplete, options);

  static autoInit = (selector = "[data-fx-autocomplete]") => {
    const roots = $$(selector);
    for (const root of roots) {
      new Autocomplete(root);
    }
  };
}
