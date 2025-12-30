import type { TraceEvent } from "./TraceEvent.ts";

export function adjustTrace(trace: Array<TraceEvent>, pidName: string) {
  const [ts, tts] = getStartProfile(trace);

  return trace.map((event) => {
    event = structuredClone(event);
    event = adjustStartTime(event, ts, tts);
    event.pid = pidName + " | PID";
    event.tid = pidName + " | TID";
    return event;
  });
}

function getStartProfile(trace: Array<TraceEvent>): [number, number] {
  // const startEvent = trace.find(
  //   (evt) => evt.name === "CpuProfiler::StartProfiling",
  // );
  const startEvent = trace[0];

  if (startEvent) {
    return [startEvent.ts, startEvent.tts];
  }

  return [0, 0];
}

function adjustStartTime(evt: TraceEvent, ts: number, tts: number): TraceEvent {
  evt.ts = evt.ts - ts;
  evt.tts = evt.tts - tts;
  return evt;
}
