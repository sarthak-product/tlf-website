# Design direction

Art direction for the Lotus Feet site. Exact values live in `design/tokens.json`. When `/develop` builds the first UI, it turns those tokens into CSS variables (light and dark) and records where they live here. Values are never written in two places.

## Character
Calm, exact, senior. A well-set financial report, not a fintech dashboard. Space and type carry the hierarchy. One restrained accent.

## Where the tokens live in code
- `design/tokens.json` is the one source. It is never copied by hand.
- `apps/web/src/styles/tokens.css` holds every token as a CSS variable. It is generated: run `pnpm tokens` after changing the tokens file. `pnpm check` fails if the two disagree.
- Names: colour `--color-<name>`, type `--type-<style>-size`, `-line`, `-weight`, `-tracking`, `-family`, plus `--font-sans`, `--font-mono`, `--font-wordmark`. Spacing `--space-1` to `--space-10`, radius `--radius-*`, `--shadow-popover`, `--duration-*`, `--easing-standard`.
- Light is on `:root`. Dark is a block on `:root[data-theme="dark"]` that swaps colour tokens only. The five `brand-*` colours sit on `:root` and do not change.
- `apps/web/src/styles/base.css` holds the reset, element defaults, the focus ring and the page frame (`.page`). It uses variables only.
- Component styles are CSS Modules beside each component in `apps/web/src/components/`.
- Contrast is checked by `node scripts/check-contrast.mjs` (also part of `pnpm check`). Add a pair there when you use a new one.

## Theme
- Light is the default. Dark follows the visitor's system setting through `prefers-color-scheme` in `tokens.css`. There is no toggle.
- `<html data-theme="light">` or `data-theme="dark"` forces one theme. Nothing sets it today. The lockup mark swaps with the theme the same way.
- If a toggle is ever built, set the attribute before the first paint and add `suppressHydrationWarning` to `<html>`, or React reports a mismatch.

## Fonts
- Loaded with `next/font/google` in `apps/web/src/lib/fonts.ts`. The files are fetched at build time and served from our own domain. Visitors' browsers never call Google.
- Arimo is a variable font (weights 400 to 700, latin, normal style). Quicksand is weight 600 only, latin. Both use `display: swap` with a size adjusted fallback, so text shows at once and does not jump.
- The next/font variables are `--next-font-arimo` and `--next-font-quicksand`. The generator wraps them into `--font-sans` and `--font-wordmark` with Arial behind them.
- Italic and other scripts are not loaded. Add them when copy needs them.
- A build needs network access to fetch the font files.

## Lockup and mark
- Built in `apps/web/src/components/lockup.tsx`. The mark is imported from `design/assets/Logos` (no second copy) and the name is type in Quicksand 600.
- Proportions follow the Mark section of `design/README.md`. Mark height is 0.84em (1.2 times the Quicksand cap height of 0.7em), gap is a quarter of that, and the mark is centred on the cap height. The header sets the lockup at 24px, so the mark is 38px wide.
- Both mark files are rendered and CSS shows the one that suits the theme.
- Checked at 32px wide on screen: the three strokes stay separate and read as LF on a normal density screen, but the strokes are only about 1.7px, so 32px is the floor. Do not go smaller.

## Layout
- Root layout: skip link, header, then `main`. No footer yet, because footer lines are open copy (`docs/context/03-home-copy.md`).
- The header holds the lockup and the Book a call button (secondary) only. Navigation labels wait for approved copy.
- `.page` is the page frame: one left edge, gutter `space-4` on mobile and `space-6` from 768px.
- `--page-max-width` is 72rem. `tokens.json` does not set it. This value is an open item for Sarthak to confirm.
- Home sections sit on one line down the left edge. `components/section.tsx` draws the hairline and one square stop per section, so hidden sections leave no gap. Content is indented `space-5` on mobile and `space-7` from 768px.
- Base components built: Button (primary, secondary, text) and the FAQ disclosure. Alert, Badge and TextField are not built, Home does not need them.

## Source files
- Tokens: `design/tokens.json` (colour for light and dark, type, spacing, radius, shadow, motion).
- Rules and reasons: `design/README.md` (content fundamentals, visual foundations, mark).
- Mark: `design/assets/Logos/lf-mark-on-light.svg` and `lf-mark-on-dark.svg`.
- Component references: `design/components/*/preview.html` and `README.md` (Alert, Badge, Button, TextField, Cover). Reference only. Rebuild them in the app's own component layer.

## Rules that decide most calls
- Light theme is default and ships first. Dark theme swaps tokens and changes nothing else.
- Page background is `bg`, never pure white. Raised content sits on `surface`. Quiet panels use `surface-tint`.
- One accent only. Steel in light, Sky in dark.
- Fonts: Arimo for everything. Quicksand 600 for the firm name in the lockup only. Fallback Arial. Helvetica is not in the web stack.
- Radius never exceeds 8px. No pills.
- Only menus, dropdowns and dialogs take a shadow.
- Motion changes state only, uses the one easing curve, and drops to zero for reduced-motion visitors.
- Every interactive element has default, hover, focus and disabled states. Focus ring is 2px solid with 2px offset and is never removed.
- Status never relies on colour alone: icon plus word.
- Text contrast 4.5:1, borders and focus rings 3:1, checked in both themes.
- Imagery: real documents and dashboards the firm supplies. None are supplied yet, so build without images and leave no placeholder pictures.

## Page structure of Home
A line runs down the page and every section is a stop on it. No cards. Sections in order:
hero, the firm, clients, what we do, case studies, how we think, how an engagement runs, key figures, testimonials, people, recent writing, questions, closing.
Sections with no real content (clients, case studies, key figures, testimonials, people) render nothing until content exists. Wireframes were drawn at desktop width only. Mobile layouts are not drawn: design them in code and show Sarthak.

## Open
- Page max width (72rem) is an assumption to confirm. Dark following the system setting is the Home brief, not yet a recorded decision in a spec.
- Header navigation labels, footer content, page titles and meta descriptions wait for copy.
- Base components Alert, Badge and TextField are not built yet. Home does not need them.
- The lockup is built in the page as type (mark plus name in Quicksand 600), not as an SVG.
