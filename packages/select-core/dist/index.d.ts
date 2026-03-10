export declare const createSelectCore: (options?: SelectOptions) => SelectCore;

export declare type SelectCore = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    select: (value: string) => void;
    unselect: (value: string) => void;
    toggleValue: (value: string) => void;
    highlightNext: () => void;
    highlightPrev: () => void;
    highlight: (index: number | null) => void;
    setSearch: (query: string) => void;
    registerItem: (item: SelectItem) => void;
    unregisterItem: (value: string) => void;
    getState: () => Readonly<SelectState>;
    subscribe: (listener: SelectListener) => () => void;
};

export declare type SelectItem = {
    value: string;
    label?: string;
    disabled?: boolean;
};

export declare type SelectListener = (state: Readonly<SelectState>) => void;

export declare type SelectOptions = {
    multiple?: boolean;
};

export declare type SelectState = {
    open: boolean;
    highlightedIndex: number | null;
    selectedValues: string[];
    search: string;
    items: SelectItem[];
};

export { }
