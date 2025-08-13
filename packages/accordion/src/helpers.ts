import { expandElement, collapseElement, initCollapsible } from "./../../collapsible/src/collapsible"
import { $d, $$ } from "@flexilla/utilities/selector"

const getAdjacentTrigger = (currentTrigger: HTMLElement, goUp: boolean, accordionElement: HTMLElement) => {
    // Get all direct children [data-accordion-item] of accordionElement
    const accordionItems = $$(`:scope > [data-accordion-item]`, accordionElement) as HTMLElement[];

    // Find the current accordion item (direct parent of the trigger)
    const currentItem = currentTrigger.parentElement;
    if (!accordionItems.includes(currentItem as HTMLElement)) return null; // Not a valid direct child item

    const currentIndex = accordionItems.indexOf(currentItem as HTMLElement);
    const nextIndex = goUp ? currentIndex - 1 : currentIndex + 1;

    // Determine the next item, looping to last/first if out of bounds
    const nextItem =
        accordionItems[nextIndex] ??
        (goUp ? accordionItems[accordionItems.length - 1] : accordionItems[0]);

    // Select trigger that is a direct child of the next item
    const nextTrigger = $d(`:scope > [data-accordion-trigger]`, nextItem);
    return nextTrigger instanceof HTMLElement ? nextTrigger : null;
};

const initKeyEvents = (event: KeyboardEvent, accordionElement: HTMLElement) => {
    if (!(document.activeElement instanceof HTMLElement)) return;

    const focusedTrigger = document.activeElement;

    // Ensure it's the right trigger in the correct structure
    const parentItem = focusedTrigger.parentElement;
    if (
        !focusedTrigger.matches('[data-accordion-trigger]') ||
        !parentItem?.matches('[data-accordion-item]') ||
        parentItem.parentElement !== accordionElement
    ) {
        return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent default scrolling
        const nextTrigger = getAdjacentTrigger(focusedTrigger, event.key === 'ArrowUp', accordionElement);
        if (nextTrigger) {
            nextTrigger.focus();
        }
    }
};

const changeTriggerState = (trigger: HTMLElement, state: "open" | "close") => {
    trigger.ariaExpanded = state === "open" ? "true" : "false";
}

const expandCollapseElement = ({ collapsible, triggerElement, state, onInit }: { collapsible: HTMLElement, triggerElement: HTMLElement, state: "open" | "close", onInit?: boolean }) => {
    if (onInit) {
        initCollapsible(collapsible, state)
        changeTriggerState(triggerElement, state)
    } else {
        if (state === "open") {
            changeTriggerState(triggerElement, "open")
            expandElement(collapsible)
        }
        else {
            changeTriggerState(triggerElement, "close")
            collapseElement(collapsible)
        }
    }
}


export { initKeyEvents, expandCollapseElement }