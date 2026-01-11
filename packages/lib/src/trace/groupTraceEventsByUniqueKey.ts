import type { ChromeTraceEvent } from "../ChromeTrace.ts";
import type { ProcessedTraceEvent } from "../types.ts";
import { getUniqueEventKey } from "./getUniqueKey.ts";

export function groupTraceEventsByUniqueKey(traceEvents: ChromeTraceEvent[]) {
  const groupedTraceEvents: Record<string, ProcessedTraceEvent> = {};

  for (const evt of traceEvents) {
    const id = getUniqueEventKey(evt);

    if (!id) {
      continue;
    }

    groupedTraceEvents[id] = groupedTraceEvents[id] ?? {
      id,
      name: evt.name,
      originalEvents: [],
      callStacks: [],
      totalDuration: 0,
    };

    groupedTraceEvents[id].originalEvents.push(evt);
    groupedTraceEvents[id].totalDuration += evt.dur;
  }

  return groupedTraceEvents;
}
