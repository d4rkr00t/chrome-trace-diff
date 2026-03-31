import type { ChromeTraceEventCallFrame } from "../ChromeTrace.ts";

export function getCallFrameKey(callFrame: ChromeTraceEventCallFrame): string {
  return [
    callFrame.codeType,
    callFrame.url,
    callFrame.functionName,
    callFrame.lineNumber,
    callFrame.columnNumber,
  ].join("|");
}
