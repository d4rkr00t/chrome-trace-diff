import type { ChromeTraceEventWithStack } from "@chrome-trace-diff/lib";
import type { Accessor } from "solid-js";
import { For, Show } from "solid-js";

import styles from "./EventDetails.module.css";

export function EventDetails({
  selected,
  onClose,
}: {
  selected: Accessor<{ event: ChromeTraceEventWithStack; source: string } | null>;
  onClose: () => void;
}) {
  const event = () => selected()!.event;
  const source = () => selected()!.source;
  const durationMs = () => (event().dur / 1000).toFixed(2);
  const startMs = () => (event().ts / 1000).toFixed(2);
  const args = () => {
    const a = event().args;
    return a ? JSON.stringify(a, null, 2) : null;
  };

  return (
    <div class={styles["event-details"]}>
      <div class={styles["event-details__header"]}>
        <h3 class={styles["event-details__title"]}>
          <span
            class={styles["event-details__source"]}
            data-source={source()}
          >
            {source()}
          </span>
          {event().name}
        </h3>
        <button
          class={styles["event-details__close"]}
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>

      <div class={styles["event-details__body"]}>
        <div class={styles["event-details__section"]}>
          <table class={styles["event-details__table"]}>
            <tbody>
              <tr>
                <td class={styles["event-details__label"]}>Category</td>
                <td>{event().cat}</td>
              </tr>
              <tr>
                <td class={styles["event-details__label"]}>Duration</td>
                <td>{durationMs()}ms</td>
              </tr>
              <tr>
                <td class={styles["event-details__label"]}>Start</td>
                <td>{startMs()}ms</td>
              </tr>
              <tr>
                <td class={styles["event-details__label"]}>Phase</td>
                <td>{event().ph}</td>
              </tr>
              <tr>
                <td class={styles["event-details__label"]}>PID / TID</td>
                <td>
                  {event().pid} / {event().tid}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Show when={args()}>
          {(argsJson) => (
            <div class={styles["event-details__section"]}>
              <h4 class={styles["event-details__subtitle"]}>Arguments</h4>
              <pre class={styles["event-details__pre"]}>{argsJson()}</pre>
            </div>
          )}
        </Show>

        <Show when={event().stack && event().stack.stackFrames.length > 0}>
          <div class={styles["event-details__section"]}>
            <h4 class={styles["event-details__subtitle"]}>
              Call Stack ({event().stack.total} samples)
            </h4>
            <ul class={styles["event-details__stack"]}>
              <For each={event().stack.stackFrames}>
                {([count, frames]) => (
                  <li class={styles["event-details__stack-entry"]}>
                    <span class={styles["event-details__stack-count"]}>
                      {count}×
                    </span>
                    <span class={styles["event-details__stack-frames"]}>
                      <For each={frames}>
                        {(frame) => (
                          <span class={styles["event-details__stack-frame"]}>
                            {frame.callFrame.functionName || "(anonymous)"}{" "}
                            <span class={styles["event-details__stack-url"]}>
                              {frame.callFrame.url}:{frame.callFrame.lineNumber}:
                              {frame.callFrame.columnNumber}
                            </span>
                          </span>
                        )}
                      </For>
                    </span>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>
      </div>
    </div>
  );
}
