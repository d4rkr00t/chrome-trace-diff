# chrome-trace-diff

A tool for diffing two Chrome DevTools trace files and visualizing the results.

## Monorepo Structure

This is a **pnpm workspace** monorepo (`pnpm@10.20.0`) with two packages:

```
packages/
├── lib/      — @chrome-trace-diff/lib   (core library)
└── viewer/   — @chrome-trace-diff/viewer (web UI)
```

### `packages/lib` — Core Library

TypeScript library that parses, processes, and diffs Chrome trace JSON files.

**Processing pipeline** (`processTrace()`):

1. **Filter** — Remove ignored/irrelevant trace events (`filterTraceEvents`)
2. **Group** — Group events by unique key and by name (`groupTraceEventsByUniqueKey`, `groupTraceEventsByName`)
3. **Call stacks** — Build call stacks from profile data (`buildCallStacks`)
4. **Timeline** — Build a lane-based timeline from processed events (`buildTimeline`)

**Diffing** (`diffTraces()`): Takes two `ProcessedTrace` objects and produces a `Diff` containing both traces, matching event keys, and unique-to-each-side event keys.

**Key types** (defined in `src/types.ts`):

| Type             | Description                                      |
|------------------|--------------------------------------------------|
| `ChromeTrace`    | Raw Chrome trace format (defined in `ChromeTrace.ts`) |
| `ProcessedTrace` | Filtered/grouped events, event counters, timeline |
| `Diff`           | Two traces + matching/unique event keys           |
| `Timeline`       | Array of `TimelineEntry` (start, end, swim-lanes) |

**CLI** (`src/cli.ts`): Reads two trace JSON files, runs `processTrace` + `diffTraces`, and writes `diff.json`.

### `packages/viewer` — Web Viewer

SolidJS app (SolidStart + Vinxi) that visualizes a `diff.json` file.

**Components:**

- `HighLevelStats` — Side-by-side event counts and durations with diff lozenges
- `Timeline` — Lane-based timeline visualization of trace events
- `NumberDiffLozenge` — Colored badge showing numeric deltas

The viewer imports `diff.json` from the repo root and renders it on the index route.

## Tech Stack

- **Language:** TypeScript (ESM)
- **Package manager:** pnpm 10.20 (workspaces)
- **Runtime:** Node.js ≥ 22
- **UI framework:** SolidJS 1.x + SolidStart (Vinxi)

## Scripts (root `package.json`)

| Script        | Description                          |
|---------------|--------------------------------------|
| `run:lib`     | Run the CLI to generate `diff.json`  |
| `run:viewer`  | Start the viewer dev server          |
| `lint:tsc`    | Type-check all packages              |
