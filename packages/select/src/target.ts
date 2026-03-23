import { SELECT_CONTENT, SELECT_TRIGGER } from "./constants";

const normalizeSelectId = (value: string) => value.replace(/^#/, "");

export const resolveSelectTarget = (select: string | HTMLElement) => {
  if (typeof select === "string") {
    const element = document.querySelector<HTMLElement>(select);
    if (element instanceof HTMLElement) {
      return resolveSelectTarget(element);
    }

    const id = normalizeSelectId(select);
    const trigger = document.querySelector<HTMLElement>(`${SELECT_TRIGGER}[data-select-id="${id}"]`);
    const content = document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${id}"]`);
    const anchorElement = trigger ?? content;

    if (!anchorElement) {
      throw new Error(`Invalid select target: ${select}`);
    }

    const rootElement =
      (anchorElement.matches("[data-fx-select]") ? anchorElement : anchorElement.closest<HTMLElement>("[data-fx-select]")) ?? null;

    return {
      root: rootElement,
      anchor: anchorElement,
      id,
    };
  }

  const id = select.getAttribute("data-select-id") || select.id || "";
  if (!id) {
    throw new Error("Invalid select root element");
  }

  const rootElement = (select.matches("[data-fx-select]") ? select : select.closest<HTMLElement>("[data-fx-select]")) ?? null;

  return {
    root: rootElement,
    anchor: select,
    id,
  };
};
