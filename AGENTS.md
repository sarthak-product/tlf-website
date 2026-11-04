# Lotus Feet Consultancy website

Source code for the Lotus Feet Consultancy corporate website (LF). Seed context file, written by hand before any code exists. Run `/audit` once the project is scaffolded and let it refine this file from the real code. Keep the rules below.

## What this project is
- A corporate site for a virtual CFO, compliance and funding consultancy in India. B2B. Founders and CXOs are the reader.
- Pages: Home, Services, About, Blog index, Article, Contact. Home comes first. Services is parked.
- One conversion: the "Book a call" button, which opens a Calendly booking page. No phone number, email address or response time is shown anywhere on the site.
- This repo holds the LF site only. The CA's personal portfolio is a separate asset and is not built here.

## Decided stack (PENN)
- PostgreSQL, self-hosted, India-region server.
- Express: a small separate API service for forms, newsletter, blog and admin.
- Next.js: server-rendered pages, so search and AI engines read full HTML.
- Node.js.
- Hosting: a small India-region VPS that Sarthak sets up. Provider and budget are not chosen. Do not tie code to one provider.
- Details and reasons: `docs/context/01-decisions.md`.

## Pinned versions
Exact numbers come from the scaffold manifests. Spec 0001 fixes the choices and leaves the numbers to scaffold time.
- Node.js 26: `.nvmrc` is `26`, root `engines` is `>=26.0.0`. pnpm warns on older Node.
- pnpm 10.28.0 (`packageManager` in `package.json`). No other build orchestrator.
- Next.js 16.4.5 (App Router), React and React DOM 19.3.1. All three are exact pins.
- TypeScript ^7.0.2 in strict mode (`tsconfig.base.json`, with `noUncheckedIndexedAccess`). Also `@types/node` ^26.6.6, `@types/react` and `@types/react-dom` ^19.3.0. `pnpm-lock.yaml` fixes the resolved versions.
- Decided by spec 0001 but not installed yet: PostgreSQL 16 or later, Express, Zod, `pg`, `node-pg-migrate`, `express-session` with `connect-pg-simple`, argon2id, `pino`, Caddy, systemd. Check package names and versions when each is first added.

## Repo layout
One repo, pnpm workspaces (spec 0001). Only the first four lines exist today.
```
apps/web/          Next.js app (Slice 1). Typed page copy in src/content/
package.json  pnpm-workspace.yaml  tsconfig.base.json  .env.example
design/  docs/  scripts/
apps/api/          Express service (Slice 5)
packages/shared/   Zod schemas and types both apps import (Slice 5)
db/                migrations/ and bootstrap/ SQL (Slice 5)
ops/               systemd/, caddy/, backup/ (Slices 5 and 8)
compose.yaml       optional local Postgres (Slice 5)
```
- `apps/web` and `apps/api` never import from each other. Both import only from `packages/shared`.

## Commands
Run from the repo root.
```bash
pnpm install                  # install every workspace
pnpm dev                      # next dev for apps/web, http://localhost:3000
pnpm build                    # next build for apps/web
pnpm start                    # serve the build output, run pnpm build first
pnpm typecheck                # tsc --noEmit in every workspace
node scripts/check-copy.mjs   # fails on em or en dashes, takes optional folders
pnpm --filter web <script>    # run one script in one workspace
```
No test runner, linter or CI exists yet (scope feature 2). Do not invent one.

## Source of truth, in this order
1. `docs/specs/` (written by `/architect`) for any decision once it exists.
2. `docs/context/` for decisions, copy, compliance and open items handed over from the project.
3. `design/tokens.json` and `design.md` for visual values.
If two sources disagree, stop and ask Sarthak. Do not pick one silently.

## Hard rules
- Sarthak Chaturvedi is the project head and decides. The CA reviews in a personal demo before anything goes public. Nothing is published, deployed or pushed to a public place without Sarthak saying so.
- Never invent clients, logos, testimonials, statistics, case studies, awards, team members or credentials. An empty section is hidden, not filled. Simulated figures carry the caption "Sample data".
- Copy is locked in `docs/context/03-home-copy.md`. Use it verbatim. Do not reword, shorten or "improve" it. Where the file lists a shortlist, build it so the choice is a one-line change.
- No em dashes or en dashes anywhere (copy, comments, commit messages). Write ranges in words.
- No "not X, but Y" sentence pattern in copy.
- Sentence case for headings, buttons and labels. Money in lakhs and crores with the rupee sign. Financial year is April to March.
- The CA's name is not used to market LF. Do not put it in page copy, metadata, schema markup or image alt text. The only exception is a person entry the CA has cleared in writing.
- No phone, email or response-time promise on the site. The Calendly URL and official firm email are not supplied yet: use a clearly named config value, never a made-up address.
- Design bans: gradients, glows, dot grids, glass, shadows on page content, stock photography, three-card feature rows, bento grids, checkmark bullet lists, pricing tiers, the fonts Inter, Geist and Space Grotesk, icon libraries such as Lucide, emoji.
- Personal data (newsletter list, form entries, consent records) follows `docs/context/05-data-and-dpdp.md`. Never log it, never commit it, never put real data in fixtures.
- Secrets live in environment variables. Commit a `.env.example` with names only.

## Workflow
This project uses the jsmastery-pro agentic workflow skills (`/scope`, `/audit`, `/architect`, `/develop`, `/check`, `/test`, `/document`, `/sync`, `/debug`). Start prompt: `START-PROMPT.md`. Specs go in `docs/specs/`, scope in `docs/scope/`. Project handover files stay in `docs/context/` and are edited only by Sarthak or on his instruction.

## Language and tone for anything user-facing
Authoritative and conversational. A senior adviser talking to a founder. "We" for the firm, "you" for the client. State the benefit in the first sentence. Plain words, exact meaning.

## Context files
- [apps/web/AGENTS.md](apps/web/AGENTS.md) (Next.js app rules: bundled Next 16 docs, content modules, the next dev block)
