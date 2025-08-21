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
	const triggerElement = trigger ? $getEl(trigger) : null;

	let isInitial = true;

	const applyState = (state: "initial" | "to") => {
		for (const target of targets) {
			const targetElement = $getEl(target.element);
			setAttributes(targetElement, target.attributes[state]);
		}
		isInitial = state === "initial";
		if (triggerElement) triggerElement.ariaExpanded = isInitial ? "false" : "true"
		onToggle?.({ isExpanded: !isInitial });
	};

	applyState("initial");
	const setToggle = () => applyState(isInitial ? "to" : "initial");

	triggerElement?.addEventListener("click", setToggle);

	return {
		toInitial: () => applyState("initial"),
		toAction: () => applyState("to"),
		toggle: () => applyState(isInitial ? "to" : "initial"),
		get state() {
			return isInitial ? "initial" : "to";
		},
		destroy: () => {
			triggerElement?.removeEventListener("click", setToggle)
		}
	};
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
	let targets = [{ element: navbar, attributes: { initial: { 'data-state': 'close' }, to: { 'data-state': 'open' } } }]
	
	if (overlayEl) {
		targets = [...targets, {
			element: overlayEl,
			attributes: { initial: { 'data-state': 'close' }, to: { 'data-state': 'open' } }
		}]
	}
	const navAction = actionToggler({ trigger, targets, onToggle })

	const closeNavbar = () => {
		navAction.toInitial()
	}
	navbar.addEventListener("click", closeNavbar);
	if (overlayEl instanceof HTMLElement && !overlayEl.hasAttribute("data-static-overlay")) {
		overlayEl.addEventListener("click", closeNavbar)
	}

	const cleanup = () => {
		navbar.removeEventListener("click", closeNavbar);
		navAction.destroy()
		if (overlayEl instanceof HTMLElement && !overlayEl.hasAttribute("data-static-overlay")) {
			overlayEl.removeEventListener("click", closeNavbar)
		}
	}

	return {
		cleanup,
		close: closeNavbar,
		toggle: navAction.toggle
	}
}