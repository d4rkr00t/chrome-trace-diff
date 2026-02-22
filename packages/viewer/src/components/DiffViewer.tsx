import type { Diff } from "@chrome-trace-diff/lib";

import { createDiffViewerStore } from "../stores/createDiffViewerStore";

import { HighLevelStats } from "./HighLevelStats";
import { DoubleTimeline } from "./DoubleTimeline";

import styles from "./DiffViewer.module.css";
import { DiffViewerStoreContext } from "~/context/DiffViewerStoreContext";

export function DiffViewer({ diff }: { diff: Diff }) {
  const [diffViewerStoreState, diffViewerStoreActions] =
    createDiffViewerStore(diff);

  return (
    <DiffViewerStoreContext.Provider
      value={{
        state: diffViewerStoreState,
        actions: diffViewerStoreActions,
      }}
    >
      <section class={styles.diffviewer}>
        <HighLevelStats diff={diff} />
        <DoubleTimeline diff={diff} />
      </section>
    </DiffViewerStoreContext.Provider>
  );
}
