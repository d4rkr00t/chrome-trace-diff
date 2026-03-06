import { createSignal, Show } from "solid-js";
import { effect } from "solid-js/web";

import { NumberDiffLozenge } from "~/components/NumberDiffLozenge";

export function EventDetailsCommon(props) {
  return (
    <>
      <h2>{props.beforeEvent?.name ?? props.afterEvent?.name}</h2>

      <hr />

      <div>
        <Show when={props.beforeEvent}>
          <div>
            Before: {props.beforeEvent!.totalDuration / 1000}ms (
            {props.beforeEvent?.originalEvents.length})
          </div>
        </Show>
        <Show when={props.afterEvent}>
          <div>
            After: {props.afterEvent!.totalDuration / 1000}ms{" "}
            <NumberDiffLozenge
              value={
                (props.afterEvent!.totalDuration -
                  (props.beforeEvent?.totalDuration ?? 0)) /
                1000
              }
              unit="ms"
            />{" "}
            ({props.afterEvent?.originalEvents.length}){" "}
            <NumberDiffLozenge
              value={
                props.afterEvent!.originalEvents.length -
                props.beforeEvent!.originalEvents.length
              }
            />
          </div>
        </Show>
      </div>
    </>
  );
}
