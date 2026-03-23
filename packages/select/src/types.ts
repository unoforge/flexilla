import type { SelectCore } from "@flexilla/select-core";
import type { Placement } from "flexipop/create-overlay";

export type SelectOptions = {
  multiple?: boolean;
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
  root: HTMLElement;
};

export type SelectController = SelectCore & {
  connect: (dom: SelectDom) => { destroy: () => void };
};
