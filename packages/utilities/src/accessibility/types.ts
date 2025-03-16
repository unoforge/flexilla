/**
 * Configuration options for keyboard navigation functionality.
 *
 * @interface KeyDirAccessibilityOptions
 * @property {HTMLElement | string} [containerElement] - The container element or its selector that contains focusable children
 * @property {string | HTMLElement[]} [targetChildren] - Selector string for focusable children or array of HTMLElements
 * @property {"up-down" | "left-right" | "all"} direction - The allowed navigation directions:
 *   - "up-down": Only vertical arrow key navigation
 *   - "left-right": Only horizontal arrow key navigation
 *   - "all": Both vertical and horizontal navigation
 */
export type KeyDirAccessibilityOptions = {
    containerElement?: HTMLElement | string,
    targetChildren?: string | HTMLElement[],
    direction: "up-down" | "left-right" | "all"
}
