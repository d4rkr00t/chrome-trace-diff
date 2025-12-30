import type { TraceEvent } from "./TraceEvent.ts";

export function mergeTraces(...traces: Array<Array<TraceEvent>>) {
  return {
    traceEvents: traces.reduce((acc, trace) => {
      acc.push(...trace);
      return acc;
    }, []),
  };
}
