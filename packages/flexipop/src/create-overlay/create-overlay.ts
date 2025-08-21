import type { EventEffect, OverlayOptions } from "./types"
import { CreatePopper, type Placement } from './../index'
import { $, afterTransition, dispatchCustomEvent } from "@flexilla/utilities"

import { updateOverlayState } from "./helpers"


/**
 * CreateOverlay class for managing overlay/popup UI components
 * @example
 * const overlay = new CreateOverlay({
 *   trigger: '#triggerButton',
 *   content: '#popupContent',
 *   options: {
 *     triggerStrategy: 'click',
 *     placement: 'bottom',
 *     offsetDistance: 10
 *   }
 * });
 * 
 * @type {OverlayOptions}
 * @property {'click' | 'hover'} [triggerStrategy='click'] - How the overlay is triggered
 * @property {string} [placement='bottom'] - Where the overlay is positioned relative to trigger
 * @property {number} [offsetDistance=6] - Distance between trigger and overlay
 * @property {boolean} [preventFromCloseOutside=false] - Prevents closing when clicking outside
 * @property {boolean} [preventCloseFromInside=false] - Prevents closing when clicking inside
 * @property {'open' | 'close'} [defaultState='close'] - Initial state of the overlay
 */

class CreateOverlay {
    private triggerElement: HTMLElement
    private contentElement: HTMLElement
    private triggerStrategy: "click" | "hover"
    private placement: Placement
    private offsetDistance: number
    private preventFromCloseOutside: boolean
    private preventFromCloseInside: boolean
    private options: OverlayOptions
    private defaultState: "open" | "close"
    private popper: CreatePopper
    private eventEffect: EventEffect | undefined

    /**
     * Creates an instance of CreateOverlay
     * @param {Object} params - The initialization parameters
     * @param {string | HTMLElement} params.trigger - The trigger element selector or HTMLElement
     * @param {string | HTMLElement} params.content - The content element selector or HTMLElement
     * @param {OverlayOptions} [params.options] - Configuration options for the overlay
     */
    constructor({ trigger, content, options = {} }: { trigger: string | HTMLElement, content: string | HTMLElement, options?: OverlayOptions }) {

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

    /**
     * Shows the overlay
     * Positions the overlay, adds event listeners, and triggers related callbacks
     */
    show() {
        this.popper.updatePosition()
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("click", this.handleDocumentClick)
        this.options.beforeShow?.()
        updateOverlayState({
            state: "open",
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        this.onToggleState(false)
        this.options.onShow?.()
    }

    /**
     * Updates the overlay's show options and displays it
     * @param {Object} params - The show options
     * @param {Placement} params.placement - The new placement position
     * @param {number} [params.offsetDistance] - The new offset distance
     */
    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.popper.setOptions({
            placement,
            offsetDistance
        })
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("click", this.handleDocumentClick)
        this.options.beforeShow?.()
        updateOverlayState({
            state: "open",
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        this.onToggleState(false)
        this.options.onShow?.()
    }
    /**
     * Updates the popper's positioning options
     * @param {Object} params - The popper options
     * @param {Placement} params.placement - The new placement position
     * @param {number} [params.offsetDistance] - The new offset distance
     */
    setPopperOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.popper.setOptions({
            placement,
            offsetDistance: offsetDistance || this.offsetDistance
        })
    }

    /**
     * Updates the popper's trigger reference Element and options
     * The new set trigger will be used as reference for the popper
     */
    setPopperTrigger = (trigger: HTMLElement, options: { placement?: Placement, offsetDistance?: number }) => {
        this.cleanup()
        this.popper.setOptions({
            placement: options.placement || this.placement,
            offsetDistance: options.offsetDistance || this.offsetDistance
        })
        this.triggerElement = trigger;
        this.triggerElement.addEventListener("click", this.toggleStateOnClick)
        if (this.triggerStrategy === "hover") {
            this.triggerElement.addEventListener("mouseenter", this.showOnMouseEnter)
        }
    }
    /**
     * Hides the overlay
     * Removes event listeners and triggers related callbacks
     */
    hide() {
        let exitAction = false
        dispatchCustomEvent(this.contentElement, "before-hide", {
            setExitAction: (value: boolean) => {
                exitAction = value
            }
        })
        const exitFromBeforeHide = this.options.beforeHide?.()?.cancelAction
        if (exitAction || exitFromBeforeHide) return

        updateOverlayState({
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
        updateOverlayState({
            state: this.defaultState,
            popper: this.contentElement,
            trigger: this.triggerElement
        })
        if (this.defaultState === "open") {
            this.show()
        } else {
            updateOverlayState({
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

    /**
     * Cleans up event listeners and related callbacks
     */
    cleanup = () => {
        this.triggerElement.removeEventListener("click", this.toggleStateOnClick)
        if (this.triggerStrategy === "hover") {
            this.triggerElement.removeEventListener("mouseenter", this.showOnMouseEnter)
        }
    }
}

export default CreateOverlay