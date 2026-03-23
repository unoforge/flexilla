import type{ SelectStore } from "./selectStore";

const canSelectValue = (state: ReturnType<SelectStore["getState"]>, value: string) => {
  const item = state.items.find((entry) => entry.value === value);
  return Boolean(item) && !item?.disabled;
};

export const selectValue = (store: SelectStore, value: string, multiple: boolean) => {
  store.setState((state) => {
    if (!canSelectValue(state, value)) return state;
    if (multiple) {
      if (state.selectedValues.includes(value)) return state;
      return { ...state, selectedValues: [...state.selectedValues, value] };
    }
    return { ...state, selectedValues: [value] };
  });
};

export const unselectValue = (store: SelectStore, value: string) => {
  store.setState((state) => {
    if (!state.selectedValues.includes(value)) return state;
    return { ...state, selectedValues: state.selectedValues.filter((entry) => entry !== value) };
  });
};

export const clearSelection = (store: SelectStore) => {
  store.setState((state) => {
    if (state.selectedValues.length === 0) return state;
    return { ...state, selectedValues: [] };
  });
};

export const toggleValue = (store: SelectStore, value: string, multiple: boolean) => {
  store.setState((state) => {
    if (!canSelectValue(state, value)) return state;
    const alreadySelected = state.selectedValues.includes(value);
    if (alreadySelected) {
      const selectedValues = state.selectedValues.filter((entry) => entry !== value);
      return { ...state, selectedValues };
    }

    if (multiple) return { ...state, selectedValues: [...state.selectedValues, value] };
    return { ...state, selectedValues: [value] };
  });
};
