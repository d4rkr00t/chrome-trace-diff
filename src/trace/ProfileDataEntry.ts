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
