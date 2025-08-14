import { appendBefore, setAttributes } from "@flexilla/utilities";


export const createIndicator = ({
    activeTabTrigger,
    indicatorClassName,
    tabList
}: {
    activeTabTrigger: HTMLElement,
    indicatorClassName: string,
    tabList: HTMLElement
}) => {
    if (!indicatorClassName || indicatorClassName === "") return;

    const indicator_ = document.createElement("span");
    setAttributes(indicator_, {
        "data-tab-indicator": "",
        "aria-hidden": "true"
    });

    const classesArray = indicatorClassName.split(" ");
    indicator_.classList.add(...classesArray);
    const indicatoBeforeEl = activeTabTrigger.parentElement === tabList
        ? activeTabTrigger
        : activeTabTrigger.parentElement as HTMLElement;

    appendBefore({
        newElement: indicator_,
        existingElement: indicatoBeforeEl
    });

    return indicator_;
};


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
    indicator_: HTMLSpanElement | undefined,
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
