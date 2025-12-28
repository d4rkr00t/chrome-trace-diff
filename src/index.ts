import fs from "node:fs";
import { processTrace } from "./trace/processTrace.ts";
import { diffTraces } from "./trace/diffTraces.ts";
import { mergeTraces } from "./trace/mergeTraces.ts";

function main() {
  const traceBefore = JSON.parse(
    fs.readFileSync("./example-traces/palette-trace-2.json", "utf8"),
  );
  const processedTraceBefore = processTrace(traceBefore.traceEvents, "before");

  const traceAfter = JSON.parse(
    fs.readFileSync("./example-traces/palette-trace-3.json", "utf8"),
  );
  const processedTraceAfter = processTrace(traceAfter.traceEvents, "after");

  const [beforeEvents, afterEvents] = diffTraces(
    processedTraceBefore,
    processedTraceAfter,
  );

  fs.writeFileSync(
    "./out.json",
    JSON.stringify(mergeTraces(beforeEvents, afterEvents)),
    "utf8",
  );
}

main();
