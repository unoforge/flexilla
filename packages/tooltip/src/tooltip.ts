import { CreateOverlay, type Placement } from "flexipop/create-overlay"
import { $, $$, dispatchCustomEvent, waitForFxComponents } from "@flexilla/utilities"
import type { ExperimentaOptions, TooltipOptions } from "./types"
import { FlexillaManager } from "@flexilla/manager"
import { domTeleporter } from "@flexilla/utilities"


const defaultExperimentalOptions: ExperimentaOptions = {
    teleport: true,
    teleportMode: "move"
}



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
    private experimentalOptions!: ExperimentaOptions
    private teleporter!: {
        append: () => void;
        remove: () => void;
        restore: () => void;
    }

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
        FlexillaManager.setup(this.contentElement)
        this.triggerElement = $(`[data-tooltip-trigger][data-tooltip-id=${content.getAttribute("id")}]`) as HTMLElement
        this.options = options
        this.triggerStrategy = content.dataset.triggerStrategy as "click" | "hover" || this.options.triggerStrategy || "hover"
        this.placement = content.dataset.placement as Placement || this.options.placement || "bottom-middle"
        this.offsetDistance = parseInt(`${content.dataset.offsetDistance}`) ?? (this.options.offsetDistance ?? 6)
        this.preventFromCloseOutside = content.hasAttribute("data-prevent-close-outside") ?? (this.options.preventFromCloseOutside ?? false)
        this.preventFromCloseInside = content.hasAttribute("data-prevent-close-inside") ?? (this.options.preventCloseFromInside ?? false)
        this.defaultState = content.dataset.defaultState as "close" | "open" ?? (this.options.defaultState ?? "close");
        this.experimentalOptions = Object.assign({}, defaultExperimentalOptions, options.experimental)
        this.teleporter = domTeleporter(this.contentElement, document.body, this.experimentalOptions.teleportMode)

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
                beforeShow: this.beforeShow,
                onShow: this.onShow,
                onHide: this.onHide,
                onToggle: ({ isHidden }) => {
                    this.options.onToggle?.({ isHidden })
                    dispatchCustomEvent(this.contentElement, "popover-toggle", {
                        isHidden: isHidden
                    })
                },
                popper: {
                    eventEffect: {
                        disableOnResize: this.options.popper?.eventEffect.disableOnResize,
                        disableOnScroll: this.options.popper?.eventEffect.disableOnScroll
                    }
                }
            }
        })

        this.moveElOnInit()
        FlexillaManager.register('tooltip', this.contentElement, this)
        FlexillaManager.initialized(this.contentElement)
    }




    private moveElOnInit = () => {
        if (this.experimentalOptions.teleport) {
            waitForFxComponents(() => {
                if (this.experimentalOptions.teleportMode === "detachable")
                    this.teleporter.remove()
                else this.teleporter.append()
            })
        }
    }

    private moveEl = () => {
        if (this.experimentalOptions.teleport && this.experimentalOptions.teleportMode === "detachable") {
            this.teleporter.remove()
        }
    }

    private restoreEl = () => {
        if (this.experimentalOptions.teleport && this.experimentalOptions.teleportMode === "detachable") {
            this.teleporter.append()
        }
    }


    private beforeShow = () => {
        this.restoreEl()

    }
    private onHide = () => {
        this.options.onHide?.()
        this.moveEl()
        dispatchCustomEvent(this.contentElement, "tooltip-hide", {
            isHidden: true
        })
    }

    private onShow = () => {
        this.options.onShow?.()
        dispatchCustomEvent(this.contentElement, "tooltip-show", {
            isHidden: false
        })
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
    }

    /**
     * Hides the tooltip.
     * @fires tooltip-hide - Custom event dispatched when the tooltip is hidden
     */
    hide = () => {
        this.PopoverInstance.hide()
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