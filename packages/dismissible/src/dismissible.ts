import { afterTransition, $, $$ } from "@flexilla/utilities"

class Dismissible {
    private dismissibleElement: HTMLElement
    private dismissButtons: HTMLElement[]
    private action: "remove-from-dom" | "hide-from-screen"
    private onDismiss: (() => void) | undefined

    /**
     * Dismissible Component
     * @param dismissible 
     * @param action 
     * @param onDissmiss 
     */
    constructor(dismissible: string | HTMLElement, action?: "remove-from-dom" | "hide-from-screen", onDissmiss?: () => void) {
        const dismissibleElement = typeof dismissible === "string" ? $(dismissible, document.body) : dismissible
        if (!(dismissibleElement instanceof HTMLElement)) throw new Error("Provided Element not a valid HTMLElement")
        this.dismissibleElement = dismissibleElement
        this.action = action || this.dismissibleElement.dataset.action as "remove-from-dom" | "hide-from-screen" || "hide-from-screen"
        this.dismissButtons = $$("[data-dismiss-btn]", this.dismissibleElement)
        this.onDismiss = onDissmiss
        this.dismissibleElement.setAttribute("aria-hidden", "false")
        this.setupDismissible()
    }

    private hideFromScreen = () => {
        this.dismissibleElement.style.display = "none"
        this.onDismiss?.()
    }

    private removeFromDom = () => {
        this.onDismiss?.()
        this.dismissibleElement.parentElement?.removeChild(this.dismissibleElement)
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
                break;
            default:
                this.dismissibleElement.setAttribute("data-hidden", "")
                this.dismissibleElement.setAttribute("aria-hidden", "true")
                this.dismissibleElement.setAttribute("data-state", "removed")
                afterTransition({
                    element: this.dismissibleElement,
                    callback: this.removeFromDom
                })
                break;
        }
    }

    private setupDismissible() {
        for (const dismissButton of this.dismissButtons) {
            dismissButton.addEventListener("click", this.dismiss)
        }
    }

    /**
     * Cleanup method to remove event listeners
     */
    cleanup() {
        for (const dismissButton of this.dismissButtons) {
            dismissButton.removeEventListener("click", this.dismiss)
        }
    }

    public static autoInit = (selector = "[data-fx-dismissible]") => {
        const dismissibleEls = $$(selector)
        for (const dismissible of dismissibleEls) new Dismissible(dismissible)
    }
    /**
     * 
     * @param dismissible 
     * @param action 
     * @param onDissmiss 
     * @returns 
     */
    static init = (dismissible: string | HTMLElement, action?: "remove-from-dom" | "hide-from-screen", onDissmiss?: () => void) => new Dismissible(dismissible, action, onDissmiss)
}
export default Dismissible