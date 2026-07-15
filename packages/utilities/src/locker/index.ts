const LOCKER_COUNT = "data-fl-lock-count";
const LOCKER_PREV_INERT = "data-fl-prev-inert";
const LOCKER_PREV_HIDDEN = "data-fl-prev-hidden";

export type Locker = {
  lock: (allowedElements: HTMLElement[]) => void;
  unlock: () => void;
};

export const createLocker = (): Locker => {
  const lockedElements: HTMLElement[] = [];

  const lock = (allowedElements: HTMLElement[]) => {
    const bodyChildren = Array.from(document.body.children) as HTMLElement[];

    for (const child of bodyChildren) {
      const isAllowed = allowedElements.some(
        (allowed) => child === allowed || child.contains(allowed)
      );
      if (isAllowed) continue;

      const count = parseInt(child.getAttribute(LOCKER_COUNT) || "0", 10);
      if (count === 0) {
        child.setAttribute(
          LOCKER_PREV_INERT,
          child.hasAttribute("inert") ? "true" : "false"
        );
        child.setAttribute(
          LOCKER_PREV_HIDDEN,
          child.hasAttribute("aria-hidden") ? "true" : "false"
        );
        child.setAttribute("inert", "");
        child.setAttribute("aria-hidden", "true");
      }
      child.setAttribute(LOCKER_COUNT, String(count + 1));
      lockedElements.push(child);
    }
  };

  const unlock = () => {
    for (const el of lockedElements) {
      const count = parseInt(el.getAttribute(LOCKER_COUNT) || "0", 10);
      const newCount = count - 1;
      if (newCount <= 0) {
        if (el.getAttribute(LOCKER_PREV_INERT) !== "true")
          el.removeAttribute("inert");
        if (el.getAttribute(LOCKER_PREV_HIDDEN) !== "true")
          el.removeAttribute("aria-hidden");
        el.removeAttribute(LOCKER_COUNT);
        el.removeAttribute(LOCKER_PREV_INERT);
        el.removeAttribute(LOCKER_PREV_HIDDEN);
      } else {
        el.setAttribute(LOCKER_COUNT, String(newCount));
      }
    }
    lockedElements.length = 0;
  };

  return { lock, unlock };
};
