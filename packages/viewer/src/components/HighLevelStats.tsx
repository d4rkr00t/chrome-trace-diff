import type { Diff } from "@chrome-trace-diff/lib";
import styles from "./HighLevelStats.module.css";
import { NumberDiffLozenge } from "./NumberDiffLozenge";
import { Lozenge } from "./Lozenge";
import { Card } from "./Card";
import { durToMs } from "~/utils/durToMs";

export function HighLevelStats({ diff }: { diff: Diff }) {
  return (
    <Card customClass={styles["highlevel-stats"]} spacing="lg">
      <div class={styles["highlevel-stats__column"]}>
        <div>
          <Lozenge color="green">Before</Lozenge>
        </div>
        <table class={styles["highlevel-stats__list"]}>
          <tbody>
            {Object.entries(diff.traces[0].eventsByName)
              .toSorted((a, b) => a[0].localeCompare(b[0]))
              .map(([key, value]) => {
                return (
                  <tr>
                    <td>
                      <h3 class={styles["highlevel-stats__list-heading"]}>
                        {key}:
                      </h3>
                    </td>
                    <td>{"" + value.total}</td>
                    <td>{durToMs(value.totalDuration)}ms</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div
        classList={{
          [styles["highlevel-stats__column"]]: true,
          [styles["--with-sep"]]: true,
        }}
      >
        <div>
          <Lozenge color="orange">After</Lozenge>
        </div>
        <table class={styles["highlevel-stats__list"]}>
          <tbody>
            {Object.entries(diff.traces[1].eventsByName)
              .toSorted((a, b) => a[0].localeCompare(b[0]))
              .map(([key, value]) => {
                return (
                  <tr>
                    <td>
                      <h3 class={styles["highlevel-stats__list-heading"]}>
                        {key}:
                      </h3>
                    </td>
                    <td>{value.total}</td>
                    <td>
                      <NumberDiffLozenge
                        value={
                          value?.total - diff.traces[0].eventsByName[key].total
                        }
                      />
                    </td>
                    <td>{durToMs(value.totalDuration)}ms</td>
                    <td>
                      <NumberDiffLozenge
                        value={durToMs(
                          value?.totalDuration -
                            diff.traces[0].eventsByName[key].totalDuration,
                        )}
                        unit="ms"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
