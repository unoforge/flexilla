import { createSelectCore, SelectState, SelectItem } from "@flexilla/select-core";
import { SelectController, SelectDom, SelectOptions } from "./types";

const SELECT_TRIGGER = "[data-select-trigger]";
const SELECT_CONTENT = "[data-select-content]";
const SELECT_ITEM = "[data-select-item]";
const SELECT_INPUT = "[data-select-input]";
const SELECT_VALUE = "[data-selected-value]";

const parseItem = (element: HTMLElement): SelectItem | null => {
  const value = element.dataset.selectItem;
  if (!value) return null;
  const label = (element.getAttribute("data-label") || element.textContent || "").trim() || value;
  const disabled = element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-disabled");
  return { value, label, disabled };
};

export const createSelect = (options: SelectOptions = {}): SelectController => {
  const core = createSelectCore({ multiple: options.multiple });
  let root: HTMLElement | null = null;
  let selectId: string | null = null;
  let triggers: HTMLElement[] = [];
  let contents: HTMLElement[] = [];
  let input: HTMLInputElement | null = null;
  let itemElements: HTMLElement[] = [];
  let selectedValueEls: HTMLElement[] = [];
  const cleanup: Array<() => void> = [];
  let unsubscribe: (() => void) | null = null;
  let placeholder = "Select";

  const ensureHighlighted = () => {
    const state = core.getState();
    if (state.highlightedIndex !== null) return;
    const firstEnabled = state.items.findIndex((item) => !item.disabled);
    if (firstEnabled >= 0) core.highlight(firstEnabled);
  };

  const registerItems = () => {
    if (!root || !selectId) return;
    const containers = contents.length ? contents : [root];
    itemElements = containers.flatMap((container) => Array.from(container.querySelectorAll<HTMLElement>(SELECT_ITEM)));

    itemElements = itemElements.filter((element) => {
      const itemId = element.getAttribute("data-select-id");
      return !itemId || itemId === selectId;
    });

    itemElements.forEach((element) => {
      const item = parseItem(element);
      if (!item) return;

      core.registerItem(item);
      element.setAttribute("role", "option");
      if (item.disabled) element.setAttribute("aria-disabled", "true");

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
    });
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
    const labels = state.selectedValues
      .map((value) => state.items.find((item) => item.value === value)?.label ?? value)
      .filter(Boolean);
    const text = labels.length ? labels.join(", ") : placeholder;

    selectedValueEls.forEach((el) => {
      el.textContent = text;
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
    core.toggle();
    ensureHighlighted();
  };

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    core.setSearch(target.value || "");
  };

  const bindDom = () => {
    if (!root || !selectId) return;

    triggers = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_TRIGGER}[data-select-id="${selectId}"]`));
    if (!triggers.length) triggers = Array.from(root.querySelectorAll<HTMLElement>(SELECT_TRIGGER));

    contents = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${selectId}"]`));
    if (!contents.length) {
      const contentInRoot = root.querySelector<HTMLElement>(SELECT_CONTENT);
      if (contentInRoot) contents = [contentInRoot];
    }

    input = document.querySelector<HTMLInputElement>(`${SELECT_INPUT}[data-select-id="${selectId}"]`) || root.querySelector<HTMLInputElement>(SELECT_INPUT);

    selectedValueEls = Array.from(document.querySelectorAll<HTMLElement>(`${SELECT_VALUE}[data-select-id="${selectId}"]`));
    if (!selectedValueEls.length) selectedValueEls = Array.from(root.querySelectorAll<HTMLElement>(SELECT_VALUE));

    const sourceTrigger = triggers[0];
    if (sourceTrigger) {
      const triggerPlaceholder = sourceTrigger.getAttribute("data-placeholder") || sourceTrigger.textContent?.trim() || placeholder;
      placeholder = triggerPlaceholder || placeholder;
    }

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

    registerItems();
  };

  const render = (state: SelectState) => {
    updateAria(state);
    updateItemsState(state);
    updateSelectedDisplays(state);
  };

  const destroy = () => {
    itemElements
      .map((element) => element.dataset.selectItem)
      .filter((value): value is string => Boolean(value))
      .forEach((value) => core.unregisterItem(value));
    cleanup.splice(0).forEach((fn) => fn());
    if (unsubscribe) unsubscribe();
    root = null;
    selectId = null;
    triggers = [];
    contents = [];
    input = null;
    itemElements = [];
    selectedValueEls = [];
  };

  const connect = ({ root: rootElement }: SelectDom) => {
    root = rootElement;
    selectId = root.id || null;
    if (!selectId) throw new Error("[select] root element requires an id attribute");
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
