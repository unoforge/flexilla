import { afterTransition } from "@flexilla/utilities";

const changeCollapseElState = (collapseElement: HTMLElement, state: "open" | "close") => {
    collapseElement.setAttribute("aria-hidden", state === "open" ? "false" : "true");
    collapseElement.setAttribute("data-state", state);
}

/**
 * Initializes a collapsible element with the specified state and height
 * @param element - The HTML element to initialize as collapsible
 * @param state - Initial state of the element ('open' or 'close')
 * @param closeHeight - Height of the element when closed (default: "0px")
 */
export const initCollapsible = (
    element: HTMLElement,
    state: "open" | "close" = "close",
    closeHeight: string = "0px"
) => {
    element.style.height = state === "open" ? 'auto' : closeHeight;
    changeCollapseElState(element, state)
};

/**
 * Expands a collapsible element to its full height
 * @param element - The HTML element to expand
 */
export const expandElement = (element: HTMLElement) => {
    if (element.getAttribute('data-state') === 'open') return;
    changeCollapseElState(element, "open")
    const fullHeight = element.scrollHeight;
    element.style.height = `${fullHeight}px`;
    afterTransition({
        element: element,
        callback: () => {
            element.style.height = 'auto';
        },
    })
};

/**
 * Collapses an element to the specified height
 * @param element - The HTML element to collapse
 * @param closeHeight - Height of the element when closed (default: "0px")
 */
export const collapseElement = (
    element: HTMLElement,
    closeHeight: string = "0px"
) => {
    if (element.getAttribute('data-state') === 'close') return;
    element.style.height = `${element.scrollHeight}px`;
    element.offsetHeight;
    element.style.height = closeHeight;
    afterTransition({
        element, callback: () => {
            changeCollapseElState(element, "close")
        }
    })
};