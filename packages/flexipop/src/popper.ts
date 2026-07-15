import { DEFAULT_OFFSETDISTANCE, DEFAULT_PLACEMENT } from "./const";
import { getDimensions } from "./utils";
import type { Placement, PopperOptions } from "./types";
import { determinePosition } from "./helpers";

/**
 * Flexilla Popper -- A small, powerful, and efficient positioning solution
 * Creates and manages a popper element that can be positioned relative to a reference element
 * @class
 */
class CreatePopper {
    private reference: HTMLElement
    private popper: HTMLElement
    private offsetDistance: number
    private placement: Placement
    private disableOnResize: boolean
    private disableOnScroll: boolean
    private readjustHeight: boolean
    private minHeight: number
    private onUpdate: (({ x, y, placement }: { x: number, y: number, placement: Placement }) => void) | undefined
    private isWindowEventsRegistered: boolean

    /**
     * Flexilla Popper 
     * @param reference 
     * @param popper 
     * @param options 
     */
    /**
     * Creates an instance of CreatePopper
     * @param {HTMLElement} reference - The reference element to position against
     * @param {HTMLElement} popper - The element to be positioned
     * @param {PopperOptions} [options] - Configuration options
     * @param {number} [options.offsetDistance] - Distance between popper and reference element
     * @param {Placement} [options.placement] - Preferred placement of the popper
     * @param {Object} [options.eventEffect] - Event handling configuration
     * @param {boolean} [options.eventEffect.disableOnResize] - Disable position updates on window resize
     * @param {boolean} [options.eventEffect.disableOnScroll] - Disable position updates on scroll
     * @param {Function} [options.onUpdate] - Callback function when position updates
     */
    constructor(reference: HTMLElement, popper: HTMLElement, options: PopperOptions = {}) {
        const {
            offsetDistance = DEFAULT_OFFSETDISTANCE,
            placement = DEFAULT_PLACEMENT,
            eventEffect = {},
            onUpdate,
            readjustHeight,
            minHeight
        } = options
        if (!(reference instanceof HTMLElement)) throw new Error("Invalid HTMLElement for Reference Element");
        if (!(popper instanceof HTMLElement)) throw new Error("Invalid HTMLElement for Popper");
        if (options.offsetDistance && typeof options.offsetDistance !== "number") throw new Error("OffsetDistance must be a number");

        const { disableOnResize, disableOnScroll } = eventEffect
        this.isWindowEventsRegistered = false
        this.reference = reference
        this.popper = popper
        this.offsetDistance = offsetDistance
        this.placement = placement
        this.disableOnResize = disableOnResize || false
        this.disableOnScroll = disableOnScroll || false
        this.readjustHeight = readjustHeight || false
        this.minHeight = minHeight || 140
        this.onUpdate = onUpdate
    }

    /**
     * Validate Elements, check if reference and popper are valid HtmlELment
     */
    private validateElements = (): void => {
        if (!(this.reference instanceof HTMLElement)) throw new Error("Invalid HTMLElement for Reference Element");
        if (!(this.popper instanceof HTMLElement)) throw new Error("Invalid HTMLElement for Popper");
        if (typeof this.offsetDistance !== "number") throw new Error("OffsetDistance must be a number");
    };

    /**
     * Set Style Property
     */
    private setPopperStyleProperty = (x: number, y: number, placement: Placement, triggerWidth: number) => {
        this.popper.setAttribute("data-show-placement", placement)
        this.popper.style.setProperty("--fx-popper-placement-x", `${x}px`)
        this.popper.style.setProperty("--fx-popper-placement-y", `${y}px`)
        this.popper.style.setProperty("--trigger-width", `${triggerWidth}px`)
    }

    private setInitialStyles = (): void => {
        this.popper.style.setProperty("--fx-popper-placement-x", "")
        this.popper.style.setProperty("--fx-popper-placement-y", "")
        this.popper.style.setProperty("--trigger-width", "")
    };

    private resetReadjustHeightStyles = (): void => {
        this.popper.style.maxHeight = ""
        this.popper.style.overflowY = ""
    }

    private applyReadjustHeight = (maxHeight?: number): void => {
        if (!maxHeight) {
            this.resetReadjustHeightStyles()
            return
        }

        this.popper.style.maxHeight = `${maxHeight}px`
        this.popper.style.overflowY = "auto"
    }

    private initPlacement = (): void => {
        this.validateElements();
        this.setInitialStyles();
        this.resetReadjustHeightStyles();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const initialDimensions = getDimensions({ reference: this.reference, popper: this.popper });
        const initialPosition = determinePosition(
            {
                placement: this.placement,
                refWidth: initialDimensions.refWidth,
                refTop: initialDimensions.refTop,
                refLeft: initialDimensions.refLeft,
                popperWidth: initialDimensions.popperWidth,
                refHeight: initialDimensions.refHeight,
                popperHeight: initialDimensions.popperHeight,
                windowHeight,
                windowWidth,
                offsetDistance: this.offsetDistance,
                minHeight: this.minHeight,
                readjustHeight: this.readjustHeight
            }
        );

        this.applyReadjustHeight(initialPosition.maxHeight)

        const { popperHeight, popperWidth, refHeight, refWidth, refLeft, refTop } = getDimensions({ reference: this.reference, popper: this.popper });
        const { x, y, resolvedPlacement } = determinePosition(
            {
                placement: this.placement,
                refWidth,
                refTop,
                refLeft,
                popperWidth,
                refHeight,
                popperHeight,
                windowHeight,
                windowWidth,
                offsetDistance: this.offsetDistance,
                minHeight: this.minHeight,
                readjustHeight: this.readjustHeight
            }
        );

        this.setPopperStyleProperty(x, y, resolvedPlacement, refWidth)
        this.onUpdate?.({ x, y, placement: this.placement })

    };

    private removeWindowEvents = () => {
        if (this.isWindowEventsRegistered) {
            !this.disableOnResize && window.removeEventListener("resize", this.updatePosition);
            !this.disableOnScroll && window.removeEventListener("scroll", this.updatePosition);
            this.isWindowEventsRegistered = false
        }
    }
    /**
     * Add event Listeners : window resize and scroll
     * These events depend on if it's disable or not
     */
    private attachWindowEvent = () => {
        if (this.isWindowEventsRegistered)
            this.removeWindowEvents()

        if (!this.disableOnResize) {
            window.addEventListener("resize", this.updatePosition);
        }
        if (!this.disableOnScroll)
            window.addEventListener("scroll", this.updatePosition)
        this.isWindowEventsRegistered = true
    }


    /**
     * Resets the popper position by clearing positioning styles
     * @public
     */
    resetPosition = () => {
        this.setInitialStyles()
        this.resetReadjustHeightStyles()
    }

    /**
     * Updates the popper position based on current reference element position
     * @public
     */
    updatePosition = () => {
        this.initPlacement();
        this.attachWindowEvent()
    }

    /**
     * Updates popper configuration and recalculates position
     * @public
     * @param {Object} options - New configuration options
     * @param {Placement} options.placement - New placement value
     * @param {number} [options.offsetDistance] - New offset distance
     */
    setOptions({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) {
        this.placement = placement
        this.offsetDistance = offsetDistance || this.offsetDistance
        this.initPlacement()
        this.attachWindowEvent()
    }

    /**
     * Remove event listerners in case they are no longer needed
     */
    /**
     * Removes all event listeners and cleans up positioning styles
     * @public
     */
    cleanupEvents = (): void => {
        this.setInitialStyles()
        this.resetReadjustHeightStyles()
        this.removeWindowEvents()
    };

}

export default CreatePopper
