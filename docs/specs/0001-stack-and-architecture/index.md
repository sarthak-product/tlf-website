# 0001. Stack and architecture

**Date**: 2026-11-04
**Status**: Proposed

## Summary

The site is three parts on one small India region server: a Next.js app that renders every public page as full HTML, a small separate Express service for forms, newsletter, blog and admin, and a self hosted PostgreSQL database. Sarthak decided this on 4 Nov 2026 and this spec records it as decided. It also settles what that decision left open: the repo layout, how the parts talk, how the one admin stays signed in, what runs the services on the server, how backups are scheduled, and the whole database design. Slice 1 builds only the Next.js skeleton. Express and Postgres arrive in Slice 5, and the tables arrive in the slices that need them.

## Decision

**Chosen option**: Option 1: PENN on one VPS, Express as a separate service (decided by Sarthak on 4 Nov 2026, not reopened)

**Decided, recorded as is** (source: `docs/context/01-decisions.md`):
- Stack: PostgreSQL, Express, Next.js, Node.js.
- Postgres is self hosted. Express is a separate small service. Next.js serves the pages (server rendered). Express handles forms, newsletter, blog and admin.
- Hosting is a small India region VPS (a rented virtual server) that Sarthak sets up. **The provider and budget are not chosen. This spec picks none and nothing in code may depend on one.**
- Backups: a database dump once a month, the schedule held in a config value so weekly is a one line change, the uploaded images folder included, the destination read from config.
- Newsletter list lives in our Postgres. Sending goes through an adapter (a thin layer) because the email provider is not chosen.
- No separate CMS. The database stores blog posts and image records. We build the admin. One admin login, draft and publish, no roles.
- Image files live on the server's disk. Paths and metadata live in Postgres. Alt text is required on every image.
- Assumption, not yet confirmed by Sarthak: fixed page copy lives in code as typed content modules, not in the database.

**Settled in this spec** (recommendations, each with its runner up in `rationale.md`):

| Item | Pick |
|---|---|
| Repo layout | One repo, pnpm workspaces: `apps/web`, `apps/api`, `packages/shared`, `db/`, `ops/` |
| Language | TypeScript, strict mode |
| Reverse proxy and HTTPS | Caddy |
| Process manager | systemd template units, one pair per environment |
| Migrations | `node-pg-migrate` with plain SQL files |
| Database access | `pg` with hand written, parameterised SQL |
| Page to API calls | Server side fetch over loopback, browser calls `/api/*` on the same origin |
| Admin session | `express-session` with `connect-pg-simple`, sessions stored in Postgres |
| Backup schedule | A systemd timer rendered from one config value |
| Environments | Local, staging and production (staging on the same VPS, loopback only) |

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript, strict, on the current Node.js LTS line (confirm the exact version at scaffold) | One language across pages and API, and the compiler checks the shared request and response schemas. |
| Web framework | Next.js, App Router, server rendered pages (current stable major at scaffold) | Search and AI engines get full HTML with no JavaScript needed. |
| API | Express as one small service, REST over JSON, no version prefix | Matches the decision. The only client is our own Next.js app, so there is nothing to version. |
| Validation | Zod schemas in `packages/shared`, used by both apps | One definition of each request and response, checked at the API edge. |
| Primary database | PostgreSQL, a current supported major (16 or later, confirm at provisioning) from the OS package source | Relational data with clear relations, the decided choice. |
| Database access | `pg` pool, hand written SQL in repository modules, parameters only | Under ten tables and simple queries. No string built query ever. |
| Migrations | `node-pg-migrate`, SQL files in `db/migrations/`, run by one script | Plain SQL, no ORM, runs on the installed Node. |
| Admin auth | `express-session` plus `connect-pg-simple`, argon2id password hash, no sign up route | Proven parts instead of hand rolled sessions. Sign out takes effect at once. |
| Background jobs | None inside the apps. Scheduled work (backup, clean up of unconfirmed sign ups) runs as systemd timers calling scripts | A queue is not needed at this volume. |
| File storage | Server disk under `UPLOADS_DIR`, served by Caddy from `/media/*` | Decided. Caddy serves files without waking Node. |
| Email | An `EmailSender` interface in `apps/api/src/email/`, provider drivers behind it | The provider is not chosen. Swapping it touches only the driver. |
| Reverse proxy and HTTPS | Caddy: automatic certificates, HTTP to HTTPS redirect, routing by path | Smallest working config. |
| Process manager | systemd: `lf-web@.service`, `lf-api@.service`, instance name is the environment | Already on the server. Restarts on failure, logs to the journal, timers run backups. |
| Package manager | pnpm workspaces, no extra build orchestrator | Strict about undeclared imports. |
| Hosting | A small India region VPS, any mainstream Linux with systemd. **Provider and budget are open.** | Decided. Nothing below names a provider. |
| Observability | `pino` JSON logs to stdout, collected by journald. No error tracker yet. | A hosted tracker is a processor to name in the privacy notice, so it waits for Sarthak. |
| Local development | Optional `compose.yaml` for a throwaway Postgres on a laptop. No Docker on the server. | Quick start. |

## Repository layout

```
apps/
  web/             Next.js. Typed content modules in src/content/. Created in Slice 1.
  api/             Express service. Created in Slice 5.
packages/
  shared/          Zod schemas and types both apps import. Created in Slice 5.
db/
  migrations/      SQL migration files. Created in Slice 5.
  bootstrap/       One off SQL to create roles and databases on a server.
ops/
  systemd/         lf-web@.service, lf-api@.service, lf-backup.service, lf-backup.timer template
  caddy/           Caddyfile template for staging and production
  backup/          backup.sh, restore.sh, install-timer.sh, backup.conf.example, RESTORE.md
design/  docs/  scripts/   already exist and stay at the root (scripts/check-copy.mjs stays)
package.json  pnpm-workspace.yaml  .env.example  compose.yaml
```

Rules:
- `apps/web` and `apps/api` never import from each other. Both import only from `packages/shared`.
- Slice 1 creates the root workspace files and `apps/web` only. Express, Postgres tooling, `packages/shared`, `db/` and the API arrive in Slice 5. `ops/` is filled in Slices 5 and 8.
- Typed content modules (Home copy and the other fixed pages) live in `apps/web/src/content/`, one file per page, with each shortlist of options in the same file so a choice is a one line change.
- Production runs compiled JavaScript on the Node LTS. No `ts-node` on the server. The API build method is settled in feature 8.

## How the pieces talk

```
Browser --HTTPS--> Caddy
   /api/*    -> Express        127.0.0.1:API_PORT
   /media/*  -> files from UPLOADS_DIR (Caddy serves them, read only)
   all else  -> Next.js        127.0.0.1:WEB_PORT
Next.js server --HTTP over loopback--> Express (API_INTERNAL_URL)   page data
Express --pg--> PostgreSQL (unix socket or 127.0.0.1)
```

- **Public pages** (blog index, article, Home recent writing) fetch from Express on the server using `API_INTERNAL_URL`. `cache: 'no-store'` at first. A cache is added only after a measured need.
- **Browser actions** (newsletter form, unsubscribe, admin) call `/api/...` on the same origin. There is no cross origin traffic, no CORS setup, and cookies stay first party.
- **Admin screens** are Next.js pages under `/admin`, marked `noindex`. They call `/api/admin/*` with the session cookie. A server rendered admin page (for example a draft preview) forwards the incoming `Cookie` header to Express over loopback. No shared secret between the two apps.
- **Next.js route handlers hold no business logic.** Forms, newsletter, blog and admin logic is in Express only.
- **Express and Postgres are never reachable from the internet.** Express binds to `127.0.0.1`. Postgres listens on the unix socket or loopback. The firewall allows only SSH, 80 and 443.
- **In local development** the Next.js dev server proxies `/api/*` to Express with a `rewrites` rule, so the browser sees the same single origin as in production. The rule is active in development only.
- **Contract.** Each endpoint's request and response shape is a Zod schema in `packages/shared`. The web app calls through one typed fetch wrapper, `apps/web/src/lib/api.ts`.
- **Rate limiting** applies to public write endpoints (sign up, unsubscribe, login) and uses `express-rate-limit` with an in memory store. One API process per environment makes that enough. A restart resets the counts. Public read endpoints are not limited, because every server side page fetch from Next.js arrives from loopback and would share one bucket.
- **When the API is down**, pages that need it are marked dynamic so `next build` never needs the API running. Home hides Recent writing, and the blog pages show a plain unavailable page with status 503.
- **Security headers.** Caddy sets HSTS and the HTTP to HTTPS redirect. Express sets the rest with `helmet`. `trust proxy` is set to one hop so client addresses are read from Caddy.

## Environments and the VPS

| | Local | Staging | Production |
|---|---|---|---|
| Runs on | Sarthak's machine | The same VPS | The same VPS |
| Instance name | none | `staging` | `production` |
| Database | local Postgres | `lf_staging` | `lf_production` |
| Access | localhost | Loopback only, reached over an SSH tunnel. No public address, DNS record or certificate. | Behind a Caddy password until Sarthak records a go live step, then public |
| Data | synthetic only | synthetic only, never restored from a production dump | real |
| Email driver | none | `noop` driver, sends nothing | the chosen provider |
| Backups | none | none | the scheduled backup |

- Unit files are templates. `lf-web@staging` and `lf-api@staging` read `EnvironmentFile=/etc/lf/staging.env`. Ports, database URL and secrets differ per file. Production works the same with `production`.
- Each environment runs as its own unprivileged system user (`lf-staging`, `lf-production`), so a compromised staging cannot write to production files. Units set `NoNewPrivileges` and `ProtectSystem=strict`, with `ReadWritePaths` limited to that environment's `UPLOADS_DIR` and the Next.js cache directory. `UPLOADS_DIR` differs per environment.
- Each environment has its own database login (see Database roles) and its own env file. The migration login lives in a separate `/etc/lf/<instance>.migrate.env` readable by root only, never by the running services.
- One canonical host is served and the other (apex or `www`) redirects to it, so the `Origin` check against `SITE_URL` holds.
- Real env files live only on the server in `/etc/lf/` with mode `0600`, and are never committed. `.env.example` lists names only.
- Staging has no public address. A second Caddy site listens on `127.0.0.1:8080` over plain HTTP and routes `/api/*` and `/media/*` the same way as production. Sarthak reaches it with an SSH tunnel (`ssh -L 8080:127.0.0.1:8080`). The admin cookie is `Secure` only when `APP_ENV` is `production`, because the tunnel is plain HTTP.
- Production is not public at first. It stays behind a Caddy basic auth password from the first deploy until Sarthak records a go live step that removes it. A DNS record alone never makes the site public.
- Memory: staging adds two Node processes and a second database. Size the VPS with that in mind (see Follow up).

## Admin session handling

- One admin. The login is `POST /api/admin/login` with email and password. There is no sign up and no reset by email.
- The admin is created, and the password reset, by a script: `pnpm --filter api admin:create`. It prompts for the email and the password, so the password never appears in a command line or an env file.
- Passwords are hashed with argon2id.
- Sessions are server side rows in Postgres (`admin_sessions`, written by `connect-pg-simple`). The browser holds only an opaque session id in a cookie named `lf_admin`: `HttpOnly`, `Secure` (production), `SameSite=Strict`, path `/`.
- Defaults (feature 11 may tighten them): 2 hours idle timeout that refreshes on use, 12 hours absolute lifetime, a new session id on login, the session destroyed on sign out and on password change.
- Cross site request protection: `SameSite=Strict`, and every state changing admin request must carry `Content-Type: application/json` and an `Origin` header matching `SITE_URL`.
- Failed logins: the count and `locked_until` live on `admin_users`, so they survive a restart. Five failures lock the login for 15 minutes (starting values). The lock is a short backoff only. The per address rate limit is the main defence, so repeated bad guesses cannot keep Sarthak out for long. An unknown email gets a dummy hash check, takes the same time and counts nothing. `admin:create` clears the lock and deletes every row in `admin_sessions`, so a password change from the command line ends all sessions.

## Newsletter and unsubscribe contract

The starting contract between the form, the emails and the API. Features 9 and 10 own the final API table and may rename paths. The rules below hold whichever way they decide double opt in.

- **Sign up** is `POST /api/newsletter/subscribe` with `email`, `consent` (must be literally `true`), `consent_text_id` and `source_page`. If `consent_text_id` is not the current version, the API answers 409 with the current text, so a form that was open during a text change cannot record words the person did not see.
- **Repeat sign ups** always get the same 202 reply with the same timing, so nobody can learn whether an address is on the list. A new address gets a row and a `granted` record. An address that is already `pending` or `active` changes nothing and adds no `granted` record. A `pending` address may get a fresh confirm email, at most once every 10 minutes per address, judged from `updated_at`. An `unsubscribed` address returns to `pending` or `active` and gets a new `granted` record.
- **Confirm and unsubscribe links** only open a page with a button. The button sends a `POST` (`/api/newsletter/confirm`, `/api/newsletter/unsubscribe`) and the action happens there. Mail scanners open links on their own, and a link that acted would unsubscribe people unasked.
- **One click unsubscribe** is `POST /api/newsletter/unsubscribe/one-click`, the standard request behind the `List-Unsubscribe-Post` mail header. It identifies the person by `public_id`, skips the `Origin` check and is rate limited.
- **The form is hidden while no email can be sent.** `GET /api/newsletter/status` returns whether sign up is open, which is true only when `EMAIL_DRIVER` is not `noop`. The pages render the form only when it is open, so production cannot collect sign ups that pile up unconfirmed.
- A second factor is an open item that feature 11 decides. The schema allows adding one later with a nullable column and no breaking change.

## Backup schedule configuration

- The real config file is `/etc/lf/backup.conf` (mode `0600`), created from `ops/backup/backup.conf.example`:
  - `BACKUP_SCHEDULE=monthly` accepts `monthly`, `weekly` or any systemd calendar expression.
  - `BACKUP_DESTINATION=/var/backups/lf`, a directory path. A remote destination is the offsite decision in feature 19.
  - `BACKUP_KEEP=6` (starting value), the number of backup sets kept.
- `ops/backup/install-timer.sh` reads `BACKUP_SCHEDULE`, writes it into `lf-backup.timer` as `OnCalendar`, sets `Persistent=true` (a missed run happens after the server comes back up), then runs `systemctl daemon-reload` and `systemctl enable --now lf-backup.timer`.
- **Changing to weekly is one edit of `BACKUP_SCHEDULE` plus one run of the install script.**
- `backup.sh` runs `pg_dump -Fc` of the production database as the read only `lf_backup_production` role, leaving out the data of `admin_sessions` (`--exclude-table-data`) so a dump holds no live session ids. It makes a tar of `UPLOADS_DIR`, writes both into one timestamped folder under the destination (directory `0700`, files `0600`), removes sets beyond `BACKUP_KEEP`, and exits with an error code on any failure. The dump and the tar are not taken at one instant, which is acceptable at this volume.
- A failure triggers `OnFailure=` on the backup service, which writes a clear line to the journal. Sarthak checks `systemctl status lf-backup.service`. Active alerting is not decided here.
- Staging is not backed up. Encryption, the offsite copy, who can read the backup, `restore.sh` and `RESTORE.md` are decided and built in feature 19.

## Database schema

The complete target design, built in stages. Each slice adds its own migration files, in the order below, and no later migration changes an earlier table in a breaking way.

**Conventions**
- PostgreSQL, `public` schema. Table names are plural `snake_case`.
- Primary key `id bigint generated always as identity`.
- All timestamps are `timestamptz`, stored in UTC and shown in `Asia/Kolkata`.
- `created_at` and `updated_at` default to `now()`. A shared function `set_updated_at()` with one trigger per table keeps `updated_at` current.
- Fixed value sets use `text` with a `CHECK`, not Postgres enums. Changing the set is a plain migration.
- Text bounds use `CHECK` on length. No soft delete: deletion removes the row.
- Emails are stored lowercased and trimmed. The API normalises them, and a `CHECK (email = lower(btrim(email)))` backs it up.
- No IP address, user agent, name or phone number is stored anywhere (data minimisation, DPDP).

**Relationships**

| From | To | Cardinality | On delete |
|---|---|---|---|
| `subscribers` | `consent_records` | 1 to many | cascade (erasure removes the person's records) |
| `consent_texts` | `consent_records` | 1 to many | restrict (a text in use cannot be removed) |
| `posts` | `tags` through `post_tags` | many to many | cascade on both sides |
| `posts` | `images` through `post_images` (images used inside the text) | many to many | post side cascades, image side restricts |
| `images` | `posts.cover_image_id` | 1 to many | restrict |
| `admin_users` | `admin_sessions` | 1 to many, by the user id kept inside the session data, no foreign key | not applicable |

`admin_users` has no foreign key from any content table. Posts carry no author column, by design (the CA's name is not used to market LF).

### `subscribers` (Slice 5)

| Column | Type | Null | Default and rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `public_id` | uuid | no | `gen_random_uuid()`. Unique. The only identifier ever put in a link. Never changes. |
| `email` | text | no | unique. Lowercased and trimmed. Length 3 to 254. Contains `@`. |
| `status` | text | no | `'pending'`. One of `pending`, `active`, `unsubscribed`. |
| `confirm_token_hash` | text | yes | SHA-256 hex of the one time confirm token. Cleared once used. Used only if double opt in is chosen. Partial unique index where not null. |
| `confirm_token_expires_at` | timestamptz | yes | When the confirm link stops working. |
| `confirmed_at` | timestamptz | yes | When the address became active: at confirmation under double opt in, at sign up under single opt in. |
| `unsubscribed_at` | timestamptz | yes | When the person last unsubscribed. |
| `created_at`, `updated_at` | timestamptz | no | `now()` |

Checks: `status = 'active'` requires `confirmed_at`. `status = 'unsubscribed'` requires `unsubscribed_at`. `status = 'pending'` requires both to be null. A returning subscriber updates this one row back to `pending` (clearing `confirmed_at`, `unsubscribed_at` and any old token) or to `active` (setting `confirmed_at`, clearing `unsubscribed_at`). The history lives in `consent_records`.

### `consent_texts` (Slice 5)

Every version of every consent text, kept forever so a record can always show the exact words.

| Column | Type | Null | Default and rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `purpose` | text | no | One of `newsletter` (adding a purpose is a migration that replaces the check). |
| `version` | integer | no | Greater than 0. Unique together with `purpose`. |
| `body` | text | no | The exact plain language words shown at the form. Not empty. |
| `created_at` | timestamptz | no | `now()` |

A trigger rejects `UPDATE` and `DELETE`. A new text version is a new migration file, reviewed as a code diff like the other copy. The current text is the highest `version` for the purpose.

### `consent_records` (Slice 5)

An append only ledger of each grant and withdrawal.

| Column | Type | Null | Default and rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `subscriber_id` | bigint | no | foreign key to `subscribers`, on delete cascade |
| `consent_text_id` | bigint | no | foreign key to `consent_texts`, on delete restrict. For a withdrawal, the version the person last granted. |
| `action` | text | no | One of `granted`, `withdrawn`. |
| `source_page` | text | no | The page path where it happened, such as `/` or `/blog/some-post`, or `/unsubscribe` for a withdrawal. Matches `^/[^?#]*$`, length up to 200. No query string. |
| `recorded_at` | timestamptz | no | `now()` |

A trigger rejects `UPDATE`. Index on `(subscriber_id, recorded_at)`. The newest row for a subscriber must agree with `subscribers.status`: the API writes both in one transaction. The `granted` row is written when the form is submitted, so it records what the person saw and ticked. Confirmation under double opt in only changes the subscriber status.

### `admin_users` (Slice 6, feature 11)

| Column | Type | Null | Default and rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `email` | text | no | unique, lowercased, same checks as `subscribers.email` |
| `password_hash` | text | no | argon2id encoded string. Never the password. |
| `failed_login_count` | integer | no | `0`. Not negative. |
| `locked_until` | timestamptz | yes | Login refused until this time. |
| `last_login_at` | timestamptz | yes | |
| `created_at`, `updated_at` | timestamptz | no | `now()` |

A unique index on `((true))` allows at most one row, which enforces the decided single admin. Adding a second admin later is a deliberate migration that drops that index.

### `admin_sessions` (Slice 6, feature 11)

The shape the `connect-pg-simple` library requires, created by our own migration, not by the library.

| Column | Type | Null | Rules |
|---|---|---|---|
| `sid` | varchar | no | primary key. The opaque session id from the cookie. |
| `sess` | json | no | Session data: the admin user id and the session start time (used for the 12 hour absolute limit). |
| `expire` | timestamp(6) | no | Index on this column. The library removes expired rows. The library requires this type without a time zone. The database time zone is `UTC`, so it is read consistently. |

### `posts` (Slice 6, feature 12)

| Column | Type | Null | Default and rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `slug` | text | no | unique. Matches `^[a-z0-9]+(-[a-z0-9]+)*$`, up to 100 characters. The API refuses to change it after the first publish. |
| `title` | text | no | 1 to 150 characters |
| `summary` | text | no | `''`. Up to 300 characters. Used for the blog index blurb and the default meta description. |
| `body_markdown` | text | no | `''`. The post body as Markdown. Inline images use the token `![](image:ID)`. |
| `status` | text | no | `'draft'`. One of `draft`, `published`. |
| `published_at` | timestamptz | yes | Set at the first publish. Kept if the post is unpublished. |
| `last_reviewed_on` | date | yes | The last reviewed date shown on the article. Entered by the admin. |
| `cover_image_id` | bigint | yes | foreign key to `images`, on delete restrict. The column is added in the migration that creates `images` (Slice 6, feature 13). |
| `created_at`, `updated_at` | timestamptz | no | `now()` |

Check: `status = 'draft'`, or `published_at`, `last_reviewed_on`, a non empty `summary` and a non empty `title` are all present. Partial index on `(published_at DESC)` where `status = 'published'`. There is no author column. Unpublishing sets `status` back to `draft`. The public URL then returns 404, and a later publish keeps the original `published_at`. Markdown allows no raw HTML and is rendered through a sanitising renderer (library chosen in feature 12). Saving a post that references an unknown `image:ID` fails with 400.

### `tags` and `post_tags` (Slice 6, feature 12)

`tags`:

| Column | Type | Null | Rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `slug` | text | no | unique, same pattern as post slugs, up to 50 characters |
| `name` | text | no | unique, 1 to 50 characters, the display text |
| `created_at` | timestamptz | no | `now()` |

`post_tags`: `post_id` (foreign key to `posts`, cascade), `tag_id` (foreign key to `tags`, cascade), primary key `(post_id, tag_id)`, index on `tag_id`. The API allows up to 8 tags per post (a starting value). Tag pages on the public site are not decided here.

### `images` (Slice 6, feature 13)

| Column | Type | Null | Default and rules |
|---|---|---|---|
| `id` | bigint identity | no | primary key |
| `storage_key` | text | no | unique. A path relative to `UPLOADS_DIR`, made by the API. No leading `/`, no `..`. |
| `mime_type` | text | no | One of `image/jpeg`, `image/png`, `image/webp`. Feature 13 may change the list. |
| `byte_size` | integer | no | Greater than 0 |
| `width`, `height` | integer | no | Greater than 0. Kept so pages reserve space and avoid layout shift. |
| `content_sha256` | text | no | 64 hex characters. For integrity checks after a restore. |
| `alt_text` | text | no | Not empty after trimming, up to 300 characters. **Required on every image.** |
| `created_at`, `updated_at` | timestamptz | no | `now()` |

The original file name is not stored.

### `post_images` (Slice 6, feature 13)

`post_id` (foreign key to `posts`, cascade), `image_id` (foreign key to `images`, restrict), primary key `(post_id, image_id)`, index on `image_id`. The API rewrites a post's rows here from the `image:ID` tokens in `body_markdown`, in the same transaction as the save. This is what stops an image that is in use from being deleted. When a post is rendered, each inline image takes its alt text from `images.alt_text`, and any alt text typed in the Markdown is ignored.

### Not in this schema
- **Form entries.** No form is decided. A table is added when one is.
- **Newsletter issues and send logs.** Newsletters reuse posts. A send log would hold emails, so it is not added without a decision.
- **Fixed page copy.** It stays in code (the unconfirmed assumption above).
- The `node-pg-migrate` bookkeeping table is owned by the tool.

### Migration order
- Slice 5, feature 8: roles, `set_updated_at()`.
- Slice 5, features 9 and 10: `subscribers`, `consent_texts` with the first text version, `consent_records`.
- Slice 6, feature 11: `admin_users`, `admin_sessions`.
- Slice 6, feature 12: `posts` (without the cover column), `tags`, `post_tags`.
- Slice 6, feature 13: `images`, `post_images`, then add `posts.cover_image_id`.

### Database roles
- Postgres logins are shared across the whole server, so each environment gets its own, named with the instance: `lf_migrator_staging`, `lf_app_staging`, and `lf_migrator_production`, `lf_app_production`, `lf_backup_production`. A staging login cannot connect to the production database.
- `lf_migrator_<env>`: owns that environment's tables and runs its migrations. Never used by the running API.
- `lf_app_<env>`: the API's login. `SELECT`, `INSERT`, `UPDATE`, `DELETE` on tables, no schema changes, no superuser. On `consent_texts` it has `SELECT` only, so new text versions come from migrations alone. `ALTER DEFAULT PRIVILEGES` in `db/bootstrap/` gives it and the backup login their rights on tables the migrator creates later.
- `lf_backup_production`: read only, used by the backup script, which runs as its own system user and signs in over the unix socket.
- Created by `db/bootstrap/`. Postgres accepts no connection from outside the server. The database time zone is `UTC`.

### Value sourcing

| Action | Value produced or shown | Source |
|---|---|---|
| Render the sign up form | Consent text and its version | The highest `version` row of `consent_texts` for `newsletter`, read from `GET /api/consent/newsletter` |
| Sign up | `source_page` | A hidden field set when the page is rendered to that page's path. The API checks the pattern. The `Referer` header is not used. |
| Sign up | `email` | The form field, lowercased and trimmed by the API |
| Sign up | `consent_text_id` | Sent by the form. The page got it from the same API call that supplied the text. The API rejects any id that is not the current version. |
| Confirm link (double opt in only) | Token | 32 random bytes, base64url. Only the SHA-256 is stored. The raw token exists only in the email. |
| Unsubscribe link and page | The person to unsubscribe | `subscribers.public_id`, carried in the link. No secret and no expiry. |
| Create the admin | Email and password | Prompted by `admin:create` |
| Image upload | `storage_key` | Made by the API: `YYYY/MM/<16 random bytes in hex>.<extension from the detected type>`. Never from the file name. |
| Image upload | `mime_type`, `byte_size`, `width`, `height`, `content_sha256` | Read from the file bytes by the API, not claimed by the client |
| Image upload | `alt_text` | A required admin form field |
| Publish a post | `published_at` | The server clock at the first publish |
| Publish a post | `last_reviewed_on` | Entered by the admin. The form suggests today's date in `Asia/Kolkata`. |
| Show a post date | The date and its time zone | `published_at` stored in UTC, shown in `Asia/Kolkata` |
| Render a post | Inline image alt text | `images.alt_text`, through `post_images` |

## Key invariants

- Personal data (subscriber emails, consent records, form entries) is never logged, committed, or put in fixtures. Logs record no request body, query string, cookie or client address. Access logs at Caddy drop the client address and the query string (confirm and unsubscribe tokens travel in the query). The `pino` error serializer strips the `detail` field of database errors, because Postgres puts the offending value, which can be an email, in it. Postgres runs with `log_error_verbosity = terse`, and duplicate emails are handled with `INSERT ... ON CONFLICT`.
- Drafts never appear on a public endpoint. Public endpoints return only `status = 'published'` rows.
- Express and Postgres accept no connection from the internet.
- Every query uses parameters. No SQL is built from user text.
- `consent_texts` and `consent_records` are never updated in place.
- Secrets come from environment variables or `/etc/lf/*.env`. Nothing is committed.
- Nothing in code or config names a hosting provider.

## Security model

- Compliance scope: DPDP Act 2023 (see `docs/context/05-data-and-dpdp.md`). The CA or counsel confirms the rules before launch.
- Public: read published posts, submit the newsletter form, unsubscribe. Admin: everything under `/api/admin/*`, only with a valid session.
- Public endpoints are rate limited. The login is rate limited and locks after repeated failures.
- HTTPS only. HSTS set at Caddy.
- Backups hold personal data and must be access controlled (feature 19).
- Image files are served from `/media/*` with no login. A file used in a draft can be fetched by anyone who has its unguessable URL. This is accepted, because a URL appears nowhere until the post is published.

## Configuration required

Names only. `.env.example` lists these with no values.
- `APP_ENV`: `local`, `staging` or `production`.
- `NODE_ENV`
- `SITE_URL`: the public origin, used for the admin `Origin` check and absolute links.
- `WEB_PORT`, `API_PORT`
- `API_INTERNAL_URL`: how Next.js reaches Express over loopback.
- `DATABASE_URL`: the `lf_app_<env>` login. `MIGRATE_DATABASE_URL` for `lf_migrator_<env>` lives only in the root only migrate env file, never in the service env file.
- `SESSION_SECRET`
- `UPLOADS_DIR`
- `EMAIL_DRIVER`: `noop` until a provider is chosen.
- `CALENDLY_URL`: owned by feature 6.
- In `/etc/lf/backup.conf`: `BACKUP_SCHEDULE`, `BACKUP_DESTINATION`, `BACKUP_KEEP`.

## Consequences

**Positive**:
- Each decided piece is recorded once. Later specs can point here and not reopen it.
- Services and database are isolated. The API holds the personal data handling in one small place.
- The schema is whole before any slice builds a part of it, so no slice has to reshape another's tables.
- Consent and withdrawal are provable from append only records, with the exact words shown.
- Nothing ties the code to a provider, so a move is a server change.
- Backups catch up after downtime, and weekly is a one line change.

**Negative / tradeoffs**:
- Sarthak runs and patches two Node services, Caddy and Postgres on one server. A single VPS means one failure takes down staging and production together.
- A monthly backup can lose up to a month of subscribers, form entries and blog edits. This is the registered disagreement, and the decision stands.
- Staging on the same server competes for memory, and reaching it needs an SSH tunnel, so the CA cannot open it from their own device.
- Dropping client addresses from stored logs removes a tool for tracing abuse.
- Erasing a person cascades through `consent_records`, so no proof of consent remains for that person. Whether to keep anonymised proof is a question for counsel.
- `no-store` page fetches mean every page view queries the API. Fine at this volume, to be measured later.
- Sessions in plain rows mean a leaked database dump shows live session ids until they expire. Short lifetimes and an access controlled backup reduce this.

**Neutral**:
- Slice 1 stays Next.js only, so the workspace starts with one app and grows.
- Feature 7 (Data model) in the scope is covered by the Database schema section. Its migration is built in the slices above.
- Package versions and the exact Node and Postgres majors are fixed at scaffold and provisioning, not here.

## Follow-up

- [ ] Sarthak to confirm the assumption that fixed page copy lives in code, not the database.
- [ ] Hosting provider and budget (open). Size the VPS for production and staging together, and confirm it runs a current Linux with systemd.
- [ ] A domain name is needed before production can be set up. Staging needs none.
- [ ] Double opt in for the newsletter is still open. The schema supports either choice. Decide in feature 9.
- [ ] Retention period for subscribers, unconfirmed sign ups and unsubscribed rows is open (`05-data-and-dpdp.md`). Decide in features 9 and 10.
- [ ] Counsel question: after an erasure request, may anonymised consent proof be kept (`ON DELETE SET NULL` is the runner up to the cascade)?
- [ ] Confirm that dropping client addresses from access logs is acceptable.
- [ ] Admin second factor (open), decided in feature 11.
- [ ] Offsite backup copy, backup encryption and who can read backups, decided in feature 19.
- [ ] Feature 10: deletion on request (an `admin:erase-subscriber` script, a check that the requester owns the address, and a record of the erasure that holds no personal data), and the newsletter send flow (what triggers a send, only `active` subscribers, no double send after a crash; a `newsletter_sent_at` column on `posts` is one option).
- [ ] Features 17 and 19: an erased person can return from a restored backup, and an erased record can survive in backups for as many periods as `BACKUP_KEEP` holds (six months at the starting values). The privacy notice must say so, and the restore runbook must re apply erasures (a list of hashed emails is one option).
- [ ] Feature 9: the clean up timer for unconfirmed sign ups, the confirm link lifetime and the unconfirmed retention period, all as config values.
- [ ] Feature 13: image size and pixel limits, request body limits at Caddy and Express, stripping location data from photos (and taking `content_sha256` from the stored bytes), the write order between file and row, removing the file when the row is deleted, and whether `next/image` optimisation is used.
- [ ] Features 8 and 18: where the build runs (a Next.js build can run out of memory on a small VPS) and the deploy order: build, migrate, restart.
- [ ] Scope feature 7 (Data model) now has its design in this spec. Reconcile it with `/scope`, which owns the scope.
- [ ] Verify the current Node LTS, Next.js and PostgreSQL versions and the package names (`argon2`, `connect-pg-simple`, `node-pg-migrate`) when scaffolding.
- [ ] Agent Skills and MCP servers: you chose to look at them later. The search returned no result in the skills registry. Web results only (unvetted): a Next.js skill from `vercel/next.js`, two community Caddy skills (`ddnetters/homelab-agent-skills`, `nevaberry/nevaberry-plugins`), and community Postgres MCP servers (`chornthorn/postgresql-mcp-server`, `perrypixel/easy-postgres-mcp`). Check any of them with `npx skills add <owner>/<repo> --list` before installing. Nothing was found for Express, node-postgres, node-pg-migrate, Zod, systemd or pnpm.
- [ ] `AGENTS.md` should gain the real commands, the repo layout and the nested `apps/web` and `apps/api` notes after the scaffold exists (owned by `/audit` and `/sync`).

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
