import type { AccordionOptions, AccordionType } from "./types";
import { getAccordionItemMetadata } from "./util";
import { $, $$, $d, dispatchCustomEvent, observeChildrenChanges } from "@flexilla/utilities";
import { initKeyEvents, expandCollapseElement } from "./helpers";
import { FlexillaManager } from "@flexilla/manager"

/**
 * Accordion component class for managing collapsible content sections.
 * @class
 * @example
 * ```typescript
 * new Accordion('#myAccordion');
 *
 * // Create a multi-section accordion with options
 * const multiAccordion = new Accordion('#multiAccordion', {
 *   accordionType: 'multiple',
 *   preventClosingAll: true
 * });
 * ```
 */
export default class Accordion {
    private accordionEl: HTMLElement;
    private options!: AccordionOptions;
    private items!: HTMLElement[];
    private eventListeners: Array<{ element: HTMLElement; type: string; listener: EventListener }> = [];
    private cleanupObserver: (() => void) | null = null;



    /**
     * Creates an instance of Accordion
     * @param {string | HTMLElement} accordion - Selector string or HTMLElement for the accordion container
     * @param {AccordionOptions} [options={}] - Configuration options for the accordion
     */
    constructor(accordion: string | HTMLElement, options: AccordionOptions = {}) {
        this.accordionEl = typeof accordion === "string" ? $(accordion) as HTMLElement : accordion;
        if (!this.accordionEl) {
            throw new Error(`Accordion element not found: ${typeof accordion === "string" ? `No element matches selector "${accordion}"` : "Provided HTMLElement is null or undefined"}`);
        }

        const existingInstance = FlexillaManager.getInstance('accordion', this.accordionEl);
        if (existingInstance) {
            return existingInstance;
        }
        this.options = {
            accordionType: this.accordionEl.dataset.accordionType as AccordionType || options.accordionType || "single",
            preventClosingAll: this.accordionEl.hasAttribute("data-prevent-closing-all") || options.preventClosingAll || false,
            defaultValue: this.accordionEl.dataset.defaultValue || options.defaultValue || "",
            allowCloseFromContent: this.accordionEl.hasAttribute("data-allow-close-from-content") || options.allowCloseFromContent || false,
            onChangeItem: options.onChangeItem
        };
        this.items = $$("[data-accordion-item]", this.accordionEl).filter((item: HTMLElement) => item.parentElement && item.parentElement === this.accordionEl);
        this.initAccordion();

    }

    private initAccordion() {
        if (!this.accordionEl) return;
        const { accordionType, defaultValue, preventClosingAll } = this.options;
        let defaultActive = $d(`[data-accordion-item][data-accordion-value="${defaultValue}"]`, this.accordionEl)

        if (accordionType === "single") {
            if (this.options.preventClosingAll && !(defaultActive instanceof HTMLElement)) defaultActive = this.items[0]
            this.closeOther({ current: defaultActive });
            if (defaultActive) this.setItemState(defaultActive, "open", true)
        } else {
            this.closeAll(true);
            const anyOpen = this.items.some(item => item.getAttribute("data-state") === "open");
            if (preventClosingAll && !anyOpen) this.setItemState(this.items[0], "open", true);
            else {
                const allDefOpen = this.items.filter(item => item.getAttribute("data-state") === "open")
                for (const item of allDefOpen) this.setItemState(item, "open", true)
            }
        }
        this.addEventListeners();

        this.accordionEl.addEventListener("keydown", this.handleKeyEvents);
        this.eventListeners.push({ element: this.accordionEl, type: "keydown", listener: this.handleKeyEvents as EventListener });

        FlexillaManager.register("accordion", this.accordionEl, this)

        this.cleanupObserver = observeChildrenChanges({
            container: this.accordionEl,
            attributeToWatch: 'data-accordion-item',
            onChildAdded: this.reload
        });
    }

    private handleKeyEvents = (e: KeyboardEvent) => {
        initKeyEvents(e, this.accordionEl)
    }

    reload = () => {
        this.cleanup()
        this.items = $$("[data-accordion-item]", this.accordionEl).filter((item: HTMLElement) => item.parentElement && item.parentElement === this.accordionEl);
        this.initAccordion()
    }
    destroy() {
        if (!this.accordionEl) return;
        this.items.forEach(item => {
            if (item && item.hasAttribute('data-state')) {
                item.removeAttribute('data-state');
            }
        });

        this.eventListeners.forEach(({ element, type, listener }) => {
            if (element && element.removeEventListener) {
                element.removeEventListener(type, listener);
            }
        });

        this.eventListeners = [];
        this.items = [];
        FlexillaManager.removeInstance('accordion', this.accordionEl);

        if (this.cleanupObserver) {
            this.cleanupObserver();
            this.cleanupObserver = null;
        }
    }

    private setItemState(item: HTMLElement, state: "open" | "close", onInit?: boolean) {
        item.setAttribute("data-state", state);
        const { accordionContentElement: content, accordionTriggerElement: trigger } = getAccordionItemMetadata(item)
        expandCollapseElement({
            collapsible: content,
            triggerElement: trigger,
            state,
            onInit
        });
    }

    private closeOther({ current, onInit }: { current?: HTMLElement, onInit?: boolean }) {
        this.items.forEach(item => {
            if (item !== current) {
                if (onInit && this.options.accordionType === "multiple") {
                    const isOpenedDefault = item.hasAttribute("data-default-open")
                    if (isOpenedDefault) this.setItemState(item, "open");
                    else this.setItemState(item, "close");
                } else
                    this.setItemState(item, "close");
            }
        });
    }

    private closeAll(onInit?: boolean) {
        this.closeOther({ onInit });
    }

    private dispatchedEvent(expandedItem: HTMLElement) {
        const { accordionContentElement: content, accordionTriggerElement: trigger, isItemExpanded, accordionItemValue: value } = getAccordionItemMetadata(expandedItem)
        if (this.options.onChangeItem) {
            this.options.onChangeItem({
                expandedItem: { accordionItem: this.accordionEl, trigger, content, value, isExpanded: isItemExpanded, },
            });
        }

        dispatchCustomEvent(this.accordionEl, "change-item", {
            targetElement: { trigger, content, isExpanded: isItemExpanded },
            items: this.items
        })
    }

    private triggerItemState = (item: HTMLElement, state: "open" | "close", isOpened: boolean) => {
        if (this.options.preventClosingAll) {
            if (this.options.accordionType === "single" && isOpened) return;
            if (this.options.accordionType === "multiple" && this.items.filter(i => i.getAttribute("data-state") === "open").length === 1 && isOpened) return;
        }
        this.setItemState(item, state);
        if (this.options.accordionType === "single") this.closeOther({ current: item });
        this.dispatchedEvent(item);
    }


    private addEventListeners() {
        this.items.forEach(item => {
            const trigger = $("[data-accordion-trigger]", item);
            const content = $("[data-accordion-content]", item)
            const actionClose = () => this.triggerItemState(item, "close", true)

            const clickHandler = (e: Event) => {
                e.preventDefault();
                const isOpened = item.getAttribute("data-state") === "open";
                let state: "open" | "close" = isOpened ? "close" : "open";
                this.triggerItemState(item, state, isOpened)
            };

            if (trigger) {
                trigger.addEventListener("click", clickHandler);
                this.eventListeners.push({ element: trigger, type: "click", listener: clickHandler });
            }

            if (this.options.allowCloseFromContent && content) {
                content.addEventListener("click", actionClose);
                this.eventListeners.push({ element: content, type: "click", listener: actionClose });
            }
        });
    }


    /**
     * Shows/expands an accordion item by its ID
     * @public
     * @param {string} id - The value/ID of the accordion item to show
     * @example
     * ```typescript
     * const accordion = new Accordion('#myAccordion');
     * accordion.show('section1'); // Expands the accordion item with value="section1"
     * ```
     */
    public show(id: string) {
        const item = $d(`[data-accordion-item][data-accordion-value="${id}"]`, this.accordionEl)
        if (!item) return;

        const isOpened = item.getAttribute("data-state") === "open"
        if (isOpened) return

        if (this.options.accordionType === "single") {
            this.closeOther({ current: item });
        }

        this.setItemState(item, "open");
        this.dispatchedEvent(item);
    }


    /**
        * Hides/collapses an accordion item by its ID
        * @public
        * @param {string} id - The value/ID of the accordion item to hide
        * @example
        * ```typescript
        * const accordion = new Accordion('#myAccordion');
        * accordion.hide('section1'); // Collapses the accordion item with value="section1"
        * ```
    */
    public hide(id: string) {
        const item = $d(`[data-accordion-item][data-accordion-value="${id}"]`, this.accordionEl)
        if (!item) return;

        const isOpened = item.getAttribute("data-state") === "open";
        if (!isOpened) return;

        if (this.options.preventClosingAll) {
            const openItems = this.items.filter(i => i.getAttribute("data-state") === "open");
            if (openItems.length === 1 && item === openItems[0]) {
                return;
            }
        }
        this.setItemState(item, "close");
        this.dispatchedEvent(item);
    }

    /**
     * Cleans up the accordion instance by removing event listeners, data attributes, and references.
     * @public
     * @example
     * ```typescript
     * const accordion = new Accordion('#myAccordion');
     * // ... use accordion ...
     * accordion.cleanup(); // Remove all event listeners and clean up resources
     * ```
     */
    cleanup = () => {
        if (!this.accordionEl) return;
        this.items.forEach(item => {
            if (item && item.hasAttribute('data-state')) {
                item.removeAttribute('data-state');
            }
        });

        this.eventListeners.forEach(({ element, type, listener }) => {
            if (element && element.removeEventListener) {
                element.removeEventListener(type, listener);
            }
        });

        if (this.cleanupObserver) {
            this.cleanupObserver();
            this.cleanupObserver = null;
        }

        this.eventListeners = [];
        this.items = [];
        FlexillaManager.removeInstance('accordion', this.accordionEl);
    }

    /**
     * Automatically initializes all accordion components matching the selector
     * @static
     * @param {string} [selector="[data-fx-accordion]"] - The selector to find accordion elements
     * @example
     * ```typescript
     * // Initialize all accordion elements with data-fx-accordion attribute
     * Accordion.autoInit();
     * 
     * // Initialize accordions with custom selector
     * Accordion.autoInit('.custom-accordion');
     * ```
     */
    public static autoInit = (selector: string = "[data-fx-accordion]") => {
        const accordions = $$(selector, document.documentElement)
        for (const accordion of accordions) new Accordion(accordion)
    }

    /**
     * Shortcut method to create a new Accordion instance
     * @static
     * @param {string | HTMLElement} accordion - Selector string or HTMLElement for the accordion container
     * @param {AccordionOptions} [options={}] - Configuration options for the accordion
     * @example
     * ```typescript
     * // Initialize with selector
     * const accordion1 = Accordion.init('#myAccordion');
     * 
     * // Initialize with HTMLElement and options
     * const element = document.querySelector('#multiAccordion');
     * const accordion2 = Accordion.init(element, {
     *   accordionType: 'multiple',
     *   preventClosingAll: true
     * });
     * ```
     */
    public static init = (accordion: string | HTMLElement, options: AccordionOptions = {}) => new Accordion(accordion, options)
}
