export const canBeAlignedOnMiddleX = (popperWidth: number, refWidth: number, refLeft: number, windowWidth: number): boolean => {
    const spaceOnLeft = refLeft;
    const spaceOnRight = windowWidth - (refLeft + refWidth);
    return spaceOnLeft >= (popperWidth - refWidth) / 2 && spaceOnRight >= (popperWidth - refWidth) / 2;
};

export const canBeAlignedOnMiddleY = (popperHeight: number, refHeight: number, refTop: number, windowHeight: number): boolean => {
    return (popperHeight - refHeight) / 2 <= refTop &&
        refTop + popperHeight / 2 + refHeight / 2 <= windowHeight;
};

export const adjustYForTopVisibility = (
    canAdjustYToFitTop: () => boolean,
    canAdjustYToFitBottom: () => boolean,
    refTop: number, refHeight: number, popperHeight: number): number => {
    return refTop > popperHeight - refHeight ?
        (
            canAdjustYToFitBottom() ? window.innerHeight - popperHeight
                : refTop - popperHeight
        ) :
        canAdjustYToFitTop() ? 0 : refTop + refHeight;
};

export const canAdjustYToFitBottom = (refTop: number, refHeight: number, popperHeight: number, windowHeight: number): boolean => refTop <= windowHeight && popperHeight - refTop <= refHeight;

export const canAdjustYToFitTop = (refTop: number, refHeight: number, popperHeight: number, windowHeight: number): boolean => popperHeight <= windowHeight && -refTop <= refHeight;


export const adjustXForVisibility = (canAdjustXToFitRight: () => boolean, canAdjustXToFitLeft: () => boolean, refLeft: number, popperWidth: number, windowWidth: number, refWidth: number): number => {
    const spaceOnRight = windowWidth - refLeft - refWidth;
    const spaceOnLeft = refLeft - popperWidth;

    const adjustToLeft = (refLeft + refWidth - popperWidth) + (windowWidth - refLeft - refWidth)
    const adjustInViewport = spaceOnRight >= 0 ? windowWidth - popperWidth : spaceOnLeft >= 0 ? refLeft - popperWidth : refLeft  // Apply small adjustments to keep the popper within the viewport
    return canAdjustXToFitRight() ? 0 : canAdjustXToFitLeft() ? adjustToLeft : adjustInViewport
};

// Checks if popper can fit to the right of the reference element
export const canAdjustXToFitRight = (refLeft: number, windowWidth: number, popperWidth: number, refWidth:number): boolean => refLeft <= popperWidth && (windowWidth - refLeft - refWidth) >= refLeft;

// Checks if popper can fit to the left of the reference element
export const canAdjustXToFitLeft = (refLeft: number, popperWidth: number): boolean => refLeft >= popperWidth;