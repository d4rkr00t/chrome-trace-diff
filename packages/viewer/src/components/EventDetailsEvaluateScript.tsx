import { ProcessedTraceEvent } from "@chrome-trace-diff/lib";

export function EventDetailsEvaluateScript(props: {
  afterEvent: ProcessedTraceEvent | null;
  beforeEvent: ProcessedTraceEvent | null;
}) {
  const firstOriginalEvent = props.beforeEvent?.originalEvents[0];
  if (firstOriginalEvent?.name !== "EvaluateScript") {
    return null;
  }

  return (
    <div>
      <ul>
        <li>
          File: {firstOriginalEvent?.args?.data?.url}:
          {firstOriginalEvent.args?.data?.lineNumber}:
          {firstOriginalEvent.args?.data?.columnNumber}
        </li>
      </ul>
    </div>
  );
}
