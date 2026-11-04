# Design direction

Art direction for the Lotus Feet site. Exact values live in `design/tokens.json`. When `/develop` builds the first UI, it turns those tokens into CSS variables (light and dark) and records where they live here. Values are never written in two places.

## Character
Calm, exact, senior. A well-set financial report, not a fintech dashboard. Space and type carry the hierarchy. One restrained accent.

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
- Smallest safe size of the mark is untested. Check 32px wide on screen.
- The lockup is built in the page as type (mark plus name in Quicksand 600), not as an SVG.
