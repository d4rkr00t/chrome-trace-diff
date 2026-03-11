import { ProcessedTraceEvent } from "@chrome-trace-diff/lib";
import { Show } from "solid-js";

import { NumberDiffLozenge } from "~/components/NumberDiffLozenge";
import { Table } from "~/components/Table";
import { TableRow } from "~/components/TableRow";
import { TableCell } from "~/components/TableCell";

import styles from "./EventDetailsCommon.module.css";

export function EventDetailsCommon(props: {
  afterEvent: ProcessedTraceEvent | null;
  beforeEvent: ProcessedTraceEvent | null;
}) {
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
              {props.beforeEvent?.totalDuration / 1000}ms →{" "}
              {props.afterEvent?.totalDuration / 1000}ms{" "}
              <NumberDiffLozenge
                value={
                  (props.afterEvent?.totalDuration -
                    props.beforeEvent?.totalDuration) /
                  1000
                }
                unit="ms"
              />
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
                  props.afterEvent?.originalEvents.length -
                    props.beforeEvent?.originalEvents.length !==
                  0
                }
              >
                <NumberDiffLozenge
                  value={
                    props.afterEvent?.originalEvents.length -
                    props.beforeEvent?.originalEvents.length
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
