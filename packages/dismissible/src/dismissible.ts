import { afterTransition, $, $$ } from "@flexilla/utilities"
import { FlexillaManager } from "@flexilla/manager"

class Dismissible {
    private dismissibleElement: HTMLElement
    private dismissButtons: HTMLElement[]
    private restoreButtons: HTMLElement[]
    private action: "remove-from-dom" | "hide-from-screen"
    private onDismiss: (() => void) | undefined
    private onRestore: (() => void) | undefined
    private parentElement: HTMLElement | null // Store parent for DOM restoration
    private previousSibling: Node | null // Store sibling for precise restoration
    private originalDisplay: string // Store original display style

    /**
     * Dismissible Component
     * @param dismissible 
     * @param action 
     * @param onDismiss 
     * @param onRestore 
     */
    constructor(
        dismissible: string | HTMLElement,
        action?: "remove-from-dom" | "hide-from-screen",
        onDismiss?: () => void,
        onRestore?: () => void
    ) {
        const dismissibleElement = typeof dismissible === "string" ? $(dismissible, document.body) : dismissible
        if (!(dismissibleElement instanceof HTMLElement)) throw new Error("Provided Element not a valid HTMLElement")
        this.dismissibleElement = dismissibleElement
        this.action = action || (this.dismissibleElement.dataset.action as "remove-from-dom" | "hide-from-screen") || "hide-from-screen"
        this.dismissButtons = $$("[data-dismiss-btn]", this.dismissibleElement)
        this.restoreButtons = $$("[data-restore-btn]", document.body) // Restore buttons can be anywhere
        this.onDismiss = onDismiss
        this.onRestore = onRestore
        this.parentElement = this.dismissibleElement.parentElement
        this.previousSibling = this.dismissibleElement.previousSibling
        this.originalDisplay = this.dismissibleElement.style.display || getComputedStyle(this.dismissibleElement).display
        this.dismissibleElement.setAttribute("aria-hidden", "false")

        const existingInstance = FlexillaManager.getInstance('dismissible', this.dismissibleElement)
        if (existingInstance) {
            return existingInstance
        }
        this.setupDismissible()
        FlexillaManager.register('dismissible', this.dismissibleElement, this)
    }

    private hideFromScreen = () => {
        this.dismissibleElement.style.display = "none"
        this.onDismiss?.()
    }

    private removeFromDom = () => {
        this.onDismiss?.()
        this.dismissibleElement.parentElement?.removeChild(this.dismissibleElement)
    }

    private showOnScreen = () => {
        this.dismissibleElement.style.display = this.originalDisplay
        this.dismissibleElement.setAttribute("aria-hidden", "false")
        this.dismissibleElement.setAttribute("data-state", "visible")
        this.onRestore?.()
    }

    private restoreToDom = () => {
        if (this.parentElement) {
            if (this.previousSibling && this.previousSibling.nextSibling) {
                this.parentElement.insertBefore(this.dismissibleElement, this.previousSibling.nextSibling)
            } else {
                this.parentElement.appendChild(this.dismissibleElement)
            }
            this.dismissibleElement.setAttribute("aria-hidden", "false")
            this.dismissibleElement.removeAttribute("data-hidden")
            this.dismissibleElement.setAttribute("data-state", "visible")
            this.onRestore?.()
        }
    }

    dismiss = () => {
        switch (this.action) {
            case "hide-from-screen":
                this.dismissibleElement.setAttribute("aria-hidden", "true")
                this.dismissibleElement.setAttribute("data-state", "hidden")
                afterTransition({
                    element: this.dismissibleElement,
                    callback: this.hideFromScreen
                })
                break
            default:
                this.dismissibleElement.setAttribute("data-hidden", "")
                this.dismissibleElement.setAttribute("aria-hidden", "true")
                this.dismissibleElement.setAttribute("data-state", "removed")
                afterTransition({
                    element: this.dismissibleElement,
                    callback: this.removeFromDom
                })
                break
        }
    }

    restore = () => {
        switch (this.action) {
            case "hide-from-screen":
                afterTransition({
                    element: this.dismissibleElement,
                    callback: this.showOnScreen
                })
                break
            default:
                afterTransition({
                    element: this.dismissibleElement,
                    callback: this.restoreToDom
                })
                break
        }
    }

    private setupDismissible() {
        for (const dismissButton of this.dismissButtons) {
            dismissButton.addEventListener("click", this.dismiss)
        }
        for (const restoreButton of this.restoreButtons) {
            restoreButton.addEventListener("click", this.restore)
        }
    }

    /**
     * Cleanup method to remove event listeners
     */
    cleanup() {
        for (const dismissButton of this.dismissButtons) {
            dismissButton.removeEventListener("click", this.dismiss)
        }
        for (const restoreButton of this.restoreButtons) {
            restoreButton.removeEventListener("click", this.restore)
        }
        FlexillaManager.removeInstance('dismissible', this.dismissibleElement)
    }

    public static autoInit = (selector = "[data-fx-dismissible]") => {
        const dismissibleEls = $$(selector)
        for (const dismissible of dismissibleEls) new Dismissible(dismissible)
    }

    /**
     * 
     * @param dismissible 
     * @param action 
     * @param onDismiss 
     * @param onRestore 
     * @returns 
     */
    static init = (
        dismissible: string | HTMLElement,
        action?: "remove-from-dom" | "hide-from-screen",
        onDismiss?: () => void,
        onRestore?: () => void
    ) => new Dismissible(dismissible, action, onDismiss, onRestore)
}

export default Dismissible