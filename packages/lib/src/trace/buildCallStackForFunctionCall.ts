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

  const stack = samplesIndexes
    .map((idx, i) => {
      const nodeIdx = profile.samples[idx]!;
      const stack = getStack(profile.nodes, profile.nodes[nodeIdx - 1]!, evt);

      if (!stack) {
        return null;
      }

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
      const duration = Math.max(nextBoundary - (profile.timeAbs[idx] ?? 0), 0) / 1000; // -> ms

      return [duration, stack] as [number, ChromeTraceEventProfileDataNode[]];
    })
    .reduce<ProcessedTraceEventCallStack>(
      (acc, item) => {
        if (!item) return acc;

        acc.total += item[0];
        acc.stackFrames.push(item);

        return acc;
      },
      { total: 0, stackFrames: [] },
    );
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
