import { getUniqueEventKey } from "./getUniqueKey.ts";
import type { ProcessedTraceEvent } from "./ProcessedTraceEvent.ts";
import type { TraceEvent } from "./TraceEvent.ts";

export function groupTraceEvents(traceEvents: TraceEvent[]) {
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
    };
    groupedTraceEvents[id].originalEvents.push(evt);
  }
  return groupedTraceEvents;
}
