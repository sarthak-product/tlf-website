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

## Commands
Not yet defined. `/audit` fills this section after the scaffold exists.

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
