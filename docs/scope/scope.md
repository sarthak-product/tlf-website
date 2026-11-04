# Scope: Lotus Feet Consultancy website

A corporate site for a virtual CFO, compliance and funding consultancy in India. Founders and CXOs find it through search and AI answers, trust what they read, and book a call with the CA. This scope covers the LF site only (not the CA's personal portfolio).

**Build approach:** Tracer Bullet (build each slice end to end through every layer, working, then thicken it). Slices 1 to 3 carry a `· Facade` tag: the interface is built first on typed content modules with no database, because the CA sees a demo before anything is committed. Newsletter sign-up is the thin thread, screen to database. (basis: your delivery notes in `docs/context/01-decisions.md`)
**Workflow:** Beta (after `/develop`, run `/check verify`, then `/test`). Slices that touch login, personal data, consent, deployment or backups carry `· GA`, which adds a fresh model `/check review` and `/document`. The stack is already decided, so most `/architect` boxes below record a decision you made rather than reopen it. `/architect` stays the first stop for a feature with a real decision, and you can skip it when you already know the build.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit. You decide when a feature is `done`, and you decide every gate. Nothing is published, deployed or pushed to a public place without your say so._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack and architecture | Slice 1 | in-progress |
| 2 | Coding standards and tooling | Slice 1 | in-progress |
| 3 | Design system and base layout | Slice 1 | in-progress |
| 4 | Home page on the locked copy | Slice 2 | done |
| 5 | Demo build for the CA | Slice 3 | planned |
| 6 | Book a call route | Slice 4 | planned |
| 7 | Data model | Slice 5 | planned |
| 8 | API service and database connection | Slice 5 | planned |
| 9 | Newsletter sign up and consent record | Slice 5 | planned |
| 10 | Unsubscribe, deletion and email sending | Slice 5 | planned |
| 11 | Single admin login | Slice 6 | planned |
| 12 | Blog admin: draft, preview, publish | Slice 6 | planned |
| 13 | Image upload with alt text | Slice 6 | planned |
| 14 | Public blog and Home recent writing | Slice 6 | planned |
| 15 | SEO and AEO foundations | Slice 7 | planned |
| 16 | Structured data (JSON-LD) | Slice 7 | planned |
| 17 | Privacy notice and terms drafts | Slice 8 | planned |
| 18 | Deployment | Slice 8 | planned |
| 19 | Monthly backup and restore | Slice 8 | planned |

## Slice 1: Foundation
Style: Facade (UI first, no database). Tier: Beta. Enough ground to render the Home page, nothing more. Express and Postgres are not installed until Slice 5.

### 1. Stack and architecture
Record the decided PENN stack as a spec and scaffold only the runnable Next.js skeleton Home needs. The spec also settles repo layout, how Next.js will talk to the Express API later, and where typed content modules live. (basis: foundations before features; stack decided in `01-decisions.md`)
spec [0001](../specs/0001-stack-and-architecture/index.md) · code in apps/web
**Done when:** the stack is recorded as Proposed in `docs/specs/`, nothing decided in `01-decisions.md` is reopened, and the scaffold boots locally and passes a build.
- [x] Decide the stack (spec): `/architect stack and architecture`
- [x] Scaffold from the decision: `/develop stack and architecture`
- [ ] Verify it: `/check verify stack and architecture`
- [ ] Test it: `/test stack and architecture`

### 2. Coding standards and tooling
Capture conventions from the real scaffold into `AGENTS.md` (keeping every current rule, adding real commands), then install lint, format and pre commit checks, with `scripts/check-copy.mjs` wired in so dashes fail the commit.
**Done when:** `AGENTS.md` lists the real commands, and lint, format and the copy check run clean on commit.
- [ ] Capture conventions and tooling choices: `/audit`
- [x] Install the tooling: `/develop tooling`
- [ ] Check it runs clean: `/test`

### 3. Design system and base layout · needs a decision · Facade
Turn `design/tokens.json` into CSS variables for light and dark (light ships first), build the base layout, navigation and footer shell with stand in labels, and the lockup as type (mark plus name in Quicksand 600). Base components follow `design/components`: Button, Alert, Badge, TextField. The spec settles how theme switching works, how fonts load without blocking, and the mobile layouts, which were never drawn. (basis: Home comes first and every page depends on this)
code in apps/web (tokens, fonts, lockup and header built ahead of the spec; the spec is still owed)
**Done when:** both themes render from one set of token variables, every interactive element shows default, hover, focus and disabled states, contrast passes 4.5:1 for text and 3:1 for borders in both themes, the mark is checked at 32px wide, and reduced motion is honored.
- [ ] Design it (spec): `/architect design system and base layout`

## Slice 2: Home page
Style: Facade. Tier: Beta. A real, polished page on typed content modules, no database. This is a validated shell the CA reviews, not a final launch page.

### 4. Home page on the locked copy · needs a decision · Facade
Build all thirteen sections in the order set in `docs/context/03-home-copy.md`, using the copy verbatim. Hero headline, supporting line and firm statement each live in one content file with all shortlisted options, so a choice is a one line change; the demo shows option 1 of each. Sections with no real content (clients, case studies, key figures, testimonials, people) render nothing until content exists, heading included. "How an engagement runs" is a hidden slot until copy exists, and Recent writing stays hidden until a post is published. Desktop and mobile both built.
code in apps/web (built from the `/develop` brief, no spec yet; the spec is still owed)
**Done when:** the page matches the locked copy word for word, hidden sections leave no heading or gap, the six questions each end with Book a call, no invented client, figure, person or image appears, and `node scripts/check-copy.mjs` passes.
- [ ] Design it (spec): `/architect home page`

## Slice 3: Stop point
Style: Facade. Tier: Alpha. This is a gate, not a build. Slices 4 onward wait for you to say go.

### 5. Demo build for the CA · Alpha
A demo ready build of Home plus short demo notes: what is built, which sections are hidden and why, which claims are flagged for the CA (`docs/context/02-rules-claims-and-compliance.md`), and which items are stand ins (nav labels, footer lines). Draft labels live in the demo notes only, never on the page. You demo the CA in person; feedback goes to the Notion tracker and `03-home-copy.md` through you, not through Claude.
**Done when:** the demo build runs from a clean checkout, the demo notes list every hidden section, stand in and flagged claim, and you have decided what happens next.
- [ ] Verify it: `/check verify demo build`
- [ ] Write the demo notes: `/document`
- [ ] Stop here: you demo the CA and decide

## Slice 4: Book a call
Style: Tracer Bullet. Tier: Beta.

### 6. Book a call route · needs a decision
Every Book a call button reads one `CALENDLY_URL` config value and opens the booking page. The spec settles what visitors see while the URL is unset (never a made up address), and whether the booking opens in a new tab or inline. Your open question stays open: the Calendly page normally shows the host's name, which conflicts with the rule against using the CA's name to market LF, so a firm or team account may be needed. (basis: `01-decisions.md` and `02-rules-claims-and-compliance.md`)
**Done when:** all Book a call buttons across Home use the one config value, an unset value fails gracefully without inventing a URL, and `.env.example` names the value.
- [ ] Design it (spec): `/architect book a call route`

## Slice 5: Database, API, consent and newsletter
Style: Tracer Bullet, the thin thread from screen to database. Tier: GA, because this slice holds personal data and consent under the DPDP Act. (basis: your delivery notes; personal data rules in `05-data-and-dpdp.md`)

### 7. Data model · needs a decision · GA
The tables the site decided to hold: subscribers, consent records with every consent text version, blog posts, image records, form entries if any form exists, and the admin user. Fixed page copy stays in code (an assumption you have not yet confirmed). (basis: a wrong data model is the costliest thing to redo)
**Done when:** the model supports newsletter, consent, blog, images and admin without a breaking migration, and collects the email address only for subscribers.
- [ ] Design it (spec): `/architect data model`

### 8. API service and database connection · needs a decision · GA
The separate Express service and self hosted Postgres, connected end to end with one real round trip from Next.js to the database. Includes migrations, rate limiting on public endpoints, parameterised queries, secrets from environment variables, and logging that carries no personal data. Install Express and Postgres tooling here, not earlier.
**Done when:** a health check travels Next.js to Express to Postgres, migrations run from nothing, public endpoints are rate limited, and a log scan finds no personal data.
- [ ] Design it (spec): `/architect api service and database connection`

### 9. Newsletter sign up and consent record · needs a decision · GA
One email field, plain language consent text, not pre ticked, with the exact consent text version, timestamp and source page saved per person. Whether to use double opt in is open and recommended; the spec settles it with you.
**Done when:** a visitor can sign up with one email, a consent record is saved with text version, timestamp and source page, and no name or phone is collected.
- [ ] Design it (spec): `/architect newsletter sign up and consent record`

### 10. Unsubscribe, deletion and email sending · needs a decision · GA
An unsubscribe page that works without login and takes effect at once, a documented way to erase a person's data on request, and an email sending adapter so the provider can change. Provider is not chosen, so the adapter ships first and the provider choice stays yours.
**Done when:** unsubscribing is immediate and recorded, a deletion request removes the person from the database by a documented route, and swapping the email provider touches only the adapter.
- [ ] Design it (spec): `/architect unsubscribe, deletion and email sending`

## Slice 6: Blog, images and admin
Style: Tracer Bullet. Tier: Beta, with the login at GA.

### 11. Single admin login · needs a decision · GA
One login for Sarthak, hashed password, no roles. The spec settles session handling and whether to add a second factor (your open item).
**Done when:** only the admin can reach admin routes, the password is stored hashed, failed logins are rate limited, and the second factor decision is recorded.
- [ ] Design it (spec): `/architect single admin login`

### 12. Blog admin: draft, preview, publish · needs a decision
Write, save as draft, preview and publish posts. No roles and no CA approval flag, so the CA review step before publishing is a process you own outside the tool. Posts carry no byline.
**Done when:** the admin can create, edit, preview, publish and unpublish a post, and drafts never appear publicly.
- [ ] Design it (spec): `/architect blog admin`

### 13. Image upload with alt text · needs a decision
Image files saved on the server's disk, paths and metadata in Postgres, alt text required on every image. The spec settles file type and size limits and safe file naming.
**Done when:** an image cannot be saved without alt text, only allowed types and sizes are accepted, and files land in one folder that the backup can include.
- [ ] Design it (spec): `/architect image upload with alt text`

### 14. Public blog and Home recent writing · needs a decision
Blog index and article pages, server rendered, with a last reviewed date on each article, and the Home Recent writing section appearing once at least one post is published. No byline.
**Done when:** published posts render as full HTML without JavaScript, the index lists them, Home shows Recent writing only when a post exists, and no post names the CA.
- [ ] Design it (spec): `/architect public blog`

## Slice 7: SEO, AEO and GEO
Style: Tracer Bullet. Tier: Beta. The aim is to be found and cited, so pages answer the general question first. (basis: `docs/context/04-seo-aeo-geo.md`)

### 15. SEO and AEO foundations · needs a decision
Unique title and meta description per page, canonical URLs, Open Graph tags, `sitemap.xml` generated from the database for posts, and `robots.txt` built from a config list. Your open decision stays yours: allow or block AI crawlers. The recommendation is to allow them, since the goal is citation. Keyword research is not done and nothing here invents volumes or competitors.
**Done when:** every public page has one h1, unique metadata and a canonical, the sitemap lists published posts, and robots.txt reads its rules from config.
- [ ] Design it (spec): `/architect seo and aeo foundations`

### 16. Structured data (JSON-LD) · needs a decision
`Organization`, `WebSite`, `FAQPage` on Home (text identical to the visible answers), and `Article` with `BreadcrumbList` on posts. No `author`, `founder` or `employee` entry that names the CA, and the organisation is the publisher. `Service` entries wait for real service pages. Google's FAQ rich results are restricted, so no rich result is promised.
**Done when:** each type validates in Google's Rich Results Test and the schema.org validator, FAQ markup matches the visible answers exactly, and no markup names the CA.
- [ ] Design it (spec): `/architect structured data`

## Slice 8: Legal, deployment and backup
Style: Tracer Bullet. Tier: GA. Real data practices exist only after Slice 5, so legal drafts come last. (basis: `02-rules-claims-and-compliance.md`)

### 17. Privacy notice and terms drafts · needs a decision · GA
Drafts written from the real data practices, each marked "Draft for review" because the CA or counsel must review before launch. The notice names Calendly, the email provider and the hosting provider, states retention, and says how long a deleted record can survive in a backup. The privacy contact route is open, because no email may show on the site. The breach response runbook is yours to write; this scope only links to it.
**Done when:** both pages exist as drafts marked "Draft for review", every processor is named, and every open item is listed rather than filled with a guess.
- [ ] Design it (spec): `/architect privacy notice and terms drafts`

### 18. Deployment · needs a decision · GA
Run the site on a small India region VPS behind HTTPS, with a process manager and reverse proxy, and the database closed to the internet. Hosting provider and budget are your open items, so nothing in code ties to one provider. Nothing goes live without your say so.
**Done when:** the site runs over HTTPS on the chosen VPS, Postgres is not reachable from outside, secrets come from environment variables, and no provider specific code exists.
- [ ] Design it (spec): `/architect deployment`

### 19. Monthly backup and restore · needs a decision · GA
A monthly database dump on a schedule held in one config value (so weekly is a one line change), the uploaded images folder included, the destination read from config, a restore script and a written restore runbook. Your decision of monthly stands. The offsite copy and who can read the backup are open.
**Done when:** the schedule comes from config, a dump and the images folder are produced and restored on a clean machine, and the runbook is written and tested.
- [ ] Design it (spec): `/architect monthly backup and restore`

## Deferred
Out of scope for this pass, kept so the plan stays honest. Several wait on you or the CA.
- **Services page and per service pages**: parked until you say so · needs a decision
- **About and Contact pages**: parked. Contact route and privacy request route are open · needs a decision
- **Fixed page copy editable from the admin**: a larger build, only if you ask · needs a decision
- **Search Console and Bing verification, monthly query checks**: set up after launch
- **Analytics and cookie policy**: no analytics tool is chosen, and none is added without your approval · needs a decision
- **`llms.txt`**: optional, unproven effect, after the core is done

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally, `Decide the stack (spec)` on Stack and architecture), so skills locate it by that `(spec)` suffix. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | `/architect` at spec capture | `Design it` ticked, spec linked, `Build it: /develop <feature>` with 2 to 5 milestones, then the tier's closing boxes |
| `in-progress` (building) | `/develop` | milestone boxes tick one by one, code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` and milestones ticked, `Verify it` ticked |
| `done` | you, when you decide it is | boxes you ran ticked, skipped ones marked skipped |

- **Next step** is the first unticked box.
- **needs a decision** means run `/architect` first, otherwise straight to `/develop`. The tag drops once the spec is captured.
- **Atomic build tasks** live in the spec's `## Build plan`, not here.
- **Status** runs `planned`, `in-progress`, `done`, plus `existing` and `dropped`.
- **Approach tag** (`· Facade`) overrides the project default for that feature. No tag inherits Tracer Bullet.
- **Workflow tier tag** (`· GA`, `· Alpha`) sets one feature's rigor above or below the project default. No tag inherits Beta.
- **Pointer line** (`spec <n> · code in <path>`) appears once a spec or code exists.

## References

_Sources plus web verified links was chosen. Only links that a fetch confirmed would be listed._

**Project sources**
- `AGENTS.md`, `design.md`, `design/tokens.json`
- `docs/context/00-project-brief.md` through `06-open-items.md`, especially `01-decisions.md` (stack, delivery recommendations, build order), `02-rules-claims-and-compliance.md` (claims flagged for the CA), `03-home-copy.md` (locked copy and section order), `04-seo-aeo-geo.md` and `05-data-and-dpdp.md`

**Practices and standards**
- Foundations before features
- Tracer Bullet slices ship real value early
- A data model is the costliest thing to redo
- Personal data features get the heaviest checking

**Links**
None verified. The link check could not reach the web from this session, so no URL is listed rather than risk a wrong one.
