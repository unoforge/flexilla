
import { ModalContentAnimations, ModalOptions } from "./types";
import { setBodyScrollable, toggleModalState } from "./helpers";
import { $, $$, afterAnimation, dispatchCustomEvent, waitForFxComponents } from "@flexilla/utilities";
import { FlexillaManager } from "@flexilla/manager"
import { buildOverlay, destroyOverlay } from "./modalOverlay";
import { domTeleporter } from "@flexilla/utilities"



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
    private modalElement: HTMLDialogElement
    private modalId!: string
    private modalContent!: HTMLElement
    private triggerButtons: HTMLElement[] = [] // Changed from single trigger to array
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
    private teleporter!: {
        append: () => void;
        remove: () => void;
        restore: () => void;
    }

    /**
     * Creates a new Modal instance
     * @param modal - The modal element or selector string to initialize
     * @param options - Configuration options for the modal behavior
     * @param triggerElements - Optional trigger elements or selectors that open the modal
     */
    constructor(modal: string | HTMLDialogElement, options: ModalOptions = {}, triggerElements?: string | HTMLElement | (string)[]) {
        const modalElement = typeof modal === "string" ? $(modal) : modal
        if (!(modalElement instanceof HTMLDialogElement)) throw new Error("Modal element not found or invalid. Please provide a valid HTMLDialogElement or selector.")

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
        FlexillaManager.setup(this.modalElement)
        this.modalContent = modalContent
        const modalId = modalElement.dataset.modalId;
        this.modalId = `${modalId}`

        this.teleporter = domTeleporter(this.modalElement, document.body, "move")


        // Handle multiple triggers
        this.initializeTriggers(triggerElements, modalId);

        this.dispatchEventToDocument = this.options.dispatchEventToDocument || true

        this.initModal(this.modalElement, this.options)
        if (this.state === "open") {
            this.initAsOpen = true
            this.showModal()
        } else {
            this.initAsOpen = false
            this.modalElement.blur()
            this.modalContent.setAttribute("data-state", 'close');
            this.modalElement.setAttribute("aria-hidden", "true");
            this.modalElement.setAttribute("data-state", "close");
        }

        this.moveElOnInit()
        FlexillaManager.register('modal', this.modalElement, this)
        FlexillaManager.initialized(this.modalElement)
    }

    private moveElOnInit = () => {
        waitForFxComponents(() => {
            this.teleporter.append()
        })
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
                toggleModalState(shownModal as HTMLDialogElement, modalContent_, "close");
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

    private initModal = (modalElement: HTMLDialogElement, options: ModalOptions) => {
        if (!(modalElement instanceof HTMLDialogElement)) throw new Error("Modal Element must be a valid HTMLDialog Element");

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

        if (this.overlayElement) this.overlayElement.setAttribute("data-state", "close")
        this.addEvents()
    };

    private closeModalOnX = (e: MouseEvent) => {
        e.preventDefault()
        this.hideModal()
    }

    private initializeTriggers(triggerElements?: string | HTMLElement | string[], modalId?: string) {
        if (!triggerElements && modalId) {
            // Look for default triggers if none provided
            const defaultTriggers = $$(`[data-modal-target='${modalId}'], [data-modal-trigger][data-modal-id='${modalId}']`);
            this.triggerButtons = defaultTriggers as HTMLElement[];
            return;
        }

        if (!triggerElements) return;


        const triggers = Array.isArray(triggerElements) ? triggerElements : [triggerElements];

        this.triggerButtons = triggers.map(trigger => {
            if (typeof trigger === "string") {
                const element = $(trigger);
                if (!(element instanceof HTMLElement)) {
                    throw new Error(`Trigger element not found: ${trigger}`);
                }
                return element;
            }
            if (!(trigger instanceof HTMLElement)) {
                throw new Error("Invalid trigger element provided");
            }
            return trigger;
        });
    }

    private addEvents = () => {
        for (const triggerButton of this.triggerButtons) {
            triggerButton.addEventListener("click", this.showModal);
        }

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

        this.modalContent.focus();
        if (!this.preventCloseModal) this.overlayElement.addEventListener("click", this.hideModal)
        this.options.onShow?.()
        this.options.onToggle?.({ isHidden: false })
        this.modalElement.showModal()
    }


    private closeModal = () => {
        this.modalElement.setAttribute("aria-hidden", "true");
        this.modalElement.setAttribute("data-state", "close");
        this.modalElement.blur();
        setBodyScrollable(this.enableStackedModals || false, this.allowBodyScroll || false, this.modalElement)
        if (!this.hasDefaultOverlay) destroyOverlay(this.overlayElement)
        dispatchCustomEvent(this.modalElement, "modal-close", { modalId: this.modalElement.id })
    }
    private closeLastAction = () => {
        if (this.isKeyDownEventRegistered) {
            document.removeEventListener("keydown", this.closeModalEsc);
            this.isKeyDownEventRegistered = false;
        }
        this.modalElement.blur()
        this.options.onHide?.()
        this.options.onToggle?.({ isHidden: true })
    }
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
                this.closeModal()
                this.closeLastAction()
                if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                this.modalElement.close('modal-closed')
            }
        })
    }
    /**
     * Cleanup modal Instance
    */
    cleanup = () => {
        // Remove event listeners from all trigger buttons
        for (const triggerButton of this.triggerButtons) {
            triggerButton.removeEventListener("click", this.showModal);
        }

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

    setOptions = ({ state, allowBodyscroll }: { state?: "open" | "close", allowBodyscroll?: boolean }) => {
        if (state) {
            this.state = state
        }
        if (allowBodyscroll !== undefined) this.allowBodyScroll = allowBodyscroll
        if (this.state === "open") this.showModal()
        else if (this.state === "close") this.hideModal()
    }
    /**
     * Automatically initializes all modal elements matching the provided selector
     */
    public static autoInit = (selector: string = "[data-fx-modal]"): void => {
        const modals = $$(selector)
        for (const modal of modals) new Modal(modal as HTMLDialogElement)
    }
    /**
     * Creates and initializes a new Modal instance
     */
    static init = (modal: string | HTMLDialogElement, options: ModalOptions = {}, triggerElements?: string | HTMLElement | string[]): Modal => new Modal(modal, options, triggerElements)
}

export default Modal
