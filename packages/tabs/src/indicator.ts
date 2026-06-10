/**
 * Moves the indicator to the position of the given element.
 */
export const moveIndicator = ({
    triggerElement,
    indicator_,
    transformDuration = 200,
    transformEasing = 'ease'
}: {
    triggerElement: HTMLElement,
    indicator_: HTMLElement | undefined,
    transformDuration?: number,
    transformEasing?: string,
}) => {

    if (!(indicator_ instanceof HTMLElement)) return;

    indicator_.animate(
        [
            {
                top: indicator_.style.top,
                left: indicator_.style.left,
                width: indicator_.style.width,
                height: indicator_.style.height
            },
            {
                top: `${triggerElement.offsetTop}px`,
                left: `${triggerElement.offsetLeft}px`,
                width: `${triggerElement.offsetWidth}px`,
                height: `${triggerElement.offsetHeight}px`
            }
        ],
        {
            fill: "both",
            duration: transformDuration,
            easing: transformEasing,
        }
    );
};
