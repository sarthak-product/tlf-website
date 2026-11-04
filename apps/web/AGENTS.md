# Web app (apps/web)

## Overview

The public site: a Next.js App Router app in strict TypeScript that renders every public page as full HTML, so search and AI engines read it without running JavaScript. Today it has a root layout with the header and lockup, the design tokens and base styles, and one page: Home, built on the typed content module `src/content/home.ts`. Pages other than Home do not exist yet. The Express API, Postgres and `packages/shared` arrive in Slice 5.

## Key files

| File | Owns |
|---|---|
| `package.json` | Scripts and pinned dependencies (Next.js 16.4.5, React 19.3.1) |
| `next.config.ts` | Next.js config: `reactStrictMode: true` and `agentRules: false` (stops `next dev` writing a managed block into this file) |
| `tsconfig.json` | Extends `../../tsconfig.base.json`, adds DOM libs, the `@/*` alias to `src/*` and `@design/*` to `../../design/*` |
| `src/app/layout.tsx` | Root layout: `<html lang="en">`, font variables, the header and `<main>` |
| `src/styles/tokens.css` | Generated from `design/tokens.json`. Never edit by hand, run `pnpm tokens` |
| `src/styles/base.css` | Reset, element defaults, focus ring and the `.page` frame |
| `src/lib/fonts.ts` | Arimo and Quicksand through `next/font/google` |
| `src/app/page.tsx` | Home: the sections of `03-home-copy.md` in its order. A section with no content renders nothing, and case studies, key figures, testimonials and recent writing have no layout yet |
| `src/components/` | Components with CSS Modules beside them: `lockup`, `site-header`, `section`, `button`, `book-call-button`, `faq-item` |
| `src/content/` | Typed content modules, one file per page. `home.ts` holds the locked Home copy, the shortlists and the `choice` numbers |
| `src/lib/booking.ts` | `getBookingUrl()`: reads `CALENDLY_URL`, returns `#` while it is unset or empty |
| `vitest.config.mts` | Vitest config: node environment, `@` and `@design` aliases, setup file |
| `src/test/` | Shared test helpers: `setup.ts` (mocks), `render.tsx`, `copy-doc.ts` (reads the locked copy file) |

## Commands

From the repo root, use the root commands. To run one script here only:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web typecheck
pnpm --filter web test
```

Checks run from the repo root: `pnpm check` runs Biome (lint, format and import order), the typecheck, the token check, the contrast check, the copy check and the Vitest suite. `pnpm format` fixes formatting. `pnpm tokens` regenerates `tokens.css`. Biome is the only linter and formatter, and Vitest is the only test runner.

## Conventions

- Next.js 16 may differ from what you remember. Read the matching guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed its deprecation notices.
- Fixed page copy lives in typed content modules in `src/content/`, one file per page. Each shortlist of options sits in the same file as its page, so a choice is a one line change. Copy is locked in `docs/context/03-home-copy.md`, so use it verbatim.
- Tests sit beside the source as `*.test.ts` or `*.test.tsx`, with shared helpers in `src/test/`. Pages are tested by rendering them to HTML with `react-dom/server`, so no browser or DOM is used. `home.test.ts` reads `docs/context/03-home-copy.md` at test time. If that document changes, update `home.ts` to match it, never the test. Fixtures use sample values only, never real personal data.
- Every Book a call button is the one `BookCallButton`. Its link comes from `CALENDLY_URL` through `src/lib/booking.ts` and is never a made up address.
- `apps/web` never imports from `apps/api`. Shared types and schemas come from `packages/shared` only.
- Next.js route handlers hold no business logic. Forms, newsletter, blog and admin logic belong to Express.
- Admin screens will live under `/admin` and carry `noindex`.
- When the API exists: pages fetch it on the server through `API_INTERNAL_URL`, using one typed wrapper at `src/lib/api.ts`. Browser code calls `/api/*` on the same origin. Pages that need the API are marked dynamic, so `next build` never needs the API running.
- `noUncheckedIndexedAccess` is on, so indexed reads can be `undefined`. Handle that, do not cast it away.

## Gotchas

- `agentRules: false` is set in `next.config.ts`, so `next dev` no longer adds a managed block to this file. If that setting is ever removed, the block comes back, contains em dashes and fails `node scripts/check-copy.mjs`. Do not commit the block.
- Never type the managed block's two comment marker strings into this file, not even in a sentence. Next.js finds them as plain text and replaces everything between them.
- `next build` fetches the Arimo and Quicksand files from Google Fonts, so a build needs network access. The files are then served from our own domain.
- `CALENDLY_URL` is read when the page is built, so set it before `pnpm build`. Changing it later needs a new build.
- `src/test/setup.ts` mocks `@/lib/fonts` and `next/image`, because both only work inside the Next.js build. Tests see plain stand ins.
- `@design/*` maps to the repo's `design/` folder (see `tsconfig.json`). The mark SVGs are imported from there, so there is no second copy.
- pnpm prints an engine warning on Node below 26. Next.js itself needs only Node 20.9 or later, so the warning does not stop the build.

## Related specs

- [0001 Stack and architecture](../../docs/specs/0001-stack-and-architecture/index.md)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
