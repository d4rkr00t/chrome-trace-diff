# Agent Guidelines — @chrome-trace-diff/lib

## Overview

Pure TypeScript library for parsing, processing, and diffing Chrome DevTools trace files. No UI dependencies.

## Type-check

```sh
pnpm --filter @chrome-trace-diff/lib run lint:tsc
# or from repo root:
pnpm run lint:tsc
```

## Directory Structure

```
src/
├── index.ts           — Barrel re-exports (public API surface)
├── types.ts           — All shared type definitions
├── ChromeTrace.ts     — Chrome trace format types
├── cli.ts             — CLI entry point
├── trace/             — One function per file, file named after primary export
│   ├── processTrace.ts
│   ├── filterTraceEvents.ts
│   ├── groupTraceEventsByUniqueKey.ts
│   ├── groupTraceEventsByName.ts
│   ├── buildCallStacks.ts
│   ├── buildCallStackForFunctionCall.ts
│   ├── buildTimeline.ts
│   ├── diffTraces.ts
│   ├── getUniqueKey.ts
│   ├── getEventsRanges.ts
│   └── IGNORED_CHROME_TRACE_EVENTS.ts
└── utils/             — Small general-purpose helpers
    └── getHash.ts
```

## Processing Pipeline

`processTrace()` runs these steps in order:

1. **Filter** — `filterTraceEvents()` removes ignored events, non-main-thread events, and events before profiling starts.
2. **Group by key** — `groupTraceEventsByUniqueKey()` groups events using deterministic keys from `getUniqueEventKey()`.
3. **Group by name** — `groupTraceEventsByName()` aggregates counts and durations per event name.
4. **Build call stacks** — `buildCallStacks()` extracts CPU profile data and attaches stack frames to events.
5. **Build timeline** — `buildTimeline()` creates a lane-based timeline from grouped events.

When adding a new processing step, add it to this pipeline in `processTrace.ts` and create a new file in `trace/`.

## Conventions

- **One export per file** in `trace/` — the file is named after the function it exports.
- **Types** go in `types.ts` (shared) or `ChromeTrace.ts` (raw Chrome format). Don't scatter type definitions across trace files.
- **Public API** — only re-export types/functions through `index.ts` that external consumers (the viewer) need.
- **Imports** use `.ts` extensions: `import { foo } from "./bar.ts"`.
- **Type-only imports** must use `import type` syntax.
- **Node built-ins** use the `node:` prefix: `import fs from "node:fs"`, `import crypto from "node:crypto"`.

## Adding a New Trace Event Handler

To support a new Chrome trace event in `getUniqueKey.ts`:
1. Add the event name to `ID_EVENTS` (if it needs no special key logic), or
2. Add a new `if (event.name === "...")` block that constructs a deterministic key string and hashes it with `getHash()`.
