# Start prompts for Claude Code

Paste these in order, one per session. Clear the session between them: the state lives in files, so nothing is lost. Stop and read the result after each one. Sarthak decides every gate.

## Before the first prompt
1. Repo created, package files copied in, first commit made (see `README.md`).
2. Skills installed and Claude Code restarted: `npx skills@latest add jsmastery-pro/skills -a claude-code`
3. Confirm the skills appear: type `/` in Claude Code and look for scope, audit, architect, develop, check, test, document, sync, debug.

## Prompt 1: scope
```
Run /scope for this repo. It is a new project. Read AGENTS.md and every file in docs/context/ and design.md first.

Context: the stack, hosting, backup, image storage, admin and approval decisions are already made by Sarthak in docs/context/01-decisions.md. Do not reopen them. Copy is locked in docs/context/03-home-copy.md and must be used verbatim.

Plan these slices in this order, and recommend a delivery style and a workflow tier for each (Sarthak decides):
1. Foundation: scaffold, design tokens as CSS variables for light and dark, base layout, lockup.
2. Home page on the locked copy. Sections with no content stay hidden.
3. Stop point: a demo build for the CA.
4. Book a call route using a CALENDLY_URL config value.
5. Database, Express API, consent record and newsletter sign-up.
6. Blog, image upload and the single-admin login.
7. SEO, AEO and GEO structure and schema, per docs/context/04-seo-aeo-geo.md.
8. Privacy notice and terms drafts, deployment, monthly backup and restore.

Do not start building. Do not run npx skills find or add. Ask me before anything is fetched from the internet.
```

## Prompt 2: architect the stack
```
Run /architect in stack mode. The stack is already decided: PENN, self-hosted Postgres, a separate small Express API, Next.js with server rendering, all on a small India-region VPS. Record these as the decision. Do not run a wide comparison.

Ask me only what I alone know. Recommend the rest with a reason and a runner-up: repo layout (apps and folders), process manager and reverse proxy on the VPS, migration tool, how Next.js talks to the API, session handling for the single admin, and how the backup schedule is configured. Write the spec to docs/specs/ as Proposed.
```

## Prompt 3: scaffold, then audit
Scaffold by hand or with the stack's own setup tools as the spec says, commit, then:
```
Run /audit on this repo. Refine AGENTS.md from the real code. Keep every rule in the current AGENTS.md. Add the real commands. Do not create design.md again: it exists.
```

## Prompt 4: Home
```
Run /develop for the Home page slice. Use the existing design system: design.md, design/tokens.json and design/README.md. Build to docs/context/03-home-copy.md verbatim. Sections with no content are hidden. Use hero option 1, supporting line option 1 and firm statement option 1, kept in one content file so each choice is a one-line change.

Build desktop and mobile. Check contrast in both themes. Run node scripts/check-copy.mjs. When done, give me demo notes: what is built, which sections are hidden and why, which claims are flagged for the CA (docs/context/02), and what is a stand-in.
```
Then `/check` in verify mode. Then Sarthak demos the CA. Feedback goes into the Notion tracker and `docs/context/03-home-copy.md` by Sarthak, not by Claude.

## Later slices
Repeat the pattern per slice: `/architect` for any real decision, `/develop`, `/check` verify, `/test` for slices that touch data or login, `/document` at PR time, `/sync` around merge. Use `/debug` when something breaks.

## Rules that apply to every prompt
- Locked copy is verbatim.
- Never invent clients, testimonials, figures, people or credentials.
- No em or en dashes.
- The CA's name is not used to market LF.
- No phone, email or response time on the site.
- Personal data never appears in logs, fixtures or commits.
- Nothing is pushed, deployed or published without Sarthak's say-so.
