import { onCleanup } from "solid-js";
import { createSignal } from "solid-js";

import type { Diff } from "@chrome-trace-diff/lib";

import { Timeline } from "~/components/Timeline";

import styles from "./DoubleTimeline.module.css";

export function DoubleTimeline({ diff }: { diff: Diff }) {
  const [scale, setScale] = createSignal(1);

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "w") {
      setScale(scale() + 0.2);
    } else if (evt.key === "s") {
      const nextScale = scale() - 0.2;
      setScale(Math.max(nextScale, 1));
    }
  };

  if (typeof document !== "undefined") {
    document?.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document?.removeEventListener("keydown", onKeyDown);
    });
  }

  return (
    <div class={styles.doubletimeline}>
      <Timeline trace={diff.traces[0]} scale={scale()} />
      <Timeline trace={diff.traces[1]} scale={scale()} />
    </div>
  );
}
