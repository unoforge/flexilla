import type { SelectCore } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";

export type AutocompleteExperimentalOptions = {
  teleport: boolean;
  teleportMode?: "move" | "detachable";
};

export type AutocompleteOptions = {
  multiple?: boolean;
  defaultValue?: string;
  filter?: (query: string, item: import("@flexilla/select-core").SelectItem) => boolean;
  searchDebounce?: number;
  placement?: Placement;
  offsetDistance?: number;
  preventFromCloseOutside?: boolean;
  preventCloseFromInside?: boolean;
  readjustHeight?: boolean;
  minHeight?: number;
  popper?: {
    eventEffect?: {
      disableOnResize?: boolean;
      disableOnScroll?: boolean;
    };
  };
  experimental?: AutocompleteExperimentalOptions;
};

export type AutocompleteDom = {
  element: string | HTMLElement;
};

export type AutocompleteController = SelectCore & {
  connect: (dom: AutocompleteDom) => { destroy: () => void };
};
