import { effect } from "solid-js/web";
import { createSignal, Show } from "solid-js";

import { ProcessedTraceEvent } from "@chrome-trace-diff/lib";

import { NumberDiffLozenge } from "~/components/NumberDiffLozenge";
import { Table } from "~/components/Table";
import { TableRow } from "~/components/TableRow";
import { TableCell } from "~/components/TableCell";

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
        <Table>
          <TableRow>
            <TableCell>
              <h3 class={styles["event-details__common-table-header"]}>
                Category
              </h3>
            </TableCell>
            <TableCell>{props.beforeEvent?.originalEvents[0].cat}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3 class={styles["event-details__common-table-header"]}>
                Total Duration
              </h3>
            </TableCell>
            <TableCell>
              {durToMs(props.beforeEvent?.totalDuration)}ms →{" "}
              {durToMs(props.afterEvent?.totalDuration)}ms{" "}
              <Show when={totalDurationDiff() !== 0}>
                <NumberDiffLozenge value={totalDurationDiff()} unit="ms" />
              </Show>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3 class={styles["event-details__common-table-header"]}>
                Number of Calls
              </h3>
            </TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        </Table>
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
