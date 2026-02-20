import type {
  FlameGraphNode,
  ProcessedTraceEventCallStack,
} from "@chrome-trace-diff/lib";
import {
  mergeCallStacks,
  collectFlameGraphNodeKeys,
  isNewFlameGraphNode,
} from "@chrome-trace-diff/lib";
import { createMemo, For, Show } from "solid-js";

import styles from "./FlameGraph.module.css";

/**
 * A flattened node ready for rendering in a lane row.
 */
type FlatNode = {
  node: FlameGraphNode;
  depth: number;
  widthPct: number;
  isNew: boolean;
};

type FlatRow = FlatNode[];

/**
 * Flatten a FlameGraphNode tree into rows (one per depth level).
 * Each row contains entries whose widthPct is relative to the root's totalTime.
 */
function flattenTree(
  root: FlameGraphNode,
  beforeKeys: Set<string> | undefined,
): FlatRow[] {
  if (root.totalTime <= 0) return [];

  const rows: FlatRow[] = [];

  type QueueItem = { node: FlameGraphNode; depth: number };
  const queue: QueueItem[] = [];

  for (const child of root.children) {
    queue.push({ node: child, depth: 0 });
  }

  while (queue.length > 0) {
    const item = queue.shift()!;
    const { node, depth } = item;

    while (rows.length <= depth) {
      rows.push([]);
    }

    rows[depth]!.push({
      node,
      depth,
      widthPct: (node.totalTime / root.totalTime) * 100,
      isNew: isNewFlameGraphNode(node, depth, beforeKeys),
    });

    for (const child of node.children) {
      queue.push({ node: child, depth: depth + 1 });
    }
  }

  return rows;
}

function formatTime(microseconds: number): string {
  if (microseconds >= 1000) {
    return `${(microseconds / 1000).toFixed(2)}ms`;
  }
  return `${microseconds.toFixed(0)}µs`;
}

function formatLocation(node: FlameGraphNode): string {
  if (!node.url) return "";
  const shortUrl =
    node.url.length > 60 ? "…" + node.url.slice(-57) : node.url;
  return `${shortUrl}:${node.lineNumber}:${node.columnNumber}`;
}

/**
 * Renders a merged call-stack flame graph using the same lane/span styles
 * as the main FlameChart. Accepts an optional `beforeTree` to highlight
 * new nodes in the "after" chart.
 */
export function MergedFlameGraph({
  callStacks,
  beforeTree,
}: {
  callStacks: ProcessedTraceEventCallStack[];
  beforeTree?: FlameGraphNode;
}) {
  const tree = createMemo(() => mergeCallStacks(callStacks));
  const beforeKeys = createMemo(() =>
    beforeTree ? collectFlameGraphNodeKeys(beforeTree) : undefined,
  );
  const rows = createMemo(() => flattenTree(tree(), beforeKeys()));
  const hasData = createMemo(() => rows().length > 0);

  return (
    <Show when={hasData()}>
      <div class={styles["flamegraph__chart"]}>
        <For each={rows()}>
          {(row) => (
            <div class={styles["flamegraph__lane"]}>
              <For each={row}>
                {({ node, widthPct, isNew }) => (
                  <span
                    class={styles["flamegraph__span"]}
                    style={`position:relative;width:${Math.max(widthPct, 0.1)}%`}
                    data-event-type="FunctionCall"
                    data-new={isNew ? "" : undefined}
                  >
                    {node.name}
                    <span class={styles["flamegraph__tooltip"]}>
                      <strong>{node.name}</strong>
                      <br />
                      Total: {formatTime(node.totalTime)}
                      <br />
                      Self: {formatTime(node.selfTime)}
                      <Show when={node.url}>
                        <br />
                        {formatLocation(node)}
                      </Show>
                      {isNew && (
                        <>
                          <br />
                          <strong style="color:#ff3d00">New span</strong>
                        </>
                      )}
                    </span>
                  </span>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
