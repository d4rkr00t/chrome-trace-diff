import { useContext, type JSX } from "solid-js";

import type {
  TimelineEntry as TTimelineEntry,
  ChromeTraceEvent,
  ChromeTraceEventWithStack,
} from "@chrome-trace-diff/lib";

import styles from "./Timeline.module.css";

import { Card } from "./Card";
import { getUniqueEventKey } from "@chrome-trace-diff/lib/src/trace/getUniqueKey";
import { DiffViewerStoreContext } from "~/context/DiffViewerStoreContext";

export function Timeline(props: { title: JSX.Element; traceId: number }) {
  const diffViewerStore = useContext(DiffViewerStoreContext);

  return (
    <div class={styles.timeline}>
      <div class={styles["timeline__title"]}>
        <Card>{props.title}</Card>
      </div>
      <div class={styles["timeline__events-container"]}>
        {diffViewerStore.state.diff.traces[props.traceId].timeline.map(
          (entry) => (
            <TimelineEntry entry={entry} traceId={props.traceId} />
          ),
        )}
      </div>
    </div>
  );
}

function TimelineEntry(props: { entry: TTimelineEntry; traceId: number }) {
  return (
    <div class={styles["timeline__entry-lane"]}>
      {props.entry.lanes.map((event) => (
        <TimelineEntryLane
          lane={event}
          start={props.entry.start}
          traceId={props.traceId}
        />
      ))}
    </div>
  );
}

function TimelineEntryLane(props: {
  lane: Array<ChromeTraceEventWithStack>;
  start: number;
  traceId: number;
}) {
  const diffViewerStore = useContext(DiffViewerStoreContext);

  return (
    <div class={styles["timeline__entry"]}>
      {props.lane.map((event, idx) => {
        const offset = idx === 0 ? event.ts - props.start : 0;
        return (
          <TimelineEntryEvent
            event={event}
            offset={offset * diffViewerStore.state.scale}
            unique={diffViewerStore.state.diff.uniqueEvents[
              props.traceId
            ].includes(getUniqueEventKey(event) ?? "")}
          />
        );
      })}
    </div>
  );
}

function TimelineEntryEvent(props: {
  event: ChromeTraceEvent;
  offset: number;
  unique?: boolean;
}) {
  const diffViewerStore = useContext(DiffViewerStoreContext);

  return (
    <span
      classList={{
        [styles["timeline__entry-event"]]: true,
        [styles["--unique"]]: props.unique ?? false,
      }}
      style={{
        width: `${(props.event.dur / 100) * diffViewerStore.state.scale}px`,
        "margin-left": `${props.offset / 100}px`,
      }}
      data-event-type={props.event.name}
      onClick={() => console.log(props.event)}
    >
      {props.event.name}
    </span>
  );
}
