import type {
  TimelineEntry,
  ChromeTraceEventWithStack,
} from "@chrome-trace-diff/lib";
import type { Accessor } from "solid-js";
import { For, Show } from "solid-js";

import styles from "./FlameGraph.module.css";

export type FlameGraphState = {
  beforeEntry: TimelineEntry | null;
  afterEntry: TimelineEntry | null;
  eventName: string;
};

/**
 * Collect a set of "name|laneIndex" keys from a TimelineEntry.
 * Used to detect which sub-spans in the "after" entry are new.
 */
function collectSpanKeys(entry: TimelineEntry): Set<string> {
  const keys = new Set<string>();
  for (let laneIdx = 0; laneIdx < entry.lanes.length; laneIdx++) {
    for (const evt of entry.lanes[laneIdx]!) {
      keys.add(`${evt.name}|${laneIdx}`);
    }
  }
  return keys;
}

function computeNewSpanKeys(
  beforeEntry: TimelineEntry | null,
  afterEntry: TimelineEntry | null,
): Set<string> | undefined {
  if (!beforeEntry || !afterEntry) return undefined;
  const beforeKeys = collectSpanKeys(beforeEntry);
  const afterKeys = collectSpanKeys(afterEntry);
  const newKeys = new Set<string>();
  for (const key of afterKeys) {
    if (!beforeKeys.has(key)) {
      newKeys.add(key);
    }
  }
  return newKeys.size > 0 ? newKeys : undefined;
}

function FlameChartLane({
  entry,
  laneIdx,
  newSpanKeys,
  onEventClick,
}: {
  entry: Accessor<TimelineEntry>;
  laneIdx: number;
  newSpanKeys: Accessor<Set<string> | undefined>;
  onEventClick: (event: ChromeTraceEventWithStack) => void;
}) {
  const lane = () => entry().lanes[laneIdx] ?? [];
  const entryStart = () => entry().start;
  const entryDuration = () => entry().end - entry().start;

  return (
    <div class={styles["flamegraph__lane"]}>
      <For each={lane()}>
        {(event) => {
          const leftPct = () =>
            ((event.ts - entryStart()) / entryDuration()) * 100;
          const widthPct = () => (event.dur / entryDuration()) * 100;
          const isNew = () => {
            const keys = newSpanKeys();
            return keys != null && keys.has(`${event.name}|${laneIdx}`);
          };
          const durationMs = (event.dur / 1000).toFixed(2);
          const startMs = (event.ts / 1000).toFixed(2);

          return (
            <span
              class={styles["flamegraph__span"]}
              style={`left:${leftPct()}%;width:${Math.max(widthPct(), 0.1)}%`}
              data-event-type={event.name}
              data-new={isNew() ? "" : undefined}
              onClick={() => onEventClick(event)}
            >
              {event.name}
              <span class={styles["flamegraph__tooltip"]}>
                <strong>{event.name}</strong>
                <br />
                Duration: {durationMs}ms
                <br />
                Start: {startMs}ms
                {isNew() && (
                  <>
                    <br />
                    <strong style="color:#ff3d00">New span</strong>
                  </>
                )}
              </span>
            </span>
          );
        }}
      </For>
    </div>
  );
}

function FlameChart({
  entry,
  newSpanKeys,
  onEventClick,
}: {
  entry: Accessor<TimelineEntry>;
  newSpanKeys: Accessor<Set<string> | undefined>;
  onEventClick: (event: ChromeTraceEventWithStack) => void;
}) {
  const laneIndices = () =>
    Array.from({ length: entry().lanes.length }, (_, i) => i);

  return (
    <div class={styles["flamegraph__chart"]}>
      <For each={laneIndices()}>
        {(laneIdx) => (
          <FlameChartLane
            entry={entry}
            laneIdx={laneIdx}
            newSpanKeys={newSpanKeys}
            onEventClick={onEventClick}
          />
        )}
      </For>
    </div>
  );
}

export function FlameGraph({
  state,
  onClose,
  onEventClick,
}: {
  state: Accessor<FlameGraphState>;
  onClose: () => void;
  onEventClick: (event: ChromeTraceEventWithStack, source: string) => void;
}) {
  const beforeEntry = () => state().beforeEntry;
  const afterEntry = () => state().afterEntry;
  const eventName = () => state().eventName;
  const newSpanKeys = () => computeNewSpanKeys(beforeEntry(), afterEntry());
  const noNewSpanKeys = () => undefined as Set<string> | undefined;

  return (
    <div class={styles["flamegraph"]}>
      <div class={styles["flamegraph__header"]}>
        <h3 class={styles["flamegraph__title"]}>
          Flame Graph — {eventName()}
        </h3>
        <button
          class={styles["flamegraph__close"]}
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>

      <div class={styles["flamegraph__body"]}>
        <div class={styles["flamegraph__comparison"]}>
          <Show when={beforeEntry()}>
            <div class={styles["flamegraph__side"]}>
              <span
                class={styles["flamegraph__side-label"]}
                data-source="Before"
              >
                Before
              </span>
              <FlameChart
                entry={beforeEntry as Accessor<TimelineEntry>}
                newSpanKeys={noNewSpanKeys}
                onEventClick={(evt) => onEventClick(evt, "Before")}
              />
            </div>
          </Show>

          <Show when={afterEntry()}>
            <div class={styles["flamegraph__side"]}>
              <span
                class={styles["flamegraph__side-label"]}
                data-source="After"
              >
                After
              </span>
              <FlameChart
                entry={afterEntry as Accessor<TimelineEntry>}
                newSpanKeys={newSpanKeys}
                onEventClick={(evt) => onEventClick(evt, "After")}
              />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
