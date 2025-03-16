import { $$ } from "./../selector";
import { $getEl } from "./../selector";
import { KeyDirAccessibilityOptions } from "./types";


/**
 * Implements keyboard navigation for a container element and its focusable children.
 * This utility enables arrow key navigation, home/end support, and circular navigation
 * through focusable elements within a specified container.
 *
 * @param {KeyDirAccessibilityOptions} options - Configuration options for keyboard navigation
 * @param {HTMLElement | string} options.containerElement - The container element or its selector
 * @param {string | HTMLElement[]} [options.targetChildren='a:not([disabled]), button:not([disabled])'] - Focusable children elements or selector
 * @param {"up-down" | "left-right" | "all"} options.direction - Navigation direction mode
 *
 * @returns {{make: () => void, destroy: () => void}} An object containing methods to initialize and cleanup the keyboard navigation
 *
 * @example
 * // Basic usage with default settings
 * const nav = keyboardNavigation({
 *   containerElement: '.nav-container',
 *   direction: 'all'
 * });
 * nav.make();
 *
 * @example
 * // Custom configuration with specific child elements
 * const nav = keyboardNavigation({
 *   containerElement: document.getElementById('menu'),
 *   targetChildren: '.menu-item',
 *   direction: 'left-right'
 * });
 * nav.make();
 * 
 * // Cleanup when no longer needed
 * nav.destroy();
 */
export const keyboardNavigation = (
    { containerElement, targetChildren = "a:not([disabled]), button:not([disabled])", direction }: KeyDirAccessibilityOptions
) => {

    let hasEventListener = false
    const parentEl = $getEl(containerElement as HTMLElement) || document.body;
    const children = typeof targetChildren === "string" ? $$(targetChildren, parentEl) : targetChildren;

    const makeAccessible = (event: KeyboardEvent) => {
        event.preventDefault()
        parentEl.focus()
        if (children.length === 0) return;

        const key = event.key;
        const current = document.activeElement;
        let currentInd = children.findIndex((el: HTMLElement) => el === current);

        if (currentInd === -1) {
            if (key === "ArrowUp" || key === "ArrowLeft") {
                children[children.length - 1].focus();
            } else {
                children[0].focus();
            }
            return;
        }

        const goPrev = (index: number) => (index > 0 ? index - 1 : children.length - 1);
        const goNext = (index: number) => (index < children.length - 1 ? index + 1 : 0);

        const directionIsAllOrUpDown = direction === "all" || direction === "up-down"
        const directionIsAllOrLeftRight = direction === "all" || direction === "left-right"
        switch (key) {
            case 'ArrowDown':
                if (directionIsAllOrUpDown) {
                    event.preventDefault();
                    currentInd = goNext(currentInd);
                }
                break;
            case 'ArrowRight':
                if (directionIsAllOrLeftRight) {
                    event.preventDefault();
                    currentInd = goNext(currentInd);
                }
                break;
            case 'ArrowUp':
                if (directionIsAllOrUpDown) {
                    event.preventDefault();
                    currentInd = goPrev(currentInd);
                }
                break;
            case 'ArrowLeft':
                if (directionIsAllOrLeftRight) {
                    event.preventDefault();
                    currentInd = goPrev(currentInd);
                }
                break;
            case 'Home':
                event.preventDefault();
                currentInd = 0;
                break;
            case 'End':
                event.preventDefault();
                currentInd = children.length - 1;
                break;
            default:
                return; 
        }

        if (children[currentInd] !== current) {
            children[currentInd].focus();
        }
    };

    const make = () => {
        if (!hasEventListener) {
            document.addEventListener('keydown', makeAccessible);
            hasEventListener = true;
        }
    };

    const destroy = () => {
        if (hasEventListener) {
            document.removeEventListener('keydown', makeAccessible);
            hasEventListener = false;
        }
    };
    return {
        make,
        destroy
    };
};