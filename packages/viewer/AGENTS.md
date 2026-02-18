# Agent Guidelines — @chrome-trace-diff/viewer

## Overview

SolidJS web application (SolidStart + Vinxi) that visualizes Chrome trace diff data.

## Commands

```sh
# Start dev server
pnpm --filter @chrome-trace-diff/viewer run dev

# Build for production
pnpm --filter @chrome-trace-diff/viewer run build

# Start production server
pnpm --filter @chrome-trace-diff/viewer run start
```

## Directory Structure

```
src/
├── app.tsx              — Root app component (Router + Suspense)
├── entry-client.tsx     — Client-side entry point
├── entry-server.tsx     — Server-side entry point
├── global-reset.css     — CSS reset
├── global-styles.css    — Global styles
├── global.d.ts          — Global type declarations
├── routes/
│   └── index.tsx        — Main route (file-based routing)
└── components/
    ├── HighLevelStats.tsx / .module.css
    ├── Timeline.tsx / .module.css
    └── NumberDiffLozenge.tsx / .module.css
```

## Conventions

### Components
- **Functional components** with destructured props: `function MyComponent({ prop }: { prop: Type }) { ... }`.
- **`export default`** only for route pages and the root `App` component; use **named exports** for all other components.
- Components use **inline prop types** (no separate `Props` interfaces) unless the type is complex or reused.
- Multiple related components can live in the same file (e.g., `Timeline.tsx` contains `Timeline`, `TimelineEntry`, `TimelineEntryLane`, `TimelineEntryEvent`).

### Styling
- **CSS Modules** — every component has a co-located `.module.css` file.
- Access styles via `styles["class-name"]` (kebab-case class names in CSS, bracket notation in JS).
- CSS modifier classes use `--` prefix: `styles["--neutral"]`, `styles["--increase"]`.
- Global styles go in `global-styles.css` or `global-reset.css`.

### Data Flow
- The viewer imports `diff.json` from the repo root (`../../../../diff.json`) and casts it to the `Diff` type from `@chrome-trace-diff/lib`.
- Generate `diff.json` first by running `pnpm run run:lib` from the repo root.

### Imports
- Import types from the lib package: `import type { Diff } from "@chrome-trace-diff/lib"`.
- Use the `~/` path alias for local imports: `import { Foo } from "~/components/Foo"`.
- **Do not** use `.ts`/`.tsx` extensions in viewer imports (bundler resolution handles this).
