import fs from "node:fs";
import { processTrace } from "./trace/processTrace.ts";
import { diffTraces } from "./trace/diffTraces.ts";
//
// const beforeTracePath = "./example-traces/aifc-off.json";
// const afterTracePath = "./example-traces/aifc-on.json";

const beforeTracePath = "./example-traces/github-trace-1.json";
const afterTracePath = "./example-traces/github-trace-2.json";

// const beforeTracePath = "./example-traces/palette-trace-1.json";
// const afterTracePath = "./example-traces/palette-trace-2.json";

// const beforeTracePath = "./example-traces/local_cache_off_no_iframe.json";
// const afterTracePath = "./example-traces/local_cache_on_no_iframe.json";
//
function main() {
  const traceBefore = JSON.parse(fs.readFileSync(beforeTracePath, "utf8"));
  const traceBeforeResult = processTrace(traceBefore);
  const traceAfter = JSON.parse(fs.readFileSync(afterTracePath, "utf8"));
  const traceAfterResult = processTrace(traceAfter);

  const diff = diffTraces(traceBeforeResult, traceAfterResult);
  fs.writeFileSync("./diff.json", JSON.stringify(diff, null, 2), "utf8");
}

main();
