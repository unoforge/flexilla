import { SelectListener } from "./types";
import { SelectStore } from "./selectStore";

export type Unsubscribe = () => void;

export const subscribeToState = (store: SelectStore, listener: SelectListener): Unsubscribe => store.subscribe(listener);
