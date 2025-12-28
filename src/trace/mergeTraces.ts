import type { TraceEvent } from "./TraceEvent.ts";

export function mergeTraces(
  trace1: Array<TraceEvent>,
  trace2: Array<TraceEvent>,
) {
  const [t1ts, t1tts] = getStartProfile(trace1);
  const [t2ts, t2tts] = getStartProfile(trace2);

  return {
    traceEvents: [
      ...adjsutStartTime(trace1, t1ts, t1tts),
      ...adjsutStartTime(trace2, t2ts, t2tts),
    ],
  };
}

function getStartProfile(trace: Array<TraceEvent>): [number, number] {
  const startEvent = trace.find(
    (evt) => evt.name === "CpuProfiler::StartProfiling",
  );

  if (startEvent) {
    return [startEvent.ts, startEvent.tts];
  }

  return [0, 0];
}

function adjsutStartTime(
  trace: Array<TraceEvent>,
  ts: number,
  tts: number,
): Array<TraceEvent> {
  for (const evt of trace) {
    evt.ts = evt.ts - ts;
    evt.tts = evt.tts - tts;
  }

  return trace;
}
