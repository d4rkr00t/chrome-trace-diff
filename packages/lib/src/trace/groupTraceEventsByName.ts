import type { ChromeTraceEvent } from "../ChromeTrace.ts";
import type {
  ProcessedTraceEvent,
  ProcessedTraceEventCounter,
} from "../types.ts";
import { getUniqueEventKey } from "./getUniqueKey.ts";

export function groupTraceEventsByName(traceEvents: ChromeTraceEvent[]) {
  const groupedTraceEvents: ProcessedTraceEventCounter = {};

  for (const evt of traceEvents) {
    const id = getUniqueEventKey(evt);

    if (!id) {
      continue;
    }

    groupedTraceEvents[evt.name] = groupedTraceEvents[evt.name] ?? {
      eventIds: new Set(),
      total: 0,
      totalDuration: 0,
    };

    groupedTraceEvents[evt.name]!.eventIds.add(id);
    groupedTraceEvents[evt.name]!.total++;
    groupedTraceEvents[evt.name]!.totalDuration += evt.dur ?? 0;
  }

  return groupedTraceEvents;
}
