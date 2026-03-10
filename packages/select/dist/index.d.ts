import { SelectCore } from '../../select-core/src/index.ts';

export declare const createSelect: (options?: SelectOptions) => SelectController;

export declare type SelectController = SelectCore & {
    connect: (dom: SelectDom) => {
        destroy: () => void;
    };
};

export declare type SelectDom = {
    root: HTMLElement;
};

export declare type SelectOptions = {
    multiple?: boolean;
};

export { }
