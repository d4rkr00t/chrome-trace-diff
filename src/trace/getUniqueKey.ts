import { getHash } from "../utils/getHash.ts";
import type { TraceEvent } from "./TraceEvent.ts";

const ID_EVENTS = new Set([
  "CpuProfiler::StartProfiling",
  "IntersectionObserverController::computeIntersections",
  "Layerize",
  "Layout",
  "LocalFrameView::performLayout",
  "MajorGC",
  "MinorGC",
  "Paint",
  "ParseAuthorStyleSheet",
  "PrePaint",
  "UpdateLayoutTree",
  "V8.DeoptimizeCode",
  "domInteractive",
  "navigationStart",
  "firstContentfulPaint",
  "firstPaint",
  "firstImagePaint",
  "firstMeaningfulPaint",
  "InteractiveTime",
  "FireAnimationFrame",
  "domComplete",
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
    const tmp = `${event.name}|${event.args?.data?.url ?? ""}`;
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
}
