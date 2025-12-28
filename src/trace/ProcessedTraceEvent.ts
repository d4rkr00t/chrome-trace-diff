import type { TraceEvent } from "./TraceEvent.ts";

export type ProcessedTraceEvent = {
  id: string;
  name: string;
  originalEvents: TraceEvent[];
};
