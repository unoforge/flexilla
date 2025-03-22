type CollapseState = "open" | "close"



export type CollapsibleElement = HTMLElement & {
    style: {
        maxHeight: string;
        transition: string;
    };
}


export type CollapseOptions = {
    defaultState?: CollapseState,
    closeHeight?: number,
    onToggle?: ({ isExpanded }: { isExpanded: boolean }) => void
}

