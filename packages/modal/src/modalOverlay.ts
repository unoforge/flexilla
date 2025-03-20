import { appendBefore } from "@flexilla/utilities"

export const destroyOverlay = (overlayElement: HTMLElement | null) => {
    if (!(overlayElement instanceof HTMLElement)) return
    overlayElement.parentElement?.removeChild(overlayElement)
}

export const buildOverlay = (
    { modalContent, overlayClassName }:
        {
            modalContent: HTMLElement,
            overlayClassName: string[] | ""
        }
) => {
    const overlayEl = document.createElement("span");
    overlayEl.setAttribute("aria-hidden", "true");
    appendBefore({ newElement: overlayEl, existingElement: modalContent });
    overlayEl.classList.add(...overlayClassName);
    overlayEl.setAttribute("data-modal-overlay", "");
    return overlayEl
}
