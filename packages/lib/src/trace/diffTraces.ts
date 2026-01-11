import type { Diff, ProcessedTrace } from "../types.ts";

export function diffTraces(
  traceBefore: ProcessedTrace,
  traceAfter: ProcessedTrace,
): Diff {
  const diff: Diff = {
    traces: [traceBefore, traceAfter],
    matchingEvents: new Set(Object.keys(traceBefore.events)).intersection(
      new Set(Object.keys(traceAfter.events)),
    ),
    uniqueEvents: [
      new Set(Object.keys(traceBefore.events)).difference(
        new Set(Object.keys(traceAfter.events)),
      ),
      new Set(Object.keys(traceAfter.events)).difference(
        new Set(Object.keys(traceBefore.events)),
      ),
    ],
  };

  return diff;
}
