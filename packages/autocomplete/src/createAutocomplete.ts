import type { SelectCore, SelectItem, SelectState } from "@flexilla/select-core";
import { FlexillaManager } from "@flexilla/manager";
import { createAutocomplete } from "./controller";
import { SELECT_CONTENT } from "./constants";
import { getBooleanAttr } from "./helpers";
import { resolveAutocompleteTarget } from "./target";
import type { AutocompleteController, AutocompleteOptions } from "./types";

type AutocompleteInstanceOptions = AutocompleteOptions & {
  multiple?: boolean;
};

export { createAutocomplete };

export class Autocomplete implements SelectCore {
  private registryElement!: HTMLElement;
  private controller!: AutocompleteController;
  private destroyConnection: { destroy: () => void } | null = null;

  constructor(autocomplete: string | HTMLElement, options: AutocompleteInstanceOptions = {}) {
    const target = resolveAutocompleteTarget(autocomplete);
    const registryElement = target.element;

    const existingInstance = FlexillaManager.getInstance("autocomplete", registryElement);
    if (existingInstance) {
      return existingInstance;
    }

    const multiple =
      options.multiple ??
      getBooleanAttr(target.element, "data-multiple") ??
      getBooleanAttr(document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${target.id}"]`), "data-multiple") ??
      false;

    this.registryElement = registryElement;
    this.controller = createAutocomplete({ ...options, multiple });
    this.destroyConnection = this.controller.connect({ element: target.element });

    FlexillaManager.register("autocomplete", registryElement, this);
  }

  open = () => this.controller.open();
  close = () => this.controller.close();
  toggle = () => this.controller.toggle();
  select = (value: string) => this.controller.select(value);
  unselect = (value: string) => this.controller.unselect(value);
  clear = () => this.controller.clear();
  toggleValue = (value: string) => this.controller.toggleValue(value);
  highlightNext = () => this.controller.highlightNext();
  highlightPrev = () => this.controller.highlightPrev();
  highlight = (index: number | null) => this.controller.highlight(index);
  setSearch = (query: string) => this.controller.setSearch(query);
  registerItem = (item: SelectItem) => this.controller.registerItem(item);
  unregisterItem = (value: string) => this.controller.unregisterItem(value);
  getState = () => this.controller.getState();
  subscribe = (listener: (state: Readonly<SelectState>) => void) => this.controller.subscribe(listener);

  cleanup = () => {
    this.destroyConnection?.destroy();
    this.destroyConnection = null;
    FlexillaManager.removeInstance("autocomplete", this.registryElement);
  };

  static init = (autocomplete: string | HTMLElement, options: AutocompleteInstanceOptions = {}) => new Autocomplete(autocomplete, options);

  static autoInit = (selector = "[data-fx-autocomplete]") => {
    const roots = document.querySelectorAll<HTMLElement>(selector);
    for (const root of roots) {
      new Autocomplete(root);
    }
  };
}
