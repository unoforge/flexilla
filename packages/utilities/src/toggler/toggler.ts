import { setAttributes } from "../dom-utilities";
import { $, $getEl } from "./../selector";
import type { TogglerOptions } from "./types";

/**
 * Creates a toggle functionality for DOM elements based on provided options.
 * 
 * @param {TogglerOptions} options - Configuration options for the toggler
 * @param {string | HTMLElement} options.trigger - The trigger element that controls the toggle action
 * @param {Array<{element: string | HTMLElement, attributes: {initial: Record<string, string>, to: Record<string, string>}}>} options.targets - Array of target elements and their toggle attributes
 * @param {Function} [options.onToggle] - Optional callback function called when toggle state changes
 * 
 * @example
 * ```ts
 * actionToggler({
 *   trigger: '#toggleButton',
 *   targets: [{
 *     element: '#target',
 *     attributes: {
 *       initial: { 'aria-hidden': 'true' },
 *       to: { 'aria-hidden': 'false' }
 *     }
 *   }],
 *   onToggle: ({ isExpanded }) => console.log('Toggle state:', isExpanded)
 * });
 * ```
 */
export const actionToggler = (options: TogglerOptions) => {
	const { trigger, targets, onToggle } = options;
	const triggerElement = $getEl(trigger);
	let initialStateSetled = false;

	const init = () => {
		for (const target of targets) {
			const targetElement = $getEl(target.element);
			setAttributes(targetElement, target.attributes.initial);
			initialStateSetled = true
		}
	}
	init()
	triggerElement.addEventListener("click", () => {
		for (const target of targets) {
			const targetElement = $getEl(target.element);
			const newAttributes = !initialStateSetled ? target.attributes.initial : target.attributes.to;
			setAttributes(targetElement, newAttributes);
		}

		initialStateSetled = !initialStateSetled;
		onToggle?.({ isExpanded: !initialStateSetled });
		triggerElement.ariaExpanded = initialStateSetled ? "false" : "true";
	});
};

/**
 * Creates a toggleable navbar with accessibility support and optional overlay.
 * 
 * @param {Object} params - The parameters for navbar toggle functionality
 * @param {string | HTMLElement} params.navbarElement - The navbar element to toggle
 * @param {Function} [params.onToggle] - Optional callback function called when navbar state changes
 * @description
 * Required HTML structure:
 * ```html
 * <button data-nav-trigger data-toggle-nav="navbar-id">Toggle</button>
 * <nav id="navbar-id">...</nav>
 * <div data-nav-overlay data-navbar-id="navbar-id"></div>
 * ```
 */
export const toggleNavbar = ({ navbarElement, onToggle }: { navbarElement: string | HTMLElement, onToggle?: ({ isExpanded }: { isExpanded: boolean }) => void }) => {
	const navbar = typeof navbarElement === "string" ? $(navbarElement) as HTMLElement : navbarElement;
	if (!(navbar instanceof HTMLElement)) return

	const id = navbar.getAttribute("id")
	const trigger = $(`[data-nav-trigger][data-toggle-nav=${id}]`);
	const overlayEl = $(`[data-nav-overlay][data-navbar-id=${id}]`)
	const toggleState = () => {
		const state = navbar.dataset.state || "close";
		const dataState = state === "open" ? "close" : "open"
		navbar.setAttribute("data-state", dataState);
		if (trigger) trigger.ariaExpanded = state === "open" ? "false" : "true"
		if (overlayEl) {
			overlayEl.ariaHidden = "true"
			overlayEl.setAttribute("data-state", dataState)
		}
		onToggle?.({ isExpanded: dataState === "open" })
	}
	if (trigger) trigger.addEventListener("click", toggleState);
	const closeNavbar = () => {
		navbar.setAttribute("data-state", "close");
		trigger?.setAttribute("aria-expanded", "false");
		if (overlayEl) {
			overlayEl.setAttribute("data-state", "close")
		}
		onToggle?.({ isExpanded: false })
	}
	navbar.addEventListener("click", closeNavbar);
	if (overlayEl instanceof HTMLElement && !overlayEl.hasAttribute("data-static-overlay")) {
		overlayEl.addEventListener("click", closeNavbar)
	}

	const cleanup = () => {
		if (overlayEl instanceof HTMLElement && !overlayEl.hasAttribute("data-static-overlay")) {
			navbar.removeEventListener("click", closeNavbar);
			if (trigger) trigger.removeEventListener("click", toggleState);
			overlayEl.removeEventListener("click", closeNavbar)
		}
	}

	return {
		cleanup,
		close: closeNavbar,
		toggle: toggleState
	}
}