import type { ChromeTrace } from "../ChromeTrace.ts";
import type { ProcessedTrace } from "../types.ts";

import { buildCallStacks } from "./buildCallStacks.ts";
import { groupTraceEvents } from "./groupTraceEvents.ts";
import { filterTraceEvents } from "./filterTraceEvents.ts";

export function processTrace(trace: ChromeTrace): ProcessedTrace {
  // 1. Filter events
  const filteredTraceEvents = filterTraceEvents(trace.traceEvents);

  // 2. Group events
  const groupedTraceEvents = groupTraceEvents(filteredTraceEvents);

  // 3. Build call stacks
  const callStacks = buildCallStacks(trace.traceEvents, filteredTraceEvents);

  for (const key of Object.keys(callStacks)) {
    if (groupedTraceEvents[key]) {
      groupedTraceEvents[key].callStacks = callStacks[key] ?? [];
    }
  }

  return {
    events: groupedTraceEvents,
  };
}
