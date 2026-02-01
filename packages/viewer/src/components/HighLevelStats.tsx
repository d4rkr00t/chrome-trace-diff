import type { Diff } from "@chrome-trace-diff/lib";
import styles from "./HighLevelStats.module.css";
import { NumberDiffLozenge } from "./NumberDiffLozenge";

export function HighLevelStats({ diff }: { diff: Diff }) {
  return (
    <div class={styles["highlevel-stats"]}>
      <div class="highlevel-stats__column">
        <h2>Before:</h2>
        <ul>
          {Object.entries(diff.traces[0].eventsByName).map(([key, value]) => {
            return (
              <li>
                {key}: {"" + value.total} {"" + value.totalDuration / 1000}ms
              </li>
            );
          })}
        </ul>
      </div>
      <div class="highlevel-stats__column">
        <h2>After:</h2>
        <ul>
          {Object.entries(diff.traces[1].eventsByName).map(([key, value]) => {
            return (
              <li>
                {key}: {"" + value.total} &nbsp;
                <NumberDiffLozenge
                  value={value?.total - diff.traces[0].eventsByName[key].total}
                />
                <NumberDiffLozenge
                  value={
                    (value?.totalDuration -
                      diff.traces[0].eventsByName[key].totalDuration) /
                    1000
                  }
                  unit="ms"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
