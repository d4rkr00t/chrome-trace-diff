import { ProcessedTraceEvent } from "@chrome-trace-diff/lib/src/types";
import { createSignal, Show, useContext } from "solid-js";
import { effect } from "solid-js/web";

import { DiffViewerStoreContext } from "~/context/DiffViewerStoreContext";

import { Card } from "~/components/Card";
import { Lozenge } from "~/components/Lozenge";
import { EventDetailsCommon } from "~/components/EventDetailsCommon";
import { EventFlameGraph } from "~/components/EventFlameGraph";

import styles from "./EventDetails.module.css";
import {
  buildFlameGraph,
  type SerializableFlameGraph,
} from "@chrome-trace-diff/lib/src";

export function EventDetails() {
  const diffViewerStore = useContext(DiffViewerStoreContext);
  const [beforeEvent, setBeforeEvent] =
    createSignal<ProcessedTraceEvent | null>(null);
  const [afterEvent, setAfterEvent] = createSignal<ProcessedTraceEvent | null>(
    null,
  );
  const [eventType, setEventType] = createSignal<string>("unknown");

  const [beforeEventFlameGraph, setBeforeEventFlameGraph] = createSignal<{
    flameGraph: SerializableFlameGraph;
    flameGraphEntryKeys: Set<string>;
  } | null>(null);
  const [afterEventFlameGraph, setAfterEventFlameGraph] = createSignal<{
    flameGraph: SerializableFlameGraph;
    flameGraphEntryKeys: Set<string>;
  } | null>(null);

  effect(() => {
    const processedTraceEventBefore =
      diffViewerStore.state.diff.traces[0].events[
        diffViewerStore.state.selectedChromeEventId!
      ];
    setBeforeEvent(processedTraceEventBefore);
    setBeforeEventFlameGraph(buildFlameGraph(processedTraceEventBefore));

    const processedTraceEventAfter =
      diffViewerStore.state.diff.traces[1].events[
        diffViewerStore.state.selectedChromeEventId!
      ];
    setAfterEvent(processedTraceEventAfter);
    setAfterEventFlameGraph(buildFlameGraph(processedTraceEventAfter));

    setEventType(
      processedTraceEventBefore?.name ?? processedTraceEventAfter?.name,
    );
  });

  return (
    <Show when={diffViewerStore.state.selectedChromeEventId}>
      <Card
        customClass={styles["event-details"]}
        title={eventType()}
        spacing="lg"
      >
        <EventDetailsCommon
          beforeEvent={beforeEvent()}
          afterEvent={afterEvent()}
        />

        <Show when={beforeEventFlameGraph()}>
          <div class={styles["event-details__flame-graph"]}>
            <EventFlameGraph
              title={<Lozenge color="green">Before</Lozenge>}
              flameGraph={beforeEventFlameGraph()!}
              flameGraphEntryKeysOther={
                afterEventFlameGraph()?.flameGraphEntryKeys ?? new Set()
              }
            />
          </div>
        </Show>

        <Show when={afterEventFlameGraph()}>
          <div class={styles["event-details__flame-graph"]}>
            <EventFlameGraph
              title={<Lozenge color="orange">After</Lozenge>}
              flameGraph={afterEventFlameGraph()!}
              flameGraphEntryKeysOther={
                beforeEventFlameGraph()?.flameGraphEntryKeys ?? new Set()
              }
            />
          </div>
        </Show>
      </Card>
    </Show>
  );
}
