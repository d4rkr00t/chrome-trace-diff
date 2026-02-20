import type {
  ChromeTraceEvent,
  ChromeTraceEventProfileDataNode,
} from "./ChromeTrace.ts";

export type Diff = {
  traces: [ProcessedTrace, ProcessedTrace];
  matchingEvents: Array<string>;
  uniqueEvents: [Array<string>, Array<string>];
};

export type ProcessedTrace = {
  events: ProcessedTraceEventsMap;
  eventsByName: ProcessedTraceEventCounter;
  timeline: Timeline;
};

export type ChromeTraceEventWithStack = ChromeTraceEvent & {
  stack: ProcessedTraceEventCallStack;
};

export type Timeline = Array<TimelineEntry>;
export type TimelineEntry = {
  start: number;
  end: number;
  lanes: Array<Array<ChromeTraceEventWithStack>>;
};

export type ProcessedTraceEventsMap = Record<string, ProcessedTraceEvent>;

export type ProcessedTraceEventCounter = Record<
  string,
  {
    eventIds: Set<string>;
    total: number;
    totalDuration: number;
  }
>;

export type ProcessedTraceEvent = {
  id: string;
  name: string;
  originalEvents: ChromeTraceEvent[];
  callStacks: ProcessedTraceEventCallStack[];
  totalDuration: number;
};

export type ProcessedTraceEventCallStack = {
  total: number;
  stackFrames: [number, ChromeTraceEventProfileDataNode[]][];
};

export type FlameGraphNode = {
  name: string;
  scriptId: string | number;
  url: string;
  lineNumber: number;
  columnNumber: number;
  totalTime: number;
  selfTime: number;
  children: FlameGraphNode[];
};

export type ProfileData = Record<string, ProfileDataEntry>;

export type ProfileDataEntry = {
  pid: string | number;
  tid: string | number;
  ts: number;
  tts: number;
  nodes: ChromeTraceEventProfileDataNode[];
  samples: number[];
  trace_ids: Record<string, string>;
  timeDeltas: number[];
  timeAbs: number[];
};
