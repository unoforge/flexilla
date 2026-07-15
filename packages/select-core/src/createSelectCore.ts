import { registerItem, unregisterItem } from "./itemRegistry";
import { highlight, highlightNext, highlightPrev } from "./navigation";
import { clearSelection, selectValue, toggleValue, unselectValue } from "./selection";
import { createSelectStore } from "./selectStore";
import { setSearch } from "./search";
import type { SelectItem, SelectOptions, SelectState, SelectListener } from "./types";

export type SelectCore = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  select: (value: string) => void;
  unselect: (value: string) => void;
  clear: () => void;
  toggleValue: (value: string) => void;
  highlightNext: () => void;
  highlightPrev: () => void;
  highlight: (index: number | null) => void;
  setSearch: (query: string) => void;
  registerItem: (item: SelectItem) => void;
  unregisterItem: (value: string) => void;
  getItem: (value: string) => SelectItem | undefined;  // O(1) lookup
  hasItem: (value: string) => boolean;                 // O(1) check
  getState: () => Readonly<SelectState>;
  subscribe: (listener: SelectListener) => () => void;
};

export const createSelectCore = (options: SelectOptions = {}): SelectCore => {
  const multiple = options.multiple ?? false;
  const store = createSelectStore({
    open: false,
    highlightedIndex: null,
    selectedValues: [],
    search: "",
    items: [],
  });

  const open = () => store.setState((state) => (state.open ? state : { ...state, open: true }));
  const close = () => store.setState((state) => (state.open ? { ...state, open: false } : state));
  const toggle = () => store.setState((state) => ({ ...state, open: !state.open }));

  return {
    open,
    close,
    toggle,
    select: (value: string) => selectValue(store, value, multiple),
    unselect: (value: string) => unselectValue(store, value),
    clear: () => clearSelection(store),
    toggleValue: (value: string) => toggleValue(store, value, multiple),
    highlightNext: () => highlightNext(store),
    highlightPrev: () => highlightPrev(store),
    highlight: (index: number | null) => highlight(store, index),
    setSearch: (query: string) => setSearch(store, query),
    registerItem: (item: SelectItem) => registerItem(store, item),
    unregisterItem: (value: string) => unregisterItem(store, value),
    getItem: store.getItem,
    hasItem: store.hasItem,
    getState: store.getState,
    subscribe: store.subscribe,
  };
};
