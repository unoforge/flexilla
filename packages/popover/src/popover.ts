import type { ExperimentaOptions, PopoverOptions } from "./types"
import { CreateOverlay, type Placement } from 'flexipop/create-overlay'
import { $, $$, dispatchCustomEvent } from "@flexilla/utilities"
import { FlexillaManager } from "@flexilla/manager"
import { domTeleporter } from "@flexilla/utilities"


const defaultExperimentalOptions: ExperimentaOptions = {
    teleport: true,
    teleportMode: "move"
}


/**
 * Creates a new popover instance with the specified trigger and content elements.
 * @class
 * @description A class that creates and manages a popover component with customizable trigger and content elements.
 */
class Popover {
    private triggerElement!: HTMLElement
    private contentElement!: HTMLElement

    private options!: PopoverOptions
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

        const existingInstance = FlexillaManager.getInstance('popover', this.contentElement);
        if (existingInstance) {
            return existingInstance;
        }
        this.triggerElement = $(`[data-popover-trigger][data-popover-id=${content.getAttribute("id")}]`) as HTMLElement
        this.options = options
        this.triggerStrategy = content.dataset.triggerStrategy as "click" | "hover" ?? (this.options.triggerStrategy ?? "click")
        this.placement = content.dataset.placement as Placement ?? (this.options.placement ?? "bottom-middle")
        this.offsetDistance = parseInt(`${content.dataset.offsetDistance}`) ?? (this.options.offsetDistance ?? 6)
        this.preventFromCloseOutside = content.hasAttribute("data-prevent-close-outside") ?? (this.options.preventFromCloseOutside ?? false)
        this.preventFromCloseInside = content.hasAttribute("data-close-inside") ? false : (this.options.preventCloseFromInside ?? true)
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
                popper: this.options.popper
            }
        })


        this.moveElOnInit()
        FlexillaManager.register("popover", this.contentElement, this)
    }


    private moveElOnInit = () => {
        if (this.experimentalOptions.teleport) {
            if (this.experimentalOptions.teleportMode === "detachable")
                this.teleporter.remove()
            else this.teleporter.append()
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
        dispatchCustomEvent(this.contentElement, "popover-hide", {
            isHidden: true
        })
    }

    private onShow = () => {
        this.options.onShow?.()
        dispatchCustomEvent(this.contentElement, "popover-show", {
            isHidden: false
        })
    }


    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.PopoverInstance.setShowOptions({ placement, offsetDistance })
    }

    /**
     * Updates the Popover's placement and offset settings
     * @param options - The new placement and offset options
     */
    setOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.PopoverInstance.setPopperOptions({ placement, offsetDistance })
    }

    /**
     * Updates the Popover trigger reference Element and options
     * The new set trigger will be used as reference for the Popover
    */
    setPopperTrigger = (trigger: HTMLElement, options: { placement?: Placement, offsetDistance?: number }) => {
        this.PopoverInstance.setPopperTrigger(trigger, options)
    }

    show = () => {
        this.PopoverInstance.show()
    }
    hide = () => {
        this.PopoverInstance.hide()
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

    cleanup = () => {
        this.PopoverInstance.cleanup()
        FlexillaManager.removeInstance('popover', this.contentElement)
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
    static autoInit(selector: string = "[data-fx-popover]") {
        const popovers = $$(selector)
        for (const popover of popovers) new Popover(popover)
    }
}

export { Popover }