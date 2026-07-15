import { resolveOverlayOptions as baseResolveOverlayOptions } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";
import type { AutocompleteOptions } from "./types";

export const resolveOverlayOptions = ({
  content,
  options,
}: {
  content: HTMLElement | null;
  options: AutocompleteOptions;
}) => {
  const multiple = options.multiple ?? (content?.hasAttribute("data-multiple") || content?.dataset.multiple === "true");

  const baseOptions = baseResolveOverlayOptions({
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
    defaultPreventCloseInside: multiple,
  });

  // Override placement with proper type
  return {
    ...baseOptions,
    placement: (content?.dataset.placement as Placement | undefined) ||
      options.placement ||
      "bottom-start",
  };
};
