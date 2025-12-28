import { getEventsRanges } from "./getEventsRanges.ts";
import type { ProcessedTrace } from "./ProcessedTrace.ts";
import type { TraceEvent } from "./TraceEvent.ts";

export function diffTraces(
  ptBefore: ProcessedTrace,
  ptAfter: ProcessedTrace,
): [Array<TraceEvent>, Array<TraceEvent>] {
  const ptBeforeKeys = new Set(Object.keys(ptBefore.grouped));
  const ptAfterKeys = new Set(Object.keys(ptAfter.grouped));

  const matchingKeys = ptBeforeKeys.intersection(ptAfterKeys);

  const ptBeforeRanges = getEventsRanges(matchingKeys, ptBefore.grouped);
  const ptAfterRanges = getEventsRanges(matchingKeys, ptAfter.grouped);

  const flatPtBeforeRanges = Object.values(ptBeforeRanges).flat();
  const flatPtAfterRanges = Object.values(ptAfterRanges).flat();

  const ptBeforeEventsInRange = getEventsInRanges(ptBefore, flatPtBeforeRanges);
  const ptAfterEventsInRange = getEventsInRanges(ptAfter, flatPtAfterRanges);

  return [ptBeforeEventsInRange, ptAfterEventsInRange];
}

function getEventsInRanges(
  pt: ProcessedTrace,
  ranges: Array<[number, number]>,
) {
  const events = [];

  for (const evt of pt.filtered) {
    const es = evt.ts;
    const ee = evt.ts + evt.dur;
    for (const [s, e] of ranges) {
      if (es >= s && ee <= e) {
        events.push(evt);
        break;
      }
    }
  }

  return events;
}
