import fs from "node:fs";

// const beforeTracePath = "./example-traces/vanilla-aifc-off.json";
// const afterTracePath = "./example-traces/vanilla-aifc-on.json";
// const beforeTracePath = "./example-traces/github-trace-1.json";
const afterTracePath = "./example-traces/github-trace-2.json";

const functionCall = {
  args: {
    data: {
      columnNumber: 4097,
      frame: "638DDBE511DFD7E5BDA4FC78E9BF1B23",
      functionName: "c",
      isolate: "13708300334584978572",
      lineNumber: 1,
      sampleTraceId: 2044053812858358,
      scriptId: "591",
      url: "https://github.githubassets.com/assets/43784-4652ae97a661.js",
    },
  },
  cat: "devtools.timeline",
  dur: 135,
  name: "FunctionCall",
  ph: "X",
  pid: 5447,
  tdur: 131,
  tid: 8661476,
  ts: 542597631887,
  tts: 8452943,
};

function main() {
  const traceEventsAfter = JSON.parse(
    fs.readFileSync(afterTracePath, "utf8"),
  ).traceEvents;

  const profileData: Record<string, any> = {};

  for (const event of traceEventsAfter) {
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

    profileData[event.id].nodes.push(
      ...(event.args.data.cpuProfile?.nodes ?? []),
    );

    profileData[event.id].samples.push(
      ...(event.args.data.cpuProfile?.samples ?? []),
    );

    Object.assign(
      profileData[event.id].trace_ids,
      event.args.data.cpuProfile?.trace_ids,
    );

    for (const delta of event.args.data.timeDeltas ?? []) {
      profileData[event.id].timeDeltas.push(delta);
      profileData[event.id].timeAbs.push(
        (profileData[event.id].timeAbs.at(-1) ?? profileData[event.id].ts) +
          delta,
      );
    }
  }

  // console.log(JSON.stringify(profileData, null, 2));
  buildTraceForFunctionCall(profileData, functionCall);
}

main();

function buildTraceForFunctionCall(profileData, functionCallEvent) {
  const profileId = Object.keys(profileData).find((key) => {
    return (
      profileData[key].pid === functionCallEvent.pid &&
      profileData[key].tid === functionCallEvent.tid
    );
  });

  if (!profileId) {
    throw new Error(
      `No matching profile for process id ${functionCallEvent.pid}`,
    );
  }

  console.log("Profile ID:", profileId);

  const profile = profileData[profileId];
  const samplesIndexes = [];

  const fStart = functionCallEvent.ts;
  const fEnd = fStart + functionCallEvent.dur;

  console.log("Function start:", fStart);
  console.log("Function end:", fEnd);
  console.log("Total samples:", profile.timeAbs.length);
  console.log("First sample:", profile.timeAbs[0]);
  console.log("Last sample:", profile.timeAbs.at(-1));

  for (let i = 0; i < profile.timeAbs.length; i++) {
    const sampleTime = profile.timeAbs[i];
    if (sampleTime >= fStart && sampleTime <= fEnd) {
      samplesIndexes.push(i);
    }
  }

  console.log("Samples during function execution:");
  console.log(samplesIndexes);
  console.log(samplesIndexes.map((idx) => profile.samples[idx]));

  const stack = samplesIndexes.map((idx) => {
    const nodeIdx = profile.samples[idx];
    return getStack(profile.nodes, profile.nodes[nodeIdx - 1]);
  });
  console.log("Stack:");
  console.log(JSON.stringify(stack, null, 2));
}

function getStack(profileNodes, node) {
  if (!node.parent) {
    return [node];
  }

  const parents = getStack(profileNodes, profileNodes[node.parent - 1]);
  parents.push(node);

  return parents;
}
