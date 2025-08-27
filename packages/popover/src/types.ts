import { OverlayOptions } from "flexipop/create-overlay"

export type ExperimentaOptions = {
    /** Whether to teleport the dropdown content to the body or not
     * @default false
     */
    teleport: boolean,
    /** Whether to move the dropdown content to the body and remove it in DOM when not used anymore or not
     * @default "detachable"
     */
    teleportMode?: "move" | "detachable",
}
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
export type PopoverOptions = OverlayOptions & {
    experimental?: ExperimentaOptions
}