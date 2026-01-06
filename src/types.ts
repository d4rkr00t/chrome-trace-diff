import type {
  ChromeTraceEvent,
  ChromeTraceEventProfileDataNode,
} from "./ChromeTraceEvent.ts";

export type Diff = {
  traces: [unknown, unknown];
  matchingEvents: Set<string>;
  uniqueEvents: [Set<string>, Set<string>];
};

export type ProcessedTrace = {
  events: Record<string, ProcessedTraceEvent>;
};

export type ProcessedTraceEvent = {
  id: string;
  name: string;
  originalEvents: ChromeTraceEvent[];
  callStacks: ProcessedTraceEventCallStack[];
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
