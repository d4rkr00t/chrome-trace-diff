import type { ChromeTraceEvent } from "./ChromTraceEvent.ts";

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
  callStacks: unknown[];
};

export type ProfileData = Record<string, ProfileDataEntry>;

export type ProfileDataEntry = {
  pid: string;
  tid: string;
  ts: number;
  tts: number;
  nodes: ProfileDataNode[];
  samples: number[];
  trace_ids: Record<string, string>;
  timeDeltas: number[];
  timeAbs: number[];
};

export type ProfileDataNode = {
  callFrame: {
    scriptId: number;
    functionName: string;
    lineNumber: number;
    columnNumber: number;
  };
  parent: number;
};
