export type {
  Diff,
  Timeline,
  TimelineEntry,
  ProcessedTrace,
  ProcessedTraceEvent,
  ProcessedTraceEventCallStack,
  ChromeTraceEventWithStack,
  FlameGraphNode,
} from "./types.ts";

export type { ChromeTraceEvent } from "./ChromeTrace.ts";

export {
  mergeCallStacks,
  collectFlameGraphNodeKeys,
  isNewFlameGraphNode,
} from "./trace/mergeCallStacks.ts";
