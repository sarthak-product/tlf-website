A labelled single-line input with an optional hint and an inline error message.

Always show a visible `label` above the input and connect it with `for` and `id`. Placeholder text is an example of valid input, never a replacement for the label. The consumer provides the label, an optional hint, and the error text.

- Height at least 44px, padding `space-4`, radius `radius-md`, border `border-strong`, fill `surface`, text `text`.
- Hint uses `small` in `text-muted` below the input.
- Error changes the border to `danger` and adds a triangle icon plus a sentence in `danger`. Set `aria-invalid="true"` and link the message with `aria-describedby`. Say what happened and what to enter: "Enter an email address, for example name@company.com."
- Focus is a 2px `focus` ring with 2px offset.
- Disabled uses `surface-tint` and `text-muted`.

Validate on submit, not on every keystroke. Keep the visitor's input when an error appears. Never rely on colour alone to show an error.
