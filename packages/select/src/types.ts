import type { SelectCore } from "@flexilla/select-core";

export type SelectOptions = {
  multiple?: boolean;
};

export type SelectDom = {
  root: HTMLElement;
};

export type SelectController = SelectCore & {
  connect: (dom: SelectDom) => { destroy: () => void };
};
