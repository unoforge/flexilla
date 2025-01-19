import type { CollapsibleElement } from "./types";
import { measureHeight, nextFrame, transitionEndAsync, changeCollapseElState, requestAnimationFrameAsync } from "./helpers";

import { afterTransition, dispatchCustomEvent } from "@flexilla/utilities"

export const triggerEvent = (eventName: string, element: HTMLElement) => dispatchCustomEvent(element, eventName, { detail: element })

const makeCollapsible = async (element: CollapsibleElement, closeHeight: number, state: "expand" | "collapse") => {
    element.style.maxHeight = 'none';
    const contentHeight = await measureHeight(element);
    element.style.maxHeight = state === "expand" ? `${closeHeight}px` || '0px' : `${contentHeight}px`;
    await nextFrame();
    await requestAnimationFrameAsync(() => {
        element.style.maxHeight = state === "expand" ? `${contentHeight}px` : `${closeHeight}px` || '0px';
    });
}

async function expand(element: CollapsibleElement, closeHeight: number): Promise<void> {
    if (!element) return;
    triggerEvent('beforeopen', element);
    await makeCollapsible(element, closeHeight, "expand")
    await transitionEndAsync(element, 'max-height');
    element.style.maxHeight = 'none';
    triggerEvent('afteropen', element);

}

async function collapse(element: CollapsibleElement, closeHeight: number): Promise<void> {
    if (!element) return;
    triggerEvent('beforeclose', element);
    makeCollapsible(element, closeHeight, "collapse")
    await transitionEndAsync(element, 'max-height');
    triggerEvent('afterclose', element);
}

const expandCollapseElement = (
    { collapseElement, triggerElement, state, closeHeight }: {
        collapseElement: CollapsibleElement, triggerElement: HTMLElement | null, state: "open" | "close",
        closeHeight?: number
    }
) => {
    if (!(collapseElement instanceof HTMLElement)) throw new Error("accordion item not a valid HTMLElement");
    const currentState = collapseElement.dataset.state

    // avoid reexecuting of previous action, check state and if remains the same then do not do anything 
    if (currentState === state) return

    if (state === "open") {
        expand(collapseElement, closeHeight || 0);
    } else {
        collapse(collapseElement, closeHeight || 0);
    }


    if (triggerElement instanceof HTMLElement) {
        triggerElement.setAttribute("aria-expanded", state === "open" ? "true" : "false");
    }
    afterTransition({
        element: collapseElement, callback() {
            changeCollapseElState(collapseElement, state);
        }
    })
}


export { expand, collapse, expandCollapseElement, type CollapsibleElement }