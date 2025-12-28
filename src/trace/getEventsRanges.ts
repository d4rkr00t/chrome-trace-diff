import type { ProcessedTrace } from "./ProcessedTrace.ts";

export function getEventsRanges(
  keys: Set<string>,
  events: ProcessedTrace["grouped"],
): Record<string, Array<[number, number]>> {
  const ranges: Record<string, Array<[number, number]>> = {};

  for (const key of keys.values()) {
    const group = events[key]!;
    ranges[key] = ranges[key] ?? [];
    for (const event of group.originalEvents) {
      ranges[key].push([event.ts, event.ts + event.dur]);
    }
  }

  return ranges;
}
