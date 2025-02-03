import { setAttributes } from "../dom-utilities";
import { $, $getEl } from "./../selector";
import type { TogglerOptions } from "./types";


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



export const toggleNavbar = ({ navbarElement, allowBoyScroll = false, onToggle }: { navbarElement: string | HTMLElement, allowBoyScroll?: boolean, onToggle?: ({ isExpanded }: { isExpanded: boolean }) => void }) => {
	const navbar = typeof navbarElement === "string" ? $(navbarElement) as HTMLElement : navbarElement;
	if (!(navbar instanceof HTMLElement)) return

	const id = navbar.getAttribute("id")
	const trigger = $(`[data-nav-trigger][data-toggle-nav=${id}]`);
	const overlayEl = $(`[data-nav-overlay][data-navbar-id=${id}]`)

	if (trigger instanceof HTMLButtonElement) {
		const toggleState = () => {
			const state = navbar.dataset.state || "close";
			const dataState = state === "open" ? "close" : "open"
			navbar.setAttribute("data-state", dataState);
			trigger.setAttribute("aria-expanded", `${state === "open" ? "false" : "true"}`);
			if (!allowBoyScroll) document.body.style.overflowY = `${state === "open" ? "auto" : "hidden"}`;
			if (overlayEl) {
				overlayEl.ariaHidden = "true"
				overlayEl.setAttribute("data-state", "open")
			}
			onToggle?.({ isExpanded: dataState === "open" })
		}
		trigger.addEventListener("click", toggleState);
		const closeNavbar = () => {
			navbar.setAttribute("data-state", "close");
			trigger.setAttribute("aria-expanded", "false");
			if (!allowBoyScroll) document.body.style.overflowY = "auto";
			if (overlayEl) {
				overlayEl.setAttribute("data-state", "close")
			}
			onToggle?.({ isExpanded: false })
		}
		navbar.addEventListener("click", closeNavbar);
		if (overlayEl instanceof HTMLElement && !overlayEl.hasAttribute("data-static-overlay")) {
			overlayEl.addEventListener("click", closeNavbar)
		}
	}
}