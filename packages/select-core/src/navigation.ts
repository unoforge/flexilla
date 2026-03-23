import type { SelectStore } from "./selectStore";

const findNextEnabledIndex = (items: { disabled?: boolean }[], start: number, direction: 1 | -1): number | null => {
  if (items.length === 0) return null;
  let steps = 0;
  let index = start;
  const total = items.length;

  while (steps < total) {
    index = (index + direction + total) % total;
    const candidate = items[index];
    if (!candidate?.disabled) return index;
    steps += 1;
  }
  return null;
};

export const highlight = (store: SelectStore, index: number | null) => {
  store.setState((state) => {
    if (index === null) return { ...state, highlightedIndex: null };
    if (index < 0 || index >= state.items.length) return { ...state, highlightedIndex: null };
    const item = state.items[index];
    if (item.disabled) return { ...state, highlightedIndex: null };
    return { ...state, highlightedIndex: index };
  });
};

export const highlightNext = (store: SelectStore) => {
  store.setState((state) => {
    const start = state.highlightedIndex ?? -1;
    const next = findNextEnabledIndex(state.items, start, 1);
    return { ...state, highlightedIndex: next };
  });
};

export const highlightPrev = (store: SelectStore) => {
  store.setState((state) => {
    const start = state.highlightedIndex ?? 0;
    const prev = findNextEnabledIndex(state.items, start, -1);
    return { ...state, highlightedIndex: prev };
  });
};
