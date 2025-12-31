export type TraceEvent = {
  ph: "M" | "I" | "X";
  name: string;
  cat: string;
  pid: number | string;
  tid: number | string;
  ts: number;
  tts: number;
  dur: number;
  args?: { name: string };
} & (
  | {
      name: "ParseHTML";
      args: {
        beginData: {
          startLine: number;
          url: string;
        };
        endData: { endLine: number };
      };
    }
  | {
      name: "EvaluateScript";
      args: {
        data?: {
          columnNumber: number;
          lineNumber: number;
          url: string;
        };
      };
    }
  | {
      name: "ScriptCompiled";
      args: {
        data: {
          url: string;
        };
      };
    }
  | {
      name: "v8.compile";
      args: {
        data: {
          columnNumber: number;
          lineNumber: number;
          url: string;
        };
      };
    }
  | {
      name: "v8.compileModule";
      args: {
        data: {
          columnNumber: number;
          lineNumber: number;
          url: string;
        };
      };
    }
  | {
      name: "PaintImage";
      args: {
        data: {
          url: string;
          width: number;
          height: number;
        };
      };
    }
  | {
      name: "v8.run";
      args: {
        fileName: string;
      };
    }
  | { name: "MinorGC" }
  | { name: "MajorGC" }
  | { name: "UpdateLayoutTree" }
  | { name: "Layout" }
  | { name: "Layerize" }
  | { name: "domInteractive" }
  | { name: "LocalFrameView::performLayout" }
  | { name: "TimerFire" }
  | { name: "Paint" }
  | { name: "PrePaint" }
  | { name: "ParseAuthorStyleSheet" }
  | { name: "navigationStart" }
  | { name: "CpuProfiler::StartProfiling" }
  | { name: "V8.DeoptimizeCode" }
  | { name: "IntersectionObserverController::computeIntersections" }
  | { name: "firstPaint" }
  | { name: "firstContentfulPaint" }
  | {
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
    }
  | {
      name: "HTMLParserScriptRunner::execute";
      args: {
        data: {
          columnNumber: number;
          lineNumber: number;
          frame: string;
        };
      };
    }
  | {
      name: "TimerInstall";
      args: {
        data: {
          timerId: number;
          timeout: number;
        };
      };
    }
);
