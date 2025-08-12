import type { Placement } from "@flexilla/create-overlay"

/** Configuration for controlling event-based behavior */
type EventEffect = {
    /** Disable dropdown repositioning on scroll events */
    disableOnScroll?: boolean,
    /** Disable dropdown repositioning on window resize events */
    disableOnResize?: boolean
}

export type SupportPositionSubItem = "left" | "right" | "left-start" | "left-end" | "right-start" | "right-end"


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

/** Configuration options for the Dropdown component */
export type DropdownOptions = {
    /** Strategy to trigger the dropdown - either by click or hover
     * @default "click"
     */
    triggerStrategy?: "click" | "hover",
    /** Position of the dropdown relative to its trigger element
     * @see Placement from @flexilla/create-overlay
     */
    placement?: Placement,
    /** Prevents dropdown from closing when clicking inside the dropdown content */
    preventCloseFromInside?: boolean,
    /** Prevents dropdown from closing when clicking outside the dropdown */
    preventFromCloseOutside?: boolean,
    /** Initial state of the dropdown
     * @default "close"
     */
    defaultState?: "open" | "close"
    /** Distance in pixels between the trigger and dropdown content */
    offsetDistance?: number,
    /** Popper-specific configuration options */
    popper?: {
        eventEffect: EventEffect
    }
    /** Callback fired when dropdown is shown */
    onShow?: () => void,
    /** Callback fired when dropdown is hidden */
    onHide?: () => void,
    /** Callback fired when dropdown visibility changes
     * @param {Object} params - Callback parameters
     * @param {boolean} [params.isHidden] - Current visibility state
     */
    onToggle?: ({ isHidden }: { isHidden?: boolean }) => void,

    experimental?: ExperimentaOptions

}
