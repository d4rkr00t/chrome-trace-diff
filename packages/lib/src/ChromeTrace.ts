type ChromeTraceEventCommon = {
  ph: "M" | "I" | "X";
  name: string;
  cat: string;
  pid: number | string;
  tid: number | string;
  ts: number;
  tts: number;
  dur: number;
  args?: { name: string };
};

export type ChromeTraceEventFunctionCall = ChromeTraceEventCommon & {
  name: "FunctionCall";
  args: {
    data: {
      columnNumber: number;
      lineNumber: number;
      url: string;
      functionName: string;
      scriptId: string;
    };
  };
};

export type ChromeTraceEventParseHTML = ChromeTraceEventCommon & {
  name: "ParseHTML";
  args: {
    beginData: {
      startLine: number;
      url: string;
    };
    endData: { endLine: number };
  };
};

export type ChromeTraceEventEvaluateScript = ChromeTraceEventCommon & {
  name: "EvaluateScript";
  args?: {
    data?: {
      columnNumber: number;
      lineNumber: number;
      url: string;
    };
  };
};

export type ChromeTraceEventScriptCompiled = ChromeTraceEventCommon & {
  name: "ScriptCompiled";
  args: {
    data: {
      url: string;
    };
  };
};

export type ChromeTraceEventV8Compile = ChromeTraceEventCommon & {
  name: "v8.compile";
  args: {
    data: {
      columnNumber: number;
      lineNumber: number;
      url: string;
    };
  };
};

export type ChromeTraceEventV8CompileModule = ChromeTraceEventCommon & {
  name: "v8.compileModule";
  args: {
    data: {
      columnNumber: number;
      lineNumber: number;
      url: string;
    };
  };
};

export type ChromeTraceEventPaintImage = ChromeTraceEventCommon & {
  name: "PaintImage";
  args: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
};

export type ChromeTraceEventV8Run = ChromeTraceEventCommon & {
  name: "v8.run";
  args: {
    fileName: string;
  };
};

export type ChromeTraceEventMinorGC = ChromeTraceEventCommon & {
  name: "MinorGC";
};

export type ChromeTraceEventMajorGC = ChromeTraceEventCommon & {
  name: "MajorGC";
};

export type ChromeTraceEventUpdateLayoutTree = ChromeTraceEventCommon & {
  name: "UpdateLayoutTree";
};

export type ChromeTraceEventLayout = ChromeTraceEventCommon & {
  name: "Layout";
};

export type ChromeTraceEventLayerize = ChromeTraceEventCommon & {
  name: "Layerize";
};

export type ChromeTraceEventDomInteractive = ChromeTraceEventCommon & {
  name: "domInteractive";
};

export type ChromeTraceEventTimerFire = ChromeTraceEventCommon & {
  name: "TimerFire";
};

export type ChromeTraceEventPaint = ChromeTraceEventCommon & { name: "Paint" };

export type ChromeTraceEventPrePaint = ChromeTraceEventCommon & {
  name: "PrePaint";
};

export type ChromeTraceEventParseAuthorStyleSheet = ChromeTraceEventCommon & {
  name: "ParseAuthorStyleSheet";
};

export type ChromeTraceEventNavigationStart = ChromeTraceEventCommon & {
  name: "navigationStart";
};

export type ChromeTraceEventCpuProfilerStartProfiling =
  ChromeTraceEventCommon & { name: "CpuProfiler::StartProfiling" };

export type ChromeTraceEventV8DeoptimizeCode = ChromeTraceEventCommon & {
  name: "V8.DeoptimizeCode";
};

export type ChromeTraceEventIntersectionObserverControllerComputeIntersections =
  ChromeTraceEventCommon & {
    name: "IntersectionObserverController::computeIntersections";
  };

export type ChromeTraceEventFirstPaint = ChromeTraceEventCommon & {
  name: "firstPaint";
};

export type ChromeTraceEventFirstContentfulPaint = ChromeTraceEventCommon & {
  name: "firstContentfulPaint";
};

export type ChromeTraceEventHTMLParserScriptRunnerExecute =
  ChromeTraceEventCommon & {
    name: "HTMLParserScriptRunner::execute";
    args: {
      data: {
        columnNumber: number;
        lineNumber: number;
        frame: string;
      };
    };
  };

export type ChromeTraceEventTimerInstall = ChromeTraceEventCommon & {
  name: "TimerInstall";
  args: {
    data: {
      timerId: number;
      timeout: number;
    };
  };
};

export type ChromeTraceEventProfile = ChromeTraceEventCommon & {
  name: "Profile";
  id: string;
};

export type ChromeTraceEventProfileDataNode = {
  callFrame: {
    codeType: string;
    columnNumber: number;
    functionName: string;
    lineNumber: number;
    scriptId: number;
    url: string;
  };
  id: number;
  parent: number;
};

export type ChromeTraceEventProfileChunk = ChromeTraceEventCommon & {
  name: "ProfileChunk";
  id: string;
  args: {
    data: {
      cpuProfile: {
        nodes: Array<ChromeTraceEventProfileDataNode>;
        samples: Array<number>;
        trace_ids: Array<string>;
      };
      timeDeltas: Array<number>;
    };
  };
};

export type ChromeTraceEvent =
  | ChromeTraceEventParseHTML
  | ChromeTraceEventEvaluateScript
  | ChromeTraceEventScriptCompiled
  | ChromeTraceEventV8Compile
  | ChromeTraceEventV8CompileModule
  | ChromeTraceEventPaintImage
  | ChromeTraceEventV8Run
  | ChromeTraceEventMinorGC
  | ChromeTraceEventMajorGC
  | ChromeTraceEventUpdateLayoutTree
  | ChromeTraceEventLayout
  | ChromeTraceEventLayerize
  | ChromeTraceEventDomInteractive
  | ChromeTraceEventLocalFrameViewPerformLayout
  | ChromeTraceEventTimerFire
  | ChromeTraceEventPaint
  | ChromeTraceEventPrePaint
  | ChromeTraceEventParseAuthorStyleSheet
  | ChromeTraceEventNavigationStart
  | ChromeTraceEventCpuProfilerStartProfiling
  | ChromeTraceEventV8DeoptimizeCode
  | ChromeTraceEventIntersectionObserverControllerComputeIntersections
  | ChromeTraceEventFirstPaint
  | ChromeTraceEventFirstContentfulPaint
  | ChromeTraceEventHTMLParserScriptRunnerExecute
  | ChromeTraceEventTimerInstall
  | ChromeTraceEventProfile
  | ChromeTraceEventProfileChunk
  | ChromeTraceEventFunctionCall;

export type ChromeTrace = {
  traceEvents: ChromeTraceEvent[];
};
