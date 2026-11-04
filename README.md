# Lotus Feet site: handover package

Source code for the Lotus Feet Consultancy corporate website. This package holds the context, design system and start prompts to build it with Claude Code and the jsmastery-pro workflow skills. The app scaffold is in place (Next.js only, no pages yet).

## What is in it
| Path | Purpose |
|---|---|
| `AGENTS.md` | Project context and hard rules. Single source for any coding agent |
| `CLAUDE.md` | One-line pointer to `AGENTS.md` |
| `design.md` | Art direction. Points at the tokens |
| `design/` | Tokens, design rules, logos, component references |
| `docs/context/` | Brief, decisions, compliance, locked Home copy, SEO/AEO/GEO, data and DPDP, open items |
| `scripts/check-copy.mjs` | Fails on em and en dashes |
| `START-PROMPT.md` | The prompts to paste, in order |
| `apps/web/` | The Next.js app (App Router, TypeScript). Express, Postgres and `packages/shared` arrive in Slice 5 |
| `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json` | Workspace and shared TypeScript settings |
| `.env.example` | Names of the config values, with no values |

## Set up (Sarthak does these steps; GitHub is not connected to the Claude session)
1. On GitHub, create a **private** repo `lotus-feet-site`. Description: `Source code for the Lotus Feet Consultancy corporate website.` Add no README, licence or .gitignore.
2. Copy the contents of this folder into a local clone, then:
   ```bash
   git add -A
   git commit -m "Add project context, design system and start prompts"
   git push -u origin main
   ```
3. Review the skills before installing. Read-only review done on 4 Nov 2026 at commit 43b69e4: the repo's two scripts run locally and make no network calls, its CI workflow only runs a local check, its two agents are read-only, and its skills ask before running `npx skills find` or `add`. The `skills` installer package is separate and was not reviewed.
4. Install in the repo folder, then restart Claude Code:
   ```bash
   npx skills@latest add jsmastery-pro/skills -a claude-code
   ```
   The skills repo's own docs show the owner name JavaScript-Mastery-Pro in places. If the command above fails, try that spelling.
5. Commit the installed `.claude/skills` folder so it stays versioned.
6. Open Claude Code in the repo and paste the prompts from `START-PROMPT.md`, one per session.

## Run it
You need Node.js 26 (the current LTS line, see `.nvmrc`) and pnpm 10.

```bash
pnpm install
```

```bash
pnpm dev
```

```bash
pnpm typecheck
```

```bash
pnpm build
```

```bash
pnpm start
```

- `pnpm dev` starts the site at http://localhost:3000. There are no pages yet, so every address shows the Next.js 404 page.
- `pnpm start` serves the output of `pnpm build`.
- `.env.example` lists the config names. Copy it to `.env` and fill in values when a feature needs them. Nothing reads it yet.
- Express and Postgres are not installed until Slice 5.

## Check before you rely on it
- `node scripts/check-copy.mjs` should print "no em or en dashes found".
- Copy in `docs/context/03-home-copy.md` is a 4 Nov 2026 snapshot. Notion is the system of record. If Notion has changed, update the file before building.
- Everything in `docs/context/06-open-items.md` is unresolved. Nothing there has a placeholder.
