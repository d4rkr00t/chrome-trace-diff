import { createContext } from "solid-js";
import { DiffViewerStore, DiffViewerStoreActions } from "~/types";

export const DiffViewerStoreContext = createContext<{
  state: DiffViewerStore;
  actions: DiffViewerStoreActions;
}>({ state: {} as any, actions: {} as any });
