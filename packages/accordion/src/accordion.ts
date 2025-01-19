import { expandCollapseElement } from "@flexilla/collapse";
import type { AccordionOptions, AccordionType } from "./types";
import { getAccordionItemMetadata } from "./util";
import { $, $$, $d, dispatchCustomEvent } from "@flexilla/utilities";
import { initKeyEvents } from "./helpers";


export default class Accordion {
    private accordionEl: HTMLElement;
    private options: AccordionOptions;
    private items: HTMLElement[];

    constructor(accordion: string | HTMLElement, options: AccordionOptions = {}) {
        this.accordionEl = typeof accordion === "string" ? document.querySelector(accordion) as HTMLElement : accordion;
        if (!this.accordionEl) {
            throw new Error("Accordion element not found");
        }
        this.options = {
            accordionType: this.accordionEl.dataset.accordionType as AccordionType || "single",
            preventClosingAll: this.accordionEl.hasAttribute("data-prevent-closing-all") || false,
            defaultValue: this.accordionEl.dataset.defaultValue || "",
            ...options,
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
            if (preventClosingAll) {
                const anyOpen = this.items.some(item => item.getAttribute("data-state") === "open");
                if (!anyOpen) {
                    this.setItemState(this.items[0], "open");
                }
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

    private addEventListeners() {
        this.items.forEach(item => {
            const trigger = $("[data-accordion-trigger]", item);
            trigger?.addEventListener("click", (e) => {
                e.preventDefault();
                const isOpened = item.getAttribute("data-state") === "open";
                let state: "open" | "close" = isOpened ? "close" : "open";

                if (this.options.preventClosingAll) {
                    if (this.options.accordionType === "single" && isOpened) return;
                    if (this.options.accordionType === "multiple" && this.items.filter(i => i.getAttribute("data-state") === "open").length === 1 && isOpened) return;
                }

                this.setItemState(item, state);
                if (this.options.accordionType === "single") this.closeOther({ current: item });
                this.dispatchedEvent(item);
            });
        });
    }

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
     * auto init accordion components based on the selector provided
     * @param selector {string} default is [data-fx-accordion]
     */
    public static autoInit = (selector: string = "[data-fx-accordion]") => {
        const accordions = $$(selector, document.documentElement)
        for (const accordion of accordions) new Accordion(accordion)
    }

    /**
         * Shortcut of : new Accordion(...)
         * @param accordion 
         * @param options 
         * @returns 
    */
    public static init = (accordion: string | HTMLElement, options: AccordionOptions = {}) => new Accordion(accordion, options)
}
