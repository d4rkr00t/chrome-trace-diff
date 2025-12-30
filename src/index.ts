import fs from "node:fs";
import { processTrace } from "./trace/processTrace.ts";
import { diffTraces } from "./trace/diffTraces.ts";
import { mergeTraces } from "./trace/mergeTraces.ts";
import { adjustTrace } from "./trace/adjustTrace.ts";

const beforeTracePath = "./example-traces/vanilla-aifc-off.json";
const afterTracePath = "./example-traces/vanilla-aifc-on.json";

function main() {
  const traceBefore = JSON.parse(fs.readFileSync(beforeTracePath, "utf8"));
  const processedTraceBefore = processTrace(traceBefore.traceEvents);

  const traceAfter = JSON.parse(fs.readFileSync(afterTracePath, "utf8"));
  const processedTraceAfter = processTrace(traceAfter.traceEvents);

  const [beforeEvents, afterEvents, beforeUniqueEvents, afterUniqueEvents] =
    diffTraces(processedTraceBefore, processedTraceAfter);

  fs.writeFileSync(
    "./out.json",
    JSON.stringify(
      mergeTraces(
        adjustTrace(beforeEvents, "Before Matching Events"),
        adjustTrace(afterEvents, "After Matching Events"),
        adjustTrace(beforeUniqueEvents, "Before Unique Events"),
        adjustTrace(afterUniqueEvents, "After Unique Events"),
      ),
    ),
    "utf8",
  );
}

main();
