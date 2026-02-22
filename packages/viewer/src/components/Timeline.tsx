import type { JSX } from "solid-js";

import type {
  ProcessedTrace,
  TimelineEntry as TTimelineEntry,
  ChromeTraceEvent,
  ChromeTraceEventWithStack,
  Diff,
} from "@chrome-trace-diff/lib";

import styles from "./Timeline.module.css";

import { Card } from "./Card";
import { getUniqueEventKey } from "@chrome-trace-diff/lib/src/trace/getUniqueKey";

export function Timeline(props: {
  diff: Diff;
  trace: ProcessedTrace;
  scale: number;
  title: JSX.Element;
}) {
  return (
    <div class={styles.timeline}>
      <div class={styles["timeline__title"]}>
        <Card>{props.title}</Card>
      </div>
      <div class={styles["timeline__events-container"]}>
        {props.trace.timeline.map((entry) => (
          <TimelineEntry entry={entry} scale={props.scale} diff={props.diff} />
        ))}
      </div>
    </div>
  );
}

function TimelineEntry(props: {
  entry: TTimelineEntry;
  scale: number;
  diff: Diff;
}) {
  return (
    <div class={styles["timeline__entry-lane"]}>
      {props.entry.lanes.map((event) => (
        <TimelineEntryLane
          lane={event}
          start={props.entry.start}
          scale={props.scale}
          diff={props.diff}
        />
      ))}
    </div>
  );
}

function TimelineEntryLane(props: {
  lane: Array<ChromeTraceEventWithStack>;
  start: number;
  scale: number;
  diff: Diff;
}) {
  return (
    <div class={styles["timeline__entry"]}>
      {props.lane.map((event, idx) => {
        const offset = idx === 0 ? event.ts - props.start : 0;
        return (
          <TimelineEntryEvent
            event={event}
            offset={offset * props.scale}
            scale={props.scale}
            unique={
              props.diff.uniqueEvents[0].includes(
                getUniqueEventKey(event) ?? "",
              ) ||
              props.diff.uniqueEvents[1].includes(
                getUniqueEventKey(event) ?? "",
              )
            }
          />
        );
      })}
    </div>
  );
}

function TimelineEntryEvent(props: {
  event: ChromeTraceEvent;
  offset: number;
  scale: number;
  unique?: boolean;
}) {
  return (
    <span
      classList={{
        [styles["timeline__entry-event"]]: true,
        [styles["--unique"]]: props.unique ?? false,
      }}
      style={{
        width: `${(props.event.dur / 100) * props.scale}px`,
        "margin-left": `${props.offset / 100}px`,
      }}
      data-event-type={props.event.name}
      onClick={() => console.log(props.event)}
    >
      {props.event.name}
    </span>
  );
}
