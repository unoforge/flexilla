import { createArrow } from "./arrow";
import { setArrowPosition } from "./arrow-helpers";
import { DEFAULT_OFFSETDISTANCE, DEFAULT_PLACEMENT, ARROW_SIZE } from "./const";
import { getDimensions } from "./helper";
import { injectStyle } from "./injectStyles";
import { PopperParams, Placement } from "./types";
import { determinePosition } from "./utils";

/**
 * Popper 
 */
class CreatePopper {
    private reference: HTMLElement
    private popper: HTMLElement
    private offsetDistance: number
    private placement: Placement
    private disableOnResize: boolean
    private disableOnScroll: boolean
    private enableArrow: boolean
    private arrowSize: number
    private arrowClassName: string
    /**
     * CREATE POPPER
     */
    constructor({
        reference, popper, options = {}
    }: PopperParams) {
        const {
            offsetDistance = DEFAULT_OFFSETDISTANCE,
            placement = DEFAULT_PLACEMENT,
            eventEffect = {},
            arrow = {},
        } = options
        if (!(reference instanceof HTMLElement)) throw new Error("Invalid HTMLElement for Reference Element");
        if (!(popper instanceof HTMLElement)) throw new Error("Invalid HTMLElement for Popper");
        if (typeof options.offsetDistance !== "number") throw new Error("OffsetDistance must be a number");
        injectStyle()

        const { disableOnResize, disableOnScroll } = eventEffect
        const { enableArrow, arrowSize = ARROW_SIZE, customClass } = arrow
        this.reference = reference
        this.popper = popper
        this.offsetDistance = offsetDistance
        this.placement = placement
        this.disableOnResize = disableOnResize || false
        this.disableOnScroll = disableOnScroll || false
        this.enableArrow = enableArrow || false
        this.arrowSize = arrowSize
        this.arrowClassName = customClass || ""
        this.popper.setAttribute("data-fx-popper", '')
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
    private setPopperStyleProperty = (x: number, y: number) => {
        this.popper.style.setProperty("--fx-popper-placement-x", `${x}px`)
        this.popper.style.setProperty("--fx-popper-placement-y", `${y}px`)
    }

    private setInitialStyles = (): void => {
        this.popper.style.setProperty("--fx-popper-placement-x", "")
        this.popper.style.setProperty("--fx-popper-placement-y", "")
    };

    private initPlacement = (): void => {
        this.validateElements();
        this.setInitialStyles();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const { popperHeight, popperWidth, refHeight, refWidth, refLeft, refTop } = getDimensions({ reference: this.reference, popper: this.popper });
        const { x, y } = determinePosition(
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
                offsetDistance: this.offsetDistance
            }
        );
        if (this.enableArrow) {
            const { addToParent } = createArrow({ customClass: this.arrowClassName, })
            addToParent(this.popper.parentElement as HTMLElement, this.popper)
        }

        setArrowPosition({
            popper: this.popper,
            arrowSize: this.arrowSize,
            offsetDistance: this.offsetDistance, placement: this.placement, refWidth, refHeight, x, y
        })

        this.setPopperStyleProperty(x, y)
    };

    /**
     * Add event Listeners : window resize and scroll
     * These events depend on if it's disable or not
     */
    private attachWindowEvent = () => {
        if (!this.disableOnResize) {
            window.addEventListener("resize", this.initPositionate);
        }
        if (!this.disableOnScroll)
            window.addEventListener("scroll", this.initPositionate)
    }

    private initPositionate = (): void => {
        this.initPlacement();
    };

    resetPosition = () => {
        this.setInitialStyles()
    }

    updatePosition() {
        !this.popper.hasAttribute("data-fx-popper") && this.popper.setAttribute("data-fx-popper", '')
        this.initPositionate()
        this.attachWindowEvent()
    }

    /**
     * Remove event listerners in case they are no longer needed
     */
    cleanupEvents = (): void => {
        this.setInitialStyles()
        !this.disableOnResize && window.removeEventListener("resize", this.initPositionate);
        !this.disableOnScroll && window.removeEventListener("scroll", this.initPositionate);
    };

}
export default CreatePopper