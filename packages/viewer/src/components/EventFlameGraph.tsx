import { createMemo, Show, type JSX } from "solid-js";

import {
  buildFlameGraph,
  ProcessedTraceEvent,
  SerializableFlameGraph,
} from "@chrome-trace-diff/lib/src";

import { Card } from "~/components/Card";

import styles from "./EventFlameGraph.module.css";

export function EventFlameGraph(props: {
  event: ProcessedTraceEvent;
  title: JSX.Element;
}) {
  const flameGraph = createMemo(() => {
    return buildFlameGraph(props.event);
  });

  return (
    <Show when={flameGraph !== null}>
      <div class={styles["event-flame-graph"]}>
        <div class={styles["event-flame-graph__title"]}>
          <Card>{props.title}</Card>
        </div>
        <EventFlameGraphLane flameGraph={flameGraph()!} id={1} parentDur={0} />
      </div>
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
    return Math.floor((selfTime() / getEntry().totalDur) * 100);
  });

  const getTintColor = () => {
    console.log(
      "Tint Color",
      getCallFrame()?.functionName,
      selfTimePercentage(),
      Math.floor(selfTimePercentage() / 10) * 10,
      selfTime(),
      getEntry().totalDur,
    );
    const tint =
      styles[`--tint-${Math.floor(selfTimePercentage() / 10) * 10}`];
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
      <div
        classList={{
          [styles["event-flame-graph__event-title"]]: true,
          [getTintColor()]: true,
        }}
      >
        {getCallFrame()?.functionName || "anonymous"} ({getDurInMs()}ms)
      </div>
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
