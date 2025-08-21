import { Dimensions, ElementType } from "./types";

/**
 * Calculates the dimensions of reference and popper elements
 * @param reference - The reference HTMLElement
 * @param popper - The popper HTMLElement
 * @throws {Error} If elements are null or undefined
 * @returns {Dimensions} The calculated dimensions
 */
export const getDimensions = ({ reference, popper }: ElementType): Dimensions => {
    if (!reference || !popper) {
        throw new Error('Reference or popper element is null or undefined');
    }
    const cache = new WeakMap<HTMLElement, DOMRect>();
    
    const getRect = (element: HTMLElement) => {
        if (!cache.has(element)) {
            cache.set(element, element.getBoundingClientRect());
        }
        return cache.get(element)!;
    };

    const popperRect = getRect(popper);
    const refRect = getRect(reference);

    return {
        popperHeight: popperRect.height,
        popperWidth: popperRect.width,
        refHeight: refRect.height,
        refWidth: refRect.width,
        refLeft: refRect.left,
        refTop: refRect.top,
        refRight: refRect.right
    };
};

