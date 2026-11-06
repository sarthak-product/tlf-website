import type { ReactNode } from "react";
import styles from "./section.module.css";

// One full width band of the Home page. Sections carry no card and no shadow: colour
// fields, space and type do the separating (design.md, Page structure of Home).
// A section with no content is never rendered, so it leaves no heading and no gap.
//
// `field` picks the ground, and the page alternates them (design/README.md, Colour fields):
//   page    bg, the theme background (the default)
//   tint    surface-tint, a pale field that follows the theme
//   deep    brand-deep, the same in both themes
//   hero    the one soft tonal gradient, brand-ink to brand-deep, hero only
// On deep and hero the theme colour variables point at brand colours, so text, buttons,
// focus rings and shapes follow with no new component rules.
//
// `id` and the data attribute are hooks for anchors and the motion script. They change
// nothing in the server HTML: every section renders complete.
export function Section({
  heading,
  headingId,
  field = "page",
  className,
  children,
}: {
  heading?: string;
  headingId?: string;
  field?: "page" | "tint" | "deep" | "hero";
  className?: string;
  children: ReactNode;
}) {
  const brand = field === "deep" || field === "hero";
  const classes = [styles.section, styles[field], brand ? styles.brand : null, className]
    .filter(Boolean)
    .join(" ");
  return (
    <section
      className={classes}
      aria-labelledby={heading ? headingId : undefined}
      data-section={field}
    >
      <div className="page">
        <div className={styles.inner}>
          {heading ? (
            <h2 id={headingId} className={styles.heading} data-split="">
              {heading}
            </h2>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
