import type { SelectStore } from "./selectStore";

export const setSearch = (store: SelectStore, query: string) => {
  store.setState((state) => {
    if (state.search === query) return state;
    return { ...state, search: query };
  });
};
