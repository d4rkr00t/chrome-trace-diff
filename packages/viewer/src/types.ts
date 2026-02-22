import { Diff } from "@chrome-trace-diff/lib";

export type DiffViewerStore = {
  diff: Diff;
  scale: number;
  selected: null;
};

export type DiffViewerStoreActions = {
  incScale: () => void;
  decScale: () => void;
};
