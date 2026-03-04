import type { Diff } from "@chrome-trace-diff/lib";
import styles from "./HighLevelStats.module.css";
import { NumberDiffLozenge } from "./NumberDiffLozenge";
import { Lozenge } from "./Lozenge";

export function HighLevelStats({ diff }: { diff: Diff }) {
  return (
    <div class={styles["highlevel-stats"]}>
      <div class="highlevel-stats__column">
        <div>
          <Lozenge color="green">Before</Lozenge>
        </div>
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
        <div>
          <Lozenge color="orange">After</Lozenge>
        </div>
        <ul>
          {Object.entries(diff.traces[1].eventsByName).map(([key, value]) => {
            return (
              <li>
                {key}: {"" + value.total} &nbsp;
                <NumberDiffLozenge
                  value={value?.total - diff.traces[0].eventsByName[key].total}
                />{" "}
                {value?.totalDuration / 1000}ms{" "}
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
