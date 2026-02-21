import type { Diff } from "@chrome-trace-diff/lib";

import { HighLevelStats } from "~/components/HighLevelStats";
import { DoubleTimeline } from "~/components/DoubleTimeline";

import styles from "./DiffViewer.module.css";

export function DiffViewer({ diff }: { diff: Diff }) {
  return (
    <section class={styles.diffviewer}>
      <HighLevelStats diff={diff} />
      <hr />
      <DoubleTimeline diff={diff} />
    </section>
  );
}
