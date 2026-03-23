import type { SelectListener } from "./types";
import type { SelectStore } from "./selectStore";

export type Unsubscribe = () => void;

export const subscribeToState = (store: SelectStore, listener: SelectListener): Unsubscribe => store.subscribe(listener);
