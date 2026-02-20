import type {
  ProcessedTrace,
  TimelineEntry as TTimelineEntry,
  ChromeTraceEventWithStack,
} from "@chrome-trace-diff/lib";
import type { Accessor } from "solid-js";
import { For } from "solid-js";

import styles from "./Timeline.module.css";

const CONSTANT_GAP = 4;
const BASE_DIVISOR = 100;

const IGNORED_EVENTS = new Set([
  "IntersectionObserverController::computeIntersections",
]);

export function Timeline({
  trace,
  uniqueEvents,
  label,
  scale,
  onEventClick,
  highlightedEntry,
  selectedEvent,
}: {
  trace: ProcessedTrace;
  uniqueEvents: Set<string>;
  label: string;
  scale: Accessor<number>;
  onEventClick: (entry: TTimelineEntry, event: ChromeTraceEventWithStack) => void;
  highlightedEntry: Accessor<TTimelineEntry | null>;
  selectedEvent: Accessor<ChromeTraceEventWithStack | null>;
}) {
  return (
    <div class={styles.timeline}>
      <h3 class={styles["timeline__label"]}>{label}</h3>
      <div class={styles["timeline__entries"]}>
        <For each={trace.timeline}>
          {(entry) => (
            <TimelineEntry
              entry={entry}
              uniqueEvents={uniqueEvents}
              scale={scale}
              onEventClick={onEventClick}
              highlightedEntry={highlightedEntry}
              selectedEvent={selectedEvent}
            />
          )}
        </For>
      </div>
    </div>
  );
}

function TimelineEntry({
  entry,
  uniqueEvents,
  scale,
  onEventClick,
  highlightedEntry,
  selectedEvent,
}: {
  entry: TTimelineEntry;
  uniqueEvents: Set<string>;
  scale: Accessor<number>;
  onEventClick: (entry: TTimelineEntry, event: ChromeTraceEventWithStack) => void;
  highlightedEntry: Accessor<TTimelineEntry | null>;
  selectedEvent: Accessor<ChromeTraceEventWithStack | null>;
}) {
  const isHighlightedEntry = () => highlightedEntry() === entry;

  return (
    <div class={styles["timeline__entry-lane"]}>
      <For each={entry.lanes}>
        {(lane, laneIdx) => (
          <TimelineEntryLane
            lane={lane}
            start={entry.start}
            isTopLevel={laneIdx() === 0}
            isHighlightedEntry={isHighlightedEntry}
            uniqueEvents={uniqueEvents}
            scale={scale}
            onClick={(event) => onEventClick(entry, event)}
            selectedEvent={selectedEvent}
          />
        )}
      </For>
    </div>
  );
}

function TimelineEntryLane({
  lane,
  start,
  isTopLevel,
  isHighlightedEntry,
  uniqueEvents,
  scale,
  onClick,
  selectedEvent,
}: {
  lane: Array<ChromeTraceEventWithStack>;
  start: number;
  isTopLevel: boolean;
  isHighlightedEntry: Accessor<boolean>;
  uniqueEvents: Set<string>;
  scale: Accessor<number>;
  onClick: (event: ChromeTraceEventWithStack) => void;
  selectedEvent: Accessor<ChromeTraceEventWithStack | null>;
}) {
  const filtered = lane.filter((event) => !IGNORED_EVENTS.has(event.name));

  return (
    <div class={styles["timeline__entry"]}>
      <For each={filtered}>
        {(event, idx) => {
          const getMarginLeft = () => {
            if (isTopLevel) {
              return CONSTANT_GAP;
            }
            const i = idx();
            const prevEnd =
              i === 0 ? start : filtered[i - 1].ts + filtered[i - 1].dur;
            const divisor = BASE_DIVISOR / scale();
            return Math.max((event.ts - prevEnd) / divisor, 0);
          };

          const isSelected = () => selectedEvent() === event;
          const isHighlighted = () =>
            isSelected() || (isTopLevel && isHighlightedEntry());
          const isSelectedNonTopLevel = () => isSelected() && !isTopLevel;

          return (
            <TimelineEntryEvent
              event={event}
              marginLeft={getMarginLeft}
              uniqueEvents={uniqueEvents}
              scale={scale}
              onClick={() => onClick(event)}
              isHighlighted={isHighlighted}
              isSelectedNonTopLevel={isSelectedNonTopLevel}
            />
          );
        }}
      </For>
    </div>
  );
}

function TimelineEntryEvent({
  event,
  marginLeft,
  uniqueEvents,
  scale,
  onClick,
  isHighlighted,
  isSelectedNonTopLevel,
}: {
  event: ChromeTraceEventWithStack;
  marginLeft: Accessor<number>;
  uniqueEvents: Set<string>;
  scale: Accessor<number>;
  onClick: () => void;
  isHighlighted: Accessor<boolean>;
  isSelectedNonTopLevel: Accessor<boolean>;
}) {
  const isUnique = uniqueEvents.has(`${event.name}|${event.ts}|${event.dur}`);
  const durationMs = (event.dur / 1000).toFixed(2);
  const startMs = (event.ts / 1000).toFixed(2);

  const styleString = () => {
    const divisor = BASE_DIVISOR / scale();
    const w = Math.max(event.dur / divisor, 2);
    const ml = marginLeft();
    return `width:${w}px;margin-left:${ml}px`;
  };

  return (
    <span
      class={styles["timeline__entry-event"]}
      style={styleString()}
      data-event-type={event.name}
      data-unique={isUnique ? "" : undefined}
      data-highlighted={isHighlighted() ? "" : undefined}
      data-selected={isSelectedNonTopLevel() ? "" : undefined}
      onClick={onClick}
    >
      {event.name}
      <span class={styles["timeline__tooltip"]}>
        <strong>{event.name}</strong>
        <br />
        Duration: {durationMs}ms
        <br />
        Start: {startMs}ms
        <br />
        <em>Click for flame graph</em>
      </span>
    </span>
  );
}
