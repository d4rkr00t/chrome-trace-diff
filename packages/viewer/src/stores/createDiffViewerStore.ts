import { type Diff } from "@chrome-trace-diff/lib";
import { createStore } from "solid-js/store";

// TODO: fix this
import { getUniqueEventKey } from "@chrome-trace-diff/lib/src/trace/getUniqueKey";

import { DiffViewerStore, DiffViewerStoreActions } from "../types";

const MAX_SCALE = 40;
const MIN_SCALE = 1;
const SCALE_STEP = 1.5;

export function createDiffViewerStore(diff: Diff) {
  const [state, setState] = createStore<DiffViewerStore>({
    diff,
    scale: MIN_SCALE,
    selectedChromeEventId: null,
  });

  const actions: DiffViewerStoreActions = {
    incScale: () => {
      setState("scale", (scale) => {
        return Math.min(scale * SCALE_STEP, MAX_SCALE);
      });
    },
    decScale: () => {
      setState("scale", (scale) => {
        return Math.max(scale / SCALE_STEP, MIN_SCALE);
      });
    },
    selectChromeEvent: (event) => {
      const id = getUniqueEventKey(event);
      console.log("Selected", id, event);
      setState("selectedChromeEventId", () => id ?? null);
    },
  };

  return [state, actions] as const;
}
