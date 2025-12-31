import fs from "node:fs";
import { processTrace } from "./trace/processTrace.ts";

const beforeTracePath = "./example-traces/github-trace-1.json";
const afterTracePath = "./example-traces/github-trace-2.json";

function main() {
  const traceBefore = JSON.parse(fs.readFileSync(beforeTracePath, "utf8"));
  const traceBeforeResult = processTrace(traceBefore);
  const traceAfter = JSON.parse(fs.readFileSync(afterTracePath, "utf8"));
  const traceAfterResult = processTrace(traceAfter);

  console.log(traceBeforeResult);
  console.log(traceAfterResult);
}

main();
