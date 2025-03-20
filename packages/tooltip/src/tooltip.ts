import { CreateOverlay, type Placement } from "@flexilla/create-overlay"
import { $, $$, dispatchCustomEvent } from "@flexilla/utilities"
import type { TooltipOptions } from "./types"



class Tooltip {
    private triggerElement: HTMLElement
    private contentElement: HTMLElement

    private options: TooltipOptions
    private PopoverInstance: CreateOverlay

    private triggerStrategy: "click" | "hover"
    private placement: Placement
    private offsetDistance: number
    private preventFromCloseOutside: boolean
    private preventFromCloseInside: boolean
    private defaultState: "open" | "close"

    /**
     * 
     * @param tooltipEl 
     * @param options 
     */
    constructor(tooltipEl: string | HTMLElement, options: TooltipOptions = {}) {
        const content = typeof tooltipEl === "string" ? $(tooltipEl) as HTMLElement : tooltipEl
        this.contentElement = content
        this.triggerElement = $(`[data-tooltip-trigger][data-tooltip-id=${content.getAttribute("id")}]`) as HTMLElement
        this.options = options
        this.triggerStrategy = this.options.triggerStrategy || content.dataset.triggerStrategy as "click" | "hover" || "hover"
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
                },
                popper: {
                    eventEffect: {
                        disableOnResize: this.options.popper?.eventEffect.disableOnResize,
                        disableOnScroll: this.options.popper?.eventEffect.disableOnScroll
                    }
                }
            }
        })
    }


    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.PopoverInstance.setShowOptions({ placement, offsetDistance })
    }

    show = () => {
        this.PopoverInstance.show()
        dispatchCustomEvent(this.triggerElement, "tooltip-show", {
            isHidden: false
        })
    }

    hide = () => {
        this.PopoverInstance.hide()
        dispatchCustomEvent(this.triggerElement, "tooltip-hide", {
            isHidden: true
        })
    }

    cleanup = ()=>{
        this.PopoverInstance.destroy()
    }

    /**
     * 
     * @param tooltipEl 
     * @param options 
     */
    static init(tooltipEl: string | HTMLElement, options?: TooltipOptions) {
        return new Tooltip(tooltipEl, options)
    }

    /**
     * auto init Tabs Elements based on the selector provided
     * @param selector {string} default is [data-fx-tabs] attribute
     */
    static autoInit = (selector: string = "[data-fx-tooltip]") => {
        const tooltipEls = $$(selector)
        for (const tooltip of tooltipEls) new Tooltip(tooltip)
    }
}

export default Tooltip