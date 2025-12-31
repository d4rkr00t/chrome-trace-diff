import { getHash } from "../utils/getHash.ts";
import type { TraceEvent } from "./TraceEvent.ts";

const ID_EVENTS = new Set([
  "CancelAnimationFrame",
  "CpuProfiler::StartProfiling",
  "DroppedFrame",
  "FireAnimationFrame",
  "FireIdleCallback",
  "InteractiveTime",
  "IntersectionObserverController::computeIntersections",
  "InvalidateLayout",
  "Layerize",
  "Layout",
  "LayoutShift",
  "LocalFrameView::performLayout",
  "MajorGC",
  "MinorGC",
  "Paint",
  "ParseAuthorStyleSheet",
  "PrePaint",
  "Profile",
  "ProfileChunk",
  "RequestAnimationFrame",
  "RequestIdleCallback",
  "ScheduleStyleRecalculation",
  "TimerRemove",
  "UpdateLayoutTree",
  "V8.DeoptimizeCode",
  "domComplete",
  "domInteractive",
  "firstContentfulPaint",
  "firstImagePaint",
  "firstMeaningfulPaint",
  "firstPaint",
  "navigationStart",
]);

export function getUniqueEventKey(event: TraceEvent) {
  if (ID_EVENTS.has(event.name)) {
    return event.name;
  }

  if (event.name === "ParseHTML") {
    const tmp = `${event.name}|${event.args.beginData.url}`;
    return getHash(tmp);
  }

  if (event.name === "EvaluateScript") {
    const tmp = [
      event.name,
      event.args.data?.url ?? "unknown",
      event.args.data?.lineNumber ?? 0,
      event.args.data?.columnNumber ?? 0,
    ].join("|");
    return getHash(tmp);
  }

  if (event.name === "TimerFire") {
    const tmp = `${event.name}`;
    return getHash(tmp);
  }

  if (event.name === "v8.compile") {
    const tmp = `${event.name}|${event.args.data.url}`;
    return getHash(tmp);
  }

  if (event.name === "v8.compileModule") {
    const tmp = `${event.name}|${event.args.data.url}`;
    return getHash(tmp);
  }

  if (event.name === "v8.run") {
    const tmp = `${event.name}|${event.args.fileName}`;
    return getHash(tmp);
  }

  if (event.name === "ScriptCompiled") {
    const tmp = `${event.name}|${event.args.data.url}`;
    return getHash(tmp);
  }

  if (event.name === "PaintImage") {
    const tmp = `${event.name}|${event.args?.data?.url ?? ""}|${event.args.data.width}|${event.args.data.height}`;
    return getHash(tmp);
  }

  if (event.name === "HTMLParserScriptRunner::execute") {
    const tmp = [
      event.name,
      event.args.data.frame,
      event.args.data.lineNumber,
      event.args.data.columnNumber,
    ].join("|");
    return getHash(tmp);
  }

  if (event.name === "FunctionCall") {
    const tmp = [
      event.name,
      event.args.data.url,
      event.args.data.lineNumber,
      event.args.data.columnNumber,
      event.args.data.functionName,
    ].join("|");
    return getHash(tmp);
  }

  if (event.name === "TimerInstall") {
    const tmp = [
      event.name,
      event.args.data.timerId,
      event.args.data.timeout,
    ].join("|");
    return getHash(tmp);
  }
}
