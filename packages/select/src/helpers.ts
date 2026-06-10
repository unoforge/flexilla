import { resolveOverlayOptions as baseResolveOverlayOptions, collectItemData, SELECT_INPUT } from "@flexilla/select-core";
import type { SelectItem } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";
import type { SelectOptions } from "./types";

export const parseItem = (element: HTMLElement): SelectItem | null => {
  const value = element.dataset.selectItem;
  if (!value) return null;
  const label = (element.getAttribute("data-label") || element.textContent || "").trim() || value;
  const disabled = element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-disabled");
  return { value, label, disabled, data: collectItemData(element) };
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
  const multiple = options.multiple ?? (root.hasAttribute("data-multiple") || root.dataset.multiple === "true");
  const hasSearchInput =
    Boolean(content?.querySelector(SELECT_INPUT)) ||
    Boolean(root.querySelector(`${SELECT_INPUT}[data-select-id="${root.id}"]`)) ||
    Boolean(root.querySelector(SELECT_INPUT));

  const baseOptions = baseResolveOverlayOptions({
    root,
    content,
    options: {
      placement: options.placement,
      offsetDistance: options.offsetDistance,
      preventFromCloseOutside: options.preventFromCloseOutside,
      preventCloseFromInside: options.preventCloseFromInside,
      readjustHeight: options.readjustHeight,
      minHeight: options.minHeight,
      popper: options.popper,
    },
    defaultPreventCloseInside: multiple || hasSearchInput,
  });

  // Override placement with proper type
  return {
    ...baseOptions,
    placement: (content?.dataset.placement as Placement | undefined) ||
      (root.dataset.placement as Placement | undefined) ||
      options.placement ||
      "bottom-start",
  };
};
