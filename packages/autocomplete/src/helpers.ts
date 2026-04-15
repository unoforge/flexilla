import type { SelectItem } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";
import type { AutocompleteOptions } from "./types";

const OMITTED_ITEM_DATA_KEYS = new Set(["selectItem", "label", "disabled", "selectId"]);

export const collectItemData = (element: HTMLElement) => {
  const data: Record<string, string> = {};
  Object.entries(element.dataset).forEach(([key, value]) => {
    if (!value || OMITTED_ITEM_DATA_KEYS.has(key)) return;
    data[key] = value;
  });
  return data;
};

export const defaultFilter = (query: string, item: SelectItem) => {
  if (!query) return true;
  const text = `${item.label ?? item.value}`.toLowerCase();
  return text.includes(query.toLowerCase());
};

export const getBooleanAttr = (element: HTMLElement | null, attr: string): boolean | undefined => {
  if (!(element instanceof HTMLElement)) return undefined;
  if (!element.hasAttribute(attr)) return undefined;
  const value = element.getAttribute(attr);
  return value !== "false";
};

export const getNumberAttr = (element: HTMLElement | null, attr: string): number | undefined => {
  if (!(element instanceof HTMLElement)) return undefined;
  const rawValue = element.getAttribute(attr);
  if (!rawValue) return undefined;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : undefined;
};

export const resolveOverlayOptions = ({
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
