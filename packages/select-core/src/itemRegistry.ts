import type { SelectItem } from "./types";
import type { SelectStore } from "./selectStore";

export const registerItem = (store: SelectStore, item: SelectItem) => {
  store.setState((state) => {
    // Use O(1) lookup via store.getItem() instead of O(n) findIndex
    const existing = store.getItem(item.value);
    if (existing) {
      // Update existing item in place (preserve array reference for perf, cloneState will copy)
      const items = state.items.map((entry) =>
        entry.value === item.value ? { ...entry, ...item } : entry
      );
      return { ...state, items };
    }
    // Add new item
    return { ...state, items: [...state.items, { ...item }] };
  });
};

export const unregisterItem = (store: SelectStore, value: string) => {
  store.setState((state) => {
    // Use O(1) lookup instead of findIndex
    if (!store.hasItem(value)) return state;

    const removeIndex = state.items.findIndex((item) => item.value === value);
    const items = state.items.filter((item) => item.value !== value);
    const selectedValues = state.selectedValues.filter((selected) => selected !== value);
    let highlightedIndex = state.highlightedIndex;

    if (highlightedIndex !== null) {
      if (highlightedIndex === removeIndex) {
        highlightedIndex = null;
      } else if (highlightedIndex > removeIndex) {
        highlightedIndex -= 1;
      }
    }

    return { ...state, items, selectedValues, highlightedIndex };
  });
};
