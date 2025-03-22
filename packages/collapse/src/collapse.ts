
import type { CollapseOptions } from "./types";

import { $$, $, dispatchCustomEvent } from "@flexilla/utilities"
import { expandElement, collapseElement, initCollapsible } from "./../../collapsible"
import {FlexillaManager} from "@flexilla/manager"

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
    private element!: HTMLElement
    private defaultState!: "open" | "close"
    private collapseId!: string
    private collapseTrigger!: HTMLElement | null
    private options!: CollapseOptions
    private closeHeight!: number

    /**
     * Creates a new Collapse instance.
     * @param selector - The CSS selector string or HTMLElement to be collapsed/expanded
     * @param options - Configuration options for the collapse behavior
     * @param triggerSelector - Optional CSS selector for the trigger element. If not provided,
     *                         it will look for an element with data-collapse-trigger attribute
     * @throws {Error} When the provided element is not a valid HTMLElement
     */
    constructor(selector: string | HTMLElement, options: CollapseOptions = {}, triggerSelector?: string) {
        let element: HTMLElement | null;
        element = typeof selector === "string" ? $(`${selector}`) : selector;

        if (typeof selector === "string" && !element) {
            throw new Error(`No element found matching selector: ${selector}`);
        }

        if (!(element instanceof HTMLElement)) {
            throw new Error("Provided element must be a valid HTMLElement or selector");
        }

        this.element = element
        const existingInstance = FlexillaManager.getInstance('collapse', this.element);
        if (existingInstance) {
            return existingInstance;
        }
        
        this.collapseId = this.element.getAttribute("id") as string

        this.collapseTrigger = $(`${triggerSelector}`) || $(`[data-collapse-trigger][data-target*='${this.collapseId}']`)

        this.options = options
        this.defaultState = this.element.dataset.state ? (this.element.dataset.state === "open" ? "open" : "close") : this.options.defaultState || "close"
        this.closeHeight = this.options.closeHeight || parseInt(this.element.dataset.closeHeight || "0") || 0
        this.initCollapse()
        FlexillaManager.register('collapse', this.element, this)
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
        dispatchCustomEvent(this.element, "before-expand", {
            isExpanded: false
        })
        if (this.collapseTrigger) this.collapseTrigger.ariaExpanded = "true"
        expandElement(this.element)
        this.options.onToggle?.({ isExpanded: true })
        dispatchCustomEvent(this.element, "expanded", {
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
        if (this.collapseTrigger) this.collapseTrigger.ariaExpanded = "false"
        collapseElement(this.element, `${this.closeHeight}px`)
        this.options.onToggle?.({ isExpanded: false })
        dispatchCustomEvent(this.element, "collapsed", { isExpanded: false })
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
        const isOpen = this.element.dataset.state === "open"
        if (!isOpen) this.show()
        else this.hide()
        this.options.onToggle?.({ isExpanded: !isOpen })
    }

    setCloseHeight = (closeHeight: number) => {
        this.closeHeight = closeHeight
    }

    private initCollapse() {
        if (this.collapseTrigger instanceof HTMLElement) {
            this.collapseTrigger.addEventListener("click", this.toggle)
            this.collapseTrigger.ariaExpanded = this.defaultState === "open" ? "true" : "false"
        }
        initCollapsible(this.element, this.defaultState, `${this.closeHeight}`)
    }

    /**
     * Cleans up the Collapse instance by removing event listeners.
     * This method should be called when the collapse component is no longer needed
     * to prevent memory leaks.
     * 
     * @example
     * ```ts
     * const collapse = new Collapse('#myCollapse');
     * // When done with the collapse component
     * collapse.cleanup();
     * ```
     */
    cleanup() {
        if (this.collapseTrigger instanceof HTMLElement) this.collapseTrigger.removeEventListener("click", this.toggle)
        FlexillaManager.removeInstance('collapse', this.element)
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