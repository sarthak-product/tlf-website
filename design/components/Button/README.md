A rectangular action control in three variants: primary, secondary and text.

Use `primary` for the one main action in a view, for example "Book a consultation". Use `secondary` for supporting actions and `text` for low-emphasis links that behave like buttons. Never place two primary buttons in one view.

The consumer provides the label: sentence case, verb first, one to four words, no end punctuation, no arrows. Use a real `<button>` for actions and an `<a href>` styled the same for navigation.

- Minimum height 44px, horizontal padding `space-5`, radius `radius-md`, type `button`.
- Primary fills with `accent` and sets the label in `on-accent`. Hover uses `accent-hover`.
- Secondary uses `surface`, a `border-strong` outline and `text`. Hover adds `surface-tint`.
- Focus is a 2px `focus` ring with 2px offset. Never remove it.
- Disabled uses `surface-tint` and `text-muted`. Prefer leaving a button enabled and explaining the problem in an error message.

Do not add icons, shadows or animated arrows. Do not round a button into a pill.
