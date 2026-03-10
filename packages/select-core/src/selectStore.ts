import { SelectListener, SelectState } from "./types";

export type SelectStore = {
  getState: () => Readonly<SelectState>;
  setState: (updater: (state: Readonly<SelectState>) => SelectState) => void;
  subscribe: (listener: SelectListener) => () => void;
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
  const listeners = new Set<SelectListener>();

  const snapshot = (): SelectState => cloneState(state);

  const setState = (updater: (state: Readonly<SelectState>) => SelectState) => {
    const next = cloneState(updater(snapshot()));
    if (isEqualState(state, next)) return;
    state = cloneState(next);
    listeners.forEach((listener) => listener(snapshot()));
  };

  const subscribe = (listener: SelectListener) => {
    listeners.add(listener);
    listener(snapshot());
    return () => listeners.delete(listener);
  };

  return {
    getState: snapshot,
    setState,
    subscribe,
  };
};
