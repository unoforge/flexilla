export type ExperimentaOptions = {
    /** Whether to teleport the dropdown content to the body or not
     * @default false
     */
    teleport: boolean,
}
export type OffcanvasOptions = {
    staticBackdrop?: boolean,
    allowBodyScroll?: boolean,
    backdrop?: string,
    beforeHide?: () => { cancelAction?: boolean; } | void
    beforeShow?: () => void
    onShow?: () => void
    onHide?: () => void,
    experimental?: ExperimentaOptions,
}