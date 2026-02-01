import type {
  ProcessedTraceEventsMap,
  Timeline,
  ChromeTraceEventWithStack,
} from "../types.ts";

export function buildTimeline(events: ProcessedTraceEventsMap): Timeline {
  const sortedEvents: Array<ChromeTraceEventWithStack> = Object.keys(events)
    .flatMap((eventId) => {
      return events[eventId]?.originalEvents.map((evt, idx) => {
        (evt as ChromeTraceEventWithStack).stack =
          events[eventId]?.callStacks[idx];
        return evt as ChromeTraceEventWithStack;
      });
    })
    .filter(Boolean)
    .toSorted((a, b) => {
      if (a.ts === b.ts) {
        return b.dur - a.dur;
      }
      return a.ts - b.ts;
    });

  const groupedEvents: Timeline = [];

  for (const evt of sortedEvents) {
    let didOverlap = false;
    let insertedEvent = false;
    for (const prev of groupedEvents) {
      if (prev.start < evt.ts + evt.dur && prev.end > evt.ts) {
        didOverlap = true;
        prev.start = Math.min(prev.start, evt.ts);
        prev.end = Math.max(prev.end, evt.ts + evt.dur);

        for (const lane of prev.lanes) {
          let hadOverlap = false;
          for (const laneEntry of lane) {
            if (
              laneEntry.ts < evt.ts + evt.dur &&
              laneEntry.ts + laneEntry.dur > evt.ts
            ) {
              hadOverlap = true;
            }
          }

          if (!hadOverlap) {
            lane.push(evt);
            insertedEvent = true;
            break;
          }
        }

        if (!insertedEvent) {
          prev.lanes.push([evt]);
        }

        break;
      }
    }

    if (!didOverlap) {
      groupedEvents.push({
        start: evt.ts,
        end: evt.ts + evt.dur,
        lanes: [[evt]],
      });
    }
  }

  return groupedEvents;
}
