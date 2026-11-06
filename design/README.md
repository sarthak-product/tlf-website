Lotus Feet is the identity system for Lotus Feet Consultancy, a virtual CFO, compliance and funding consultancy in India. It serves a corporate firm site, a personal portfolio for the founding CA, documents, decks and social. Light theme is the default. Dark theme is a flat secondary theme with the same layouts.

## Content fundamentals

- Write plainly and precisely. Sound like a senior adviser talking to a founder: authoritative, conversational, specific.
- Use "we" for the firm and "you" for the client. State the benefit directly in the first sentence.
- Use sentence case for headings, buttons, labels and menu items.
- Write money in lakhs and crores with the rupee sign. Write the financial year as April to March. Use GST, ITR and MCA filings as clients say them.
- Never use em dashes or en dashes. Use commas, colons and full stops. Write ranges in words: "April to March".
- Do not write "not X, but Y". Describe the thing you are offering.
- Never invent testimonials, client names, logos, statistics or claims. Label simulated figures with `caption` text reading "Sample data".
- Check every public claim about services or credentials against the claims standards of the regulators that apply to that service before publishing. This system does not interpret those rules.
- Real examples of interface copy: "Book a call", "Filed", "Due soon", "Overdue", "In review".

## Visual foundations

**Colour.** Set pages on `bg`, raised content on `surface`, quiet panels on `surface-tint`. Set text in `text`, secondary text in `text-muted`. Use one accent: `accent`, with `accent-hover` and `accent-tint`. Put `on-accent` on accent fills. Status colours are `success`, `warning`, `danger` with matching `-tint` backgrounds, and info uses `accent` on `accent-tint`. Never use pure white as a page background. Never add a second accent hue. The `brand-*` colours are fixed in both themes and are for identity fields, decks and print, not for interface text. The one exception is the brand fields on the Home page (below).

**Themes.** `light` is first and is the default. `dark` swaps tokens and changes nothing else: no glow, no gradients, no glass.

**Brand fields (exception authorised by Sarthak Chaturvedi).** The Home hero and the Home closing are full width deep blue fields. They may use the fixed brand colours `brand-deep`, `brand-ink`, `brand-mist` and `brand-sky` (plus `brand-steel` behind selected text). Text on them is `brand-mist`. The button on a field is `brand-sky` with a `brand-ink` label and turns `brand-mist` on hover, and the focus ring is `brand-sky`. The fields look the same in both themes. The page between them stays on `bg`, `surface` and `surface-tint` with the single accent. One soft tonal gradient is allowed, on the hero field only, between `brand-ink` and `brand-deep`. No glows, orbs, mesh, noise, grain or glass, and no other gradient anywhere. Text contrast is checked against both ends of the gradient.

**Type.** The face is Arimo, loaded from Google Fonts, with Arial as fallback. Helvetica is not in the web stack until its licence is confirmed. The firm name is the one exception: it is set in Quicksand 600 (`wordmark`), a rounded monoline face chosen to sit beside the mark, and nothing else uses it. Set the page headline in `display`, titles in `h1`, `h2`, `h3`, paragraphs in `body`, hints in `small`, simulated-data labels in `caption`. Use `label` for form labels and `button` for button text. Use `code` for hex values and reference numbers. Hierarchy comes from size, weight 400 to 600 and space, not from colour.

**Spacing.** Use the `space-1` to `space-10` scale only. Pad sections with `space-8` on mobile and `space-9` on desktop. Give the hero headline `space-10` around it. Keep paragraph lines to 60 to 75 characters. Align content to one left edge.

**Radius.** Use `radius-sm` on badges, `radius-md` on buttons, inputs, alerts and cards, `radius-lg` on dialogs and image frames. Nothing is rounder than `radius-lg`. No pills, no circles except avatars.

**Borders and shadow.** Separate content with space first, then a `border` hairline. Mark controls with `border-strong`. Only menus, dropdowns and dialogs take `shadow-popover`. Nothing else carries a shadow.

**Motion.** Use `duration-fast` for colour changes and `duration-base` for menus and opacity, always with `easing-standard`. Animate only a change of state. When the visitor prefers reduced motion, set durations to 0 and keep normal scrolling.

**Page motion (exception authorised by Sarthak Chaturvedi).** Beyond changes of state, the site may use this motion and nothing more: the three strokes of the mark draw one after another once on load; sections and headings reveal once as they enter, headings line by line; the line down the left edge draws as the page scrolls; the large hero mark drifts a small distance as the hero scrolls away; FAQ items ease open and closed. All of it uses `easing-standard` with short durations based on `duration-base`. The page HTML and CSS always show the final state, and only the script sets a start state, so the page is complete without JavaScript. For reduced motion none of it runs. No smooth scrolling, scroll hijacking, pinning, cursor effects, looping animation or animated arrows.

**States.** Every interactive element has default, hover, focus and disabled. Focus is a 2px solid `focus` ring with a 2px offset, never removed. Hover changes `accent` to `accent-hover` or adds `surface-tint`. Status never relies on colour alone: pair it with an icon and a word.

**Imagery.** The work is the visual: real reports, filings, dashboards and documents the firm supplies. Use real photography only when supplied. No stock photography of people, no silhouettes, no illustrations of coins or charts.

**Banned.** Gradients (except the one hero field gradient above), radial glows, dot grids, glass effects, decorative stripes, sparkle icons, emoji, animated arrows, three-card feature rows, bento grids, fake terminal windows, checkmark bullet lists, three-tier pricing, and the fonts Inter, Geist and Space Grotesk.

## Iconography

Use icons only where they clarify an action or a status. Draw them as 1.5px strokes on a 24px grid with round caps, in `currentColor`. The status set is check (`success`), clock (`warning`), triangle with a mark (`danger`) and circle with an i (info). Do not use Lucide or any icon library. No emoji.

## Mark

The mark is a monoline LF monogram with rounded corners, supplied by the project head. It is three strokes of one weight with round caps and joins: the L, the F stem with its arm, and the F top.

- Use `assets/Logos/lf-mark-on-light.svg` (deep blue) on `bg`, `surface` and light fields. Use `assets/Logos/lf-mark-on-dark.svg` (mist) on dark `bg`, `brand-deep` and `brand-ink`.
- The lockup is the mark followed by the name "Lotus Feet" in `wordmark`, with the mark about 1.2 times the cap height of the name and a gap of one quarter of the mark height. The lockup carries the name only. Never add a descriptor line to it.
- Keep clear space of one quarter of the mark height on every side.
- Do not recolour the mark, outline it, add effects, or redraw its strokes. Three strokes make it, so they can be revealed one after another in motion.
- On the site the mark is drawn inline from the exact paths of these files, in the file colour that suits the ground (`brand-deep` on light grounds, `brand-mist` on dark grounds and brand fields), so its strokes can be drawn in. A test fails if the inline paths ever differ from the files.
- Open items: the smallest safe size is not yet tested (check 32px wide on screen before use), and the lockup is built in the page as type, not as an SVG, because the wordmark depends on the hosted font.

## Themes in practice

Build with `bg`, `surface`, `text` and `accent` and the page switches theme without edits. Check any new colour pair at 4.5:1 for text and 3:1 for borders and focus rings in both themes before adding it.
