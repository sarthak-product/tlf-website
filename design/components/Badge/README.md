A compact status label that pairs an icon with a word.

Use a badge to show the state of an item such as a filing: "Filed", "Due soon", "Overdue", "In review". The consumer provides the word. Keep it to one or two words in sentence case.

- Fill with the matching `-tint` token and set icon and text in the status colour: `success`, `warning`, `danger`, or `accent` on `accent-tint` for info. Neutral uses `surface-tint` with `text-muted` and needs no icon.
- Icons: check for success, clock for warning, triangle for danger, circle with an i for info.
- Radius `radius-sm`, type `label`, 4px vertical padding.
- Every badge keeps both its icon and its word, so status never depends on colour alone.

Do not use a badge as a button. Do not invent statuses; map each one to a role above.
