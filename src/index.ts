import fs from "node:fs";
import { processTrace } from "./trace/processTrace.ts";

function main() {
  const traceBefore = JSON.parse(fs.readFileSync('./example-traces/reddit-trace-1.json', 'utf8'));
  processTrace(traceBefore.traceEvents);
}

main();
