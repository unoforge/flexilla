import { CreateOverlay, type Placement } from "@flexilla/create-overlay"
import { $, $$, dispatchCustomEvent } from "@flexilla/utilities"
import type { TooltipOptions } from "./types"
import { FlexillaManager } from "@flexilla/manager"

/**
 * Creates and manages a tooltip component with customizable trigger and content elements.
 * @class
 * @description A class that provides tooltip functionality with various positioning and interaction options.
 */
class Tooltip {
    private triggerElement!: HTMLElement
    private contentElement: HTMLElement

    private options!: TooltipOptions
    private PopoverInstance!: CreateOverlay

    private triggerStrategy!: "click" | "hover"
    private placement!: Placement
    private offsetDistance!: number
    private preventFromCloseOutside!: boolean
    private preventFromCloseInside!: boolean
    private defaultState!: "open" | "close"

    /**
     * Creates a new Tooltip instance.
     * @param {string | HTMLElement} tooltipEl - The tooltip content element or its selector.
     * @param {TooltipOptions} [options={}] - Configuration options for the tooltip.
     * @example
     * // Create a tooltip with default options
     * const tooltip = new Tooltip('#my-tooltip');
     * 
     * // Create a tooltip with custom options
     * const tooltip = new Tooltip('#my-tooltip', {
     *   placement: 'top',
     *   triggerStrategy: 'hover',
     *   offsetDistance: 8
     * });
     */
    constructor(tooltipEl: string | HTMLElement, options: TooltipOptions = {}) {
        const content = typeof tooltipEl === "string" ? $(tooltipEl) as HTMLElement : tooltipEl
        this.contentElement = content

        const existingInstance = FlexillaManager.getInstance('tooltip', this.contentElement);
        if (existingInstance) {
            return existingInstance;
        }
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

        FlexillaManager.register('tooltip', this.contentElement, this)
    }

    /**
     * Updates the tooltip's placement and offset settings.
     * @param {Object} options - The options to update
     * @param {Placement} options.placement - New placement for the tooltip
     * @param {number} [options.offsetDistance] - New offset distance from the trigger element
     */
    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.PopoverInstance.setShowOptions({ placement, offsetDistance })
    }

    /**
     * Shows the tooltip.
     * @fires tooltip-show - Custom event dispatched when the tooltip is shown
     */
    show = () => {
        this.PopoverInstance.show()
        dispatchCustomEvent(this.triggerElement, "tooltip-show", {
            isHidden: false
        })
    }

    /**
     * Hides the tooltip.
     * @fires tooltip-hide - Custom event dispatched when the tooltip is hidden
     */
    hide = () => {
        this.PopoverInstance.hide()
        dispatchCustomEvent(this.triggerElement, "tooltip-hide", {
            isHidden: true
        })
    }

    /**
     * Cleans up the tooltip instance and removes it from the manager.
     * Call this method when the tooltip is no longer needed to prevent memory leaks.
     */
    cleanup = () => {
        this.PopoverInstance.cleanup()
        FlexillaManager.removeInstance('tooltip', this.contentElement)
    }

    /**
     * Creates and initializes a new Tooltip instance.
     * @param {string | HTMLElement} tooltipEl - The tooltip content element or its selector
     * @param {TooltipOptions} [options] - Configuration options for the tooltip
     * @returns {Tooltip} A new Tooltip instance
     * @example
     * const tooltip = Tooltip.init('#my-tooltip', {
     *   placement: 'top',
     *   triggerStrategy: 'hover'
     * });
     */
    static init(tooltipEl: string | HTMLElement, options?: TooltipOptions) {
        return new Tooltip(tooltipEl, options)
    }

    /**
     * Automatically initializes all tooltip elements matching the specified selector.
     * @param {string} [selector='[data-fx-tooltip]'] - The selector to find tooltip elements
     * @example
     * // Initialize all tooltips with default selector
     * Tooltip.autoInit();
     * 
     * // Initialize tooltips with custom selector
     * Tooltip.autoInit('.custom-tooltip');
     */
    static autoInit = (selector: string = "[data-fx-tooltip]") => {
        const tooltipEls = $$(selector)
        for (const tooltip of tooltipEls) new Tooltip(tooltip)
    }
}

export default Tooltip