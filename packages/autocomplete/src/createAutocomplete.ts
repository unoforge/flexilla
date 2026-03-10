import { createSelectCore, SelectItem, SelectState } from "@flexilla/select-core";
import { AutocompleteController, AutocompleteDom, AutocompleteOptions } from "./types";

const SELECT_TRIGGER = "[data-select-trigger]";
const SELECT_CONTENT = "[data-select-content]";
const SELECT_ITEM = "[data-select-item]";
const SELECT_INPUT = "[data-select-input]";
const SELECT_VALUE = "[data-selected-value]";

const defaultFilter = (query: string, item: SelectItem) => {
  if (!query) return true;
  const text = `${item.label ?? item.value}`.toLowerCase();
  return text.includes(query.toLowerCase());
};

export const createAutocomplete = (options: AutocompleteOptions = {}): AutocompleteController => {
  const core = createSelectCore({ multiple: options.multiple });
  const filter = options.filter ?? defaultFilter;
  let root: HTMLElement | null = null;
  let selectId: string | null = null;
  let trigger: HTMLElement | null = null;
  let content: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let itemsContainer: HTMLElement | null = null;
  let itemElements: HTMLElement[] = [];
  let selectedValueEls: HTMLElement[] = [];
  let placeholder = "Select";
  let unsubscribe: (() => void) | null = null;
  const cleanup: Array<() => void> = [];
  let renderedValues = new Set<string>();
  let lastSearch = core.getState().search;
  type ItemMeta = { item: SelectItem; el: HTMLElement };
  let itemsMeta: ItemMeta[] = [];
  const boundElements = new WeakSet<HTMLElement>();

  const ensureHighlighted = () => {
    const state = core.getState();
    if (state.highlightedIndex !== null) return;
    const firstEnabled = state.items.findIndex((item) => !item.disabled);
    if (firstEnabled >= 0) core.highlight(firstEnabled);
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
    const labels = state.selectedValues
      .map((value) => state.items.find((item) => item.value === value)?.label ?? value)
      .filter(Boolean);
    const text = labels.length ? labels.join(", ") : placeholder;
    selectedValueEls.forEach((el) => {
      el.textContent = text;
    });
    if (input && !state.open && !options.multiple && labels.length === 1) {
      input.value = labels[0];
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
    itemsContainer = content;
    selectedValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_VALUE}[data-select-id="${selectId}"]`));
    if (!selectedValueEls.length) {
      selectedValueEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_VALUE));
    }

    const sourcePlaceholder = input?.getAttribute("data-placeholder") || input?.getAttribute("placeholder") || placeholder;
    placeholder = sourcePlaceholder || placeholder;

    if (!content) throw new Error("[autocomplete] data-select-content is required");
    if (!itemsContainer) throw new Error("[autocomplete] items container not found");
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
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeyDown);
      input.addEventListener("focus", () => core.open());
      cleanup.push(() => input?.removeEventListener("input", handleInput));
      cleanup.push(() => input?.removeEventListener("keydown", handleKeyDown));
    }

    if (!itemsMeta.length) parseDomItems();
    updateFromSource(core.getState().search);
  };

  const render = (state: SelectState) => {
    if (state.search !== lastSearch) {
      lastSearch = state.search;
      void updateFromSource(state.search);
    }
    updateAria(state);
    updateItemsState(state);
    updateSelectedDisplays(state);
  };

  const destroy = () => {
    cleanup.splice(0).forEach((fn) => fn());
    if (unsubscribe) unsubscribe();
    teardownItems();
    root = null;
    trigger = null;
    content = null;
    input = null;
    itemsContainer = null;
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
