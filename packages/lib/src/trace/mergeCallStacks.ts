import type { ChromeTraceEventProfileDataNode } from "../ChromeTrace.ts";
import type {
  FlameGraphNode,
  ProcessedTraceEventCallStack,
} from "../types.ts";

/**
 * Build a unique key for a FlameGraphNode based on its identity fields.
 * Uses url instead of scriptId because scriptId is session-specific and
 * will differ between before/after trace recordings.
 */
function nodeKey(node: FlameGraphNode, depth: number): string {
  return `${depth}|${node.url}|${node.name}|${node.lineNumber}|${node.columnNumber}`;
}

/**
 * Collect a set of unique keys from all nodes in a FlameGraphNode tree.
 * Used to detect which nodes in the "after" tree are new compared to "before".
 */
export function collectFlameGraphNodeKeys(
  root: FlameGraphNode,
): Set<string> {
  const keys = new Set<string>();

  function walk(node: FlameGraphNode, depth: number): void {
    keys.add(nodeKey(node, depth));
    for (const child of node.children) {
      walk(child, depth + 1);
    }
  }

  // Start from root's children at depth 0 (skip synthetic root)
  for (const child of root.children) {
    walk(child, 0);
  }

  return keys;
}

/**
 * Check whether a given node at a given depth is "new" relative to a key set.
 */
export function isNewFlameGraphNode(
  node: FlameGraphNode,
  depth: number,
  existingKeys: Set<string> | undefined,
): boolean {
  if (!existingKeys) return false;
  return !existingKeys.has(nodeKey(node, depth));
}

/**
 * Merge multiple call stacks into a single flame graph tree.
 *
 * Each `ProcessedTraceEventCallStack` contains a list of sampled stack frames,
 * where each sample is a `[timeDelta, nodeStack[]]` tuple. The `nodeStack`
 * array is ordered from root (caller) to leaf (callee).
 *
 * This function walks every sample from every call stack, and merges them into
 * a single tree of `FlameGraphNode`s. Nodes at the same depth with the same
 * identity (scriptId + functionName + lineNumber + columnNumber) are merged
 * together, accumulating their time. The leaf node of each sample receives the
 * sample's time delta as self-time.
 *
 * Returns a synthetic root node whose children represent the top-level callers.
 */
export function mergeCallStacks(
  callStacks: ProcessedTraceEventCallStack[],
): FlameGraphNode {
  const root: FlameGraphNode = {
    name: "(root)",
    scriptId: 0,
    url: "",
    lineNumber: 0,
    columnNumber: 0,
    totalTime: 0,
    selfTime: 0,
    children: [],
  };

  for (const callStack of callStacks) {
    for (const [timeDelta, nodeStack] of callStack.stackFrames) {
      const sampleTime = Math.max(timeDelta, 0);
      if (nodeStack.length === 0) continue;

      insertSample(root, nodeStack, 0, sampleTime);
    }
  }

  return root;
}

/**
 * Recursively insert a single sample into the tree.
 *
 * At each depth, we look for an existing child that matches the current
 * profile node's call frame. If found, we accumulate time into that child.
 * If not, we create a new child node. Then we recurse into the next depth.
 *
 * The leaf node (last element in the stack) receives the sample's time
 * as self-time.
 */
function insertSample(
  parent: FlameGraphNode,
  nodeStack: ChromeTraceEventProfileDataNode[],
  depth: number,
  sampleTime: number,
): void {
  if (depth >= nodeStack.length) return;

  const profileNode = nodeStack[depth]!;
  const { callFrame } = profileNode;

  // Find an existing child with the same identity
  let child = parent.children.find(
    (c) =>
      c.scriptId === callFrame.scriptId &&
      c.name === callFrame.functionName &&
      c.lineNumber === callFrame.lineNumber &&
      c.columnNumber === callFrame.columnNumber,
  );

  if (!child) {
    child = {
      name: callFrame.functionName || "(anonymous)",
      scriptId: callFrame.scriptId,
      url: callFrame.url,
      lineNumber: callFrame.lineNumber,
      columnNumber: callFrame.columnNumber,
      totalTime: 0,
      selfTime: 0,
      children: [],
    };
    parent.children.push(child);
  }

  // Accumulate total time (this node was on the stack for this sample)
  child.totalTime += sampleTime;
  parent.totalTime += sampleTime;

  const isLeaf = depth === nodeStack.length - 1;
  if (isLeaf) {
    // Leaf node gets self-time
    child.selfTime += sampleTime;
  } else {
    // Recurse into the next depth
    insertSample(child, nodeStack, depth + 1, sampleTime);
  }
}
