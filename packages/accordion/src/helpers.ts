import { $d, $$ } from "@flexilla/utilities/selector"

const getAdjacentTrigger = (currentTrigger: HTMLElement, goUp: boolean, accordionElement: HTMLElement) => {
    const allAccordionItems = $$("[data-accordion-item]", accordionElement)
    const accordionItems = allAccordionItems.filter((item) => item.parentElement === accordionElement);
    const currentTriggerIndex = Array.from(accordionItems).indexOf(currentTrigger.closest('[data-accordion-item]')!);
    const nextIndex = goUp ? currentTriggerIndex - 1 : currentTriggerIndex + 1;
    const nextTrigger = $d("[data-accordion-trigger]", accordionItems[nextIndex]) as HTMLElement

    return nextTrigger ?? (goUp ? $d("[data-accordion-trigger]", accordionItems[accordionItems.length - 1]) : $d("[data-accordion-trigger]", accordionItems[0]))
}

const attachKeyEvent = (event: KeyboardEvent, accordionElement: HTMLElement) => {
    const focusedTrigger = document.activeElement;
    if (!(focusedTrigger instanceof HTMLElement)) return

    const isTriggerFocused = focusedTrigger.matches('[data-accordion-trigger]');
    if (isTriggerFocused && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        event.preventDefault(); // Prevent default scrolling behavior
        const nextTrigger = getAdjacentTrigger(focusedTrigger, event.key === 'ArrowUp', accordionElement);
        nextTrigger.focus();
    }
}



const initKeyEvents = (accordionElement: HTMLElement) => {
    accordionElement.addEventListener("keydown", (e: KeyboardEvent) => {
        attachKeyEvent(e, accordionElement)
    });
}


export { initKeyEvents }