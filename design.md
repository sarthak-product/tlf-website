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
- Built in `apps/web/src/components/lockup.tsx`. The mark is drawn inline by `components/mark.tsx` and the name is type in Quicksand 600.
- The mark's paths, viewBox and stroke settings are in `apps/web/src/lib/mark.ts`. `mark.test.ts` reads both files in `design/assets/Logos` and fails if a single character differs, so the files stay the source. The stroke is `brand-deep` on the light theme and `brand-mist` on the dark theme and on brand fields, the two file colours.
- Proportions follow the Mark section of `design/README.md`. Mark height is 0.84em (1.2 times the Quicksand cap height of 0.7em), gap is a quarter of that, and the mark is centred on the cap height. The header sets the lockup at 28px (the `h2` size) on mobile and 40px (the `h1` size) from 64rem, so the mark is 45px and 64px wide. At the earlier 24px the mark was 20px high with 2px strokes, the same height, weight and colour as the capitals beside it, so it read as two more letters and not as a mark.
- Checked at 32px wide on screen: the three strokes stay separate and read as LF on a normal density screen, but the strokes are only about 1.7px, so 32px is the floor. Do not go smaller.

## Layout
- Root layout: skip link, header, then `main`. No footer yet, because footer lines are open copy (`docs/context/03-home-copy.md`).
- The header holds the lockup and the Book a call button (secondary) only. Navigation labels wait for approved copy.
- `.page` is the page frame: gutter `space-4` on mobile and `space-6` from 768px. Inside it Home is a zig-zag, not one left edge (below).
- `--page-max-width` is 72rem. `tokens.json` does not set it. This value is an open item for Sarthak to confirm.
- Home sections are full width bands (`components/section.tsx`). A hidden section renders nothing, so it leaves no band and no gap. Sections pad `space-8` on mobile and `space-9` from 768px. Section headings are set at the `h1` size on phones and `display` from 768px.
- Colour fields: `Section` takes `field="page"` (`bg`, the default), `"tint"` (`surface-tint`), `"deep"` (`brand-deep`) or `"hero"` (the one gradient, `brand-ink` to `brand-deep`). Down the page: hero, the marquee band (`brand-sky`), the firm on `page`, what we do on `deep`, how we think on `tint`, questions on `page`, the closing on `deep`. Inside `deep` and `hero` the theme colour variables point at brand colours (text `brand-mist`, accent `brand-sky`, label `brand-ink`, hover `brand-mist`, focus `brand-sky`, selection and hairlines `brand-steel`), so buttons, focus rings and shapes follow with no new component rules. The pairs are in the contrast check. Authorised by Sarthak, recorded in `design/README.md` under Colour fields.
- Zig-zag (authorised by Sarthak for scope 4c): what we do and how we think are lists of items, each its text and an original shape (`components/shape.tsx`). From 768px each item is two columns and the text and shape swap sides on every other item (`data-zig="start"` or `"end"`). On phones the text keeps one left edge and the shape swings from side to side above it. Text is always left aligned. The questions stay one column.
- The hero sets the eyebrow, then the headline across the full width in `display-xl`, then the supporting line and button on the left with the large mark (`brand-mist`) on the right from 768px. Below that the mark sits under the text, right aligned.
- `display-xl` is fluid: `clamp(h1 size, 8.125vw, display-xl size)`, so it is 40px on phones and 104px at 1280px wide. Hero headline and closing headline only.
- The marquee (`components/marquee.tsx`) is a `brand-sky` band between the hero and the firm, repeating the hero eyebrow in `brand-ink` at the `h1` size (`display` from 768px). It is hidden from assistive technology, because the hero already says it.
- Base components built: Button (primary, secondary, text) and the FAQ disclosure. Alert, Badge and TextField are not built, Home does not need them.

## Motion
- GSAP 3.15.1, pinned exactly, under GreenSock's standard no charge licence (the package names it in `package.json`). Core, ScrollTrigger, SplitText and ScrollSmoother. ScrollSmoother was chosen by Sarthak for scope 4c.
- All of it lives in one client component, `apps/web/src/components/site-motion.tsx`, which renders nothing. Pages and the header stay server components. GSAP is imported nowhere else.
- It finds its targets by data attributes the server markup sets: `data-mark` (the mark's strokes), `data-split` (headings revealed by line), `data-reveal` (blocks), `data-draw` (shapes), `data-words` (the firm statement), `data-marquee` and `data-marquee-track`, `data-pin` and `data-step` (the principles), `data-parallax` (the hero mark), `data-faq` (the details elements) and `data-smooth-wrapper` and `data-smooth-content` (the two plain wrappers in `layout.tsx`).
- The server HTML and CSS are always the final state. Start states are set by the script only, just before each animation. The principles are stacked for the pin only while the script sets `data-pinned` on the list.
- Everything runs inside `gsap.matchMedia` on `(prefers-reduced-motion: no-preference)`, so a reduced motion visitor sees the still page, normal scrolling and the native FAQ.
- On every width: the mark draws (header on load, hero as it enters), headings rise line by line out of a mask, blocks fade in (zig-zag text slides in from its own side from 768px, other blocks rise), shapes draw once as they enter, the hero mark drifts, FAQ items ease open and closed.
- From 1024px only (`(min-width: 64rem)`): ScrollSmoother eases the scroll (`smooth: 1`, never on touch), the principles section is pinned and its three items step through in one place with their shapes drawing (scrubbed), shapes in what we do draw with the scroll (scrubbed), the firm statement fills from `text-muted` to `text` word by word (scrubbed, through `color-mix`, so it follows the theme), and the marquee slides sideways only while the page scrolls (scrubbed). Below 1024px none of these run and the marquee is still.
- Nothing loops on its own, nothing follows the cursor, and nothing moves while the reader is still.
- The curve is read from `--easing-standard` and the timing from `--duration-base` at run time (`src/lib/ease.ts`). Entrances take twice `duration-base`, the FAQ takes `duration-base`. Scrubbed moments follow the scroll and use no curve.
- SplitText splits a heading only when it enters, after the fonts load, labels it with its full text while split, and reverts the split when the reveal ends. The statement's word split labels the paragraph with its full text the same way.
- If the script starts more than two seconds after navigation, anything already in view is left as it is rather than hidden and replayed.
- Only transforms, opacity, stroke dashes, the statement colour, the FAQ height and the pinned section's height change. The pinned section is below the first screen, so measured layout shift is 0 (scope 4c, measured at 1280px and 375px in both themes).
- Hover: in the zig-zag the shape steps `space-3` toward its text, over `duration-base`, only on devices that hover and only when motion is allowed.

## Shapes
- Original monoline drawings in `apps/web/src/lib/shapes.ts`, drawn for this site, recorded in `docs/assets.md`. One per service and one per principle, in the order of the copy.
- Grammar of the mark: horizontal and vertical strokes, quarter circle turns, round caps and joins, open ends. A 240 grid, stroke 16, corner radius 32 (44 for the two turns in the funding shape). `shapes.test.ts` fails on any diagonal, any other curve or a stroke outside the grid.
- Stroke is `currentColor`: `accent` on the page and on `tint`, `brand-sky` on `deep`. Always decorative and hidden from assistive technology.

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
- Motion changes state only, uses the one easing curve, and drops to zero for reduced-motion visitors. The one exception is the page motion in `design/README.md` (Page motion), built as described under Motion below.
- One gradient only: the hero field, `brand-ink` to `brand-deep`. Brand colours appear only on the Home colour fields (hero, the marquee band, what we do, closing).
- Every interactive element has default, hover, focus and disabled states. Focus ring is 2px solid with 2px offset and is never removed.
- Status never relies on colour alone: icon plus word.
- Text contrast 4.5:1, borders and focus rings 3:1, checked in both themes.
- Imagery: real documents and dashboards the firm supplies. None are supplied yet, so build without images and leave no placeholder pictures. The only drawings are the mark and the original shapes (Shapes, above).

## Page structure of Home
Full width bands that alternate deep blue and pale fields, with services and principles in a zig-zag. No cards. (The earlier line down the left edge with a stop per section was replaced by the zig-zag in scope 4c.) Sections in order:
hero, the firm, clients, what we do, case studies, how we think, how an engagement runs, key figures, testimonials, people, recent writing, questions, closing.
Sections with no real content (clients, case studies, key figures, testimonials, people) render nothing until content exists. Wireframes were drawn at desktop width only. Mobile layouts are not drawn: design them in code and show Sarthak.

## Open
- Page max width (72rem) is an assumption to confirm. Dark following the system setting is the Home brief, not yet a recorded decision in a spec.
- Header navigation labels, footer content, page titles and meta descriptions wait for copy.
- Base components Alert, Badge and TextField are not built yet. Home does not need them.
- The lockup is built in the page as type (mark plus name in Quicksand 600), not as an SVG.
