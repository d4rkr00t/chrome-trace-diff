import type {
  ProcessedTraceEvent,
  FlameGraph,
  SerializableFlameGraph,
} from "../types.ts";

export function buildFlameGraph(
  event: ProcessedTraceEvent,
): SerializableFlameGraph | null {
  const flameGraph: FlameGraph = {
    "1": { children: new Set(), totalDur: 0, callFrame: null },
  };

  if (!event.callStacks.length) {
    return null;
  }

  for (const originalEvent of event.originalEvents) {
    if (!("stack" in originalEvent)) continue;

    for (const stackFrame of originalEvent.stack.stackFrames) {
      const [dur, callFrames] = stackFrame;

      for (const callFrame of callFrames) {
        flameGraph[callFrame.id] = flameGraph[callFrame.id] ?? {
          callFrame: { ...callFrame },
          children: new Set(),
          totalDur: 0,
        };
        flameGraph[callFrame.id].totalDur += dur;

        if (callFrame.parent in flameGraph) {
          flameGraph[callFrame.parent].children.add(callFrame.id);
        }
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

  return serializableFlameGraph;
}
