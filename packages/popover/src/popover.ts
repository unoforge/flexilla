import type { EventEffect, PopoverOptions } from "./types"
import { CreatePopper, type Placement } from 'flexipop'
import { $, $$, afterTransition, dispatchCustomEvent } from "@flexilla/utilities"
import { updatePopoverState } from "./helpers"

/**
 * Internal class for creating and managing popover functionality.
 * @internal
 */
class CreatePopover {
    private triggerElement: HTMLElement
    private contentElement: HTMLElement
    private triggerStrategy: "click" | "hover"
    private placement: Placement
    private offsetDistance: number
    private preventFromCloseOutside: boolean
    private preventFromCloseInside: boolean
    private options: PopoverOptions
    private defaultState: "open" | "close"
    private popper: CreatePopper
    private eventEffect: EventEffect | undefined

    constructor({ trigger, content, options = {} }: { trigger: string | HTMLElement, content: string | HTMLElement, options?: PopoverOptions }) {

        this.contentElement = this.getElement(content) as HTMLElement;
        this.triggerElement = this.getElement(trigger) as HTMLElement;

        if (!(this.triggerElement instanceof HTMLElement)) throw new Error("Trigger element must be a valid HTML element")
        if (!(this.contentElement instanceof HTMLElement)) throw new Error("Content element must be a valid HTML element")

        this.options = options

        this.triggerStrategy = this.options.triggerStrategy || "click"
        this.placement = this.options.placement || "bottom"
        this.offsetDistance = this.options.offsetDistance || 6
        this.preventFromCloseOutside = this.options.preventFromCloseOutside || false
        this.preventFromCloseInside = this.options.preventCloseFromInside || false
        this.defaultState = this.options.defaultState || "close";
        this.eventEffect = this.options.popper?.eventEffect
        this.popper = new CreatePopper(
            this.triggerElement,
            this.contentElement,
            {
                placement: this.placement,
                offsetDistance: this.offsetDistance,
                eventEffect: this.eventEffect
            }
        )
        this.initInstance()
    }

    private getElement = (el: string | HTMLElement | undefined) => {
        return typeof el === "string" ? $(el) : el instanceof HTMLElement ? el : undefined;
    };


    private handleDocumentClick = (event: MouseEvent) => {
        if (this.contentElement.getAttribute("data-state") === "open") {
            if (
                !this.triggerElement.contains(event.target as Node) &&
                !this.preventFromCloseInside &&
                !this.preventFromCloseOutside
            ) {
                this.hide()
            }
            else if (!this.triggerElement.contains(event.target as Node)
                && !this.contentElement.contains(event.target as Node)
                && !this.preventFromCloseOutside)
                this.hide()
            else if (!this.triggerElement.contains(event.target as Node) && !this.contentElement.contains(event.target as Node) && !this.preventFromCloseOutside) this.hide()
            else if (!this.triggerElement.contains(event.target as Node) && this.contentElement.contains(event.target as Node) && !this.preventFromCloseInside) this.hide()
        }
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault()
        if (this.triggerStrategy !== "hover" && event.key === "Escape") {
            if (this.contentElement.getAttribute("data-state") === "open") {
                if (!this.preventFromCloseOutside) this.hide();
            }
        }
    }


    private onToggleState(isHidden: boolean) {
        this.options.onToggle?.({ isHidden: isHidden })
    }

    private toggleStateOnClick = () => {
        const state = this.contentElement.dataset.state || "close"
        if (state === "close") {
            this.show()
            if (this.triggerStrategy === "hover") this.addEventOnMouseEnter()
        } else {
            this.hide()
        }
    }

    private hideOnMouseLeaseTrigger = () => {
        setTimeout(() => {
            if (!this.contentElement.matches(':hover')) this.hide();
        }, 150);
    }

    private hideOnMouseLeave = () => {
        setTimeout(() => {
            if (!this.triggerElement.matches(':hover')) this.hide();
        }, 150);
    }

    private addEventOnMouseEnter = () => {
        this.triggerElement.addEventListener("mouseleave", this.hideOnMouseLeaseTrigger)
        this.contentElement.addEventListener("mouseleave", this.hideOnMouseLeave)
    }

    private showOnMouseEnter = () => {
        this.show()
        this.addEventOnMouseEnter()
    }

    show() {
        this.popper.updatePosition()
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("click", this.handleDocumentClick)
        this.options.beforeShow?.()
        updatePopoverState({
            state: "open",
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        this.onToggleState(false)
        this.options.onShow?.()
    }

    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.popper.setOptions({
            placement,
            offsetDistance
        })
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("click", this.handleDocumentClick)
        this.options.beforeShow?.()
        updatePopoverState({
            state: "open",
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        this.onToggleState(false)
        this.options.onShow?.()
    }
    setPopperOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.popper.setOptions({
            placement,
            offsetDistance
        })
    }

    hide() {
        this.options.beforeHide?.()
        updatePopoverState({
            state: "close",
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        this.triggerStrategy === "click" && document.removeEventListener("click", this.handleDocumentClick)
        document.removeEventListener("keydown", this.handleKeyDown)
        if (this.triggerStrategy === "hover") {
            this.triggerElement.removeEventListener("mouseleave", this.hideOnMouseLeaseTrigger)
            this.contentElement.removeEventListener("mouseleave", this.hideOnMouseLeave)
        }
        afterTransition({
            element: this.contentElement,
            callback: () => {
                this.onToggleState(true)
                this.popper.cleanupEvents()
                this.options.onHide?.()
            }
        })

    }

    private initInstance() {
        updatePopoverState({
            state: this.defaultState,
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        if (this.defaultState === "open") {
            this.show()
        } else {
            updatePopoverState({
                state: "close",
                popper: this.contentElement,
                trigger: this.triggerElement
            })
        }

        this.triggerElement.addEventListener("click", this.toggleStateOnClick)
        if (this.triggerStrategy === "hover") {
            this.triggerElement.addEventListener("mouseenter", this.showOnMouseEnter)
        }
    }
}

/**
 * Creates a new popover instance with the specified trigger and content elements.
 * @class
 * @description A class that creates and manages a popover component with customizable trigger and content elements.
 */
class Popover {
    private triggerElement: HTMLElement
    private contentElement: HTMLElement

    private options: PopoverOptions
    private PopoverInstance: CreatePopover

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

        this.PopoverInstance = new CreatePopover({
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

export { CreatePopover, Popover }