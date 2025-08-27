import { FlexillaManager } from "@flexilla/manager"


export type PinInputOptions = {
    validation?: RegExp;
};

class PinInput {
    private el: HTMLElement;
    private validation: RegExp;
    private listeners: {
        input: HTMLInputElement;
        onInput: (e: Event) => void;
        onKeydown: (e: KeyboardEvent) => void;
        onPaste: (e: ClipboardEvent) => void;
        onFocus: (e: FocusEvent) => void;
    }[] = [];

    private _value: string = "";
    private _isComplete: boolean = false;
    private changeCallbacks: ((val: string) => void)[] = [];

    constructor(el: string | HTMLElement, options: PinInputOptions = {}) {
        const element = typeof el === "string" ? document.querySelector(`${el}`) : el
        if (!(element instanceof HTMLElement)) throw new Error("No valide wrapper")

        this.el = element;
        this.validation = options.validation ?? /.*/;

        const existingInstance = FlexillaManager.getInstance('pin-input', this.el);
        if (existingInstance) {
            return existingInstance;
        }

        this.setup();
        FlexillaManager.register('pin-input', this.el, this)
    }

    private get inputs(): NodeListOf<HTMLInputElement> {
        return this.el.querySelectorAll<HTMLInputElement>("[data-pin-input]");
    }

    private setup() {
        for (const [index, input] of Array.from(this.inputs).entries()) {
            const onInput = (e: Event) => this.handleInput(e as InputEvent, index);
            const onKeydown = (e: KeyboardEvent) => {
                if (e.key === "Backspace") this.handleBackspace(e, index);
                else this.handleKeydown(e, index);
            };
            const onPaste = (e: ClipboardEvent) => this.handlePaste(e);
            const onFocus = (e: FocusEvent) => this.handleFocus(e, index);

            input.addEventListener("input", onInput);
            input.addEventListener("keydown", onKeydown);
            input.addEventListener("paste", onPaste);
            input.addEventListener("focus", onFocus);

            this.listeners.push({ input, onInput, onKeydown, onPaste, onFocus });
        }
    }

    private validateInputsLength() {
        this._isComplete = Array.from(this.inputs).every(
            (i) => i.value.trim() !== ""
        );
    }

    private updateValue() {
        this._value = Array.from(this.inputs).map((i) => i.value).join("");
        this.validateInputsLength();

        this.changeCallbacks.forEach((cb) => cb(this._value));
    }

    private handleInput(e: InputEvent, index: number) {
        this.updateValue();
        const target = e.target as HTMLInputElement;

        if (target.value !== "") {
            const next = this.inputs[index + 1];
            if (next) this.focusEnd(next);
        }
    }

    private focusEnd(input: HTMLInputElement) {
        input.focus();
        requestAnimationFrame(() => input.select());
    }

    private handlePaste(e: ClipboardEvent) {
        e.preventDefault();
        const paste = e.clipboardData
            ?.getData("text")
            .slice(0, this.inputs.length);

        if (!paste) return;

        let j = 0;
        for (let i = 0; i < paste.length; i++) {
            const char = paste[i];
            const input = this.inputs[j];
            if (input && this.validation.test(char)) {
                input.value = char;
                j++;
            }
        }
        this.updateValue();
    }

    private handleBackspace(e: KeyboardEvent, index: number) {
        const target = e.target as HTMLInputElement;
        if (target.value === "" && index > 0) {
            const prev = this.inputs[index - 1];
            this.focusEnd(prev);
        }
        this.updateValue();
    }

    private handleKeydown(e: KeyboardEvent, index: number) {
        if (e.key.length === 1 && !this.validation.test(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.key === "ArrowLeft" && index > 0) {
            const prev = this.inputs[index - 1];
            this.focusEnd(prev);
        } else if (
            e.key === "ArrowRight" &&
            index < this.inputs.length - 1
        ) {
            if (this.inputs[index].value.trim() !== "") {
                const next = this.inputs[index + 1];
                this.focusEnd(next);
            }
        }
    }

    private handleFocus(e: FocusEvent, index: number) {
        const firstEmptyIndex = Array.from(this.inputs).findIndex(
            (i) => i.value.trim() === ""
        );

        if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
            e.preventDefault();
            this.focusEnd(this.inputs[firstEmptyIndex]);
        }
    }

    public get value(): string {
        return this._value;
    }

    public get isComplete(): boolean {
        return this._isComplete;
    }

    public onChange(callback: (val: string) => void) {
        this.changeCallbacks.push(callback);
    }

    public cleanup() {
        for (const { input, onInput, onKeydown, onPaste, onFocus } of this.listeners) {
            input.removeEventListener("input", onInput);
            input.removeEventListener("keydown", onKeydown);
            input.removeEventListener("paste", onPaste);
            input.removeEventListener("focus", onFocus);
        }
        this.listeners = [];
        this.changeCallbacks = [];
    }

    public static init = (el: HTMLElement | string, options: PinInputOptions = {}) => new PinInput(el, options)
    public static autoInit = (selector: string = "fx-pin-input") => {
        const pinInputs = Array.from(document.querySelectorAll(selector)) as HTMLElement[]
        for (const input of pinInputs) {
            new PinInput(input)
        }
    }
}

export default PinInput