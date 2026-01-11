import type {
  ChromeTraceEvent,
  ChromeTraceEventProfileDataNode,
} from "./ChromeTrace.ts";

export type Diff = {
  traces: [ProcessedTrace, ProcessedTrace];
  matchingEvents: Set<string>;
  uniqueEvents: [Set<string>, Set<string>];
};

export type ProcessedTrace = {
  events: Record<string, ProcessedTraceEvent>;
  eventsByName: Record<string, ProcessedTraceEventCounter>;
};

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
