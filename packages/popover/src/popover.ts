import type { PopoverOptions } from "./types"
import {  type Placement } from 'flexipop'
import { $, $$, dispatchCustomEvent } from "@flexilla/utilities"
import { CreateOverlay } from "@flexilla/create-overlay"


/**
 * Creates a new popover instance with the specified trigger and content elements.
 * @class
 * @description A class that creates and manages a popover component with customizable trigger and content elements.
 */
class Popover {
    private triggerElement: HTMLElement
    private contentElement: HTMLElement

    private options: PopoverOptions
    private PopoverInstance: CreateOverlay

    private triggerStrategy: "click" | "hover"
    private placement: Placement
    private offsetDistance: number
    private preventFromCloseOutside: boolean
    private preventFromCloseInside: boolean
    private defaultState: "open" | "close"

    /**
     * Creates a new Popover instance.
     * @param {string | HTMLElement} popoverEl - The popover content element or its selector.
     * @param {PopoverOptions} [options={}] - Configuration options for the popover.
     * @example
     * // Create a popover with default options
     * const popover = new Popover('#my-popover');
     * 
     * // Create a popover with custom options
     * const popover = new Popover('#my-popover', {
     *   placement: 'top',
     *   triggerStrategy: 'hover',
     *   offsetDistance: 10
     * });
     */
    constructor(popoverEl: string | HTMLElement, options: PopoverOptions = {}) {

        const content = typeof popoverEl === "string" ? $(popoverEl) as HTMLElement : popoverEl
        this.contentElement = content
        this.triggerElement = $(`[data-popover-trigger][data-popover-id=${content.getAttribute("id")}]`) as HTMLElement
        this.options = options
        this.triggerStrategy = this.options.triggerStrategy || content.dataset.triggerStrategy as "click" | "hover" || "click"
        this.placement = this.options.placement || content.dataset.placement as Placement || "bottom-middle"
        this.offsetDistance = this.options.offsetDistance || parseInt(`${content.dataset.offsetDistance}`) | 6
        this.preventFromCloseOutside = this.options.preventFromCloseOutside || content.hasAttribute("data-prevent-close-outside") || false
        this.preventFromCloseInside = this.options.preventCloseFromInside || content.hasAttribute("data-prevent-close-inside") || false
        this.defaultState = this.options.defaultState || content.dataset.defaultState as "close" | "open" || "close";

        this.PopoverInstance = new CreateOverlay({
            trigger: this.triggerElement,
            content: this.contentElement,
            options: {
                placement: this.placement,
                offsetDistance: this.offsetDistance,
                triggerStrategy: this.triggerStrategy,
                preventFromCloseOutside: this.preventFromCloseOutside,
                preventCloseFromInside: this.preventFromCloseInside,
                defaultState: this.defaultState,
                onShow: this.options.onShow,
                onHide: this.options.onHide,
                onToggle: ({ isHidden }) => {
                    this.options.onToggle?.({ isHidden })
                    dispatchCustomEvent(this.contentElement, "popover-toggle", {
                        isHidden: isHidden
                    })
                },
                popper: this.options.popper
            }
        })
    }
    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.PopoverInstance.setShowOptions({ placement, offsetDistance })
    }

    show=()=>{
        this.PopoverInstance.show()
        dispatchCustomEvent(this.contentElement, "popover-show", {
            isHidden: false
        })
    }
    hide=()=>{
        this.PopoverInstance.hide()
        dispatchCustomEvent(this.contentElement, "popover-hide", {
            isHidden: true
        })
    }

    /**
     * Creates a new Popover instance with the specified options.
     * @param {string | HTMLElement} popoverEl - The popover content element or its selector.
     * @param {PopoverOptions} [options] - Configuration options for the popover.
     * @returns {Popover} A new Popover instance.
     * @example
     * const popover = Popover.init('#my-popover', {
     *   placement: 'bottom',
     *   triggerStrategy: 'click'
     * });
     */
    static init(popoverEl: string | HTMLElement, options?: PopoverOptions) {
        return new Popover(popoverEl, options)
    }

    /**
     * Automatically initializes all popover elements matching the specified selector.
     * @param {string} [selector='[data-fx-popover]'] - The selector to find popover elements.
     * @example
     * // Initialize all popovers with default selector
     * Popover.autoInit();
     * 
     * // Initialize popovers with custom selector
     * Popover.autoInit('.custom-popover');
     */
    static autoInit(selector = "[data-fx-popover]") {
        const popovers = $$(selector)
        for (const popover of popovers) new Popover(popover)
    }
}

export { Popover }