import { type ShapeName, shapeStrokeWidth, shapes, shapeViewBox } from "@/lib/shapes";
import styles from "./shape.module.css";

// One original monoline shape (src/lib/shapes.ts), drawn inline so its strokes can be
// drawn in. Always decorative: the heading and text beside it carry the meaning, so it is
// hidden from assistive technology. The stroke is currentColor, so it takes the accent of
// whatever ground it sits on (accent on the page, brand-sky on a brand field).
//
// The server HTML draws the whole shape. Only the motion script sets a start state.
export function Shape({ name, className }: { name: ShapeName; className?: string }) {
  return (
    <svg
      className={[styles.shape, className].filter(Boolean).join(" ")}
      viewBox={shapeViewBox}
      aria-hidden="true"
      focusable="false"
      data-shape={name}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={shapeStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shapes[name].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
