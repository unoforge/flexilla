
import { ModalOptions } from "./types";
import { initModal } from "./helpers";
import { $, $$ } from "@flexilla/utilities";

/**
 * Modal Component - A flexible and customizable modal dialog implementation
 * 
 * @example
 * ```typescript
 * // Create a new modal instance
 * const modal = new Modal('#myModal', {
 *   defaultState: 'close',
 *   animateContent: {
 *     enterAnimation: 'fadeIn 0.3s ease',
 *     exitAnimation: 'fadeOut 0.3s ease'
 *   }
 * });
 * 
 * // Show/hide the modal programmatically
 * modal.showModal();
 * modal.hideModal();
 * ```
 */
class Modal {
    private modalElement: HTMLElement
    /**
     * Shows the modal dialog
     * @returns {void}
     */
    public showModal: () => void

    /**
     * Hides the modal dialog
     * @returns {void}
     */
    public hideModal: () => void

    public cleanup: () => void

    /**
     * Checks if the modal is currently hidden
     * @returns {boolean} True if the modal is hidden, false otherwise
     */
    public isHidden: () => boolean
    private options: ModalOptions
    private state: string

    /**
     * Creates a new Modal instance
     * @param modal - The modal element or selector string to initialize
     * @param options - Configuration options for the modal behavior
     * @param triggerElement - Optional trigger element or selector that opens the modal
     * @throws {Error} When the provided modal element is invalid or cannot be found
     */
    constructor(modal: string | HTMLElement, options: ModalOptions = {}, triggerElement?: string | HTMLElement) {
        const modalElement = typeof modal === "string" ? $(modal) : modal
        if (!(modalElement instanceof HTMLElement)) throw new Error("Modal element not found or invalid. Please provide a valid HTMLElement or selector.")

        this.modalElement = modalElement
        this.options = options

        this.state = options?.defaultState || this.modalElement.dataset.state || "close"

        if (!this.modalElement.hasAttribute("data-fx-modal")) {
            this.modalElement.setAttribute("data-fx-modal", "");
        }
        const modalId = modalElement.dataset.modalId;

        const triggerButton = (typeof triggerElement === "string" ? $(triggerElement) : triggerElement) || $(`[data-modal-target='${modalId}']`);

        const { showModal, hideModal, autoInitModal, isHidden, cleanup } = initModal(modalElement, triggerButton, this.options);

        if (this.state === "open") {
            showModal()
        }
        autoInitModal()
        this.showModal = showModal
        this.hideModal = hideModal
        this.isHidden = isHidden
        this.cleanup = cleanup
    }



    /**
     * Automatically initializes all modal elements matching the provided selector
     * @param selector - CSS selector to find modal elements (defaults to "[data-fx-modal]")
     * @returns {void}
     * 
     * @example
     * ```typescript
     * // Initialize all modals with data-fx-modal attribute
     * Modal.autoInit();
     * 
     * // Initialize modals with custom selector
     * Modal.autoInit('.custom-modal');
     * ```
     */
    public static autoInit = (selector: string = "[data-fx-modal]") => {
        const modals = $$(selector)
        for (const modal of modals) new Modal(modal)
    }

    /**
     * Creates and initializes a new Modal instance
     * @param modal - The modal element or selector string
     * @param options - Configuration options for the modal
     * @param triggerElement - Optional trigger element or selector
     * @returns {Modal} A new Modal instance
     * 
     * @example
     * ```typescript
     * const modal = Modal.init('#myModal', {
     *   defaultState: 'open',
     *   allowBodyScroll: true
     * });
     * ```
     */
    static init = (modal: string | HTMLElement, options: ModalOptions = {}, triggerElement?: string | HTMLElement) => new Modal(modal, options, triggerElement)
}

export default Modal