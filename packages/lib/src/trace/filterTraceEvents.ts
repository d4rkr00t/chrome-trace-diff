import type { ChromeTraceEvent } from "../ChromeTrace.ts";

import { getUniqueEventKey } from "./getUniqueKey.ts";
import { IGNORED_CHROME_TRACE_EVENT_NAMES } from "./IGNORED_CHROME_TRACE_EVENTS.ts";

const IGNORED_EVENT_PH = new Set(["M", "f", "s", "R", "I"]);

const MAIN_THREAD_NAME = "CrRendererMain";

export function filterTraceEvents(
  traceEvents: ChromeTraceEvent[],
): ChromeTraceEvent[] {
  const filteredTraceEvents: ChromeTraceEvent[] = [];

  let mainThreadPID = null;
  for (const evt of traceEvents) {
    if (evt.name === "TracingStartedInBrowser") {
      for (const frame of evt.args?.data?.frames ?? []) {
        if (frame.isInPrimaryMainFrame) {
          mainThreadPID = parseInt(frame.processId);
          break;
        }
      }
    }
  }

  let seenStartProfile = false;
  for (const evt of traceEvents) {
    if (evt.name.startsWith("URL:") && evt.cat === "navigation") {
      continue;
    }

    if (evt.name.startsWith("react-")) {
      continue;
    }

    if (evt.name.startsWith("auto cc::")) {
      continue;
    }

    if (evt.name === "CpuProfiler::StartProfiling") {
      seenStartProfile = true;
      continue;
    }

    if (!seenStartProfile) {
      continue;
    }

    if (IGNORED_EVENT_PH.has(evt.ph)) {
      continue;
    }

    if (IGNORED_CHROME_TRACE_EVENT_NAMES.has(evt.name)) {
      continue;
    }

    // TODO: figure this out a better way to find main PID
    if (evt.pid !== mainThreadPID) {
      continue;
    }

    const id = getUniqueEventKey(evt);
    if (!id) {
      // console.log(evt);
      continue;
    }

    filteredTraceEvents.push(evt);
  }

  return filteredTraceEvents;
}
