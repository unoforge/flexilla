import type { PopoverOptions } from "@flexilla/popover";

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
export type TooltipOptions = PopoverOptions & {
    experimental?: ExperimentaOptions
}