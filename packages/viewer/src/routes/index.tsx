import diffData from "../../../../diff.json";

import type { Diff } from "@chrome-trace-diff/lib";

import { HighLevelStats } from "~/components/HighLevelStats";
import { Timeline } from "~/components/Timeline";

export default function Index() {
  const diff = diffData as unknown as Diff;

  return (
    <main>
      <h1>Index Page</h1>
      <HighLevelStats diff={diff} />
      <hr />
      <Timeline trace={diff.traces[0]} />
      <Timeline trace={diff.traces[1]} />
    </main>
  );
}
