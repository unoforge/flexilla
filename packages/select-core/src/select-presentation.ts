import type { SelectItem } from "./types";

const SELECT_TEMPLATE = "[data-select-template]";
const SELECT_LABEL = "[data-select-label]";
const SELECT_VALUE = "[data-select-value]";
const SELECT_REMOVE = "[data-select-remove]";
const SELECT_CHIP_REMOVE = "[data-select-chip-remove]";
const SELECT_PLACEHOLDER = "[data-placeholder]";
const SELECT_RICH_CONTENT = "[data-select-rich-content]";
const SELECT_EMPTY = "[data-select-empty]";
const SELECT_EMPTY_QUERY = "[data-select-empty-query]";
const SELECT_EMPTY_RENDERED = "data-select-empty-rendered";
const SELECT_RENDERED = "data-select-rendered";
const SELECT_TAG_CONTENT_ATTR = "data-select-tag-content-html";
const SELECT_TRIGGER_CONTENT_ATTR = "data-select-trigger-content-html";
const SELECT_DISPLAY_CONTENT_ATTR = "data-select-display-content-html";
const SELECT_TEMPLATE_ATTR = "data-select-template-html";
const DEFAULT_COUNT_SINGULAR_TEXT = "{count} item selected";
const DEFAULT_COUNT_PLURAL_TEXT = "{count} items selected";
const DEFAULT_COMPACT_TEXT = "{labels} and {remaining} others";

export type SelectPresentationMode = "tag" | "trigger";

export type SelectPresentationItem = {
  item: SelectItem;
  element?: HTMLElement | null;
};

export type SelectSummaryOptions = {
  mode?: "chips" | "count" | "compact";
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

const replaceSummaryTokens = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), template);

const getContainerSummaryOptions = (container: HTMLElement, summary?: SelectSummaryOptions): SelectSummaryOptions => {
  const rawLimit = Number(container.getAttribute("data-select-summary-limit") || summary?.maxVisibleLabels || 1);
  return {
    mode: (container.getAttribute("data-select-summary-mode") as SelectSummaryOptions["mode"] | null) || summary?.mode || "chips",
    maxVisibleLabels: Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 1,
    countSingularText:
      container.getAttribute("data-select-summary-count-singular") || summary?.countSingularText || DEFAULT_COUNT_SINGULAR_TEXT,
    countPluralText:
      container.getAttribute("data-select-summary-count-plural") || summary?.countPluralText || DEFAULT_COUNT_PLURAL_TEXT,
    compactText:
      container.getAttribute("data-select-summary-compact-text") || summary?.compactText || DEFAULT_COMPACT_TEXT,
  };
};

const stripSelectionArtifacts = (node: HTMLElement) => {
  node
    .querySelectorAll<HTMLElement>('[data-select-indicator], [data-slot="icon"]')
    .forEach((el) => el.remove());
  node.removeAttribute("data-select-tag-content");
  node.removeAttribute("data-select-trigger-content");
  node.removeAttribute("data-select-display-content");
  return node;
};

const captureMarkedContent = ({
  element,
  selector,
  attribute,
}: {
  element: HTMLElement;
  selector: string;
  attribute: string;
}) => {
  const marked = element.querySelector<HTMLElement>(selector);
  if (!(marked instanceof HTMLElement)) return;
  const clone = stripSelectionArtifacts(marked.cloneNode(true) as HTMLElement);
  element.setAttribute(attribute, clone.outerHTML.trim());
  marked.remove();
};

export const setupSelectPresentationItem = (element: HTMLElement) => {
  captureMarkedContent({
    element,
    selector: "[data-select-tag-content]",
    attribute: SELECT_TAG_CONTENT_ATTR,
  });
  captureMarkedContent({
    element,
    selector: "[data-select-trigger-content]",
    attribute: SELECT_TRIGGER_CONTENT_ATTR,
  });
  captureMarkedContent({
    element,
    selector: "[data-select-display-content]",
    attribute: SELECT_DISPLAY_CONTENT_ATTR,
  });
};

const createNodeFromHtml = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild instanceof HTMLElement
    ? (template.content.firstElementChild.cloneNode(true) as HTMLElement)
    : null;
};

export const setupSelectValueContainer = (container: HTMLElement) => {
  if (container.getAttribute(SELECT_TEMPLATE_ATTR)) return;
  const template = container.querySelector<HTMLElement>(SELECT_TEMPLATE);
  if (!(template instanceof HTMLElement)) return;
  container.setAttribute(SELECT_TEMPLATE_ATTR, template.outerHTML);
  template.remove();
};

export const getSelectPresentationMarkup = ({
  element,
  mode,
}: {
  element?: HTMLElement | null;
  mode: SelectPresentationMode;
}) => {
  if (!(element instanceof HTMLElement)) return "";

  const preferred =
    (mode === "tag"
      ? element.getAttribute(SELECT_TAG_CONTENT_ATTR) || element.getAttribute(SELECT_DISPLAY_CONTENT_ATTR)
      : element.getAttribute(SELECT_TRIGGER_CONTENT_ATTR) || element.getAttribute(SELECT_DISPLAY_CONTENT_ATTR)) || "";
  if (preferred) return preferred;

  const clone = stripSelectionArtifacts(element.cloneNode(true) as HTMLElement);
  return clone.innerHTML.trim();
};

const fillTemplate = ({
  node,
  item,
  value,
  richContent,
  onRemove,
  registerCleanup,
}: {
  node: HTMLElement;
  item: SelectPresentationItem | undefined;
  value: string;
  richContent: string;
  onRemove: (value: string) => void;
  registerCleanup: (cleanup: () => void) => void;
}) => {
  const label = item?.item.label ?? value;

  node.querySelectorAll<HTMLElement>(SELECT_LABEL).forEach((el) => {
    el.textContent = label;
  });
  node.querySelectorAll<HTMLElement>(SELECT_VALUE).forEach((el) => {
    el.textContent = value;
  });
  node.querySelectorAll<HTMLElement>(SELECT_RICH_CONTENT).forEach((el) => {
    el.innerHTML = richContent || label;
  });

  const removeTarget =
    node.querySelector<HTMLElement>(SELECT_REMOVE) ??
    node.querySelector<HTMLElement>(SELECT_CHIP_REMOVE) ??
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
  multiple,
  onRemove,
  registerCleanup,
}: {
  container: HTMLElement;
  item: SelectPresentationItem | undefined;
  value: string;
  multiple: boolean;
  onRemove: (value: string) => void;
  registerCleanup: (cleanup: () => void) => void;
}) => {
  const template = createNodeFromHtml(container.getAttribute(SELECT_TEMPLATE_ATTR) || "");
  const mode: SelectPresentationMode = multiple ? "tag" : "trigger";
  const richContent = getSelectPresentationMarkup({ element: item?.element, mode });

  if (template) {
    const node = template.cloneNode(true) as HTMLElement;
    node.removeAttribute("data-select-template");
    node.style.removeProperty("display");
    node.setAttribute(SELECT_RENDERED, "");
    fillTemplate({
      node,
      item,
      value,
      richContent,
      onRemove,
      registerCleanup,
    });
    return node;
  }

  const node = document.createElement("span");
  node.setAttribute(SELECT_RENDERED, "");
  if (richContent) {
    node.innerHTML = richContent;
  } else {
    node.textContent = item?.item.label ?? value;
  }
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
  } else {
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
  }

  const template = createNodeFromHtml(container.getAttribute(SELECT_TEMPLATE_ATTR) || "");
  if (template) {
    template.removeAttribute("data-select-template");
    template.style.removeProperty("display");
    template.setAttribute(SELECT_RENDERED, "");
    template.querySelectorAll<HTMLElement>(SELECT_LABEL).forEach((el) => {
      el.textContent = text;
    });
    template.querySelectorAll<HTMLElement>(SELECT_RICH_CONTENT).forEach((el) => {
      el.textContent = text;
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
    const template = createNodeFromHtml(container.getAttribute(SELECT_TEMPLATE_ATTR) || "");
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
        node.removeAttribute("data-select-template");
        node.style.removeProperty("display");
        node.setAttribute(SELECT_RENDERED, "");
        node.querySelectorAll<HTMLElement>(SELECT_LABEL).forEach((el) => {
          el.textContent = placeholder;
        });
        node.querySelectorAll<HTMLElement>(SELECT_RICH_CONTENT).forEach((el) => {
          el.textContent = placeholder;
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
        multiple,
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
        multiple,
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
