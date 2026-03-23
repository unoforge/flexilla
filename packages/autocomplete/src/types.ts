import type { SelectCore, SelectItem } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";

export type AutocompleteSource = SelectItem[] | string[];

export type AutocompleteOptions = {
  multiple?: boolean;
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
};

export type AutocompleteDom = {
  root: HTMLElement;
};

export type AutocompleteController = SelectCore & {
  connect: (dom: AutocompleteDom) => { destroy: () => void };
};
