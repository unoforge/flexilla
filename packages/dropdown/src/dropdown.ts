import { DropdownOptions } from "./types"
import { CreatePopover, type Placement } from "@flexilla/popover"
import { $$, $, keyboardNavigation, dispatchCustomEvent } from "@flexilla/utilities"


/**
 * A class that creates and manages dropdown functionality with popover positioning.
 * Provides click or hover trigger strategies, customizable placement, and keyboard navigation.
 * 
 * @example
 * ```ts
 * // Auto initialize all dropdowns with data-fx-dropdown attribute
 * Dropdown.autoInit()
 * 
 * // Initialize a specific dropdown
 * const dropdown = new Dropdown('#myDropdown', {
 *   triggerStrategy: 'hover',
 *   placement: 'bottom-start',
 *   offsetDistance: 8
 * })
 * 
 * // Control programmatically
 * dropdown.show()
 * dropdown.hide()
 * ```
 */
class Dropdown {
    private triggerElement: HTMLElement
    private contentElement: HTMLElement

    private options: DropdownOptions
    private CreatePopoverInstance: CreatePopover
    private navigationKeys: {
        make: () => void;
        destroy: () => void;
    }

    private triggerStrategy: "click" | "hover"
    private placement: Placement
    private offsetDistance: number
    private preventFromCloseOutside: boolean
    private preventFromCloseInside: boolean
    private defaultState: "open" | "close"

    /**
     * Creates a new Dropdown instance
     * @param dropdown - The dropdown content element or selector
     * @param options - Configuration options for the dropdown
     * @throws {Error} If provided elements are not valid HTMLElements
     */
    constructor(dropdown: string | HTMLElement, options: DropdownOptions = {}) {
        const contentElement = typeof dropdown === "string"  ? $(dropdown)  : dropdown;

        if (!(contentElement instanceof HTMLElement)) {
            throw new Error(
                "Invalid dropdown content element: Must provide either a valid HTMLElement " +
                "or a selector string that resolves to an existing HTMLElement"
            );
        }
        if (!contentElement.id) {
            throw new Error("Dropdown content element must have an 'id' attribute for trigger association")
        }
        this.contentElement = contentElement

        const triggerSelector = `[data-dropdown-trigger][data-dropdown-id=${this.contentElement.id}]`
        this.triggerElement = $(triggerSelector) as HTMLElement
        if (!(this.triggerElement instanceof HTMLElement)) {
            throw new Error(`No valid trigger element found. Ensure a trigger element exists with attributes: data-dropdown-trigger and data-dropdown-id="${this.contentElement.id}"`)
        }

        this.options = options
        this.triggerStrategy = this.options.triggerStrategy || this.contentElement.dataset.triggerStrategy as "click" | "hover" || "click"
        this.placement = this.options.placement || this.contentElement.dataset.placement as Placement || "bottom-start"
        this.offsetDistance = this.options.offsetDistance || parseInt(`${this.contentElement.dataset.offsetDistance}`) | 6
        this.preventFromCloseOutside = this.options.preventFromCloseOutside || this.contentElement.hasAttribute("data-prevent-close-outside") || false
        this.preventFromCloseInside = this.options.preventCloseFromInside || this.contentElement.hasAttribute("data-prevent-close-inside") || false
        this.defaultState = this.options.defaultState || this.contentElement.dataset.defaultState as "close" | "open" || "close";

        this.CreatePopoverInstance = new CreatePopover({
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
                beforeHide: this.beforeHide,
                onShow: this.onShow,
                onHide: this.onHide,
                onToggle: ({ isHidden }) => {
                    this.onToggle({ isHidden })
                },
                popper: this.options.popper
            }
        })


        this.navigationKeys = keyboardNavigation({
            containerElement: this.contentElement,
            targetChildren: "a:not([disabled]), button:not([disabled])",
            direction: "up-down"
        })
    }


    private onToggle = ({ isHidden }: { isHidden?: boolean }) => {
        this.options.onToggle?.({ isHidden })
    }

    private beforeShow = () => {
        this.contentElement.focus()
        this.navigationKeys.make()
    }

    private beforeHide = () => {
        this.contentElement.blur()
        this.navigationKeys.destroy()
    }

    private onShow = () => {
        dispatchCustomEvent(this.contentElement, "dropdown-show", {
            isHidden: false
        })
        this.options.onShow?.()
    }
    private onHide = () => {
        dispatchCustomEvent(this.contentElement, "dropdown-hide", {
            isHidden: true
        })
        this.options.onHide?.()
    }

    /**
     * Shows the dropdown
     */
    show = () => {
        this.CreatePopoverInstance.show()
    }

    /**
     * Hides the dropdown
     */
    hide = () => {
        this.CreatePopoverInstance.hide()
    }

    /**
     * Updates the dropdown's placement and offset settings
     * @param options - The new placement and offset options
     */
    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.CreatePopoverInstance.setShowOptions({ placement, offsetDistance })
    }

    /**
     * Automatically initializes all dropdown elements that match the given selector
     * @param selector - The selector to find dropdown elements (default: "[data-fx-dropdown]")
     */
    static autoInit = (selector = "[data-fx-dropdown]") => {
        const dropdowns = $$(selector)
        for (const dropdown of dropdowns) new Dropdown(dropdown)
    }

    /**
     * Initializes a single dropdown instance
     * @param dropdown - The dropdown element or selector
     * @param options - Configuration options for the dropdown
     * @returns A new Dropdown instance
     */
    static init(dropdown: string | HTMLElement, options: DropdownOptions = {}) {
        new Dropdown(dropdown, options)
    }
}

export default Dropdown