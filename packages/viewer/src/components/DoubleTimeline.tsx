import { onCleanup, useContext } from "solid-js";

import { DiffViewerStoreContext } from "~/context/DiffViewerStoreContext";

import { Timeline } from "~/components/Timeline";
import { Lozenge } from "./Lozenge";
import { Card } from "./Card";

import styles from "./DoubleTimeline.module.css";

export function DoubleTimeline() {
  const diffViewerStore = useContext(DiffViewerStoreContext);

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "w") {
      diffViewerStore.actions.incScale();
    } else if (evt.key === "s") {
      diffViewerStore.actions.decScale();
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
            title={<Lozenge color="green">Before</Lozenge>}
            traceId={0}
          />
          <Timeline
            title={<Lozenge color="orange">After</Lozenge>}
            traceId={1}
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
