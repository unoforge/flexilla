
import type { CollapseOptions } from "./types";
import { expandCollapseElement } from "./collapsible";

import { $$, $, dispatchCustomEvent } from "@flexilla/utilities"


/**
 * A class that implements collapsible functionality for HTML elements.
 * It allows elements to be expanded and collapsed with smooth transitions.
 *
 * @example
 * ```ts
 * // Basic usage
 * const collapse = new Collapse('#myCollapse');
 *
 * // With options
 * const collapse = new Collapse('#myCollapse', {
 *   defaultState: 'open',
 *   closeHeight: 50,
 *   onToggle: ({ isExpanded }) => console.log(`Collapse is ${isExpanded ? 'expanded' : 'collapsed'}`)
 * });
 *
 * // With custom trigger
 * const collapse = new Collapse('#myCollapse', {}, '#customTrigger');
 * ```
 */
class Collapse {
    private collapseElement: HTMLElement
    private defaultState: "open" | "close"
    private collapseId: string
    private collapseTrigger: HTMLElement | null
    private options: CollapseOptions
    private closeHeight: number

    /**
     * Creates a new Collapse instance.
     * @param selector - The CSS selector string or HTMLElement to be collapsed/expanded
     * @param options - Configuration options for the collapse behavior
     * @param triggerSelector - Optional CSS selector for the trigger element. If not provided,
     *                         it will look for an element with data-collapse-trigger attribute
     * @throws {Error} When the provided element is not a valid HTMLElement
     */
    constructor(selector: string | HTMLElement, options: CollapseOptions = {}, triggerSelector?: string) {
        let collapseElement: HTMLElement | null;
        collapseElement = typeof selector === "string" ? $(`${selector}`)  : selector;

        if (typeof selector === "string" && !collapseElement) {
            throw new Error(`No element found matching selector: ${selector}`);
        }

        if (!(collapseElement instanceof HTMLElement)) {
            throw new Error("Provided element must be a valid HTMLElement or selector");
        }
        this.collapseElement = collapseElement
        this.collapseId = this.collapseElement.getAttribute("id") as string

        this.collapseTrigger = $(`${triggerSelector}`) || $(`[data-collapse-trigger][data-target*='${this.collapseId}']`)

        this.options = options
        this.defaultState = this.options.defaultState || this.collapseElement.dataset.defaultState as "open" | "close" || "close"

        this.closeHeight = this.options.closeHeight || parseInt(this.collapseElement.dataset.closeHeight || "0") || 0
        this.initCollapse()
    }
    /**
     * Expands the collapse element to show its content.
     * Triggers 'beforeshow' and 'aftershow' events, and calls the onToggle callback if provided.
     * 
     * @example
     * ```ts
     * const collapse = new Collapse('#myCollapse');
     * collapse.show();
     * ```
     */
    show = () => {
        dispatchCustomEvent(this.collapseElement, "beforeshow", {
            isExpanded: false
        })
        expandCollapseElement({
            collapseElement: this.collapseElement,
            triggerElement: this.collapseTrigger, state: "open",
            closeHeight: this.closeHeight
        })
        this.options.onToggle?.({ isExpanded: true })
        dispatchCustomEvent(this.collapseElement, "aftershow", {
            isExpanded: false
        })
    }
    /**
     * Collapses the element to hide its content.
     * Triggers 'beforehide' and 'afterhide' events, and calls the onToggle callback if provided.
     * 
     * @example
     * ```ts
     * const collapse = new Collapse('#myCollapse');
     * collapse.hide();
     * ```
     */
    hide = () => {
        dispatchCustomEvent(this.collapseElement, "beforehide", {
            isExpanded: false
        })
        expandCollapseElement({
            collapseElement: this.collapseElement,
            triggerElement: this.collapseTrigger, state: "close",
            closeHeight: this.closeHeight
        })
        this.options.onToggle?.({ isExpanded: false })
        dispatchCustomEvent(this.collapseElement, "afterhide", {
            isExpanded: false
        })
    }
    /**
     * Toggles the collapse element between expanded and collapsed states.
     * Triggers 'beforetoggle' and 'aftertoggle' events, and calls the onToggle callback if provided.
     * 
     * @example
     * ```ts
     * const collapse = new Collapse('#myCollapse');
     * collapse.toggle();
     * ```
     */
    toggle = () => {
        const state = this.collapseElement.dataset.state as "close" | "open" === "close" ? "open" : "close"
        dispatchCustomEvent(this.collapseElement, "beforetoggle", {
            isExpanded: state === "open"
        })
        if (state === "open") this.show()
        else this.hide()
        this.options.onToggle?.({ isExpanded: state === "open" })
        dispatchCustomEvent(this.collapseElement, "aftertoggle", {
            isExpanded: state === "open"
        })
    }

    private initCollapse() {
        if (this.collapseTrigger instanceof HTMLElement) this.collapseTrigger.addEventListener("click", this.toggle)

        this.defaultState === "close" ? this.hide() : null
        this.defaultState === "open" ? this.show() : null
    }

    /**
     * Initializes a new Collapse instance with the specified configuration.
     * 
     * @param selector - The CSS selector string or HTMLElement to be collapsed/expanded
     * @param options - Configuration options for the collapse behavior
     * @param triggerSelector - Optional CSS selector for the trigger element
     * @returns A new Collapse instance
     * 
     * @example
     * ```ts
     * const collapse = Collapse.init('#myCollapse', {
     *   defaultState: 'open',
     *   onToggle: ({ isExpanded }) => console.log(isExpanded)
     * });
     * ```
     */
    public static init = (selector: string | HTMLElement, options: CollapseOptions = {}, triggerSelector?: string) => new Collapse(selector, options, triggerSelector)

    /**
     * Automatically initializes all collapse components in the document that match the provided selector.
     * This is useful for setting up multiple collapse elements at once without manual initialization.
     * 
     * @param selector - CSS selector to identify collapse elements. Defaults to '[data-fx-collapse]'
     * 
     * @example
     * ```ts
     * // Initialize all elements with data-fx-collapse attribute
     * Collapse.autoInit();
     * 
     * // Initialize elements with custom selector
     * Collapse.autoInit('.custom-collapse');
     * ```
     */
    public static autoInit = (selector = "[data-fx-collapse]") => {
        const collapses = $$(selector)
        for (const collapseEl of collapses) {
            new Collapse(collapseEl)
        }
    }
}

export default Collapse