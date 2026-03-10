import type { SelectCore, SelectItem } from "@flexilla/select-core";

export type AutocompleteSource = SelectItem[] | string[];

export type AutocompleteOptions = {
  multiple?: boolean;
  source?: AutocompleteSource;
  filter?: (query: string, item: SelectItem) => boolean;
};

export type AutocompleteDom = {
  root: HTMLElement;
};

export type AutocompleteController = SelectCore & {
  connect: (dom: AutocompleteDom) => { destroy: () => void };
};
