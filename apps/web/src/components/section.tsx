import type { CSSProperties, ReactNode } from "react";
import styles from "./section.module.css";

// One stop on the line that runs down the page. Sections carry no card and no shadow:
// space and a hairline do the separating (design.md, Page structure of Home).
// A section with no content is never rendered, so it leaves no heading and no gap.
// `marker` is the line height of the first line of text, so the stop sits level with it.
// `field` sets the section on a full width brand field: `hero` is the one soft tonal
// gradient from brand-ink to brand-deep, `closing` is flat brand-deep. Text on a field is
// brand-mist (design/README.md, Brand fields).
//
// The data attributes are hooks for the motion script (site-motion.tsx). They change
// nothing in the server HTML: every section, line and stop renders complete.
export function Section({
  heading,
  headingId,
  marker,
  field,
  children,
}: {
  heading?: string;
  headingId?: string;
  marker?: string;
  field?: "hero" | "closing";
  children: ReactNode;
}) {
  const style = marker ? ({ "--stop-first-line": marker } as CSSProperties) : undefined;
  const classes = [styles.section, field ? styles.field : null, field ? styles[field] : null]
    .filter(Boolean)
    .join(" ");
  return (
    <section
      className={classes}
      style={style}
      aria-labelledby={heading ? headingId : undefined}
      data-section={field ?? ""}
    >
      <div className="page">
        <div className={styles.stop} data-line="">
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
