import type { CSSProperties, ReactNode } from "react";
import styles from "./section.module.css";

// One stop on the line that runs down the page. Sections carry no card and no shadow:
// space and a hairline do the separating (design.md, Page structure of Home).
// A section with no content is never rendered, so it leaves no heading and no gap.
// `marker` is the line height of the first line of text, so the stop sits level with it.
export function Section({
  heading,
  headingId,
  marker,
  children,
}: {
  heading?: string;
  headingId?: string;
  marker?: string;
  children: ReactNode;
}) {
  const style = marker ? ({ "--stop-first-line": marker } as CSSProperties) : undefined;
  return (
    <section
      className={styles.section}
      style={style}
      aria-labelledby={heading ? headingId : undefined}
    >
      <div className="page">
        <div className={styles.stop}>
          {heading ? (
            <h2 id={headingId} className={styles.heading}>
              {heading}
            </h2>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
