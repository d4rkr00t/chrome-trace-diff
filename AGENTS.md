# Agent Guidelines

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Type-check all packages | `pnpm run lint:tsc` |
| Run CLI (generate diff.json) | `pnpm run run:lib` |
| Start viewer dev server | `pnpm run run:viewer` |
| Type-check lib only | `pnpm --filter @chrome-trace-diff/lib run lint:tsc` |

There is no test suite yet — use `pnpm run lint:tsc` as the primary correctness check after changes.

## Monorepo Layout

- **pnpm workspaces** with `pnpm@10.20.0` — always use `pnpm`, never `npm` or `yarn`.
- Two packages under `packages/`: `lib` (core logic) and `viewer` (SolidJS web UI).
- The viewer depends on lib via `"@chrome-trace-diff/lib": "workspace:*"`.

## Code Conventions

- **Language:** TypeScript, strict mode, ESM-only (`"type": "module"` everywhere).
- **Runtime:** Node.js ≥ 22 (uses modern APIs like `Set.prototype.intersection`).
- **Imports:** Always use `.ts` extensions in import paths (`import { foo } from "./bar.ts"`). This is enabled by `allowImportingTsExtensions: true` in tsconfig.
- **Module style:** Use named exports (`export function …`), not default exports (except SolidJS route/app components which use `export default`).
- **Types:** Use `import type` / `export type` for type-only imports/exports (`verbatimModuleSyntax` is on).
- **Formatting:** No configured formatter/linter (Prettier/ESLint) — match the existing style: 2-space indent, double quotes, trailing commas, semicolons.

## Architecture Rules

- `packages/lib` has **zero UI dependencies** — it is a pure Node.js library. Never import browser/UI code here.
- `packages/viewer` imports types and data structures from `@chrome-trace-diff/lib` but never imports lib's internal modules directly (except via the barrel `index.ts`).
- The CLI reads trace JSON files from `./example-traces/` and writes `diff.json` to the repo root. Both paths are gitignored.

## File Naming

- TypeScript source files: `camelCase.ts` (e.g., `buildTimeline.ts`, `getHash.ts`).
- Constants/data files: `UPPER_SNAKE_CASE.ts` (e.g., `IGNORED_CHROME_TRACE_EVENTS.ts`).
- React/Solid components: `PascalCase.tsx` with co-located `PascalCase.module.css`.
- One primary export per file, named to match the filename.
