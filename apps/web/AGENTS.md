# Web app (apps/web)

## Overview

The public site: a Next.js App Router app in strict TypeScript that renders every public page as full HTML, so search and AI engines read it without running JavaScript. Today it is the Slice 1 skeleton: a root layout and an empty content folder, no pages yet. The Express API, Postgres and `packages/shared` arrive in Slice 5.

## Key files

| File | Owns |
|---|---|
| `package.json` | Scripts and pinned dependencies (Next.js 16.4.5, React 19.3.1) |
| `next.config.ts` | Next.js config. Only `reactStrictMode: true` so far |
| `tsconfig.json` | Extends `../../tsconfig.base.json`, adds DOM libs and the `@/*` alias to `src/*` |
| `src/app/layout.tsx` | Root layout: `<html lang="en">` and `<body>` |
| `src/content/` | Typed content modules, one file per page. Empty today |

## Commands

From the repo root, use the root commands. To run one script here only:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web typecheck
```

## Conventions

- Next.js 16 may differ from what you remember. Read the matching guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed its deprecation notices.
- Fixed page copy lives in typed content modules in `src/content/`, one file per page. Each shortlist of options sits in the same file as its page, so a choice is a one line change. Copy is locked in `docs/context/03-home-copy.md`, so use it verbatim.
- `apps/web` never imports from `apps/api`. Shared types and schemas come from `packages/shared` only.
- Next.js route handlers hold no business logic. Forms, newsletter, blog and admin logic belong to Express.
- Admin screens will live under `/admin` and carry `noindex`.
- When the API exists: pages fetch it on the server through `API_INTERNAL_URL`, using one typed wrapper at `src/lib/api.ts`. Browser code calls `/api/*` on the same origin. Pages that need the API are marked dynamic, so `next build` never needs the API running.
- `noUncheckedIndexedAccess` is on, so indexed reads can be `undefined`. Handle that, do not cast it away.

## Gotchas

- When `next dev` detects an AI agent, it adds a managed block to the end of this file, fenced by two HTML comment markers whose names start with `nextjs-agent-rules`. It leaves the rest of the file alone and writes the block again if it is removed. The block contains em dashes, so `node scripts/check-copy.mjs` fails while it is present. Do not commit the block.
- Never type those two marker strings into this file, not even in a sentence. Next.js finds them as plain text and replaces everything between the first start marker and the first end marker, which would eat your own words.
- The permanent fix is Sarthak's call: set `agentRules: false` in `next.config.ts`, or teach the check to skip the block. Until then, delete the block before running the check.
- pnpm prints an engine warning on Node below 26. Next.js itself needs only Node 20.9 or later, so the warning does not stop the build.

## Related specs

- [0001 Stack and architecture](../../docs/specs/0001-stack-and-architecture/index.md)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
