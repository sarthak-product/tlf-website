# Assets

Every visual asset the site uses: where it came from, its licence and when that was checked. Add a line before an asset ships. The rules are in `design/README.md` (Imagery) and `AGENTS.md` (Hard rules): only CC0, public domain or permissive licences (MIT, Apache 2.0), nothing that needs a visible credit unless Sarthak approves a credits line, and no stock photography, people, coins, charts or handshakes.

## Third party assets

None. For scope 4c (Home redesign) Sarthak chose original SVG drawn from the mark. The free asset sites were also unreachable from the build environment on 6 November 2026 (the network policy refused SVG Repo, unpkg and jsDelivr), so no third party file was downloaded, read or used.

## Brand assets

| Asset | Source | Licence | Checked |
|---|---|---|---|
| LF mark, `design/assets/Logos/lf-mark-on-light.svg` and `lf-mark-on-dark.svg` | Supplied by the project head | Owned by Lotus Feet Consultancy | 6 November 2026 |

## Original drawings

Drawn for this site in `apps/web/src/lib/shapes.ts`, in the grammar of the LF mark (horizontal and vertical strokes, quarter circle turns, round caps, one weight). No source file outside this repo, nothing traced or adapted. They are part of this repository's code, under its `LICENSE` (MIT), so they can be recoloured freely: the stroke is `currentColor` and takes the brand token of its ground.

| Shape | Used for | Source | Licence | Checked |
|---|---|---|---|---|
| `frame` | Virtual CFO | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `corners` | Valuation | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `base` | Startup Consultancy | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `carry` | Business Funding | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `pair` | Pitch Deck and Financial Model | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `turn` | Advice, not information | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `rhythm` | Technology for the routine, people for the call | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |
| `spiral` | Continuity, not rotation | Original, `apps/web/src/lib/shapes.ts` | MIT (this repo) | 6 November 2026 |

## Libraries that draw or move things

| Library | Use | Licence | Checked |
|---|---|---|---|
| GSAP 3.15.1 (core, ScrollTrigger, SplitText, ScrollSmoother) | All page motion | Standard "No Charge" GSAP License (https://gsap.com/community/standard-license/, effective 30 April 2025, last modified 30 May 2025). Covers every GSAP product including the plugins, free for commercial sites, no attribution required. The one prohibited use is building a no code visual animation tool that competes with Webflow, which this site is not. | 6 November 2026, licence page read, and the package names it in `package.json` |

## Fonts

| Font | Source | Licence | Checked |
|---|---|---|---|
| Arimo, Quicksand | Google Fonts through `next/font/google`, served from our own domain | SIL Open Font License 1.1 | Not rechecked in scope 4c. Record the date when it is next checked. |
