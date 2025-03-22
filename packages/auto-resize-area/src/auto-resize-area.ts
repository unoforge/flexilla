import { FlexillaManager } from "@flexilla/manager"
/**
 * A class that automatically resizes a textarea element based on its content.
 * 
 * @class AutoResizableTextArea
 * @description Provides functionality to automatically adjust the height of a textarea
 * as the user types or when the window is resized. The textarea will grow or shrink
 * within the specified minimum and maximum height constraints.
 */
class AutoResizableTextArea {
    private textareaElement: HTMLTextAreaElement;
    private minHeight!: number;
    private maxHeight!: number;
    private boundAutoresize!: () => void;
    private debouncedResize!: (...args: any[]) => void;

    /**
     * Creates an instance of AutoResizableTextArea.
     * @param {string | HTMLTextAreaElement} textarea - The textarea element or a selector string to find it.
     * @param {number} [minHeight] - The minimum height in pixels (default: 20).
     * @param {number} [maxHeight] - The maximum height in pixels (default: 500).
     * @throws {Error} If the provided element is not a valid textarea or cannot be found.
     * 
     * @example
     * // Using with an element reference
     * const textarea = document.querySelector('textarea');
     * new AutoResizableTextArea(textarea);
     * 
     * // Using with a selector string
     * new AutoResizableTextArea('#my-textarea', 50, 300);
     */
    constructor(textarea: string | HTMLTextAreaElement, minHeight?: number, maxHeight?: number) {
        this.textareaElement = (typeof textarea === "string") ? document.querySelector(`${textarea}`) as HTMLTextAreaElement : textarea;
        if (!(this.textareaElement instanceof HTMLTextAreaElement)) {
            throw new Error(`Invalid textarea element: The provided ${typeof textarea === 'string' ? 'selector "' + textarea + '"' : 'element'} does not reference a valid HTMLTextAreaElement`);
        }
        // Check for existing instance
        const existingInstance = FlexillaManager.getInstance('auto-resize-area', this.textareaElement);
        if (existingInstance) {
            return existingInstance;
        }
        this.minHeight = Number(this.textareaElement.getAttribute("data-min-height")) || minHeight || 20;
        this.maxHeight = Number(this.textareaElement.getAttribute("data-max-height")) || maxHeight || 500;

        this.boundAutoresize = this.autoresizeTextarea.bind(this);
        this.debouncedResize = this.debounce(this.boundAutoresize, 100);

        this.autoresizeTextarea();
        this.textareaElement.addEventListener("input", this.boundAutoresize, false);
        window.addEventListener("resize", this.debouncedResize);
        FlexillaManager.register('auto-resize-area', this.textareaElement, this);

    }

    /**
     * Adjusts the height of the textarea based on its content.
     * @private
     */
    private autoresizeTextarea(): void {
        this.textareaElement.style.height = "auto";
        this.textareaElement.style.height = `${this.textareaElement.scrollHeight}px`;

        const newHeight = Math.min(
            Math.max(this.textareaElement.scrollHeight, this.minHeight),
            this.maxHeight
        );

        this.textareaElement.style.height = `${newHeight}px`;
    }


    private debounce(func: Function, wait: number) {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Automatically initializes auto-resize functionality for all matching textarea elements.
     * @static
     * @param {string} [selector='[data-fx-autoresize]'] - The CSS selector to find textarea elements.
     * 
     * @example
     * // Initialize all textareas with data-fx-autoresize attribute
     * AutoResizableTextArea.autoInit();
     * 
     * // Initialize textareas with custom selector
     * AutoResizableTextArea.autoInit('.auto-resize-textarea');
     */
    public static autoInit(selector: string = "[data-fx-autoresize]"): void {
        const textAreas = Array.from(document.querySelectorAll(selector)) as HTMLTextAreaElement[];
        if (textAreas.length > 0) {
            for (const textarea of textAreas) {
                new AutoResizableTextArea(textarea);
            }
        }
    }

    /**
     * Creates a new instance of AutoResizableTextArea for the specified textarea.
     * @static
     * @param {string | HTMLTextAreaElement} textarea - The textarea element or selector.
     * @returns {AutoResizableTextArea} A new instance of AutoResizableTextArea.
     * 
     * @example
     * // Initialize with element reference
     * const textarea = document.querySelector('textarea');
     * AutoResizableTextArea.init(textarea);
     * 
     * // Initialize with selector
     * AutoResizableTextArea.init('#my-textarea');
     */
    /**
     * Creates a new instance of AutoResizableTextArea for the specified textarea.
     * @param textarea - The textarea element or selector.
     * @returns A new instance of AutoResizableTextArea.
     */
    static init = (textarea: string | HTMLTextAreaElement): AutoResizableTextArea => new AutoResizableTextArea(textarea);

    /**
     * Removes all event listeners, resets styles, and cleans up the instance.
     * Call this method when the textarea is no longer needed to prevent memory leaks.
     * 
     * @public
     * @returns {void}
     * @example
     * ```typescript
     * const autoResize = new AutoResizableTextArea('#my-textarea');
     * // ... use the textarea ...
     * autoResize.cleanup(); // Clean up when done
     * ```
     */
    public cleanup = (): void => {
        if (!this.textareaElement) return;
        this.textareaElement.removeEventListener("input", this.boundAutoresize);
        window.removeEventListener("resize", this.debouncedResize);
        FlexillaManager.removeInstance('auto-resize-area', this.textareaElement);
        if (this.debouncedResize) {
            clearTimeout(this.debouncedResize as unknown as NodeJS.Timeout);
        }
        this.boundAutoresize = null as any;
        this.debouncedResize = null as any;
        this.textareaElement = null as any;
        this.minHeight = null as any;
        this.maxHeight = null as any;
    }
}

export default AutoResizableTextArea