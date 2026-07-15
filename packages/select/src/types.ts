import type { SelectCore, SelectItem, SelectSummaryOptions } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";

export type SelectExperimentalOptions = {
  teleport: boolean;
  teleportMode?: "move" | "detachable";
};

export type SelectOptions = {
  multiple?: boolean;
  defaultValue?: string;
  filter?: (query: string, item: SelectItem) => boolean;
  searchDebounce?: number;
  summary?: SelectSummaryOptions;
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
  experimental?: SelectExperimentalOptions;
};

export type SelectDom = {
  element: string | HTMLElement;
};

export type SelectController = SelectCore & {
  connect: (dom: SelectDom) => { destroy: () => void };
};
