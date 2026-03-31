import type {
  ChromeTraceEventFunctionCall,
  ChromeTraceEventProfileDataNode,
} from "../ChromeTrace.ts";
import type { ProcessedTraceEventCallStack, ProfileData } from "../types.ts";

export function buildCallStackForFunctionCall(
  profileData: ProfileData,
  evt: ChromeTraceEventFunctionCall,
) {
  const profileId = Object.keys(profileData).find((key) => {
    return (
      profileData[key]?.pid === evt.pid && profileData[key]?.tid === evt.tid
    );
  });

  if (!profileId || !profileData[profileId]) {
    throw new Error(`No matching profile for process id ${evt.pid}`);
  }

  const profile = profileData[profileId];

  const samplesIndexes: number[] = [];

  const fStart = evt.ts;
  const fEnd = fStart + evt.dur;

  for (let i = 0; i < profile.timeAbs.length; i++) {
    const sampleTime = profile.timeAbs[i] ?? 0;
    if (sampleTime >= fStart && sampleTime <= fEnd) {
      samplesIndexes.push(i);
    }
  }

  // console.log("Samples during function execution:");
  // console.log(samplesIndexes);
  // console.log(samplesIndexes.map((idx) => profile.samples[idx]));

  const stack: ProcessedTraceEventCallStack = { total: 0, stackFrames: [] };

  // Track duration from samples whose call stack couldn't be resolved.
  // This time still belongs to the function's execution, so we carry it
  // forward and attribute it to the next resolvable sample. This keeps the
  // flame graph's totalDur consistent with the event's wall-clock duration.
  //
  // Seed with the leading gap: time between the function start and the first
  // sample. The CPU was already executing the function during this interval.
  let unattributedDuration =
    samplesIndexes.length > 0
      ? Math.max((profile.timeAbs[samplesIndexes[0]!] ?? fStart) - fStart, 0) /
        1000 // -> ms
      : 0;

  for (let i = 0; i < samplesIndexes.length; i++) {
    const idx = samplesIndexes[i]!;
    const nodeIdx = profile.samples[idx]!;

    // Compute sample duration from absolute timestamps rather than raw
    // timeDeltas. timeDeltas can be negative due to clock drift / NTP
    // adjustments, which would otherwise discard timing information.
    // For each sample we measure the gap until the next boundary:
    //   - next sample's absolute timestamp, or
    //   - the function call's end timestamp for the last sample.
    const nextBoundary =
      i < samplesIndexes.length - 1
        ? (profile.timeAbs[samplesIndexes[i + 1]!] ?? fEnd)
        : fEnd;

    const duration =
      Math.max(nextBoundary - (profile.timeAbs[idx] ?? 0), 0) / 1000; // -> ms

    const callStack = getStack(profile.nodes, profile.nodes[nodeIdx - 1]!, evt);

    if (!callStack) {
      // Can't resolve this sample's stack — accumulate its duration so it
      // isn't lost from the total.
      unattributedDuration += duration;
      continue;
    }

    const attributedDuration = duration + unattributedDuration;
    unattributedDuration = 0;

    stack.total += attributedDuration;
    stack.stackFrames.push([attributedDuration, callStack]);
  }

  // If trailing samples couldn't be resolved, their duration would otherwise
  // be lost. Add it to the total so it matches the event's wall-clock dur.
  stack.total += unattributedDuration;

  // Clamp to the wall-clock duration — sample-based accounting can slightly
  // overshoot due to timeAbs imprecision / clock drift, but the event's dur
  // is the ground truth and we should never report more time than elapsed.
  const wallClockMs = evt.dur / 1000;
  stack.total = Math.min(stack.total, wallClockMs);

  // console.log("Stack:");
  // console.log(JSON.stringify(stack, null, 2));
  return stack;
}

function getStack(
  profileNodes: ChromeTraceEventProfileDataNode[],
  node: ChromeTraceEventProfileDataNode,
  functionCall: ChromeTraceEventFunctionCall,
): null | ChromeTraceEventProfileDataNode[] {
  const maybeSeenFunction =
    +node.callFrame.scriptId === +functionCall.args.data.scriptId &&
    node.callFrame.functionName === functionCall.args.data.functionName &&
    node.callFrame.lineNumber + 1 === +functionCall.args.data.lineNumber &&
    node.callFrame.columnNumber + 1 === +functionCall.args.data.columnNumber;

  if (maybeSeenFunction) {
    return [node];
  }

  if (!node.parent) {
    return null;
  }

  const stack = getStack(
    profileNodes,
    profileNodes[node.parent - 1]!,
    functionCall,
  );

  if (!stack) {
    return null;
  }

  stack.push(node);

  return stack;
}
