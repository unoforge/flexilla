import type { SelectItem } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";
import type { SelectOptions } from "./types";
import { SELECT_INPUT } from "./constants";

export const defaultFilter = (query: string, item: SelectItem) => {
  if (!query) return true;
  const text = `${item.label ?? item.value}`.toLowerCase();
  return text.includes(query.toLowerCase());
};

export const parseItem = (element: HTMLElement): SelectItem | null => {
  const value = element.dataset.selectItem;
  if (!value) return null;
  const label = (element.getAttribute("data-label") || element.textContent || "").trim() || value;
  const disabled = element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-disabled");
  return { value, label, disabled };
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
  options: SelectOptions;
}) => {
  const source = content ?? root;
  const multiple = options.multiple ?? (root.hasAttribute("data-multiple") || root.dataset.multiple === "true");
  const hasSearchInput =
    Boolean(content?.querySelector(SELECT_INPUT)) ||
    Boolean(root.querySelector(`${SELECT_INPUT}[data-select-id="${root.id}"]`)) ||
    Boolean(root.querySelector(SELECT_INPUT));

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
      (multiple || hasSearchInput),
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
