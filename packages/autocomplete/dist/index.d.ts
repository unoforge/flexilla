import { SelectCore } from '../../select-core/src/index.ts';
import { SelectItem } from '../../select-core/src/index.ts';

export declare type AutocompleteController = SelectCore & {
    connect: (dom: AutocompleteDom) => {
        destroy: () => void;
    };
};

export declare type AutocompleteDom = {
    root: HTMLElement;
};

export declare type AutocompleteOptions = {
    multiple?: boolean;
    source?: AutocompleteSource;
    filter?: (query: string, item: SelectItem) => boolean;
};

export declare type AutocompleteSource = SelectItem[] | string[];

export declare const createAutocomplete: (options?: AutocompleteOptions) => AutocompleteController;

export { }
