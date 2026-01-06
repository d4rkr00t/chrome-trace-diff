import fs from "node:fs";
import { filterTraceEvents } from "./trace/filterTraceEvents.ts";
import { groupTraceEvents } from "./trace/groupTraceEvents.ts";
import { buildCallStacks } from "./trace/buildCallStacks.ts";

const afterTracePath = "./example-traces/github-trace-2.json";

function main() {
  console.log(afterTracePath);
  const traceAfter = JSON.parse(fs.readFileSync(afterTracePath, "utf8"));

  // 1. Filter events
  const filteredTraceAfterEvents = filterTraceEvents(traceAfter.traceEvents);

  // 2. Group events
  const groupedTraceAfterEvents = groupTraceEvents(filteredTraceAfterEvents);

  // 3. Build call stacks
  const callStacks = buildCallStacks(
    traceAfter.traceEvents,
    filteredTraceAfterEvents,
  );

  for (const key of Object.keys(callStacks)) {
    groupedTraceAfterEvents[key].callStacks = callStacks[key];
  }

  console.log(JSON.stringify(groupedTraceAfterEvents, null, 2));
}

main();
