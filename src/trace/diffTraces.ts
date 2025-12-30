import { getEventsRanges } from "./getEventsRanges.ts";
import type { ProcessedTrace } from "./ProcessedTrace.ts";
import type { TraceEvent } from "./TraceEvent.ts";

export function diffTraces(
  ptBefore: ProcessedTrace,
  ptAfter: ProcessedTrace,
): [
  Array<TraceEvent>,
  Array<TraceEvent>,
  Array<TraceEvent>,
  Array<TraceEvent>,
] {
  const ptBeforeKeys = new Set(Object.keys(ptBefore.grouped));
  const ptAfterKeys = new Set(Object.keys(ptAfter.grouped));

  const matchingKeys = ptBeforeKeys.intersection(ptAfterKeys);
  const onlyInPtBeforeKeys = ptBeforeKeys.difference(ptAfterKeys);
  const onlyInPtAfterKeys = ptAfterKeys.difference(ptBeforeKeys);

  const ptBeforeCommonRanges = getEventsRanges(matchingKeys, ptBefore.grouped);
  const ptBeforeOnlyRanges = getEventsRanges(
    onlyInPtBeforeKeys,
    ptBefore.grouped,
  );
  const ptAfterCommonRanges = getEventsRanges(matchingKeys, ptAfter.grouped);
  const ptAfterOnlyRanges = getEventsRanges(onlyInPtAfterKeys, ptAfter.grouped);

  const flatPtBeforeCommonRanges = Object.values(ptBeforeCommonRanges).flat();
  const flatPtBeforeOnlyRanges = Object.values(ptBeforeOnlyRanges).flat();
  const flatPtAfterCommonRanges = Object.values(ptAfterCommonRanges).flat();
  const flatPtAfterOnlyRanges = Object.values(ptAfterOnlyRanges).flat();

  const ptBeforeCommonEventsInRange = getEventsInRanges(
    ptBefore,
    flatPtBeforeCommonRanges,
  );
  const ptBeforeOnlyEventsInRange = getEventsInRanges(
    ptBefore,
    flatPtBeforeOnlyRanges,
  );
  const ptAfterCommonEventsInRange = getEventsInRanges(
    ptAfter,
    flatPtAfterCommonRanges,
  );
  const ptAfterOnlyEventsInRange = getEventsInRanges(
    ptAfter,
    flatPtAfterOnlyRanges,
  );

  return [
    ptBeforeCommonEventsInRange,
    ptAfterCommonEventsInRange,
    ptBeforeOnlyEventsInRange,
    ptAfterOnlyEventsInRange,
  ];
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
