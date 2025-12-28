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
);

// {
//   args: {
//     data: {
//       columnNumber: 357,
//       frame: '468D73F4200C2FF5A08D5C15EFBF3C6E',
//       functionName: 'r.<computed>.onmessage',
//       isolate: '15490442668739585124',
//       lineNumber: 369,
//       sampleTraceId: 1855610689097915,
//       scriptId: '125',
//       url: 'https://www.gstatic.com/recaptcha/releases/jdMmXeCQEkPbnFDy9T04NbgJ/recaptcha__en.js'
//     }
//   },
//   cat: 'devtools.timeline',
//   dur: 1271,
//   name: 'FunctionCall',
//   ph: 'X',
//   pid: 93366,
//   tdur: 1253,
//   tid: 6224104,
//   ts: 387525743890,
//   tts: 1761517
// };
