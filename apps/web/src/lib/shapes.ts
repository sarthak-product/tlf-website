// Original monoline shapes for the Home zig-zag, drawn for this site from the grammar of
// the LF mark (design/assets/Logos): straight horizontal and vertical strokes of one
// weight, round caps and joins, corners turned on a quarter circle, open ends. No coins,
// charts, handshakes or people. They are decorative and always hidden from assistive
// technology. Recorded in docs/assets.md.
//
// One 240 by 240 grid for all of them. The stroke is 16 and the corner radius 32, about
// the mark's own ratio of stroke to corner (28 to 50). Strokes are listed in drawing
// order, so the motion script can draw them one after another like the mark.

export const shapeViewBox = "0 0 240 240";
export const shapeStrokeWidth = "16";

// A rounded rectangle as one closed stroke, corner radius 32.
function frame(x: number, y: number, size: number): string {
  const inner = size - 64;
  return `M${x + 32} ${y}h${inner}a32 32 0 0 1 32 32v${inner}a32 32 0 0 1-32 32h-${inner}a32 32 0 0 1-32-32v-${inner}a32 32 0 0 1 32-32z`;
}

export const shapes = {
  // Virtual CFO: the whole function held in one frame, with the line that runs through it.
  frame: [
    "M120 24h64a32 32 0 0 1 32 32v128a32 32 0 0 1-32 32H56a32 32 0 0 1-32-32V96",
    "M88 120h64",
  ],
  // Valuation: two corners that frame what is put in front of the reader.
  corners: ["M24 104V56a32 32 0 0 1 32-32h48", "M216 136v48a32 32 0 0 1-32 32h-48", "M104 120h32"],
  // Startup Consultancy: a long base, with a tall stem and a shorter one set on it.
  base: ["M24 216h192", "M72 216V88a32 32 0 0 1 32-32h88", "M168 216v-64"],
  // Business Funding: two strokes that carry into one another.
  carry: [
    "M32 24v112a44 44 0 0 0 44 44a44 44 0 0 0 44-44v-32",
    "M208 216V104a44 44 0 0 0-44-44a44 44 0 0 0-44 44v32",
  ],
  // Pitch Deck and Financial Model: two frames built as one.
  pair: [frame(24, 24, 144), frame(72, 72, 144)],
  // Advice, not information: three report lines, then one line that turns.
  turn: ["M24 40h72", "M24 80h56", "M24 120h72", "M128 40h56a32 32 0 0 1 32 32v144"],
  // Technology for the routine, people for the call: a repeated stroke, then one long one.
  rhythm: [
    "M40 24v56",
    "M88 24v56",
    "M136 24v56",
    "M184 24v56",
    "M40 216h144a32 32 0 0 0 32-32v-56",
  ],
  // Continuity, not rotation: one unbroken line that turns inward and keeps going.
  spiral: [
    "M24 216V56a32 32 0 0 1 32-32h128a32 32 0 0 1 32 32v128a32 32 0 0 1-32 32h-80a32 32 0 0 1-32-32v-56a32 32 0 0 1 32-32h40",
  ],
} as const satisfies Record<string, readonly string[]>;

export type ShapeName = keyof typeof shapes;

// One shape per service and per principle, in the order of 03-home-copy.md. These are not
// copy, so they sit here and not in the content module. A list longer than its shapes
// reuses them in turn, so a new service never renders without one.
export const serviceShapes: readonly ShapeName[] = ["frame", "corners", "base", "carry", "pair"];
export const principleShapes: readonly ShapeName[] = ["turn", "rhythm", "spiral"];

export function shapeAt(list: readonly ShapeName[], index: number): ShapeName {
  return list[index % list.length] ?? "frame";
}
