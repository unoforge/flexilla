import type { SelectCore, SelectItem, SelectSummaryOptions } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";

export type SelectOptions = {
  multiple?: boolean;
  checkIcon?: string;
  indicatorPosition?: "start" | "end";
  filter?: (query: string, item: SelectItem) => boolean;
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
};

export type SelectDom = {
  root?: HTMLElement;
  id?: string;
  anchor?: HTMLElement;
};

export type SelectController = SelectCore & {
  connect: (dom: SelectDom) => { destroy: () => void };
};
