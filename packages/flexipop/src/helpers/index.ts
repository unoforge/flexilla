import { adjustYForTopVisibility, canAdjustYToFitTop, canAdjustYToFitBottom, adjustXForVisibility, canAdjustXToFitRight, canAdjustXToFitLeft, canBeAlignedOnMiddleX, canBeAlignedOnMiddleY } from "./alignment";


type UtilType = {
    placement: string,
    refWidth: number,
    refTop: number,
    refLeft: number,
    popperWidth: number,
    refHeight: number,
    popperHeight: number,
    windowHeight: number,
    windowWidth: number,
    offsetDistance: number
}

export const determinePosition = (
    { placement,
        refWidth,
        refTop,
        refLeft,
        refHeight,
        popperWidth,
        popperHeight,
        windowHeight,
        windowWidth,
        offsetDistance
    }: UtilType
) => {
    // Calculate available space once for efficiency
    const availableSpaceRight = windowWidth - refLeft - refWidth;
    const availableSpaceLeft = refLeft;
    const availableSpaceBottom = windowHeight - refTop - refHeight;
    const availableSpaceTop = refTop;

    const adjustContentVisibilityY = () => {

        return adjustYForTopVisibility(
            () => canAdjustYToFitTop(refTop, refHeight, popperHeight, windowHeight),
            () => canAdjustYToFitBottom(refTop, refHeight, popperHeight, windowHeight), refTop, refHeight, popperHeight)
    }

    const adjustContentVisibilityX = () => adjustXForVisibility(
        () => canAdjustXToFitRight(refLeft, windowWidth, popperWidth, refWidth),
        () => canAdjustXToFitLeft(refLeft, popperWidth),
        refLeft, popperWidth, windowWidth, refWidth
    )

    const calculateMiddleX = () => (
        canBeAlignedOnMiddleX(popperWidth, refWidth, refLeft, windowWidth) ?
            refLeft + refWidth / 2 - popperWidth / 2 : adjustContentVisibilityX() // Adjust X
    )

    const calculateMiddleY = () => {
        return (
            canBeAlignedOnMiddleY(popperHeight, refHeight, refTop, windowHeight) ?
                refTop + refHeight / 2 - popperHeight / 2 :
                adjustContentVisibilityY() // Adjust Y
        );
    }

    const calculateXStart = () => (refLeft + popperWidth <= windowWidth ? refLeft : adjustContentVisibilityX());
    const calculateXEnd = () => (refLeft + refWidth - popperWidth >= 0 ? refLeft + refWidth - popperWidth : adjustContentVisibilityX());
    const calculateYStart = () => (refTop + popperHeight <= windowHeight ? refTop : adjustContentVisibilityY());
    const calculateYEnd = () => (refTop + refHeight - popperHeight >= 0 ? refTop + refHeight - popperHeight : adjustContentVisibilityY());

    let x = 0;
    let y = 0;

    const placeTop = refTop - popperHeight - offsetDistance;
    const placeBottom = refTop + refHeight + offsetDistance;
    const placeLeft = refLeft - popperWidth - offsetDistance;
    const placeRight = refLeft + refWidth + offsetDistance;

    const canPlaceTop = availableSpaceTop >= popperHeight + offsetDistance;
    const canPlaceBottom = availableSpaceBottom >= popperHeight + offsetDistance;
    const canPlaceLeft = availableSpaceLeft >= popperWidth + offsetDistance;
    const canPlaceRight = availableSpaceRight >= popperWidth + offsetDistance;

    if (placement.startsWith("top")) {
        y = canPlaceTop ? placeTop : canPlaceBottom ? placeBottom : Math.max(placeTop, placeBottom);
    } else if (placement.startsWith("bottom")) {
        y = canPlaceBottom ? placeBottom : canPlaceTop ? placeTop : Math.max(placeBottom), placeTop;
    } else if (placement.startsWith("left")) {
        x = canPlaceLeft ? placeLeft : canPlaceRight ? placeRight : Math.max(placeLeft, placeRight);
    } else if (placement.startsWith("right")) {
        x = canPlaceRight ? placeRight : canPlaceLeft ? placeLeft : Math.max(placeRight, placeLeft);
    }

    switch (placement) {
        case "bottom":
        case "bottom-middle":
        case "top":
        case "top-middle":
            x = calculateMiddleX();
            break;
        case "left":
        case "left-middle":
        case "right":
        case "right-middle":
            y = calculateMiddleY();
            break;
        case "bottom-start":
        case "top-start":
            x = calculateXStart();
            break;
        case "bottom-end":
        case "top-end":
            x = calculateXEnd();
            break;
        case "left-start":
        case "right-start":
            y = calculateYStart();
            break;
        case "left-end":
        case "right-end":
            y = calculateYEnd();
            break;
    }
    return { x, y };
}
