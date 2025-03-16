import { expandCollapseElement } from "@flexilla/collapse";
import type { AccordionOptions, AccordionType } from "./types";
import { getAccordionItemMetadata } from "./util";
import { $, $$, $d, dispatchCustomEvent } from "@flexilla/utilities";
import { initKeyEvents } from "./helpers";


/**
 * Accordion component class for managing collapsible content sections.
 * Provides functionality for creating interactive accordion UI elements with single or multiple expandable sections.
 * 
 * @class
 * @example
 * ```typescript
 * // Create a single-section accordion
 * const accordion = new Accordion('#myAccordion');
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
    private options: AccordionOptions;
    private items: HTMLElement[];

    /**
     * Creates an instance of Accordion
     * @param {string | HTMLElement} accordion - Selector string or HTMLElement for the accordion container
     * @param {AccordionOptions} [options={}] - Configuration options for the accordion
     * @throws {Error} When accordion element is not found or selector is invalid
     */
    constructor(accordion: string | HTMLElement, options: AccordionOptions = {}) {
        this.accordionEl = typeof accordion === "string" ? $(accordion) as HTMLElement : accordion;
        if (!this.accordionEl) {
            throw new Error(`Accordion element not found: ${typeof accordion === "string" ? `No element matches selector "${accordion}"` : "Provided HTMLElement is null or undefined"}`);
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
            if (defaultActive) this.setItemState(defaultActive, "open")
        } else {
            this.closeAll(true);
            const anyOpen = this.items.some(item => item.getAttribute("data-state") === "open");
            if (preventClosingAll && !anyOpen) this.setItemState(this.items[0], "open");
            else {
                const allDefOpen = this.items.filter(item => item.getAttribute("data-state") === "open")
                for (const item of allDefOpen) this.setItemState(item, "open")
            }
        }
        this.addEventListeners();
        initKeyEvents(this.accordionEl)
    }



    private setItemState(item: HTMLElement, state: "open" | "close") {
        item.setAttribute("data-state", state);
        const { accordionContentElement: content, accordionTriggerElement: trigger } = getAccordionItemMetadata(item)
        expandCollapseElement({
            collapseElement: content,
            triggerElement: trigger,
            state,
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
                expandedItem: {
                    accordionItem: this.accordionEl,
                    trigger,
                    content,
                    value,
                    isExpanded: isItemExpanded,
                },
            });
        }

        dispatchCustomEvent(this.accordionEl, "change-item", {
            targetElement: {
                trigger,
                content,
                isExpanded: isItemExpanded
            },
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

            trigger?.addEventListener("click", (e) => {
                e.preventDefault();
                const isOpened = item.getAttribute("data-state") === "open";
                let state: "open" | "close" = isOpened ? "close" : "open";
                this.triggerItemState(item, state, isOpened)
            });
            if (this.options.allowCloseFromContent) {
                content?.addEventListener("click", actionClose)
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
     * @returns {Accordion} A new Accordion instance
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