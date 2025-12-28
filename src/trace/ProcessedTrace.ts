import type { ProcessedTraceEvent } from "./ProcessedTraceEvent.ts";
import type { TraceEvent } from "./TraceEvent.ts";

export type ProcessedTrace = {
  grouped: Record<string, ProcessedTraceEvent>;
  filtered: Array<TraceEvent>;
};
