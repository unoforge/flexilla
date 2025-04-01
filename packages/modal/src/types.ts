/**
 * Defines animation classes for modal content.
 */
export type ModalContentAnimations = {
    enterAnimation: string;
    exitAnimation?: string;
};

/**
 * Defines options for modal behavior.
 */
export type ModalOptions = {
    defaultState?: "open" | "close", // Whether the modal should be open by default or not (default is close)
    animateContent?: ModalContentAnimations;
    overlayClass?: string;
    preventCloseModal?: boolean;
    allowBodyScroll?: boolean;
    enableStackedModals?: boolean;
    dispatchEventToDocument?: boolean;
    beforeHide?:()=>{ cancelAction?: boolean;} |void;
    onShow?: () => void;
    onHide?: () => void;
    onToggle?: ({ isHidden }: { isHidden: boolean }) => void
};