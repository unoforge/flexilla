const SELECT_ICON_SLOT = '[data-slot="icon"]';
const SELECT_INDICATOR_TEMPLATE = "data-select-indicator-template";

export const DEFAULT_SELECT_CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>`;

type IndicatorPosition = "start" | "end";

type SetupIndicatorOptions = {
  element: HTMLElement;
  fallbackIcon: string;
};

type SyncIndicatorOptions = {
  element: HTMLElement;
  isSelected: boolean;
  fallbackIcon: string;
  root?: HTMLElement | null;
  indicatorPosition?: IndicatorPosition;
};

const getIndicatorPosition = ({
  element,
  root,
  indicatorPosition = "start",
}: {
  element: HTMLElement;
  root?: HTMLElement | null;
  indicatorPosition?: IndicatorPosition;
}) =>
  (element.getAttribute("data-indicator-position") as IndicatorPosition | null) ||
  (root?.getAttribute("data-indicator-position") as IndicatorPosition | null) ||
  indicatorPosition;

const getOrCreateItemIndicator = ({
  element,
  fallbackIcon,
  root,
  indicatorPosition,
}: {
  element: HTMLElement;
  fallbackIcon: string;
  root?: HTMLElement | null;
  indicatorPosition?: IndicatorPosition;
}) => {
  let iconSlot = element.querySelector<HTMLElement>(`:scope > ${SELECT_ICON_SLOT}`);
  if (!(iconSlot instanceof HTMLElement)) {
    iconSlot = element.querySelector<HTMLElement>(SELECT_ICON_SLOT) || null;
  }

  if (iconSlot instanceof HTMLElement) {
    if (!element.getAttribute(SELECT_INDICATOR_TEMPLATE)) {
      element.setAttribute(SELECT_INDICATOR_TEMPLATE, iconSlot.innerHTML.trim() || fallbackIcon);
    }
  }

  if (!(iconSlot instanceof HTMLElement)) {
    iconSlot = document.createElement("span");
    iconSlot.setAttribute("data-slot", "icon");
    iconSlot.setAttribute("aria-hidden", "true");
    iconSlot.setAttribute("data-select-indicator", "");
    iconSlot.innerHTML = element.getAttribute(SELECT_INDICATOR_TEMPLATE) || fallbackIcon;
  } else {
    iconSlot.setAttribute("aria-hidden", "true");
    iconSlot.setAttribute("data-select-indicator", "");
    if (!iconSlot.innerHTML.trim()) {
      iconSlot.innerHTML = element.getAttribute(SELECT_INDICATOR_TEMPLATE) || fallbackIcon;
    }
  }

  const position = getIndicatorPosition({ element, root, indicatorPosition });
  if (position === "end") {
    if (element.lastElementChild !== iconSlot) {
      element.append(iconSlot);
    }
  } else if (element.firstElementChild !== iconSlot) {
    element.prepend(iconSlot);
  }

  return iconSlot;
};

export const setupSelectItemIndicator = ({
  element,
  fallbackIcon,
}: SetupIndicatorOptions) => {
  const existingIcon = element.querySelector<HTMLElement>(SELECT_ICON_SLOT);
  if (existingIcon instanceof HTMLElement) {
    existingIcon.setAttribute("aria-hidden", "true");
    existingIcon.setAttribute("data-select-indicator", "");
    if (!element.getAttribute(SELECT_INDICATOR_TEMPLATE)) {
      element.setAttribute(SELECT_INDICATOR_TEMPLATE, existingIcon.innerHTML.trim() || fallbackIcon);
    }
    existingIcon.remove();
  }
};

export const syncSelectItemIndicator = ({
  element,
  isSelected,
  fallbackIcon,
  root,
  indicatorPosition = "start",
}: SyncIndicatorOptions) => {
  const existingIcon = element.querySelector<HTMLElement>(SELECT_ICON_SLOT);
  if (isSelected) {
    getOrCreateItemIndicator({ element, fallbackIcon, root, indicatorPosition });
  } else if (existingIcon instanceof HTMLElement) {
    existingIcon.remove();
  }
};
