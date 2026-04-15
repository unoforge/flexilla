const normalizeAutocompleteId = (value: string) => value.replace(/^#/, "");

const resolveElement = (target: string | HTMLElement) => {
  if (target instanceof HTMLElement) return target;

  const matchedElement = document.querySelector<HTMLElement>(target);
  if (matchedElement instanceof HTMLElement) return matchedElement;

  const normalizedId = normalizeAutocompleteId(target);
  return (
    document.getElementById(normalizedId) ||
    document.querySelector<HTMLElement>(`[data-autocomplete-id="${normalizedId}"]`) ||
    document.querySelector<HTMLElement>(`[data-select-id="${normalizedId}"]`)
  );
};

export const resolveAutocompleteTarget = (target: string | HTMLElement) => {
  const element = resolveElement(target);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`[autocomplete] invalid target: ${String(target)}`);
  }

  const id = element.getAttribute("data-autocomplete-id") || element.getAttribute("data-select-id") || element.id || "";
  if (!id) {
    throw new Error("[autocomplete] target element must provide data-autocomplete-id, data-select-id or id");
  }

  return {
    element,
    id,
  };
};
