import { ProcessedTraceEvent } from "@chrome-trace-diff/lib";
import { Show } from "solid-js";

import { NumberDiffLozenge } from "~/components/NumberDiffLozenge";

export function EventDetailsCommon(props: {
  afterEvent: ProcessedTraceEvent | null;
  beforeEvent: ProcessedTraceEvent | null;
}) {
  return (
    <>
      <h2>{props.beforeEvent?.name ?? props.afterEvent?.name}</h2>

      <hr />

      <div>
        <Show when={props.beforeEvent}>
          <div>
            Before: {(props.beforeEvent?.totalDuration ?? 0) / 1000}ms (
            {props.beforeEvent?.originalEvents.length})
          </div>
        </Show>
        <Show when={props.afterEvent}>
          <div>
            After: {(props.afterEvent?.totalDuration ?? 0) / 1000}ms{" "}
            <NumberDiffLozenge
              value={
                ((props.afterEvent?.totalDuration ?? 0) -
                  (props.beforeEvent?.totalDuration ?? 0)) /
                1000
              }
              unit="ms"
            />{" "}
            ({props.afterEvent?.originalEvents.length}){" "}
            <NumberDiffLozenge
              value={
                (props.afterEvent?.originalEvents?.length ?? 0) -
                (props.beforeEvent?.originalEvents?.length ?? 0)
              }
            />
          </div>
        </Show>
      </div>
    </>
  );
}
