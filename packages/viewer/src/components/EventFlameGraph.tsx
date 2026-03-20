import { createMemo, Show } from "solid-js";

import {
  buildFlameGraph,
  ProcessedTraceEvent,
  SerializableFlameGraph,
} from "@chrome-trace-diff/lib/src";

import styles from "./EventFlameGraph.module.css";

export function EventFlameGraph(props: { event: ProcessedTraceEvent }) {
  const flameGraph = createMemo(() => {
    return buildFlameGraph(props.event);
  });

  return (
    <Show when={flameGraph !== null}>
      <EventFlameGraphLane flameGraph={flameGraph()!} id={1} parentDur={0} />
    </Show>
  );
}

function EventFlameGraphLane(props: {
  flameGraph: SerializableFlameGraph;
  id: number;
  parentDur: number;
}) {
  const getWidth = () =>
    `${Math.floor((props.flameGraph[props.id].totalDur / props.parentDur) * 100)}%`;

  const getEntry = () => props.flameGraph[props.id];
  const getCallFrame = () => getEntry().callFrame?.callFrame;
  const getDurInMs = () => getEntry().totalDur / 1000;

  const selfTime = createMemo(() => {
    const entry = getEntry();
    const totalDur = entry.totalDur;
    const childrenDur = entry.children.reduce(
      (acc, child) => acc + props.flameGraph[child].totalDur,
      0,
    );
    return totalDur - childrenDur;
  });

  const selfTimePercentage = createMemo(() => {
    console.log(getEntry().totalDur, selfTime());
    return Math.floor((selfTime() / getEntry().totalDur) * 100);
  });

  const getTintColor = () => {
    const tint =
      styles[`--tint-${Math.floor(selfTimePercentage() / 100) * 100}`];
    return tint;
  };

  return (
    <div
      classList={{
        [styles["event-flame-graph__event"]]: true,
      }}
      style={{
        width: getWidth(),
      }}
    >
      <Show when={getCallFrame()?.functionName}>
        <div
          classList={{
            [styles["event-flame-graph__event-title"]]: true,
            [getTintColor()]: true,
          }}
        >
          {getCallFrame()?.functionName} ({getDurInMs()}ms)
        </div>
      </Show>
      <div class={styles["event-flame-graph__event-lane"]}>
        {getEntry().children.map((child) => {
          return (
            <EventFlameGraphLane
              flameGraph={props.flameGraph}
              id={child}
              parentDur={getEntry().totalDur}
            />
          );
        })}
      </div>
    </div>
  );
}
