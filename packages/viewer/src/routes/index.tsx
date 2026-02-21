import diffData from "../../../../diff.json";

import type { Diff } from "@chrome-trace-diff/lib";

import { DiffViewer } from "~/components/DiffViewer";

export default function Index() {
  const diff = diffData as unknown as Diff;

  return (
    <main>
      <DiffViewer diff={diff} />
    </main>
  );
}
