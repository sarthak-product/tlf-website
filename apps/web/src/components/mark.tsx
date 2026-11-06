import { markLineCap, markLineJoin, markPaths, markStrokeWidth, markViewBox } from "@/lib/mark";
import styles from "./mark.module.css";

// The LF mark drawn inline from the brand file's own paths (src/lib/mark.ts), so its three
// strokes can be revealed one after another. It is always decorative here: the firm name
// sits beside it in the header, and the hero headline carries the meaning in the hero.
//
// `tone` picks the stroke colour from the brand file that suits the ground:
//   theme  brand-deep on the light theme, brand-mist on the dark theme (lf-mark-on-light.svg
//          and lf-mark-on-dark.svg), for marks that sit on the page background
//   mist   brand-mist in both themes (lf-mark-on-dark.svg), for marks on a brand field
//
// The server HTML draws the full mark. Only the motion script, in the browser, sets a
// start state, so the mark shows complete without JavaScript.
export function Mark({
  tone,
  className,
  motion,
}: {
  tone: "theme" | "mist";
  className?: string;
  motion?: string;
}) {
  return (
    <svg
      className={[styles.mark, styles[tone], className].filter(Boolean).join(" ")}
      viewBox={markViewBox}
      aria-hidden="true"
      focusable="false"
      data-mark={motion}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={markStrokeWidth}
        strokeLinecap={markLineCap}
        strokeLinejoin={markLineJoin}
      >
        {markPaths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
