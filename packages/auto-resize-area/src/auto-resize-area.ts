class AutoResizableTextArea {
    private textareaElement: HTMLTextAreaElement;
    private minHeight: number ;
    private maxHeight: number ;

    /**
     * Auto-resize Area
     * @param textarea 
     */
    constructor(textarea: string | HTMLTextAreaElement, minHeight?: number, maxHeight?: number) {
        this.textareaElement = (typeof textarea === "string") ? document.querySelector(`${textarea}`) as HTMLTextAreaElement : textarea;
        if (!(this.textareaElement instanceof HTMLTextAreaElement)) throw new Error("Provided Element is not a Valid HTMLTextAreaElement");
        this.minHeight = minHeight || 20;
        this.maxHeight = maxHeight || 500;
        // this.autoresizeTextarea();
        // this.textareaElement.addEventListener("input", this.autoresizeTextarea.bind(this), false);
        // window.addEventListener("resize", this.autoresizeTextarea.bind(this));

        this.autoresizeTextarea();
        this.textareaElement.addEventListener("input", this.autoresizeTextarea.bind(this), false);
        window.addEventListener("resize", this.debounce(this.autoresizeTextarea.bind(this), 100));
    }

    private autoresizeTextarea(): void {
        // this.textareaElement.style.height = "auto";
        // this.textareaElement.style.height = `${this.textareaElement.scrollHeight}px`;

        const computedStyle = getComputedStyle(this.textareaElement);
        const padding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        const border = parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);

        // Calculate new height and apply limits
        const newHeight = Math.min(
            Math.max(this.textareaElement.scrollHeight + padding + border, this.minHeight),
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
     * auto init the auto-resize based on the selector provided
     * @param selector {string} default is [data-fx-autoresize]
     */
    public static autoInit = (selector = "[data-fx-autoresize]") => {
        const textAreas = Array.from(document.querySelectorAll(selector)) as HTMLTextAreaElement[];
        if (textAreas.length > 0) {
            for (const textarea of textAreas) {
                new AutoResizableTextArea(textarea);
            }
        } else {
            console.warn(`No text areas found for selector: ${selector}`);
        }
    }

    static init = (textarea: string | HTMLTextAreaElement) => new AutoResizableTextArea(textarea);
}


export default AutoResizableTextArea