export type {
  Diff,
  Timeline,
  TimelineEntry,
  ProcessedTrace,
  ChromeTraceEventWithStack,
  ProcessedTraceEvent,
  SerializableFlameGraph,
} from "./types.ts";

export type { ChromeTraceEvent } from "./ChromeTrace.ts";

export { getUniqueEventKey } from "./trace/getUniqueKey.ts";

export { buildFlameGraph } from "./trace/buildFlameGraph.ts";
