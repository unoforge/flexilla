import type { SelectItem, SelectListener, SelectState } from "./types";

export type Unsubscribe = () => void;

export type SelectStore = {
  getState: () => Readonly<SelectState>;
  setState: (updater: (state: Readonly<SelectState>) => SelectState) => void;
  subscribe: (listener: SelectListener) => Unsubscribe;
  getItem: (value: string) => SelectItem | undefined;
  hasItem: (value: string) => boolean;
};

const cloneState = (state: SelectState): SelectState => ({
  ...state,
  items: [...state.items],
  selectedValues: [...state.selectedValues],
});

const isEqualState = (a: SelectState, b: SelectState) => {
  if (
    a.open !== b.open ||
    a.highlightedIndex !== b.highlightedIndex ||
    a.search !== b.search ||
    a.items.length !== b.items.length ||
    a.selectedValues.length !== b.selectedValues.length
  ) {
    return false;
  }

  for (let index = 0; index < a.items.length; index += 1) {
    const current = a.items[index];
    const next = b.items[index];
    if (!next) return false;
    if (
      current.value !== next.value ||
      current.label !== next.label ||
      Boolean(current.disabled) !== Boolean(next.disabled)
    ) {
      return false;
    }
  }

  for (let index = 0; index < a.selectedValues.length; index += 1) {
    if (a.selectedValues[index] !== b.selectedValues[index]) return false;
  }

  return true;
};

export const createSelectStore = (initialState: SelectState): SelectStore => {
  let state = cloneState(initialState);
  // Internal Map for O(1) item lookups - API remains unchanged (items is still an array)
  const itemsMap = new Map<string, SelectItem>(state.items.map(item => [item.value, item]));
  const listeners = new Set<SelectListener>();

  const snapshot = (): SelectState => cloneState(state);

  const syncMapWithState = () => {
    itemsMap.clear();
    for (const item of state.items) {
      itemsMap.set(item.value, item);
    }
  };

  const setState = (updater: (state: Readonly<SelectState>) => SelectState) => {
    const current = snapshot();
    const next = updater(current);
    if (isEqualState(state, next)) return;
    state = cloneState(next);
    syncMapWithState(); // Sync Map after state change
    listeners.forEach((listener) => listener(snapshot()));
  };

  const getItem = (value: string): SelectItem | undefined => itemsMap.get(value);
  const hasItem = (value: string): boolean => itemsMap.has(value);

  const subscribe = (listener: SelectListener) => {
    listeners.add(listener);
    listener(snapshot());
    return () => listeners.delete(listener);
  };

  return {
    getState: snapshot,
    setState,
    subscribe,
    getItem,
    hasItem,
  };
};
