class CustomRangeIndicator {
    private rangeContainer: HTMLElement
    private rangeElement: HTMLInputElement
    private indicatorElement: HTMLSpanElement
    private indicatorClassname: string[]

    /**
     * Create a new instance of the CustomRangeIndicator
     * @param containerElement_ {string | HTMLElement} the container element that wraps the input range
     * @param rangeIndicator {string} the class name of the
     */
    constructor(containerElement_: string | HTMLElement, rangeIndicator?: string) {
        const containerElement = typeof containerElement_ === "string" ? document.querySelector(`${containerElement_}`) : containerElement_
        if (!(containerElement instanceof HTMLElement)) throw new Error("No valide container element")

        this.rangeContainer = containerElement
        this.rangeElement = this.rangeContainer.querySelector("[data-input-range]") as HTMLInputElement

        if (!(this.rangeElement instanceof HTMLInputElement)) throw new Error("The provided element doesn't have a valid HTMLInputElement. Make sure to add data-input-range to the input element")

        this.indicatorClassname = rangeIndicator?.split(" ") || (this.rangeContainer.dataset.rangeIndicator)?.split(" ") || []
        this.indicatorElement = this.initIndicator()
        this.initRange()
        this.updateIndicatorSize()
    }

    private initIndicator() {
        const indicator = document.createElement("span")
        indicator.style.position = "absolute"
        indicator.style.pointerEvents = "none"
        if (this.indicatorClassname.length > 0) {
            indicator.classList.add(...this.indicatorClassname)
            this.rangeContainer.append(indicator)
        }
        return indicator
    }


    private updateIndicatorSize = () => {
        let size = '0%';
        const size_ =
            ((parseFloat(this.rangeElement.value) - parseFloat(this.rangeElement.min)) /
                (parseFloat(this.rangeElement.max) - parseFloat(this.rangeElement.min))) *
            100;
        if (size_ < 14 && size_ > 0) {
            size = `${size_ + 20 / 100}%`;
            console.log(size);
        } else {
            size = `${size_}%`;
        }

        this.indicatorElement.style.width = `${size}`;
    }

    private initRange() {
        this.rangeElement.addEventListener("input", this.updateIndicatorSize)
    }

    /**
     * Cleanup resources and remove event listeners
     */
    public cleanup() {
        this.rangeElement.removeEventListener("input", this.updateIndicatorSize)
    }

    static autoInit = (selector: string = "[data-fx-custom-range]") => {
        const inputRanges = Array.from(document.querySelectorAll(selector)) as HTMLInputElement[];
        for (const inputRange of inputRanges) new CustomRangeIndicator(inputRange);
    }

    /**
     * Initialize the Custom Input Range
     * @param containerElement_ {string | HTMLElement} the container element that wraps the input range
     * @param rangeIndicator {string} the class name of the
     */
    static init = (containerElement_: string | HTMLElement, rangeIndicator?: string) => new CustomRangeIndicator(containerElement_, rangeIndicator);
}

export default CustomRangeIndicator;
