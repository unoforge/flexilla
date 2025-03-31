
import type { OffcanvasOptions } from "./types"
import { closeAllOpenedOffcanvas, toggleOffCanvasState } from "./helpers"
import { appendBefore, $$, $, dispatchCustomEvent } from "@flexilla/utilities"
import { createOverlay, destroyOverlay } from "./offCanvasOverlay"
import { FlexillaManager } from "@flexilla/manager"
/**
 * Class representing an Offcanvas element.
 * An Offcanvas is a sidebar component that can slide in from the edges of the viewport.
 * It can be triggered to show/hide through various user interactions.
 * 
 * @example
 * ```ts
 * // Initialize with element ID
 * const offcanvas = new Offcanvas('#myOffcanvas', {
 *   allowBodyScroll: true,
 *   staticBackdrop: false
 * });
 * 
 * // Or initialize with HTMLElement
 * const element = document.querySelector('#myOffcanvas');
 * const offcanvas = new Offcanvas(element);
 * ```
 */
class Offcanvas {
    private offCanvasElement!: HTMLElement
    private offCanvasTriggers!: HTMLElement[]
    private offCanvasCloseBtns!: HTMLElement[]
    private allowBodyScroll!: boolean
    private staticBackdrop!: boolean
    private backdrop!: string
    private options!: OffcanvasOptions

    /**
     * Creates an instance of Offcanvas.
     * @param offcanvas - The offcanvas element selector or HTMLElement
     * @param options - Configuration options for the offcanvas
     * @throws {Error} When the provided element is not a valid HTMLElement
     * 
     * @example
     * ```ts
     * const offcanvas = new Offcanvas('#sidebar', {
     *   allowBodyScroll: true, // Allow scrolling when offcanvas is open
     *   staticBackdrop: false, // Close when clicking outside
     *   backdrop: 'dark',      // Backdrop appearance
     *   onShow: () => console.log('Offcanvas shown'),
     *   onHide: () => console.log('Offcanvas hidden')
     * });
     * ```
     */
    constructor(offcanvas: string | HTMLElement, options: OffcanvasOptions = {}) {

        const offCanvasElement = typeof offcanvas === "string" ? $(offcanvas) : offcanvas
        if (!(offCanvasElement instanceof HTMLElement)) throw new Error("Invalid Offcanvas, the provided Element is not a valid HTMLElement")
        const existingInstance = FlexillaManager.getInstance("offcanvas", offCanvasElement);
        if (existingInstance) {
            return existingInstance;
        }

        this.options = options
        const { staticBackdrop, allowBodyScroll, backdrop: overlay } = this.options
        this.offCanvasElement = offCanvasElement
        this.setupAttributes()
        this.staticBackdrop = staticBackdrop || (offCanvasElement.hasAttribute("data-static-backdrop") && offCanvasElement.dataset.staticBackdrop !== "false") || false
        this.allowBodyScroll = allowBodyScroll || (offCanvasElement.hasAttribute("data-allow-body-scroll") && offCanvasElement.dataset.allowBodyScroll !== "false") || false
        const offCanvasId = this.offCanvasElement.getAttribute("id")
        this.offCanvasTriggers = this.findOffCanvasElements("[data-offcanvas-trigger]", false, offCanvasId);
        this.offCanvasCloseBtns = this.findOffCanvasElements("[data-offcanvas-close]", true, offCanvasId, this.offCanvasElement);
        this.backdrop = overlay || this.offCanvasElement.dataset.offcanvasBackdrop || ""
        this.setupOffcanvas()
        FlexillaManager.register("offcanvas", this.offCanvasElement, this)
    }

    private findOffCanvasElements(selector: string, hasChildren: boolean, offCanvasId: string | null, parent?: HTMLElement) {
        return hasChildren ? $$(`${selector}`, parent) : $$(`${selector}[data-target=${offCanvasId}]`);
    }
    private setupAttributes() {
        if (!this.offCanvasElement.hasAttribute("data-fx-offcanvas"))
            this.offCanvasElement.setAttribute("data-fx-offcanvas", "")
    }

    private closeWhenClickOutSide = (event: MouseEvent) => {
        const isOpen = this.offCanvasElement.getAttribute("data-state") === "open"
        const clickOutOutside = !this.offCanvasElement.contains(event.target as Node) && ![...this.offCanvasTriggers].includes(event.target as HTMLElement)
        if (isOpen && clickOutOutside) this.closeOffCanvas()
    }

    private closeOffCanvas = () => {
        let cancelFromBeforeHide = false
        dispatchCustomEvent(this.offCanvasElement, "offcanvas-before-hide", {
            offcanvasId: this.offCanvasElement.id,
            setExitAction: (value: boolean) => {
                cancelFromBeforeHide = value
            }
        })
        const cancelAction = this.options.beforeHide?.()?.cancelAction
        if (cancelAction || cancelFromBeforeHide) return
        const id = this.offCanvasElement.getAttribute("id")
        const overlayElement = $(`[data-fx-offcanvas-overlay][data-offcanvas-el=${id}]`)
        if (overlayElement instanceof HTMLElement)
            destroyOverlay(overlayElement)

        toggleOffCanvasState(
            this.offCanvasElement,
            this.allowBodyScroll,
            "close"
        )
        document.removeEventListener("keydown", this.closeWithEsc)
        !this.allowBodyScroll && !overlayElement && document.removeEventListener("click", this.closeWhenClickOutSide)
        this.options.onHide?.()
        dispatchCustomEvent(this.offCanvasElement, "offcanvas-close", { offcanvasId: this.offCanvasElement.id })
    }

    private openOffCanvas() {
        this.options.beforeShow?.()
        closeAllOpenedOffcanvas(this.offCanvasElement)
        toggleOffCanvasState(
            this.offCanvasElement,
            this.allowBodyScroll,
            "open")
        const id = this.offCanvasElement.getAttribute("id") as string
        const overlayElement = createOverlay(
            this.backdrop,
            id
        )
        if (overlayElement instanceof HTMLElement) {
            appendBefore({ newElement: overlayElement, existingElement: this.offCanvasElement })
            if (!this.staticBackdrop)
                overlayElement.addEventListener("click", this.closeOffCanvas)
        }
        document.addEventListener("keydown", this.closeWithEsc)
        this.options.onShow?.()
        dispatchCustomEvent(this.offCanvasElement, "offcanvas-open", { offcanvasId: this.offCanvasElement.id })
    }

    private closeWithEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") { 
            event.preventDefault()
            this.closeOffCanvas()
         }
    }


    private initCloseBtns() {
        for (const closeOffCanvas of this.offCanvasCloseBtns) closeOffCanvas.addEventListener("click", this.closeOffCanvas)
    }

    private changeState = () => {
        const curState = this.offCanvasElement.getAttribute("data-state")
        curState === "open" ? this.closeOffCanvas() : this.openOffCanvas()
    }

    private initTriggers() {
        for (const triggerBtn of this.offCanvasTriggers) triggerBtn.addEventListener("click", this.changeState)
    }

    private setupOffcanvas() {
        this.initTriggers()
        this.initCloseBtns()
    }

    /**
     * Opens the offcanvas element.
     * This method will trigger the beforeShow callback if provided,
     * show the backdrop if configured, and finally trigger the onShow callback.
     * 
     * @example
     * ```ts
     * const offcanvas = new Offcanvas('#sidebar');
     * offcanvas.open();
     * ```
     */
    open() {
        this.openOffCanvas()
    }

    /**
     * Closes the offcanvas element.
     * This method will trigger the beforeHide callback if provided,
     * remove the backdrop if present, and finally trigger the onHide callback.
     * 
     * @example
     * ```ts
     * const offcanvas = new Offcanvas('#sidebar');
     * offcanvas.close();
     * ```
     */
    close() {
        this.closeOffCanvas()
    }

    /**
     * Cleans up the offcanvas instance by removing event listeners and references.
     * Call this method when the offcanvas component is no longer needed to prevent memory leaks.
     * 
     * @example
     * ```ts
     * const offcanvas = new Offcanvas('#sidebar');
     * // ... use offcanvas ...
     * offcanvas.cleanup();
     * ```
     */
    cleanup() {
        for (const triggerBtn of this.offCanvasTriggers) {
            triggerBtn.removeEventListener("click", this.changeState)
        }
        for (const closeBtn of this.offCanvasCloseBtns) {
            closeBtn.removeEventListener("click", this.closeOffCanvas)
        }
        document.removeEventListener("keydown", this.closeWithEsc)
        if (!this.allowBodyScroll) {
            document.removeEventListener("click", this.closeWhenClickOutSide)
        }
        FlexillaManager.removeInstance("offcanvas", this.offCanvasElement)
    }

    /**
     * 
     * @param selector - The selector for offcanvas elements to initialize.
     * @example
     * ```ts
     * Offcanvas.autoInit('#sidebar');
     * ```
     */
    static autoInit = (selector: string = "[data-fx-offcanvas]") => {
        const offCanvasElements = $$(selector)
        for (const offCanvasElement of offCanvasElements) new Offcanvas(offCanvasElement)
    }
    /**
     * This is an alternative to using the constructor directly.
     * @param offcanvas - The offcanvas element selector or HTMLElement
     * @param options - Configuration options for the offcanvas
     * @returns A new Offcanvas instance
     * 
     * @example
     * ```ts
     * const offcanvas = Offcanvas.init('#sidebar', {
     *   allowBodyScroll: true,
     *   staticBackdrop: false
     * });
     * ```
     */
    static init = (offcanvas: string | HTMLElement, options: OffcanvasOptions = {}) => new Offcanvas(offcanvas, options)
}

export default Offcanvas