import type { Diff } from "@chrome-trace-diff/lib";
import { createStore } from "solid-js/store";

import { DiffViewerStore, DiffViewerStoreActions } from "../types";

const MAX_SCALE = 40;
const MIN_SCALE = 1;
const SCALE_STEP = 1.5;

export function createDiffViewerStore(diff: Diff) {
  const [state, setState] = createStore<DiffViewerStore>({
    diff,
    scale: MIN_SCALE,
    selected: null,
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
  };

  return [state, actions] as const;
}
