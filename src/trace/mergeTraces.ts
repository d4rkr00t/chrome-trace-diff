import type { ChromeTraceEvent } from "../ChromTraceEvent.ts";

export function mergeTraces(...traces: Array<Array<ChromeTraceEvent>>) {
  return {
    traceEvents: traces.reduce((acc, trace) => {
      acc.push(...trace);
      return acc;
    }, []),
  };
}
