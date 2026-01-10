import type { ChromeTraceEvent } from "../ChromeTrace.ts";

export function mergeTraces(...traces: Array<Array<ChromeTraceEvent>>) {
  return {
    traceEvents: traces.reduce((acc, trace) => {
      acc.push(...trace);
      return acc;
    }, []),
  };
}
