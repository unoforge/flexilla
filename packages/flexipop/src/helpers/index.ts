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
    minHeight?: number,
    readjustHeight?: boolean
}

type PrimaryPlacement = "top" | "bottom" | "left" | "right";
type PlacementAlignment = "start" | "middle" | "end";

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
        offsetDistance,
        readjustHeight,
        minHeight
    }: UtilType
) => {
    // Calculate available space once for efficiency
    const availableSpaceRight = windowWidth - refLeft - refWidth;
    const availableSpaceLeft = refLeft;
    const availableSpaceBottom = windowHeight - refTop - refHeight;
    const availableSpaceTop = refTop;

    const adjustContentVisibilityX = () => adjustXForVisibility(
        () => canAdjustXToFitRight(refLeft, windowWidth, popperWidth, refWidth),
        () => canAdjustXToFitLeft(refLeft, popperWidth),
        refLeft, popperWidth, windowWidth, refWidth
    )

    const calculateMiddleX = () => (
        canBeAlignedOnMiddleX(popperWidth, refWidth, refLeft, windowWidth) ?
            refLeft + refWidth / 2 - popperWidth / 2 : adjustContentVisibilityX() // Adjust X
    )

    const calculateMiddleY = (height = popperHeight) => {
        return (
            canBeAlignedOnMiddleY(height, refHeight, refTop, windowHeight) ?
                refTop + refHeight / 2 - height / 2 :
                adjustYForTopVisibility(
                    () => canAdjustYToFitTop(refTop, refHeight, height, windowHeight),
                    () => canAdjustYToFitBottom(refTop, refHeight, height, windowHeight),
                    refTop,
                    refHeight,
                    height
                )
        );
    }

    const calculateXStart = () => (refLeft + popperWidth <= windowWidth ? refLeft : adjustContentVisibilityX());
    const calculateXEnd = () => (refLeft + refWidth - popperWidth >= 0 ? refLeft + refWidth - popperWidth : adjustContentVisibilityX());
    const calculateYStart = (height = popperHeight) => (refTop + height <= windowHeight ? refTop : adjustYForTopVisibility(
        () => canAdjustYToFitTop(refTop, refHeight, height, windowHeight),
        () => canAdjustYToFitBottom(refTop, refHeight, height, windowHeight),
        refTop,
        refHeight,
        height
    ));
    const calculateYEnd = (height = popperHeight) => (refTop + refHeight - height >= 0 ? refTop + refHeight - height : adjustYForTopVisibility(
        () => canAdjustYToFitTop(refTop, refHeight, height, windowHeight),
        () => canAdjustYToFitBottom(refTop, refHeight, height, windowHeight),
        refTop,
        refHeight,
        height
    ));

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
    const primaryPlacement = placement.split("-")[0] as PrimaryPlacement;
    const alignment = (placement.split("-")[1] || "middle") as PlacementAlignment;
    let resolvedPlacement: PrimaryPlacement = primaryPlacement;
    let maxHeight: number | undefined;

    const getVerticalMaxHeight = (space: number) => {
        const adjustedHeight = Math.max(space - offsetDistance, 0);
        return adjustedHeight >= (minHeight || 0) ? adjustedHeight : undefined;
    };

    const getBaseSidePlacementY = (height = popperHeight) => {
        if (alignment === "start") return calculateYStart(height);
        if (alignment === "end") return calculateYEnd(height);
        return calculateMiddleY(height);
    };

    const getAdjustedSidePlacementY = (height: number) => {
        const preferredY = getBaseSidePlacementY(height);
        const isTriggerWithinViewport = refTop >= 0 && refTop + refHeight <= windowHeight;

        if (!isTriggerWithinViewport) {
            return preferredY;
        }

        if (height >= windowHeight) return 0;
        return Math.min(Math.max(preferredY, 0), windowHeight - height);
    };

    if (primaryPlacement === "top") {
        resolvedPlacement = canPlaceTop ? "top" : canPlaceBottom ? "bottom" : availableSpaceTop >= availableSpaceBottom ? "top" : "bottom";
    } else if (primaryPlacement === "bottom") {
        resolvedPlacement = canPlaceBottom ? "bottom" : canPlaceTop ? "top" : availableSpaceBottom >= availableSpaceTop ? "bottom" : "top";
    } else if (primaryPlacement === "left") {
        resolvedPlacement = canPlaceLeft ? "left" : canPlaceRight ? "right" : availableSpaceLeft >= availableSpaceRight ? "left" : "right";
    } else if (primaryPlacement === "right") {
        resolvedPlacement = canPlaceRight ? "right" : canPlaceLeft ? "left" : availableSpaceRight >= availableSpaceLeft ? "right" : "left";
    }

    if (readjustHeight && (resolvedPlacement === "top" || resolvedPlacement === "bottom")) {
        const availableVerticalSpace = resolvedPlacement === "top" ? availableSpaceTop : availableSpaceBottom;
        if (popperHeight + offsetDistance > availableVerticalSpace) {
            maxHeight = getVerticalMaxHeight(availableVerticalSpace);
        }
    }

    if (resolvedPlacement === "top") {
        y = placeTop;
    } else if (resolvedPlacement === "bottom") {
        y = placeBottom;
    } else if (resolvedPlacement === "left") {
        x = placeLeft;
    } else if (resolvedPlacement === "right") {
        x = placeRight;
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
            y = (resolvedPlacement === "left" || resolvedPlacement === "right")
                ? getAdjustedSidePlacementY(popperHeight)
                : calculateMiddleY();
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
            y = getAdjustedSidePlacementY(popperHeight);
            break;
        case "left-end":
        case "right-end":
            y = getAdjustedSidePlacementY(popperHeight);
            break;
    }

    if (readjustHeight && (resolvedPlacement === "left" || resolvedPlacement === "right")) {
        const nextMaxHeight = popperHeight > windowHeight ? getVerticalMaxHeight(windowHeight + offsetDistance) : undefined;
        if (nextMaxHeight !== undefined && popperHeight > nextMaxHeight) {
            maxHeight = nextMaxHeight;
        }
    }

    return { x, y, maxHeight, resolvedPlacement };
}
