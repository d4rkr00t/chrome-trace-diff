import type { ChromeTraceEvent } from "../ChromeTrace.ts";
import type { ProcessedTraceEvent } from "../types.ts";
import { getUniqueEventKey } from "./getUniqueKey.ts";

export function groupTraceEvents(traceEvents: ChromeTraceEvent[]) {
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
    };
    groupedTraceEvents[id].originalEvents.push(evt);
  }
  return groupedTraceEvents;
}
