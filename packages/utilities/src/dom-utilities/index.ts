
/**
 * Inserts a new HTML element before an existing element in the DOM.
 * @param {Object} params - The parameters object
 * @param {HTMLElement} params.newElement - The new element to insert
 * @param {HTMLElement} params.existingElement - The reference element before which to insert
 * @throws {Error} If either parameter is not a valid HTML element
 * @throws {Error} If the existing element has no parent element
 * @example
 * const newDiv = document.createElement('div');
 * const existingDiv = document.getElementById('existing');
 * appendBefore({ newElement: newDiv, existingElement: existingDiv });
 */
export const appendBefore = ({
	newElement,
	existingElement,
}: { newElement: HTMLElement; existingElement: HTMLElement }) => {
	if (
		!(newElement instanceof HTMLElement) ||
		!(existingElement instanceof HTMLElement)
	)
		throw new Error("Both parameters must be valid HTML elements.");
	const parentElement = existingElement.parentElement;
	if (parentElement) parentElement.insertBefore(newElement, existingElement);
	else throw new Error("Existing element must have a parent element.");
};

/**
 * Sets multiple attributes on an HTML element.
 * @param {HTMLElement} element - The target HTML element
 * @param {Record<string, string>} attributes - An object containing attribute key-value pairs
 * @example
 * const div = document.createElement('div');
 * setAttributes(div, { id: 'myDiv', class: 'my-class', 'data-test': 'value' });
 */
export const setAttributes = (
	element: HTMLElement,
	attributes: Record<string, string>,
) => {
	for (const [key, value] of Object.entries(attributes))
		element.setAttribute(key, value);
};

/**
 * Internal helper function to handle both animation and transition end events.
 * @private
 * @param {Object} params - The parameters object
 * @param {'animation' | 'transition'} params.type - The type of event to handle
 * @param {HTMLElement} params.element - The target HTML element
 * @param {Function} params.callback - The callback to execute after the animation/transition
 * @param {string[]} params.keysCheck - Array of computed style values to check against
 */
const afterAnimationOrTransition = ({
	element,
	callback,
	type,
	keysCheck
}: {
	type: "animation" | "transition"
	element: HTMLElement;
	callback: () => void;
	keysCheck: string[]
}) => {
	const computedStyle = getComputedStyle(element)
	const elementTransition = type === "transition" ? computedStyle.transition : computedStyle.animation;
	if (
		elementTransition !== "none" &&
		elementTransition !== "" &&
		!keysCheck.includes(elementTransition)
	) {
		const eventName = type === "transition" ? "transitionend" : "animationend"
		const handleEvent = () => {
            element.removeEventListener(eventName, handleEvent);
            callback();
        };
		element.addEventListener(eventName, handleEvent, { once: true });
	} else {
		callback();
	}
};

/**
 * Executes a callback after a CSS transition has completed on an element.
 * If no transition is present or the transition is invalid, the callback executes immediately.
 * @param {Object} params - The parameters object
 * @param {HTMLElement} params.element - The target HTML element
 * @param {Function} params.callback - The function to execute after the transition
 * @example
 * const div = document.getElementById('animated-div');
 * afterTransition({
 *   element: div,
 *   callback: () => console.log('Transition completed')
 * });
 */
export const afterTransition = ({
	element,
	callback,
}: {
	element: HTMLElement;
	callback: () => void;
}) => {
	afterAnimationOrTransition({
		element,
		callback,
		type: "transition",
		keysCheck: ["all 0s ease 0s", "all"]
	})
};

/**
 * Executes a callback after a CSS animation has completed on an element.
 * If no animation is present or the animation is invalid, the callback executes immediately.
 * @param {Object} params - The parameters object
 * @param {HTMLElement} params.element - The target HTML element
 * @param {Function} params.callback - The function to execute after the animation
 * @example
 * const div = document.getElementById('animated-div');
 * afterAnimation({
 *   element: div,
 *   callback: () => console.log('Animation completed')
 * });
 */
export const afterAnimation = ({ element, callback, }: { element: HTMLElement; callback: () => void; }) => {
	afterAnimationOrTransition({
		element,
		callback,
		type: "animation",
		keysCheck: ["none 0s ease 0s 1 normal none running"]
	})
};

/**
 * Dispatches a custom event with a typed detail object on a specified element.
 * @template T
 * @param {HTMLElement} element - The target HTML element
 * @param {string} eventName - The name of the custom event
 * @param {T} detail - The detail object to be included in the custom event
 * @example
 * const div = document.getElementById('my-div');
 * dispatchCustomEvent(div, 'my-event', { data: 'example' });
 */
export const dispatchCustomEvent = <T extends object>(element: HTMLElement, eventName: string, detail: T): void => {
	const customEvent = new CustomEvent<T>(eventName, { detail });
	element.dispatchEvent(customEvent);
}