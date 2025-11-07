export type OffcanvasOptions = {
    staticBackdrop?: boolean,
    allowBodyScroll?: boolean,
    backdrop?: string,
    dispatchEventToDocument?: boolean;
    beforeHide?: () => { cancelAction?: boolean; } | void
    beforeShow?: () => void
    onShow?: () => void
    onHide?: () => void
}