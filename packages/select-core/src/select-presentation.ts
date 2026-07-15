import type { SelectItem } from "./types";

const SELECT_LABEL = "[data-select-label]";
const SELECT_VALUE = "[data-select-value]";
const SELECT_REMOVE = "[data-select-remove]";
const SELECT_CHIP_REMOVE = "[data-select-chip-remove]";
const SELECT_PLACEHOLDER = "[data-placeholder]";
const SELECT_EMPTY = "[data-select-empty]";
const SELECT_EMPTY_QUERY = "[data-select-empty-query]";
const SELECT_EMPTY_RENDERED = "data-select-empty-rendered";
const SELECT_RENDERED = "data-select-rendered";
const SELECT_MODEL = "template[data-selected-model]";
const SELECT_MODEL_ATTR = "data-selected-model-html";
const SELECT_BIND = "[data-bind]";
const SELECT_BIND_HTML = "[data-bind-html]";
const SELECT_BIND_SRC = "[data-bind-src]";
const SELECT_BIND_ALT = "[data-bind-alt]";
const SELECT_BIND_TITLE = "[data-bind-title]";
const SELECT_BIND_HREF = "[data-bind-href]";
const SELECT_BIND_STYLE = "[data-bind-style]";
const DEFAULT_COUNT_SINGULAR_TEXT = "{count} item selected";
const DEFAULT_COUNT_PLURAL_TEXT = "{count} items selected";
const DEFAULT_COMPACT_TEXT = "{labels} and {remaining} others";

export type SelectPresentationMode = "tag" | "trigger";

export type SelectPresentationItem = {
  item: SelectItem;
  element?: HTMLElement | null;
};

export type SelectSummaryOptions = {
  mode?: "chips" | "count" | "compact" | "simple";
  maxVisibleLabels?: number;
  countSingularText?: string;
  countPluralText?: string;
  compactText?: string;
};

type RenderSelectedValuesOptions = {
  containers: HTMLElement[];
  itemsByValue: Map<string, SelectPresentationItem>;
  selectedValues: string[];
  multiple?: boolean;
  placeholder: string;
  summary?: SelectSummaryOptions;
  onRemove: (value: string) => void;
  registerCleanup: (cleanup: () => void) => void;
};

type SyncEmptyStateOptions = {
  content: HTMLElement | null;
  visibleCount: number;
  query?: string;
};

type TemplateRecord = Record<string, string>;

const replaceSummaryTokens = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), template);

const getContainerSummaryOptions = (container: HTMLElement, summary?: SelectSummaryOptions): SelectSummaryOptions => {
  const rawLimit = Number(container.getAttribute("data-select-summary-limit") || summary?.maxVisibleLabels || 1);
  // Check for explicit mode configuration (container attr or options)
  const explicitMode = (container.getAttribute("data-select-summary-mode") as SelectSummaryOptions["mode"] | null) || summary?.mode;
  return {
    mode: explicitMode || "simple", // Default to "simple" (comma-separated) instead of "chips"
    maxVisibleLabels: Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 1,
    countSingularText:
      container.getAttribute("data-select-summary-count-singular") || summary?.countSingularText || DEFAULT_COUNT_SINGULAR_TEXT,
    countPluralText:
      container.getAttribute("data-select-summary-count-plural") || summary?.countPluralText || DEFAULT_COUNT_PLURAL_TEXT,
    compactText:
      container.getAttribute("data-select-summary-compact-text") || summary?.compactText || DEFAULT_COMPACT_TEXT,
  };
};

const createNodeFromHtml = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild instanceof HTMLElement
    ? (template.content.firstElementChild.cloneNode(true) as HTMLElement)
    : null;
};

const getBindingValue = (record: TemplateRecord, key: string | null) => {
  if (!key) return "";
  return record[key] ?? "";
};

const collectBoundElements = (node: HTMLElement, selector: string) => {
  const elements = Array.from(node.querySelectorAll<HTMLElement>(selector));
  if (node.matches(selector)) elements.unshift(node);
  return elements;
};

const applyBindingAttribute = ({
  node,
  selector,
  attribute,
  record,
}: {
  node: HTMLElement;
  selector: string;
  attribute: string;
  record: TemplateRecord;
}) => {
  collectBoundElements(node, selector).forEach((el) => {
    const key = el.getAttribute(attribute);
    const value = getBindingValue(record, key);
    if (value) {
      el.setAttribute(attribute.replace("data-bind-", ""), value);
    } else {
      el.removeAttribute(attribute.replace("data-bind-", ""));
    }
  });
};

const fillBindings = (node: HTMLElement, record: TemplateRecord) => {
  collectBoundElements(node, SELECT_BIND).forEach((el) => {
    el.textContent = getBindingValue(record, el.getAttribute("data-bind"));
  });

  collectBoundElements(node, SELECT_BIND_HTML).forEach((el) => {
    el.innerHTML = getBindingValue(record, el.getAttribute("data-bind-html"));
  });

  applyBindingAttribute({ node, selector: SELECT_BIND_SRC, attribute: "data-bind-src", record });
  applyBindingAttribute({ node, selector: SELECT_BIND_ALT, attribute: "data-bind-alt", record });
  applyBindingAttribute({ node, selector: SELECT_BIND_TITLE, attribute: "data-bind-title", record });
  applyBindingAttribute({ node, selector: SELECT_BIND_HREF, attribute: "data-bind-href", record });

  collectBoundElements(node, SELECT_BIND_STYLE).forEach((el) => {
    const value = getBindingValue(record, el.getAttribute("data-bind-style"));
    if (value) {
      el.setAttribute("style", value);
    } else {
      el.removeAttribute("style");
    }
  });
};

const createTemplateRecord = ({
  item,
  value,
  fallbackLabel,
}: {
  item?: SelectPresentationItem;
  value: string;
  fallbackLabel?: string;
}): TemplateRecord => {
  const label = item?.item.label ?? fallbackLabel ?? value;
  return {
    value,
    label,
    ...(item?.item.data || {}),
  };
};

export const setupSelectValueContainer = (container: HTMLElement) => {
  if (container.getAttribute(SELECT_MODEL_ATTR)) return;
  const template = container.querySelector<HTMLTemplateElement>(SELECT_MODEL);
  if (!(template instanceof HTMLTemplateElement)) return;
  container.setAttribute(SELECT_MODEL_ATTR, template.innerHTML.trim());
  template.remove();
};

export const getSelectPresentationMarkup = ({
  element,
  mode: _mode,
}: {
  element?: HTMLElement | null;
  mode: SelectPresentationMode;
}) => {
  if (!(element instanceof HTMLElement)) return "";
  return element.innerHTML.trim();
};

const fillTemplate = ({
  node,
  item,
  value,
  fallbackLabel,
  onRemove,
  registerCleanup,
}: {
  node: HTMLElement;
  item?: SelectPresentationItem;
  value: string;
  fallbackLabel?: string;
  onRemove: (value: string) => void;
  registerCleanup: (cleanup: () => void) => void;
}) => {
  const record = createTemplateRecord({ item, value, fallbackLabel });
  const label = record.label || fallbackLabel || value;

  collectBoundElements(node, SELECT_LABEL).forEach((el) => {
    el.textContent = label;
  });
  collectBoundElements(node, SELECT_VALUE).forEach((el) => {
    el.textContent = value;
  });

  fillBindings(node, record);

  const removeTarget =
    (node.matches(SELECT_REMOVE) ? node : node.querySelector<HTMLElement>(SELECT_REMOVE)) ??
    (node.matches(SELECT_CHIP_REMOVE) ? node : node.querySelector<HTMLElement>(SELECT_CHIP_REMOVE)) ??
    null;

  if (removeTarget) {
    removeTarget.setAttribute("data-select-remove", value);
    const handler = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onRemove(value);
    };
    removeTarget.addEventListener("click", handler);
    registerCleanup(() => removeTarget.removeEventListener("click", handler));
  }
};

const createRenderedNode = ({
  container,
  item,
  value,
  onRemove,
  registerCleanup,
}: {
  container: HTMLElement;
  item?: SelectPresentationItem;
  value: string;
  onRemove: (value: string) => void;
  registerCleanup: (cleanup: () => void) => void;
}) => {
  const template = createNodeFromHtml(container.getAttribute(SELECT_MODEL_ATTR) || "");

  if (template) {
    const node = template.cloneNode(true) as HTMLElement;
    node.setAttribute(SELECT_RENDERED, "");
    fillTemplate({
      node,
      item,
      value,
      onRemove,
      registerCleanup,
    });
    return node;
  }

  const node = document.createElement("span");
  node.setAttribute(SELECT_RENDERED, "");
  node.textContent = item?.item.label ?? value;
  return node;
};

const createSummaryNode = ({
  container,
  selectedValues,
  itemsByValue,
  summary,
}: {
  container: HTMLElement;
  selectedValues: string[];
  itemsByValue: Map<string, SelectPresentationItem>;
  summary: SelectSummaryOptions;
}) => {
  const labels = selectedValues.map((value) => itemsByValue.get(value)?.item.label ?? value).filter(Boolean);
  const count = labels.length;
  let text = "";

  if (summary.mode === "count") {
    text = replaceSummaryTokens(
      count === 1 ? summary.countSingularText || DEFAULT_COUNT_SINGULAR_TEXT : summary.countPluralText || DEFAULT_COUNT_PLURAL_TEXT,
      { count },
    );
  } else if (summary.mode === "compact") {
    const visibleCount = Math.min(summary.maxVisibleLabels || 1, labels.length);
    const visibleLabels = labels.slice(0, visibleCount);
    const remaining = Math.max(labels.length - visibleLabels.length, 0);
    text = remaining
      ? replaceSummaryTokens(summary.compactText || DEFAULT_COMPACT_TEXT, {
          count,
          remaining,
          labels: visibleLabels.join(", "),
        })
      : visibleLabels.join(", ");
  } else {
    // Simple mode: all values comma-separated, no truncation
    text = labels.join(", ");
  }

  const template = createNodeFromHtml(container.getAttribute(SELECT_MODEL_ATTR) || "");
  if (template) {
    template.setAttribute(SELECT_RENDERED, "");
    fillTemplate({
      node: template,
      value: text,
      fallbackLabel: text,
      onRemove: () => {},
      registerCleanup: () => {},
    });
    return template;
  }

  const node = document.createElement("span");
  node.setAttribute(SELECT_RENDERED, "");
  node.textContent = text;
  return node;
};

export const renderSelectedValues = ({
  containers,
  itemsByValue,
  selectedValues,
  multiple = false,
  placeholder,
  summary,
  onRemove,
  registerCleanup,
}: RenderSelectedValuesOptions) => {
  containers.forEach((container) => {
    setupSelectValueContainer(container);
    const template = createNodeFromHtml(container.getAttribute(SELECT_MODEL_ATTR) || "");
    const placeholderEl = container.querySelector<HTMLElement>(SELECT_PLACEHOLDER);
    const resolvedSummary = getContainerSummaryOptions(container, summary);

    if (placeholderEl) placeholderEl.style.display = "none";

    container.querySelectorAll<HTMLElement>(`[${SELECT_RENDERED}]`).forEach((el) => el.remove());
    if (!template && !placeholderEl) {
      container.textContent = "";
    }

    if (!selectedValues.length) {
      if (placeholderEl) {
        placeholderEl.style.removeProperty("display");
        return;
      }

      if (template) {
        const node = template.cloneNode(true) as HTMLElement;
        node.setAttribute(SELECT_RENDERED, "");
        fillTemplate({
          node,
          value: placeholder,
          fallbackLabel: placeholder,
          onRemove,
          registerCleanup,
        });
        container.appendChild(node);
        return;
      }

      container.textContent = placeholder;
      return;
    }

    if (!multiple) {
      const value = selectedValues[0]!;
      const item = itemsByValue.get(value);
      const node = createRenderedNode({
        container,
        item,
        value,
        onRemove,
        registerCleanup,
      });

      if (!template) {
        container.replaceChildren();
      }

      container.appendChild(node);
      return;
    }

    if (resolvedSummary.mode !== "chips") {
      container.appendChild(
        createSummaryNode({
          container,
          selectedValues,
          itemsByValue,
          summary: resolvedSummary,
        }),
      );
      return;
    }

    selectedValues.forEach((value) => {
      const item = itemsByValue.get(value);
      const node = createRenderedNode({
        container,
        item,
        value,
        onRemove,
        registerCleanup,
      });
      container.appendChild(node);
    });
  });
};

const getEmptyRenderable = (content: HTMLElement) => {
  const source = content.querySelector<HTMLElement | HTMLTemplateElement>(SELECT_EMPTY);
  if (!source) return null;

  if (source instanceof HTMLTemplateElement) {
    return {
      type: "template" as const,
      source,
      rendered: content.querySelector<HTMLElement>(`[${SELECT_EMPTY_RENDERED}]`),
    };
  }

  return {
    type: "element" as const,
    source,
  };
};

const fillEmptyState = (node: HTMLElement, query: string) => {
  node.querySelectorAll<HTMLElement>(SELECT_EMPTY_QUERY).forEach((el) => {
    el.textContent = query;
  });
};

export const syncSelectEmptyState = ({
  content,
  visibleCount,
  query = "",
}: SyncEmptyStateOptions) => {
  if (!(content instanceof HTMLElement)) return;

  const emptyRenderable = getEmptyRenderable(content);
  if (!emptyRenderable) return;

  const shouldShow = visibleCount === 0;

  if (emptyRenderable.type === "element") {
    if (shouldShow) {
      fillEmptyState(emptyRenderable.source, query);
      emptyRenderable.source.removeAttribute("hidden");
    } else {
      emptyRenderable.source.setAttribute("hidden", "");
    }
    return;
  }

  if (!shouldShow) {
    emptyRenderable.rendered?.remove();
    return;
  }

  const fragment = emptyRenderable.source.content.cloneNode(true) as DocumentFragment;
  const firstElement = fragment.firstElementChild;
  if (!(firstElement instanceof HTMLElement)) return;

  firstElement.setAttribute(SELECT_EMPTY_RENDERED, "");
  fillEmptyState(firstElement, query);
  emptyRenderable.rendered?.remove();
  content.appendChild(firstElement);
};
