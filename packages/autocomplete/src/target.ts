import { SELECT_CONTENT, SELECT_INPUT, SELECT_TRIGGER } from "./constants";

const normalizeAutocompleteId = (value: string) => value.replace(/^#/, "");

export const resolveAutocompleteTarget = (autocomplete: string | HTMLElement) => {
  if (typeof autocomplete === "string") {
    const element = document.querySelector<HTMLElement>(autocomplete);
    if (element instanceof HTMLElement) {
      return resolveAutocompleteTarget(element);
    }

    const id = normalizeAutocompleteId(autocomplete);
    const input = document.querySelector<HTMLElement>(`${SELECT_INPUT}[data-autocomplete-id="${id}"]`);
    const trigger = document.querySelector<HTMLElement>(`${SELECT_TRIGGER}[data-autocomplete-id="${id}"]`);
    const content = document.querySelector<HTMLElement>(`${SELECT_CONTENT}[data-select-id="${id}"]`);
    const anchorElement = input ?? trigger ?? content;

    if (!anchorElement) {
      throw new Error(`Invalid autocomplete target: ${autocomplete}`);
    }

    const rootElement =
      (anchorElement.matches("[data-fx-autocomplete]") ? anchorElement : anchorElement.closest<HTMLElement>("[data-fx-autocomplete]")) ?? null;

    return {
      root: rootElement,
      anchor: anchorElement,
      id,
    };
  }

  const id = autocomplete.getAttribute("data-autocomplete-id") || autocomplete.getAttribute("data-select-id") || autocomplete.id || "";
  if (!id) {
    throw new Error("Invalid autocomplete root element");
  }

  const rootElement =
    (autocomplete.matches("[data-fx-autocomplete]") ? autocomplete : autocomplete.closest<HTMLElement>("[data-fx-autocomplete]")) ?? null;

  return {
    root: rootElement,
    anchor: autocomplete,
    id,
  };
};
