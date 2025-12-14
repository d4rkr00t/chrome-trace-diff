import { getHash } from "../utils/getHash.ts";
import type { TraceEvent } from "./TraceEvent.ts";

export function getUniqueEventKey(event: TraceEvent) {
  if (event.name === "ParseHTML") {
    const tmp = `${event.name}|${event.args.beginData.url}`;
    return getHash(tmp);
  }

  if (event.name === "EvaluateScript") {
    const tmp = `${event.name}|${event.args.data.url}`;
    return getHash(tmp);
  }

  if (event.name === "MinorGC") {
    const tmp = `${event.name}`;
    return getHash(tmp);
  }

  if (event.name === "MajorGC") {
    const tmp = `${event.name}`;
    return getHash(tmp);
  }

  if (event.name === "Layout") {
    const tmp = `${event.name}`;
    return getHash(tmp);
  }

  if (event.name === "TimerFire") {
    const tmp = `${event.name}`;
    return getHash(tmp);
  }

  if (event.name === "UpdateLayoutTree") {
    const tmp = `${event.name}`;
    return getHash(tmp);
  }

  if (event.name === "v8.compile") {
    const tmp = `${event.name}|${event.args.data.url}`;
    return getHash(tmp);
  }

  if (event.name === "FunctionCall") {
    const tmp = [
      event.name,
      event.args.data.url,
      event.args.data.lineNumber,
      event.args.data.columnNumber,
      event.args.data.functionName,
      event.args.data.scriptId,
    ].join("|");
    return getHash(tmp);
  }
}
