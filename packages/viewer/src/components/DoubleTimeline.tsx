import { onCleanup } from "solid-js";
import { createSignal } from "solid-js";

import type { Diff } from "@chrome-trace-diff/lib";

import { Timeline } from "~/components/Timeline";

import styles from "./DoubleTimeline.module.css";
import { Lozenge } from "./Lozenge";
import { Card } from "./Card";

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
      <DoubleTimelineLegend />
      <div class={styles["doubletimeline__container"]}>
        <div class={styles["doubletimeline__container-width"]}>
          <Timeline
            diff={diff}
            trace={diff.traces[0]}
            scale={scale()}
            title={<Lozenge color="green">Before</Lozenge>}
          />
          <Timeline
            diff={diff}
            trace={diff.traces[1]}
            scale={scale()}
            title={<Lozenge color="orange">After</Lozenge>}
          />
        </div>
      </div>
    </div>
  );
}

function DoubleTimelineLegend() {
  return (
    <Card customClass={styles["doubletimeline__legend"]}>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--parsing"]]: true,
          }}
        ></span>
        Parsing
      </span>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--scripting"]]: true,
          }}
        ></span>
        Scripting
      </span>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--paint"]]: true,
          }}
        ></span>
        Paint
      </span>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--layout"]]: true,
          }}
        ></span>
        Layout
      </span>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--gc"]]: true,
          }}
        ></span>
        GC
      </span>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--other"]]: true,
          }}
        ></span>
        Other
      </span>
      <span class={styles["doubletimeline__legend-item"]}>
        <span
          classList={{
            [styles["doubletimeline__legend-color-box"]]: true,
            [styles["--unique"]]: true,
          }}
        ></span>
        Unique
      </span>
    </Card>
  );
}
