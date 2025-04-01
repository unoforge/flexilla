
import { ModalContentAnimations, ModalOptions } from "./types";
import { setBodyScrollable, toggleModalState } from "./helpers";
import { $, $$, afterAnimation, dispatchCustomEvent } from "@flexilla/utilities";
import { FlexillaManager } from "@flexilla/manager"
import { buildOverlay, destroyOverlay } from "./modalOverlay";

/**
 * Modal Component - A flexible and customizable modal dialog implementation
 * @example
 * ```typescript
 * const modal = new Modal('#myModal');
 * // Show/hide the modal programmatically
 * modal.showModal();
 * modal.hideModal();
 * ```
 */
class Modal {
    private modalElement: HTMLElement
    private modalId!: string
    private modalContent!: HTMLElement
    private triggerButton?: HTMLElement | null
    private overlayElement!: HTMLElement | null
    private dispatchEventToDocument!: boolean
    private options: ModalOptions
    private state: string
    private animationEnter?: string
    private animationExit?: string
    private animateContent?: ModalContentAnimations
    private hasDefaultOverlay?: boolean
    private enableStackedModals?: boolean
    private preventCloseModal?: boolean
    private isKeyDownEventRegistered?: boolean
    private closeButtons!: HTMLButtonElement[]
    private overlayClassName!: string[] | ""
    private allowBodyScroll?: boolean
    private initAsOpen?: boolean

    /**
     * Creates a new Modal instance
     * @param modal - The modal element or selector string to initialize
     * @param options - Configuration options for the modal behavior
     * @param triggerElement - Optional trigger element or selector that opens the modal
     */
    constructor(modal: string | HTMLElement, options: ModalOptions = {}, triggerElement?: string | HTMLElement) {
        const modalElement = typeof modal === "string" ? $(modal) : modal
        if (!(modalElement instanceof HTMLElement)) throw new Error("Modal element not found or invalid. Please provide a valid HTMLElement or selector.")

        this.modalElement = modalElement
        this.options = options

        this.state = options?.defaultState || this.modalElement.dataset.state || "close"

        const existingInstance = FlexillaManager.getInstance('modal', this.modalElement);
        if (existingInstance) {
            return existingInstance;
        }
        if (!this.modalElement.hasAttribute("data-fx-modal")) {
            this.modalElement.setAttribute("data-fx-modal", "");
        }

        const modalContent = $("[data-modal-content]", modalElement);
        if (!(modalContent instanceof HTMLElement)) {
            throw new Error("Modal content element not found or invalid. Please provide a valid HTMLElement or selector.")
        }
        this.modalContent = modalContent
        const modalId = modalElement.dataset.modalId;
        this.modalId = `${modalId}`

        const triggerButton = (typeof triggerElement === "string" ? $(triggerElement) : triggerElement) || $(`[data-modal-target='${modalId}']`);
        this.triggerButton = triggerButton

        this.initModal(this.modalElement, this.options)
        this.addEvents()
        if (this.state === "open") {
            this.initAsOpen = true
            this.showModal()
        } else this.initAsOpen = false
        this.dispatchEventToDocument = this.options.dispatchEventToDocument || true
        FlexillaManager.register('modal', this.modalElement, this)
    }

    private closeAll = (currentModal: HTMLElement) => {
        if (this.enableStackedModals) return
        const shownModalElements = $$("[data-fx-modal][data-state=open]")
        for (const shownModal of shownModalElements) {
            const showId = shownModal.dataset.modalId
            if (showId !== currentModal.dataset.modalId) {
                shownModal.blur()
                const modalOverlay = $("[data-modal-overlay]", shownModal) as HTMLElement
                modalOverlay.setAttribute("data-state", "close")
                const modalContent_ = $("[data-modal-content]", shownModal)
                toggleModalState(shownModal, modalContent_, "close");
                document.dispatchEvent(new CustomEvent(`modal:${showId}:close`))
            }
        }
    }

    private closeModalEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault()
            if (!this.preventCloseModal) {
                this.hideModal();
            }
        }
    };

    private initModal = (modalElement: HTMLElement, options: ModalOptions) => {
        if (!(modalElement instanceof HTMLElement)) throw new Error("Modal Element must be a valid element");
        const { allowBodyScroll, animateContent, preventCloseModal, overlayClass, enableStackedModals } = options;
        this.allowBodyScroll = (modalElement.hasAttribute("data-allow-body-scroll") && modalElement.getAttribute("data-allow-body-scroll") !== "false") || allowBodyScroll || false
        this.preventCloseModal = modalElement.hasAttribute("data-prevent-close-modal") && modalElement.getAttribute("data-prevent-close-modal") !== "false" || preventCloseModal || false
        this.enableStackedModals = (modalElement.hasAttribute("data-enable-stacked") && modalElement.getAttribute("data-enable-stacked") !== "false") || enableStackedModals || false
        this.overlayClassName = modalElement.dataset.modalOverlay?.split(" ") || overlayClass?.split(" ") || "";
        this.isKeyDownEventRegistered = false;
        modalElement.setAttribute("data-allow-body-scroll", `${this.allowBodyScroll}`)
        this.closeButtons = $$("[data-close-modal]", modalElement) as HTMLButtonElement[];
        this.hasDefaultOverlay = false
        if ($("[data-modal-overlay]", modalElement) instanceof HTMLElement) {
            this.overlayElement = $("[data-modal-overlay]", modalElement) as HTMLElement
            this.overlayElement.setAttribute("data-overlay-nature", "default")
            this.hasDefaultOverlay = true
        }
        this.animateContent = animateContent
        this.animationEnter = this.modalContent.dataset.enterAnimation || "";
        this.animationExit = this.modalContent.dataset.exitAnimation || "";
        this.modalContent.setAttribute("data-state", 'close');
    };

    private closeModalOnX = (e: MouseEvent) => {
        e.preventDefault()
        this.hideModal()
    }

    private addEvents = () => {
        if (this.triggerButton instanceof HTMLElement) this.triggerButton.addEventListener("click", this.showModal);
        if (this.closeButtons.length > 0) {
            for (const closeButton of this.closeButtons) {
                closeButton.addEventListener("click", this.closeModalOnX);
            }
        }
        if (this.dispatchEventToDocument) document.addEventListener(`modal:${this.modalId}:open`, this.showModal);
        if (this.dispatchEventToDocument) document.addEventListener(`modal:${this.modalId}:close`, this.hideModal);
    }

    /**
     * Show the modal
     */
    showModal = () => {
        const isOpened = !this.initAsOpen && this.modalElement.getAttribute("data-state") === "open"
        if (isOpened) return

        this.initAsOpen = false
        this.closeAll(this.modalElement)
        this.overlayElement = !this.hasDefaultOverlay ? buildOverlay({
            modalContent: this.modalContent,
            overlayClassName: this.overlayClassName,
        }) : (this.overlayElement as HTMLElement)

        this.overlayElement?.setAttribute("data-state", "open")
        dispatchCustomEvent(this.modalElement, "modal-open", { modalId: this.modalId })
        if (this.animateContent || this.animationEnter !== "") {
            const contentAnimation = this.animateContent ? this.animateContent.enterAnimation : this.animationEnter;
            if (contentAnimation && contentAnimation !== '') {
                this.modalContent.style.setProperty("--un-modal-animation", contentAnimation);
            }
            toggleModalState(this.modalElement, this.modalContent, "open");
            afterAnimation({
                element: this.modalContent,
                callback: () => {
                    this.modalContent.style.removeProperty("--un-modal-animation")
                }
            })
        } else {
            toggleModalState(this.modalElement, this.modalContent, "open");
        }

        if (!this.allowBodyScroll) document.body.style.overflow = "hidden";
        if (!this.isKeyDownEventRegistered) {
            document.addEventListener("keydown", this.closeModalEsc);
            this.isKeyDownEventRegistered = true;
        }

        this.modalElement.focus();

        if (!this.preventCloseModal) this.overlayElement.addEventListener("click", this.hideModal)
        this.options.onShow?.()
        this.options.onToggle?.({ isHidden: false })
    }
    /**
     * Hide the modal
     */
    hideModal = () => {
        let exitAction = false
        dispatchCustomEvent(this.modalElement, "before-hide", {
            modalId: this.modalId,
            setExitAction: (value: boolean) => {
                exitAction = value
            }
        })
        const exitFromBeforeHide = this.options.beforeHide?.()?.cancelAction

        if (exitAction || exitFromBeforeHide) return

        const closeModal = () => {
            toggleModalState(this.modalElement, this.modalContent, "close");
            setBodyScrollable(this.enableStackedModals || false, this.allowBodyScroll || false, this.modalElement)
            if (!this.hasDefaultOverlay) destroyOverlay(this.overlayElement)
            dispatchCustomEvent(this.modalElement, "modal-close", { modalId: this.modalElement.id })
        }
        const closeLastAction = () => {
            if (this.isKeyDownEventRegistered) {
                document.removeEventListener("keydown", this.closeModalEsc);
                this.isKeyDownEventRegistered = false;
            }
            this.modalElement.blur();
            this.options.onHide?.()
            this.options.onToggle?.({ isHidden: true })
        }
        const hasExitAnimation = (this.animateContent?.exitAnimation && this.animateContent.exitAnimation !== "") || (this.animationExit && this.animationExit !== "")
        this.overlayElement?.setAttribute("data-state", "close")
        this.modalContent.setAttribute("data-state", "close");
        if (hasExitAnimation) {
            const exitAnimation_ = this.animationExit ? this.animationExit : this.animateContent ? this.animateContent.exitAnimation || "" : "";
            this.modalContent.style.setProperty("--un-modal-animation", exitAnimation_);
        }

        afterAnimation({
            element: this.modalContent,
            callback: () => {
                if (hasExitAnimation) this.modalContent.style.removeProperty("--un-modal-animation");
                closeModal()
                closeLastAction()
            }
        })
    }
    /**
     * Cleanup modal Instance
    */
    cleanup = () => {
        if (this.triggerButton instanceof HTMLElement) this.triggerButton.removeEventListener("click", this.showModal);
        if (this.closeButtons.length > 0) {
            for (const closeButton of this.closeButtons) {
                closeButton.removeEventListener("click", this.closeModalOnX);
            }
        }
        if (!this.preventCloseModal && this.overlayElement instanceof HTMLElement) {
            this.overlayElement.removeEventListener("click", this.hideModal);
        }
        if (this.dispatchEventToDocument) document.removeEventListener(`modal:${this.modalId}:open`, this.showModal);
        if (this.dispatchEventToDocument) document.removeEventListener(`modal:${this.modalId}:close`, this.hideModal);
        FlexillaManager.removeInstance("modal", this.modalElement)
    }
    /**
     * Automatically initializes all modal elements matching the provided selector
     */
    public static autoInit = (selector: string = "[data-fx-modal]"): void => {
        const modals = $$(selector)
        for (const modal of modals) new Modal(modal)
    }
    /**
     * Creates and initializes a new Modal instance
     */
    static init = (modal: string | HTMLElement, options: ModalOptions = {}, triggerElement?: string | HTMLElement): Modal => new Modal(modal, options, triggerElement)
}

export default Modal