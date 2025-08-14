import { DropdownOptions, ExperimentalOptions } from "./types"
import { CreateOverlay, type Placement } from "flexipop/create-overlay"

import { $$, $, keyboardNavigation, dispatchCustomEvent, waitForFxComponents } from "@flexilla/utilities"
import { FlexillaManager } from "@flexilla/manager"
import { domTeleporter } from "@flexilla/utilities"




const defaultExperimentalOptions: ExperimentalOptions = {
    teleport: true,
    teleportMode: "move"
}

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
    private triggerElement!: HTMLElement
    private contentElement: HTMLElement

    private items: HTMLElement[] = []
    private options!: DropdownOptions
    private OverlayInstance!: CreateOverlay
    private navigationKeys!: {
        make: () => void;
        destroy: () => void;
    }
    private keyObserver!: MutationObserver
    private subtriggerObserver!: MutationObserver

    private triggerStrategy!: "click" | "hover"
    private placement!: Placement
    private offsetDistance!: number
    private preventFromCloseOutside!: boolean
    private preventFromCloseInside!: boolean
    private defaultState!: "open" | "close"
    private experimentalOptions!: ExperimentalOptions
    private teleporter!: {
        append: () => void;
        remove: () => void;
        restore: () => void;
    }

    /**
     * Creates a new Dropdown instance
     * @param dropdown - The dropdown content element or selector
     * @param options - Configuration options for the dropdown
     * @throws {Error} If provided elements are not valid HTMLElements
     */
    constructor(dropdown: string | HTMLElement, options: DropdownOptions = {}) {
        const contentElement = typeof dropdown === "string" ? $(dropdown) : dropdown;

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
        const existingInstance = FlexillaManager.getInstance('dropdown', this.contentElement);
        if (existingInstance) {
            return existingInstance;
        }
        FlexillaManager.setup(this.contentElement)
        const triggerSelector = `[data-dropdown-trigger][data-dropdown-id=${this.contentElement.id}]`
        this.triggerElement = $(triggerSelector) as HTMLElement
        if (!(this.triggerElement instanceof HTMLElement)) {
            throw new Error(`No valid trigger element found. Ensure a trigger element exists with attributes: data-dropdown-trigger and data-dropdown-id="${this.contentElement.id}"`)
        }

        this.options = options
        this.triggerStrategy = this.contentElement.dataset.triggerStrategy as "click" | "hover" || this.options.triggerStrategy || "click"
        this.placement = this.contentElement.dataset.placement as Placement || this.options.placement || "bottom-start"
        this.offsetDistance = parseInt(`${this.contentElement.dataset.offsetDistance}`) || this.options.offsetDistance || 6
        this.preventFromCloseOutside = this.contentElement.hasAttribute("data-prevent-close-outside") || this.options.preventFromCloseOutside || false
        this.preventFromCloseInside = this.contentElement.hasAttribute("data-prevent-close-inside") || this.options.preventCloseFromInside || false
        this.defaultState = this.contentElement.dataset.defaultState as "close" | "open" || this.options.defaultState || "close";
        this.experimentalOptions = Object.assign({}, defaultExperimentalOptions, options.experimental)

        this.teleporter = domTeleporter(this.contentElement, document.body, this.experimentalOptions.teleportMode)

        this.OverlayInstance = new CreateOverlay({
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
                beforeHide: () => {
                    const droptriggersOpen = $$("[data-dropdown-trigger][aria-expanded=true]", this.contentElement)

                    if (droptriggersOpen.length >= 1) {
                        return { cancelAction: true }
                    }
                    this.beforeHide()
                },
                onShow: this.onShow,
                onHide: this.onHide,
                onToggle: ({ isHidden }) => {
                    this.onToggle({ isHidden })
                },
                popper: this.options.popper
            }
        })


        this.moveElOnInit()

        this.items = $$("a:not([disabled]), button:not([disabled])", this.contentElement) as HTMLElement[]

        this.navigationKeys = keyboardNavigation({
            containerElement: this.contentElement,
            targetChildren: this.items,
            direction: "up-down",
        })



        FlexillaManager.register('dropdown', this.contentElement, this)
        FlexillaManager.initialized(this.contentElement)
    }

    private updateSubtriggerAttr = (trigger: HTMLElement, action: "add" | "remove") => {
        if (action === "add") {
            trigger.setAttribute("data-current-subtrigger", "")
            trigger.setAttribute("data-focus", "active")
        } else {
            trigger.removeAttribute("data-current-subtrigger")
            trigger.removeAttribute("data-focus")
        }
    }
    private updateObserverFor = (observer: MutationObserver) => {
        const subtriggers = $$("[data-dropdown-trigger]", this.contentElement)

        for (const item of subtriggers) {
            observer.observe(item, {
                attributes: true,
                attributeFilter: ['aria-expanded']
            });
        }
    }
    private observeEl = () => {
        this.keyObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
                    const state = (mutation.target as HTMLElement).getAttribute('aria-expanded')
                    if (state === "true") this.navigationKeys.destroy()
                    else if (this.contentElement.dataset.state === "open") this.navigationKeys.make()
                }
            }
        })
        this.updateObserverFor(this.keyObserver)
    }


    private observeSubtriggers = () => {
        this.subtriggerObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
                    const trigger = mutation.target as HTMLElement
                    const state = trigger.getAttribute('aria-expanded')
                    this.updateSubtriggerAttr(trigger, state === "true" ? "add" : "remove")
                }
            }
        })
        this.updateObserverFor(this.subtriggerObserver)
    }

    private onToggle = ({ isHidden }: { isHidden?: boolean }) => {
        this.options.onToggle?.({ isHidden })
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
        this.contentElement.focus()
        this.navigationKeys.make()
        this.addArrowEvent()
    }

    private beforeHide = () => {
        this.contentElement.blur()
        this.navigationKeys.destroy()
        this.removeArrowEvent()
    }

    private showHideOnArrow = (ev: KeyboardEvent) => {
        ev.preventDefault()
        const key = ev.key;
        const current = document.activeElement as HTMLElement;

        if (current?.hasAttribute("data-dropdown-trigger")) {
            switch (key) {
                case 'ArrowRight':
                    if (current.getAttribute("aria-expanded") !== "true") {
                        (current as HTMLElement).click()
                        this.updateSubtriggerAttr(current, "add")
                    }
                    break;
                case 'ArrowLeft':
                    if (current.getAttribute("aria-expanded") === "true") {
                        (current as HTMLElement).click()
                        this.updateSubtriggerAttr(current, "remove")
                    }
                    break;
                default:
                    return;
            }


        }

        if (this.triggerElement.hasAttribute("data-current-subtrigger")) {
            switch (key) {
                case 'ArrowLeft':
                    this.triggerElement.click()
                    this.triggerElement.focus()
                    this.updateSubtriggerAttr(this.triggerElement as HTMLElement, "remove")
                    break;
                default:
                    return;
            }
        }


    }


    private addArrowEvent = () => {
        document.addEventListener('keydown', this.showHideOnArrow);
    }

    private removeArrowEvent = () => {
        document.removeEventListener('keydown', this.showHideOnArrow);
    }

    private onShow = () => {
        dispatchCustomEvent(this.contentElement, "dropdown-show", {
            isHidden: false
        })
        this.options.onShow?.()
        this.observeEl()
        this.observeSubtriggers()
    }
    private onHide = () => {
        dispatchCustomEvent(this.contentElement, "dropdown-hide", {
            isHidden: true
        })
        this.options.onHide?.()
        this.moveEl()
        if (this.triggerElement.hasAttribute("data-current-subtrigger")) {
            this.updateSubtriggerAttr(this.triggerElement, "remove")
        }
        this.disconnectObserver()
    }

    /**
     * Shows the dropdown
     */
    show = () => this.OverlayInstance.show()

    /**
     * Hides the dropdown
     */
    hide = () => this.OverlayInstance.hide()

    /**
     * Updates the dropdown's placement and offset settings and show it
     * @param options - The new placement and offset options
     */
    setShowOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.OverlayInstance.setShowOptions({ placement, offsetDistance })
    }
    /**
    * Updates the dropdown's placement and offset settings
    * @param options - The new placement and offset options
    */
    setOptions = ({ placement, offsetDistance }: { placement: Placement, offsetDistance?: number }) => {
        this.OverlayInstance.setPopperOptions({ placement, offsetDistance })
    }

    /**
     * Updates the dropdown trigger reference Element and options
     * The new set trigger will be used as reference for the Dropdown
     */
    setPopperTrigger = (trigger: HTMLElement, options: { placement?: Placement, offsetDistance?: number }) => {
        this.OverlayInstance.setPopperTrigger(trigger, options)
    }

    private disconnectObserver = () => {
        if (this.keyObserver) {
            this.keyObserver.disconnect();
        }
        if (this.subtriggerObserver) {
            this.subtriggerObserver.disconnect()
        }
    }



    /**
     * Removes all event listeners
     */
    cleanup = () => {
        this.disconnectObserver()
        this.OverlayInstance.cleanup()
        FlexillaManager.removeInstance('dropdown', this.contentElement)
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