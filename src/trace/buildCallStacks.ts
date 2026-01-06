import type { ChromeTraceEvent } from "../ChromeTraceEvent.ts";
import type {
  ProcessedTraceEventCallStack,
  ProfileData,
  ProfileDataEntry,
} from "../types.ts";
import { buildCallStackForFunctionCall } from "./buildCallStackForFunctionCall.ts";
import { getUniqueEventKey } from "./getUniqueKey.ts";

export function buildCallStacks(
  traceEvents: ChromeTraceEvent[],
  filteredTraceEvents: ChromeTraceEvent[],
) {
  const profileData = compileProfileData(traceEvents);
  const callStacks: Record<string, ProcessedTraceEventCallStack[]> = {};

  for (const evt of filteredTraceEvents) {
    if (evt.name !== "FunctionCall") {
      continue;
    }
    const id = getUniqueEventKey(evt) ?? "unreachable";
    callStacks[id] ??= [];

    callStacks[id].push(buildCallStackForFunctionCall(profileData, evt));
  }

  return callStacks;
}

function compileProfileData(
  traceEvents: ChromeTraceEvent[],
): Record<string, ProfileDataEntry> {
  const profileData: ProfileData = {};

  for (const event of traceEvents) {
    if (event.name === "Profile") {
      if (!(event.id in profileData)) {
        profileData[event.id] = {
          pid: event.pid,
          tid: event.tid,
          ts: event.ts,
          tts: event.tts,
          nodes: [],
          samples: [],
          trace_ids: {},
          timeDeltas: [],
          timeAbs: [],
        };
      }
    }

    if (event.name !== "ProfileChunk") {
      continue;
    }

    profileData[event.id]?.nodes.push(
      ...(event.args.data.cpuProfile?.nodes ?? []),
    );

    profileData[event.id]?.samples.push(
      ...(event.args.data.cpuProfile?.samples ?? []),
    );

    Object.assign(
      profileData[event.id]?.trace_ids ?? {},
      event.args.data.cpuProfile?.trace_ids,
    );

    for (const delta of event.args.data.timeDeltas ?? []) {
      profileData[event.id]?.timeDeltas.push(delta);
      profileData[event.id]?.timeAbs.push(
        (profileData[event.id]?.timeAbs.at(-1) ??
          profileData[event.id]?.ts ??
          0) + delta,
      );
    }
  }

  return profileData;
}
