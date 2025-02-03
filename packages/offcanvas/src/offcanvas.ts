
import type { OffcanvasOptions } from "./types"
import { closeAllOpenedOffcanvas, toggleOffCanvasState } from "./helpers"
import { appendBefore, $$, $ } from "@flexilla/utilities"
import { createOverlay, destroyOverlay } from "./offCanvasOverlay"

/**
 * Class representing an Offcanvas element.
 */
class Offcanvas {
    private offCanvasElement: HTMLElement
    private offCanvasTriggers: HTMLElement[]
    private offCanvasCloseBtns: HTMLElement[]
    private allowBodyScroll: boolean
    private staticBackdrop: boolean
    private backdrop: string
    private options: OffcanvasOptions

    /**
     * Offcanvas Component
     * @param offcanvas 
     * @param options 
     */
    constructor(offcanvas: string | HTMLElement, options: OffcanvasOptions = {}) {

        const offCanvasElement = typeof offcanvas === "string" ? $(offcanvas) : offcanvas
        if (!(offCanvasElement instanceof HTMLElement)) throw new Error("Invalid Offcanvas, the provided Element is not a valid HTMLElement")
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
    }

    private findOffCanvasElements(selector: string, hasChildren: boolean, offCanvasId: string | null, parent?: HTMLElement) {
        return hasChildren ? $$(`${selector}`, parent) : $$(`${selector}[data-target=${offCanvasId}]`);
    }
    private setupAttributes() {
        if (!this.offCanvasElement.hasAttribute("data-fx-offcanvas"))
            this.offCanvasElement.setAttribute("data-fx-offcanvas", "")
    }

    /**
   * Close the Offcanvas when a click occurs outside of it.
   */
    private closeWhenClickOutSide(event: MouseEvent) {
        const isOpen = this.offCanvasElement.getAttribute("data-state") === "open"
        const clickOutOutside = !this.offCanvasElement.contains(event.target as Node) && ![...this.offCanvasTriggers].includes(event.target as HTMLElement)
        if (isOpen && clickOutOutside) this.closeOffCanvas()
    }

    private closeOffCanvas = () => {
        const cancelAction = this.options.beforeHide?.()?.cancelAction
        if (cancelAction) return
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
        !this.allowBodyScroll && !overlayElement && document.removeEventListener("click", (event) => this.closeWhenClickOutSide(event))
        this.options.onHide?.()
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
    }

    /**
   * Close the Offcanvas when the "Escape" key is pressed.
   */
    private closeWithEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") { this.closeOffCanvas() }
    }


    private initCloseBtns() {
        for (const closeOffCanvas of this.offCanvasCloseBtns) closeOffCanvas.addEventListener("click", () => this.closeOffCanvas())
    }

    private changeState() {
        const curState = this.offCanvasElement.getAttribute("data-state")
        curState === "open" ? this.closeOffCanvas() : this.openOffCanvas()
    }

    private initTriggers() {
        for (const triggerBtn of this.offCanvasTriggers) triggerBtn.addEventListener("click", () => this.changeState())
    }

    private setupOffcanvas() {
        this.initTriggers()
        this.initCloseBtns()
    }

    open() {
        this.openOffCanvas()
    }
    close() {
        this.closeOffCanvas()
    }

    /**
     * auto init Offcanvas based on the selector provided
     * @param selector {string} default is [data-fx-offcanvas] attribute
     */
    static autoInit = (selector: string = "[data-fx-offcanvas]") => {
        const offCanvasElements = $$(selector)
        for (const offCanvasElement of offCanvasElements) new Offcanvas(offCanvasElement)
    }

    /**
    * Offcanvas Component
    * @param offcanvas 
    * @param options 
    */
    static init = (offcanvas: string | HTMLElement, options: OffcanvasOptions = {}) => new Offcanvas(offcanvas, options)
}

export default Offcanvas