import { effect } from "solid-js/web";
import { createSignal, Show } from "solid-js";

import { ProcessedTraceEvent } from "@chrome-trace-diff/lib";

import { NumberDiffLozenge } from "~/components/NumberDiffLozenge";

import { durToMs } from "~/utils/durToMs";

import styles from "./EventDetailsCommon.module.css";

export function EventDetailsCommon(props: {
  afterEvent: ProcessedTraceEvent | null;
  beforeEvent: ProcessedTraceEvent | null;
}) {
  const [totalDurationDiff, setTotalDurationDiff] = createSignal(0);

  effect(() => {
    setTotalDurationDiff(
      durToMs(props.afterEvent?.totalDuration) -
        durToMs(props.beforeEvent?.totalDuration),
    );
  });

  return (
    <>
      <div class={styles["event-details__common"]}>
        <table>
          <tr>
            <td>
              <h3 class={styles["event-details__common-table-header"]}>
                Category
              </h3>
            </td>
            <td>{props.beforeEvent?.originalEvents[0].cat}</td>
          </tr>
          <tr>
            <td>
              <h3 class={styles["event-details__common-table-header"]}>
                Total Duration
              </h3>
            </td>
            <td>
              {durToMs(props.beforeEvent?.totalDuration)}ms →{" "}
              {durToMs(props.afterEvent?.totalDuration)}ms{" "}
              <Show when={totalDurationDiff() !== 0}>
                <NumberDiffLozenge value={totalDurationDiff()} unit="ms" />
              </Show>
            </td>
          </tr>
          <tr>
            <td>
              <h3 class={styles["event-details__common-table-header"]}>
                Number of Calls
              </h3>
            </td>
            <td>
              {props.beforeEvent?.originalEvents.length} →{" "}
              {props.afterEvent?.originalEvents.length}{" "}
              <Show
                when={
                  (props.afterEvent?.originalEvents.length ?? 0) -
                    (props.beforeEvent?.originalEvents.length ?? 0) !==
                  0
                }
              >
                <NumberDiffLozenge
                  value={
                    (props.afterEvent?.originalEvents.length ?? 0) -
                    (props.beforeEvent?.originalEvents.length ?? 0)
                  }
                />
              </Show>
            </td>
          </tr>
        </table>
      </div>

      <Show when={props.beforeEvent?.originalEvents[0].args}>
        <pre>
          {JSON.stringify(
            props.beforeEvent?.originalEvents[0].args ?? {},
            null,
            2,
          )}
        </pre>
      </Show>
    </>
  );
}
