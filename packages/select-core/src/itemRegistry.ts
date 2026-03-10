import { SelectItem } from "./types";
import { SelectStore } from "./selectStore";

export const registerItem = (store: SelectStore, item: SelectItem) => {
  store.setState((state) => {
    const existingIndex = state.items.findIndex((entry) => entry.value === item.value);
    const items = existingIndex >= 0
      ? state.items.map((entry, index) => (index === existingIndex ? { ...entry, ...item } : entry))
      : [...state.items, { ...item }];

    const highlightedIndex = state.highlightedIndex;
    return { ...state, items, highlightedIndex };
  });
};

export const unregisterItem = (store: SelectStore, value: string) => {
  store.setState((state) => {
    const removeIndex = state.items.findIndex((item) => item.value === value);
    if (removeIndex === -1) return state;

    const items = state.items.filter((_, index) => index !== removeIndex);
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
