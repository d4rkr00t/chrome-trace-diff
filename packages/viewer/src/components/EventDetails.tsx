import { ProcessedTraceEvent } from "@chrome-trace-diff/lib/src/types";
import { createSignal, Show, useContext } from "solid-js";
import { effect } from "solid-js/web";

import { DiffViewerStoreContext } from "~/context/DiffViewerStoreContext";

import { Card } from "~/components/Card";
import { EventDetailsCommon } from "~/components/EventDetailsCommon";

import styles from "./EventDetails.module.css";

export function EventDetails() {
  const diffViewerStore = useContext(DiffViewerStoreContext);
  const [beforeEvent, setBeforeEvent] =
    createSignal<ProcessedTraceEvent | null>(null);
  const [afterEvent, setAfterEvent] = createSignal<ProcessedTraceEvent | null>(
    null,
  );
  const [eventType, setEventType] = createSignal<string>("unknown");

  effect(() => {
    const processedTraceEventBefore =
      diffViewerStore.state.diff.traces[0].events[
        diffViewerStore.state.selectedChromeEventId!
      ];
    setBeforeEvent(processedTraceEventBefore);

    const processedTraceEventAfter =
      diffViewerStore.state.diff.traces[1].events[
        diffViewerStore.state.selectedChromeEventId!
      ];
    setAfterEvent(processedTraceEventAfter);
    console.log(processedTraceEventAfter);

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
      </Card>
    </Show>
  );
}
