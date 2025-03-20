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
export type OverlayOptions = {
    /** Initial state of the overlay ("open" or "close") */
    defaultState?: "open" | "close",
    /** Prevent overlay from closing when clicking outside */
    preventFromCloseOutside?: boolean,
    /** Prevent overlay from closing when clicking inside */
    preventCloseFromInside?: boolean,
    /** Position of the overlay relative to its trigger element */
    placement?: Placement,
    /** Distance in pixels between overlay and trigger element */
    offsetDistance?: number,
    /** How the overlay is triggered ("click" or "hover") */
    triggerStrategy?: "click" | "hover",
    /** Popper-specific configuration */
    popper?: {
        /** Event-related effects configuration */
        eventEffect: EventEffect
    },
    /** Callback function executed before Overlay shows */
    beforeShow?: () => void,
    /** Callback function executed before Overlay hides */
    beforeHide?: () => void,
    /** Callback function executed after Overlay shows */
    onShow?: () => void,
    /** Callback function executed after Overlay hides */
    onHide?: () => void,
    /** Callback function executed when Overlay visibility toggles */
    onToggle?: ({ isHidden }: { isHidden?: boolean }) => void
}
