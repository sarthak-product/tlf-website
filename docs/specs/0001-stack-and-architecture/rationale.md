# 0001 rationale: Stack and architecture

Decision record for [index.md](index.md). The build does not read this file.

## Context

> ⚠️ Premise note: you asked for a staging copy of the site (local, staging and production) on the same VPS (a rented virtual server). On a small server that doubles the Node processes (two Next.js, two Express) and adds a second database. This spec keeps staging, gives it no public address (it is reached over an SSH tunnel, so the project rule that nothing is public holds), and flags the server size as a follow up. It does not drop staging.

Lotus Feet Consultancy needs a corporate site that search engines and AI answer engines can read as full HTML, with a blog, a newsletter sign up and one admin login. The traffic is low and steady. One person (Sarthak) builds it with Claude Code and runs the server. The CA reviews in a personal demo before anything goes public.

Sarthak decided the stack on 4 Nov 2026 in `docs/context/01-decisions.md`: PostgreSQL, Express, Next.js and Node.js (PENN), a separate small Express service, self hosted Postgres, and a small India region VPS with the provider not yet chosen. That file also records three disagreements, registered once and not reopened. This spec does not compare stacks again.

The decision left several build level questions open, and code cannot start without them: where each app lives in the repo, how the Next.js pages reach the Express service, how the single admin stays signed in, what runs the services and terminates HTTPS on the server, how a migration is written and applied, how the backup schedule is held in config, and the shape of every table. Personal data is in play (subscriber emails, consent records, an admin password), so the Digital Personal Data Protection Act 2023 (DPDP) rules in `docs/context/05-data-and-dpdp.md` shape the schema and the logging.

Constraints that frame every pick below:
- The provider is not chosen, so nothing may depend on one provider's tools, images or APIs.
- Slice 1 builds Home on typed content modules with no database. Express and Postgres are installed in Slice 5, not earlier.
- Backups are monthly by Sarthak's decision, with weekly a one line change.
- The database must support newsletter, consent, blog, images and the admin without a breaking migration, even though slices build it in stages.

## Options considered

Stacks, compared whole. The first is decided; the other two are the paths Sarthak already weighed in `01-decisions.md`.

### Option 1: PENN on one VPS, Express as a separate service (decided)

Next.js renders pages. A small Express service owns forms, newsletter, blog and admin. Postgres holds the data. All three run on one India region VPS behind a reverse proxy (a front door server that terminates HTTPS and forwards requests).

**Pros**:
- Matches the decision Sarthak made and the PENN stack he asked for.
- The API is a clean boundary: personal data handling, rate limiting and the admin live in one small service that the page renderer never touches directly.
- A self hosted database does not pause or sleep, which free hosted tiers do.
- Nothing is tied to a provider.

**Cons**:
- Two Node services plus a database to run and patch on one server, with Sarthak as the operator.
- A network hop between pages and data (on loopback, so small).
- More moving parts than Next.js route handlers alone would need.

### Option 2: Next.js only, route handlers for forms and admin, Postgres on the VPS

Drop Express. Next.js route handlers (server code inside the Next.js app) take the forms and admin calls.

**Pros**:
- One fewer service to run, deploy and monitor.
- One codebase and one process for the app.

**Cons**:
- Personal data handling, rate limiting and admin routes would sit inside the same process as the public pages.
- Sarthak asked for PENN, and the registered disagreement was decided in favour of Express.

### Option 3: Managed hosting for the app and a hosted database

Run Next.js on a platform that hosts it for you and use a hosted Postgres.

**Pros**:
- Almost no server work.
- Deploys from a push.

**Cons**:
- The vendor pages read on 4 Nov 2026 rule out the Vercel Hobby plan for a commercial site, and free hosted database tiers pause or sleep, which a quiet site hits often.
- Paid managed options cost more than a small VPS and bring provider specific features, against the rule that code must not depend on one provider.

## Rationale

Option 1 is the decision, so the reasoning here is about the open details. Each pick follows from the forces above: a solo operator, a quiet site, personal data under DPDP, no provider chosen, and an end to end slice approach. The principle used throughout is boring and proven tools with the fewest new things to run.

Settled in this spec, each with the runner up it beat:

| Item | Pick | Why | Runner up and why it lost |
|---|---|---|---|
| Repo layout | One repo, pnpm workspaces: `apps/web`, `apps/api`, `packages/shared`, plus `db/`, `ops/` | Shared request and response schemas live in one place and change in one commit. Slice 1 creates only `apps/web`. | Two repos: shared types would be copied and drift. Plain npm workspaces: also fine, but pnpm blocks code from importing packages it did not declare, which matters with three packages. |
| Language | TypeScript, strict mode, in all packages | The API and the pages share Zod schemas, and the compiler catches mismatches between them. | Plain JavaScript with JSDoc: fewer tools, but no compile time check across the API boundary. |
| Reverse proxy and HTTPS | Caddy | Gets and renews HTTPS certificates by itself and a working config is a dozen lines. Serves `/media` files straight from disk. | nginx with certbot: the most common setup, but two tools and a renewal job to keep working. |
| Process manager | systemd template units, one pair per environment | Already on every mainstream Linux server, restarts on failure, logs to the journal, and its timers run the backup. No extra tool to install or update. | pm2: easy to learn, but it is another program to keep running, and systemd must still start it. |
| Migration tool | `node-pg-migrate` with plain SQL files | SQL files read as exactly what the database will do, there is no ORM to learn, and it runs from the Node toolchain already installed. | dbmate (a single binary using SQL files): equally plain, but one more binary to install on every machine. |
| Database access | `pg` with hand written, parameterised SQL in small repository modules | About ten tables and simple queries. Every query is visible and cannot be built from user text. | Kysely (a typed query builder): a good upgrade if queries grow, but one more layer now. |
| Page to API calls | Pages fetch on the server over loopback. The browser calls `/api/*` on the same origin, which Caddy routes to Express. | No cross origin rules, cookies stay first party, and Express is never exposed on its own address. | Next.js rewrites or a Next.js proxy route: works, but puts a second layer in front of every API call. |
| Caching of public pages | None at first (`no-store` on server fetches) | The site is quiet, loopback queries take milliseconds, and a stale cache could show an unpublished post. Measure before adding a cache. | 60 second time based revalidation: cheaper per request, but an unpublish can linger up to a minute. |
| Admin session | `express-session` with `connect-pg-simple`, session rows in Postgres | A proven pair, avoids hand rolling session handling, a sign out or password change takes effect at once, and no extra service is needed. | Own sessions table with hashed tokens: slightly safer if a database dump leaks, but more code to get right. Signed tokens (JWT): cannot be revoked at once and add nothing for one user. |
| Password hashing | argon2id | The current first choice in password storage guidance. | Node built in `scrypt`: no dependency, nearly as good. |
| Admin creation | A command line script, no sign up route | A public sign up route for a one person admin is attack surface with no use. | A first run web page: convenient, but open until used. |
| Backup scheduling | A systemd timer rendered from one config value | `Persistent=true` runs a missed backup after downtime, which matters on a small server. Switching to weekly is one edit plus one command. | A cron line: simpler, but a missed run is silently lost. |
| Environments | systemd template units and separate env files per environment on one VPS, staging on loopback only and reached by SSH tunnel | One server to patch, with separate databases and separate data. | A second small VPS for staging: stronger isolation, double the cost and double the patching. |
| Local Postgres | An optional `compose.yaml` for a throwaway local database, no Docker on the server | A quick start on any laptop. | A native install: no extra tool, but versions drift between machines. |
| Logging | `pino` JSON to stdout, collected by journald, with body, query, cookie and IP fields left out | Meets the rule that no personal data is logged. | A hosted error tracker: useful, but it is a processor that the privacy notice must name, so it waits for Sarthak. |
| IDs | `bigint` identity keys, with random tokens for anything public | Small, fast, easy to read. Public links use a token or slug, never an id. | UUIDv7: safe to expose, but wider keys with no benefit once links carry tokens. |
| Page copy | Typed content modules in `apps/web/src/content/` (still an assumption Sarthak has not confirmed) | Stable server rendered HTML, and the CA review is a code diff. | Copy in the database: needs an admin editor, a much larger build. |

Where the Sarthak decision and a recommendation touch, the decision wins. His one choice that adds cost is the staging environment. The consequence is covered in the premise note and in the index Follow up.

## References

**Project sources**:
- `AGENTS.md` (decided stack, hard rules, source of truth order)
- `docs/context/01-decisions.md` (stack, backups, images, admin, registered disagreements, hosting findings)
- `docs/context/05-data-and-dpdp.md` (stored data, consent record, unsubscribe, deletion, security basics, no personal data in logs)
- `docs/context/04-seo-aeo-geo.md` (server rendered HTML, alt text from the database, last reviewed date)
- `docs/scope/scope.md` (feature 1 and the slice order, features 7 to 14 and 19 that build on this spec)

**Practices and standards**:
- Monolith first, extract only when forced
- Boring technology, fewest new things to operate
- Least privilege database roles
- Parameterised queries only
- Server side sessions with `HttpOnly`, `Secure` and `SameSite` cookies
- Argon2id for password storage
- Append only records for consent evidence
- A data model is the costliest thing to redo
