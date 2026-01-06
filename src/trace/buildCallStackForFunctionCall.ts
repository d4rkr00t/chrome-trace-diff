import type { ProfileData } from "./ProfileData.ts";
import type { ProfileDataNode } from "./ProfileDataEntry.ts";
import type { TraceEventFunctionCall } from "./TraceEvent.ts";

export function buildCallStackForFunctionCall(
  profileData: ProfileData,
  evt: TraceEventFunctionCall,
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

  const samplesIndexes = [];

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
    .map((idx) => {
      const nodeIdx = profile.samples[idx]!;
      const stack = getStack(profile.nodes, profile.nodes[nodeIdx - 1]!, evt);

      if (!stack) {
        return null;
      }

      return [
        profile.timeDeltas[idx] ?? 0 / 1000, // -> ms
        stack,
      ];
    })
    .reduce(
      (acc, item) => {
        if (!item) return acc;

        acc.total += Math.max(item[0], 0);
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
  profileNodes: ProfileDataNode[],
  node: ProfileDataNode,
  functionCall: TraceEventFunctionCall,
): null | ProfileDataNode[] {
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
