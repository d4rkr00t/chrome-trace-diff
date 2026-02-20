import type {
  Diff,
  ProcessedTrace,
  TimelineEntry,
  ChromeTraceEventWithStack,
} from "@chrome-trace-diff/lib";
import type { Accessor } from "solid-js";
import { createSignal, Show } from "solid-js";

import { Timeline } from "~/components/Timeline";
import { EventDetails } from "~/components/EventDetails";
import { FlameGraph } from "~/components/FlameGraph";
import type { FlameGraphState } from "~/components/FlameGraph";
import styles from "./DiffTimeline.module.css";

const LEGEND_ITEMS = [
  { label: "Parsing", color: "#4c8df6" },
  { label: "Scripting", color: "#facc15" },
  { label: "Paint", color: "#37be5f" },
  { label: "Layout", color: "#bf67ff" },
  { label: "Image", color: "#757575" },
  { label: "GC", color: "#f00" },
  { label: "Other", color: "#e44" },
];

const MIN_SCALE = 0.01;
const MAX_SCALE = 10;
const SCALE_STEP = 1.5;

function buildUniqueEventKeys(
  trace: ProcessedTrace,
  uniqueEventIds: Array<string>,
): Set<string> {
  const set = new Set<string>();
  for (const eventId of uniqueEventIds) {
    const group = trace.events[eventId];
    if (group) {
      for (const evt of group.originalEvents) {
        set.add(`${evt.name}|${evt.ts}|${evt.dur}`);
      }
    }
  }
  return set;
}

/**
 * Find the top-level event ID from a TimelineEntry's first lane-0 event.
 * Uses the event's unique key (name-based hash) from the processed events map.
 */
function findTopLevelEventId(
  entry: TimelineEntry,
  trace: ProcessedTrace,
): string | null {
  const topLevelEvent = entry.lanes[0]?.[0];
  if (!topLevelEvent) return null;

  for (const [id, group] of Object.entries(trace.events)) {
    if (
      group.originalEvents.some(
        (evt) => evt.ts === topLevelEvent.ts && evt.dur === topLevelEvent.dur,
      )
    ) {
      return id;
    }
  }
  return null;
}

/**
 * Find the TimelineEntry in a trace that contains an event with the given ID.
 */
function findEntryByEventId(
  trace: ProcessedTrace,
  eventId: string,
): TimelineEntry | null {
  const group = trace.events[eventId];
  if (!group) return null;

  for (const entry of trace.timeline) {
    for (const evt of entry.lanes[0] ?? []) {
      if (
        group.originalEvents.some(
          (orig) => orig.ts === evt.ts && orig.dur === evt.dur,
        )
      ) {
        return entry;
      }
    }
  }
  return null;
}


export default function DiffTimeline({ diff }: { diff: Diff }) {
  const [scale, setScale] = createSignal(1);
  const [selectedEvent, setSelectedEvent] =
    createSignal<{ event: ChromeTraceEventWithStack; source: string } | null>(null);
  const [flameGraphState, setFlameGraphState] =
    createSignal<FlameGraphState | null>(null);

  const matchingEventsSet = new Set(diff.matchingEvents);

  const uniqueBefore = buildUniqueEventKeys(
    diff.traces[0],
    diff.uniqueEvents[0],
  );
  const uniqueAfter = buildUniqueEventKeys(
    diff.traces[1],
    diff.uniqueEvents[1],
  );

  const handleTopLevelClick = (
    entry: TimelineEntry,
    sourceTrace: ProcessedTrace,
    otherTrace: ProcessedTrace,
    sourceName: string,
  ) => {
    const eventId = findTopLevelEventId(entry, sourceTrace);
    const topLevelEvent = entry.lanes[0]?.[0];
    const eventName = topLevelEvent?.name ?? "Unknown";

    let beforeEntry: TimelineEntry | null = null;
    let afterEntry: TimelineEntry | null = null;

    if (sourceName === "Before") {
      beforeEntry = entry;
      if (eventId && matchingEventsSet.has(eventId)) {
        afterEntry = findEntryByEventId(otherTrace, eventId);
      }
    } else {
      afterEntry = entry;
      if (eventId && matchingEventsSet.has(eventId)) {
        beforeEntry = findEntryByEventId(otherTrace, eventId);
      }
    }

    setFlameGraphState({ beforeEntry, afterEntry, eventName });
  };

  const zoomIn = () =>
    setScale((s) => Math.min(s * SCALE_STEP, MAX_SCALE));
  const zoomOut = () =>
    setScale((s) => Math.max(s / SCALE_STEP, MIN_SCALE));
  const resetZoom = () => setScale(1);

  return (
    <div class={styles["diff-timeline"]}>
      <div class={styles["diff-timeline__legend"]}>
        {LEGEND_ITEMS.map((item) => (
          <span class={styles["diff-timeline__legend-item"]}>
            <span
              class={styles["diff-timeline__legend-swatch"]}
              style={{ "background-color": item.color }}
            />
            {item.label}
          </span>
        ))}
        <span class={styles["diff-timeline__legend-item"]}>
          <span
            class={`${styles["diff-timeline__legend-swatch"]} ${styles["diff-timeline__legend-swatch--unique"]}`}
          />
          Unique
        </span>
        <span class={styles["diff-timeline__legend-item"]}>
          <span
            class={`${styles["diff-timeline__legend-swatch"]} ${styles["diff-timeline__legend-swatch--new-span"]}`}
          />
          New span
        </span>
        <span class={styles["diff-timeline__zoom"]}>
          <button
            class={styles["diff-timeline__zoom-btn"]}
            onClick={zoomOut}
            title="Zoom out"
          >
            −
          </button>
          <button
            class={styles["diff-timeline__zoom-btn"]}
            onClick={resetZoom}
            title="Reset zoom"
          >
            {Math.round(scale() * 100)}%
          </button>
          <button
            class={styles["diff-timeline__zoom-btn"]}
            onClick={zoomIn}
            title="Zoom in"
          >
            +
          </button>
        </span>
      </div>
      <div class={styles["diff-timeline__scroll-container"]}>
        <Timeline
          trace={diff.traces[0]}
          uniqueEvents={uniqueBefore}
          label="Before"
          scale={scale}
          onEventClick={(entry, event) => {
            handleTopLevelClick(entry, diff.traces[0], diff.traces[1], "Before");
            setSelectedEvent({ event, source: "Before" });
          }}
          highlightedEntry={() => flameGraphState()?.beforeEntry ?? null}
          selectedEvent={() => selectedEvent()?.event ?? null}
        />
        <Timeline
          trace={diff.traces[1]}
          uniqueEvents={uniqueAfter}
          label="After"
          scale={scale}
          onEventClick={(entry, event) => {
            handleTopLevelClick(entry, diff.traces[1], diff.traces[0], "After");
            setSelectedEvent({ event, source: "After" });
          }}
          highlightedEntry={() => flameGraphState()?.afterEntry ?? null}
          selectedEvent={() => selectedEvent()?.event ?? null}
        />
      </div>
      <Show when={selectedEvent()}>
        <EventDetails
          selected={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </Show>
      <Show when={flameGraphState()}>
        <FlameGraph
          state={flameGraphState as Accessor<FlameGraphState>}
          onClose={() => setFlameGraphState(null)}
          onEventClick={(event, source) => {
            setSelectedEvent({ event, source });
          }}
        />
      </Show>
    </div>
  );
}
