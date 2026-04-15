import type { SelectCore, SelectItem, SelectState } from "@flexilla/select-core";
import { FlexillaManager } from "@flexilla/manager";
import { createSelect } from "./controller";
import { SELECT_CONTENT } from "./constants";
import { getBooleanAttr } from "./helpers";
import { resolveSelectTarget } from "./target";
import type { SelectController, SelectOptions } from "./types";

type SelectInstanceOptions = SelectOptions & {
  multiple?: boolean;
};

export { createSelect };

export class Select implements SelectCore {
  private registryElement!: HTMLElement;
  private controller!: SelectController;
  private destroyConnection: { destroy: () => void } | null = null;

  constructor(select: string | HTMLElement, options: SelectInstanceOptions = {}) {
    const target = resolveSelectTarget(select);
    const registryElement = target.element;

    const existingInstance = FlexillaManager.getInstance("select", registryElement);
    if (existingInstance) {
      return existingInstance;
    }

    const multiple =
      options.multiple ??
      getBooleanAttr(target.element, "data-multiple") ??
      getBooleanAttr(document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${target.id}"]`), "data-multiple") ??
      false;

    this.registryElement = registryElement;
    this.controller = createSelect({ ...options, multiple });
    this.destroyConnection = this.controller.connect({ element: target.element });

    FlexillaManager.register("select", registryElement, this);
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
    FlexillaManager.removeInstance("select", this.registryElement);
  };

  static init = (select: string | HTMLElement, options: SelectInstanceOptions = {}) => new Select(select, options);

  static autoInit = (selector = "[data-fx-select]") => {
    const roots = document.querySelectorAll<HTMLElement>(selector);
    for (const root of roots) {
      new Select(root);
    }
  };
}
