import type { ProcessedFunctionCall } from "./ProcessedFunctionCall.ts";
import type { ProcessedTraceEvent } from "./ProcessedTraceEvent.ts";

export type Diff = {
  timeline: {
    before: Array<ProcessedTraceEvent>;
    after: Array<ProcessedTraceEvent>;
  };
  functionCalls: {
    before: Record<string, ProcessedFunctionCall>;
    after: Record<string, ProcessedFunctionCall>;
  };
};
