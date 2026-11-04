An inline message that explains the state of a task, in four statuses: success, warning, danger and info.

The consumer provides a short title and one sentence of body. Say what happened, then what to do. Place the alert next to the content it concerns, not in a corner.

- Fill with the matching `-tint` token, 1px `border`, radius `radius-md`, padding `space-4`. No coloured side stripe and no shadow.
- Title in the status colour at 16px weight 500. Body in `text` at `small`.
- Always include the status icon: check, clock, triangle, circle with an i.
- Use `role="alert"` for danger, which interrupts a screen reader, and `role="status"` for the others.
- Do not add a dismiss control unless the message can safely be ignored.

Do not use an alert for marketing messages or promotions.
