import type { ChromeTrace } from "../ChromeTrace.ts";
import type { ProcessedTrace } from "../types.ts";

import { buildCallStacks } from "./buildCallStacks.ts";
import { groupTraceEventsByUniqueKey } from "./groupTraceEventsByUniqueKey.ts";
import { filterTraceEvents } from "./filterTraceEvents.ts";
import { groupTraceEventsByName } from "./groupTraceEventsByName.ts";
import { buildTimeline } from "./buildTimeline.ts";

export function processTrace(trace: ChromeTrace): ProcessedTrace {
  // 1. Filter events
  const filteredTraceEvents = filterTraceEvents(trace.traceEvents);

  // 2. Group events
  const groupedTraceEventsByKey =
    groupTraceEventsByUniqueKey(filteredTraceEvents);
  const groupedTraceEventsByName = groupTraceEventsByName(filteredTraceEvents);

  // 3. Build call stacks
  const callStacks = buildCallStacks(trace.traceEvents, filteredTraceEvents);

  // 4. Assign callstacks to groups
  for (const key of Object.keys(callStacks)) {
    if (groupedTraceEventsByKey[key]) {
      groupedTraceEventsByKey[key].callStacks = callStacks[key] ?? [];
    }
  }

  // 5. Build timeline
  const timeline = buildTimeline(groupedTraceEventsByKey);

  return {
    events: groupedTraceEventsByKey,
    eventsByName: groupedTraceEventsByName,
    timeline,
  };
}
