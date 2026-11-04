# 01 Decisions (stack and delivery)

Decided by Sarthak Chaturvedi on 4 Nov 2026 unless stated. These are inputs to `/architect`: treat them as decided and write specs that record them. Do not reopen them. If one turns out to be technically impossible, stop and tell Sarthak.

## Decided
| Item | Decision |
|---|---|
| Stack | PENN: PostgreSQL, Express, Next.js, Node.js |
| Database | Self-hosted PostgreSQL, because the site is quiet and free hosted tiers pause or sleep |
| API | Express as a small separate service. Next.js serves pages. Express handles forms, newsletter, blog and admin |
| Hosting | A small India-region VPS. Sarthak sets it up. Provider and budget not chosen. Nothing in code may depend on one provider |
| Backups | A database dump once a month. Build the schedule as a config value so a change to weekly is one line. Include the uploaded images folder in the backup |
| Newsletter list | Stored in our own Postgres |
| Newsletter sending | A free email service until volume outgrows the free plan. Provider not chosen. Send through an adapter so the provider can change |
| DPDP basics | Needed. See `05-data-and-dpdp.md` |
| Content management | No separate CMS. The database stores blog posts and image records. We build the admin |
| Image storage | Image files on the server's disk. Paths and metadata in Postgres. Alt text required on every image |
| Blog admin | One admin login (Sarthak). Draft and publish. No roles, no CA-approval flag |
| Repo | Private GitHub repo `lotus-feet-site`, description "Source code for the Lotus Feet Consultancy corporate website." |
| Build tooling | Claude Code with the jsmastery-pro/skills workflow |
| Handover | Inside the repo: `CLAUDE.md`, `AGENTS.md`, `docs/context/`, `design/` |
| Contact | No phone, email or response time on the site. The "Book a call" button (Calendly) is the route to the CA |

## Assumption to confirm (not yet said by Sarthak)
Page copy for Home and other fixed pages lives in code as typed content modules, not in the database. Reason: search engines get stable server-rendered HTML and the CA review is a code diff. The database holds blog posts, image records, form entries, subscribers, consent records and the admin user. If Sarthak wants fixed page copy editable from the admin, that is a larger build and needs a spec.

## Disagreements registered once (follow Sarthak's decision, do not relitigate)
1. Express is optional: Next.js route handlers could handle forms. Built as a separate service because Sarthak asked for PENN.
2. A monthly backup can lose up to a month of form entries, subscribers and blog edits. Recommended: weekly, a copy stored away from the server, and a tested restore. Sarthak's decision stands. The backup tooling must make weekly a one-line change, ship a restore script and a written restore runbook, and take its destination from config.
3. Storing blog and images in the database means building login, drafts, preview, publish and image handling. Recommended: keep image files outside Postgres. Sarthak agreed to files on disk.

## Hosting findings (vendor pages, read 4 Nov 2026)
- ngrok routes and secures traffic to services you run. It does not host a site. Ruled out.
- Vercel Hobby is limited to non-commercial, personal use. Ruled out for this site. Vercel has a Mumbai region, but it runs functions, not a standing Express service or a self-hosted Postgres.
- India-region VPS providers: not yet compared. Price, backups and region features are unknown.

## Delivery recommendations for `/scope` (opinion, Sarthak decides)
- Delivery style: "Look first, wire later" for Home, because Sarthak demos the CA before committing. Switch to "Thin thread first" for the newsletter form (screen to database).
- Workflow tier: Beta by default. GA for anything touching login, personal data, consent or backups.
- Build order: (1) foundation and tokens as CSS, (2) Home on locked copy, (3) stop for the CA demo, (4) Book a call route, (5) database, API, consent and newsletter sign-up, (6) blog and admin, (7) SEO, AEO, GEO structure and schema, (8) privacy notice and terms drafts, deployment, backups and restore.

## Open
- Hosting provider and monthly budget.
- Email provider (free plan limits not checked).
- Domain name and sending address.
- Whether backups get an offsite copy.
- Admin hardening: second factor or not.
