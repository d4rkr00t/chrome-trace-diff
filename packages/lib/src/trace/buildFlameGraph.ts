import { getCallFrameKey } from "../utils/getCallFrameKey.ts";
import type {
  ProcessedTraceEvent,
  FlameGraph,
  SerializableFlameGraph,
} from "../types.ts";

export function buildFlameGraph(event: ProcessedTraceEvent | null): {
  flameGraph: SerializableFlameGraph;
  flameGraphEntryKeys: Set<string>;
} | null {
  if (!event || !event.callStacks.length) {
    return null;
  }

  const flameGraph: FlameGraph = {
    "1": { children: new Set(), totalDur: 0, callFrame: null },
  };

  const flameGraphEntryKeys: Set<string> = new Set();

  for (const originalEvent of event.originalEvents) {
    if (!("stack" in originalEvent)) continue;

    for (const stackFrame of originalEvent.stack.stackFrames) {
      const [dur, callFrames] = stackFrame;

      for (const callFrame of callFrames) {
        flameGraph[callFrame.id] = flameGraph[callFrame.id] ?? {
          callFrame: { ...callFrame.callFrame },
          children: new Set(),
          totalDur: 0,
          key: "",
        };
        flameGraph[callFrame.id].totalDur += dur;

        if (callFrame.parent in flameGraph) {
          flameGraph[callFrame.parent].children.add(callFrame.id);
        }

        flameGraphEntryKeys.add(getCallFrameKey(callFrame.callFrame));
      }
    }
  }

  const serializableFlameGraph: SerializableFlameGraph = {};

  for (const key of Object.keys(flameGraph)) {
    // Converting children to an array so it's serializable to JSON
    serializableFlameGraph[key] = {
      ...flameGraph[key],
      children: Array.from(flameGraph[key].children),
    };
  }

  // Get total time of the first child
  serializableFlameGraph[1].totalDur =
    serializableFlameGraph[serializableFlameGraph[1]?.children[0]]?.totalDur ??
    0;

  return {
    flameGraph: serializableFlameGraph,
    flameGraphEntryKeys: flameGraphEntryKeys,
  };
}
