import { OverlayOptions } from "@flexilla/create-overlay"

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
export type PopoverOptions = OverlayOptions