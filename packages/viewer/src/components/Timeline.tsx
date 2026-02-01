import type {
  ProcessedTrace,
  Timeline as TTimeline,
  TimelineEntry as TTimelineEntry,
  ChromeTraceEvent,
} from "@chrome-trace-diff/lib";
import type { ChromeTraceEventWithStack } from "@chrome-trace-diff/lib/src/types";

import styles from "./Timeline.module.css";

const IGNORED_EVENTS = new Set([
  "IntersectionObserverController::computeIntersections",
]);

export function Timeline({ trace }: { trace: ProcessedTrace }) {
  return (
    <div class={styles.timeline}>
      {trace.timeline.map((entry) => (
        <TimelineEntry entry={entry} />
      ))}
    </div>
  );
}

function TimelineEntry({ entry }: { entry: TTimelineEntry }) {
  return (
    <div class={styles["timeline__entry-lane"]}>
      {entry.lanes.map((event) => (
        <TimelineEntryLane lane={event} start={entry.start} />
      ))}
    </div>
  );
}

function TimelineEntryLane({
  lane,
  start,
}: {
  lane: Array<ChromeTraceEventWithStack>;
  start: number;
}) {
  return (
    <div class={styles["timeline__entry"]}>
      {lane
        .filter((event) => {
          if (IGNORED_EVENTS.has(event.name)) {
            return false;
          }
          return true;
        })
        .map((event, idx) => {
          const offset =
            idx === 0 ? event.ts - start : event.ts - (lane[idx - 1] ?? 0);
          return <TimelineEntryEvent event={event} offset={offset} />;
        })}
    </div>
  );
}

function TimelineEntryEvent({
  event,
  offset,
}: {
  event: ChromeTraceEvent;
  offset: number;
}) {
  return (
    <span
      class={styles["timeline__entry-event"]}
      style={{
        width: `${event.dur / 100}px`,
        "margin-left": `${offset / 100}px`,
      }}
      data-event-type={event.name}
    >
      {event.name}
    </span>
  );
}
