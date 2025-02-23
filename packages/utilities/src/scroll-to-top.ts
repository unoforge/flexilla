import { $ } from "./selector";

/**
 * Initialize a scroll to top button
 * @param triggerElement {string | HTMLElement} the element that triggers the scroll to top
 * @param initFrom {number} the scroll position to show the button
 * @param target {string | HTMLElement} the target element to scroll to
 */
export const initScrollToTop = ({ triggerElement, initFrom = 300, target }: { triggerElement: string | HTMLElement, initFrom?: number, target?: string | HTMLElement }) => {
    const button = typeof triggerElement === "string" ? $(triggerElement) : triggerElement;
    const targetElement = typeof target === "string" ? $(target) : target;
    const frame = targetElement ? targetElement : window;
    if (button instanceof HTMLElement) {
        const handleScroll = () => {
            button.setAttribute("data-state", window.scrollY > initFrom ? "visible" : "hidden");
        };
        const scrollToTop = () => {
            frame.scrollTo({ top: 0, behavior: "smooth" });
        };
        frame.addEventListener("scroll", handleScroll);
        button.addEventListener("click", scrollToTop);
    }
}