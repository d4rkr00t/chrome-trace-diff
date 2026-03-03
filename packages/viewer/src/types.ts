import { ChromeTraceEvent, Diff } from "@chrome-trace-diff/lib";

export type DiffViewerStore = {
  diff: Diff;
  scale: number;
  selectedChromeEventId: null | string;
};

export type DiffViewerStoreActions = {
  incScale: () => void;
  decScale: () => void;
  selectChromeEvent: (event: ChromeTraceEvent) => void;
};
