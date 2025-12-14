import { getUniqueEventKey } from "./getUniqueKey.ts";
import type { ProcessedTraceEvent } from "./ProcesedTraceEvent.ts";
import type { TraceEvent } from "./TraceEvent.ts";

const IGNORED_EVENT_PH = new Set(["M", "I", "f", "s"]);

const IGNORED_EVENT_NAMES = new Set([
  "EventDispatch",
  "CommitLoad",
  "HTMLDocumentParser::MaybeFetchQueuedPreloads",
  "HandlePostMessage",
  "FireIdleCallback",
  "XHRReadyStateChange",
  "XHRLoad",
]);

const MAIN_THREAD_NAME = "CrRendererMain";

export function processTrace(traceEvents: TraceEvent[]) {
  let mainThreadPID = null;
  for (const evt of traceEvents) {
    if (evt.args?.name === MAIN_THREAD_NAME) {
      mainThreadPID = evt.pid;
    }
  }

  const processedTraceEvents: Record<string, ProcessedTraceEvent> = {};
  for (const evt of traceEvents) {
    if (!evt.cat.includes("devtools.timeline")) {
      continue;
    }

    if (
      evt.cat.includes("disabled-by-default-devtools.timeline") ||
      evt.cat.includes("disabled-by-default-v8.gc")
    ) {
      continue;
    }

    if (IGNORED_EVENT_PH.has(evt.ph)) {
      continue;
    }

    if (IGNORED_EVENT_NAMES.has(evt.name)) {
      continue;
    }

    if (evt.pid !== mainThreadPID) {
      continue;
    }

    const id = getUniqueEventKey(evt);
    if (!id) {
      console.log(evt);
      continue;
    }

    processedTraceEvents[id] = processedTraceEvents[id] ?? {
      id,
      name: evt.name,
      originalEvents: [],
    };
    processedTraceEvents[id].originalEvents.push(evt);
  }

  console.log("-----------------");
  // console.log(JSON.stringify(processedTraceEvents, null, 2));
  console.log(processedTraceEvents);
}
