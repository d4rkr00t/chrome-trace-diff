import diffData from "../../../../diff.json";
import { clientOnly } from "@solidjs/start";

import type { Diff } from "@chrome-trace-diff/lib";

import { HighLevelStats } from "~/components/HighLevelStats";

const DiffTimeline = clientOnly(
  () => import("~/components/DiffTimeline"),
);

export default function Index() {
  const diff = diffData as unknown as Diff;

  return (
    <main>
      <h1>Index Page</h1>
      <HighLevelStats diff={diff} />
      <hr />
      <DiffTimeline diff={diff} />
    </main>
  );
}
