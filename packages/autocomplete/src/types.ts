import type { SelectCore, SelectItem } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";

export type AutocompleteSource = SelectItem[] | string[];

export type AutocompleteExperimentalOptions = {
  teleport: boolean;
  teleportMode?: "move" | "detachable";
};

export type AutocompleteOptions = {
  multiple?: boolean;
  defaultValue?: string;
  source?: AutocompleteSource;
  filter?: (query: string, item: SelectItem) => boolean;
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
