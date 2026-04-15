const normalizeSelectId = (value: string) => value.replace(/^#/, "");

const resolveElement = (target: string | HTMLElement) => {
  if (target instanceof HTMLElement) return target;

  const matchedElement = document.querySelector<HTMLElement>(target);
  if (matchedElement instanceof HTMLElement) return matchedElement;

  const normalizedId = normalizeSelectId(target);
  return (
    document.getElementById(normalizedId) ||
    document.querySelector<HTMLElement>(`[data-select-id="${normalizedId}"]`)
  );
};

export const resolveSelectTarget = (target: string | HTMLElement) => {
  const element = resolveElement(target);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`[select] invalid target: ${String(target)}`);
  }

  const id = element.getAttribute("data-select-id") || element.id || "";
  if (!id) {
    throw new Error("[select] target element must provide data-select-id or id");
  }

  return {
    element,
    id,
  };
};
