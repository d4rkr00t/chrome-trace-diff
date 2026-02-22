import type { JSX } from "solid-js";

import type {
  ProcessedTrace,
  TimelineEntry as TTimelineEntry,
  ChromeTraceEvent,
  ChromeTraceEventWithStack,
} from "@chrome-trace-diff/lib";

import styles from "./Timeline.module.css";

export function Timeline(props: {
  trace: ProcessedTrace;
  scale: number;
  title: JSX.Element;
}) {
  return (
    <div class={styles.timeline}>
      <div class={styles["timeline__title"]}>{props.title}</div>
      <div class={styles["timeline__events-container"]}>
        {props.trace.timeline.map((entry) => (
          <TimelineEntry entry={entry} scale={props.scale} />
        ))}
      </div>
    </div>
  );
}

function TimelineEntry(props: { entry: TTimelineEntry; scale: number }) {
  return (
    <div class={styles["timeline__entry-lane"]}>
      {props.entry.lanes.map((event) => (
        <TimelineEntryLane
          lane={event}
          start={props.entry.start}
          scale={props.scale}
        />
      ))}
    </div>
  );
}

function TimelineEntryLane(props: {
  lane: Array<ChromeTraceEventWithStack>;
  start: number;
  scale: number;
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
}) {
  return (
    <span
      class={styles["timeline__entry-event"]}
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
