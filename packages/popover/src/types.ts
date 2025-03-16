import type { Placement } from "flexipop"

/**
 * Configuration options for controlling event-based behaviors
 */
export type EventEffect = {
    /** Disable popover response to scroll events */
    disableOnScroll?: boolean,
    /** Disable popover response to window resize events */
    disableOnResize?: boolean
}

/**
 * Configuration options for the Popover component
 */
export type PopoverOptions = {
    /** Initial state of the popover ("open" or "close") */
    defaultState?: "open" | "close",
    /** Prevent popover from closing when clicking outside */
    preventFromCloseOutside?: boolean,
    /** Prevent popover from closing when clicking inside */
    preventCloseFromInside?: boolean,
    /** Position of the popover relative to its trigger element */
    placement?: Placement,
    /** Distance in pixels between popover and trigger element */
    offsetDistance?: number,
    /** How the popover is triggered ("click" or "hover") */
    triggerStrategy?: "click" | "hover",
    /** Popper-specific configuration */
    popper?: {
        /** Event-related effects configuration */
        eventEffect: EventEffect
    },
    /** Callback function executed before popover shows */
    beforeShow?: () => void,
    /** Callback function executed before popover hides */
    beforeHide?: () => void,
    /** Callback function executed after popover shows */
    onShow?: () => void,
    /** Callback function executed after popover hides */
    onHide?: () => void,
    /** Callback function executed when popover visibility toggles */
    onToggle?: ({ isHidden }: { isHidden?: boolean }) => void
}
