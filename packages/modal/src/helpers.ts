import { $, $$ } from "@flexilla/utilities"

/**
 * Toggles the state of the modal (open or close).
 */
export const toggleModalState = (modalElement: HTMLElement, modalContent: HTMLElement | null, action: "open" | "close") => {
    if (!(modalContent instanceof HTMLElement)) throw new Error("No modal-content found")
    modalElement.setAttribute("aria-hidden", action === "open" ? "false" : "true");
    modalElement.setAttribute("data-state", action);
    modalContent.setAttribute("data-state", action);
    const overlayEl = $("[data-modal-overlay]", modalElement);
    if (overlayEl instanceof HTMLElement) overlayEl.setAttribute("data-state", action)
};

export const setBodyScrollable = (enableStackedModals_: boolean, allowBodyScroll_: boolean, modalElement: HTMLElement) => {
    if (!enableStackedModals_) {
        if (!allowBodyScroll_) document.body.style.overflowY = "auto";
        return
    }
    const shownModalElementsWithoutBodyScroll = $$("[data-fx-modal][data-state=open]:not([data-allow-body-scroll=true]")
    const filteredShown = shownModalElementsWithoutBodyScroll.filter((element: HTMLElement) => element !== modalElement)
    if (filteredShown.length === 0 && !allowBodyScroll_) document.body.style.overflowY = "auto"
}