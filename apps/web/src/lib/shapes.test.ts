import { describe, expect, it } from "vitest";
import {
  principleShapes,
  serviceShapes,
  shapeAt,
  shapeStrokeWidth,
  shapes,
  shapeViewBox,
} from "./shapes";

// The shapes are original drawings in the grammar of the mark (design.md, Shapes): only
// horizontal and vertical strokes and quarter circle turns, inside one 240 grid. These
// checks keep a later edit from slipping in a diagonal, a curve of another kind or a
// stroke outside the grid.
const COMMAND = /([MmHhVvAaZz])([^MmHhVvAaZz]*)/g;

function commands(d: string) {
  return [...d.matchAll(COMMAND)].map((m) => ({
    letter: m[1] ?? "",
    numbers: (m[2] ?? "").match(/-?\d*\.?\d+/g)?.map(Number) ?? [],
  }));
}

// Walks a path and returns every point it reaches, so the bounds can be checked.
function points(d: string) {
  let x = 0;
  let y = 0;
  const seen: Array<[number, number]> = [];
  for (const { letter, numbers } of commands(d)) {
    const n = numbers;
    switch (letter) {
      case "M":
        [x, y] = [n[0] ?? 0, n[1] ?? 0];
        break;
      case "H":
        x = n[0] ?? x;
        break;
      case "h":
        x += n[0] ?? 0;
        break;
      case "V":
        y = n[0] ?? y;
        break;
      case "v":
        y += n[0] ?? 0;
        break;
      case "a":
        x += n[5] ?? 0;
        y += n[6] ?? 0;
        break;
    }
    seen.push([x, y]);
  }
  return seen;
}

describe("original shapes", () => {
  it("share one square grid and one stroke weight", () => {
    expect(shapeViewBox).toBe("0 0 240 240");
    expect(shapeStrokeWidth).toBe("16");
  });

  it("use only straight horizontal and vertical strokes and quarter circle turns", () => {
    for (const [name, paths] of Object.entries(shapes)) {
      for (const d of paths) {
        for (const { letter, numbers } of commands(d)) {
          expect("MHhVvaz", `${name}: ${letter}`).toContain(letter);
          if (letter === "a") {
            const [rx, ry, , , , dx, dy] = numbers;
            expect(rx, name).toBe(ry);
            // A quarter turn moves one radius across and one radius down or up.
            expect(Math.abs(dx ?? 0), name).toBe(rx);
            expect(Math.abs(dy ?? 0), name).toBe(rx);
          }
        }
      }
    }
  });

  it("keep every stroke inside the grid with room for its round cap", () => {
    const half = Number(shapeStrokeWidth) / 2;
    for (const [name, paths] of Object.entries(shapes)) {
      for (const d of paths) {
        for (const [x, y] of points(d)) {
          expect(x, name).toBeGreaterThanOrEqual(half);
          expect(x, name).toBeLessThanOrEqual(240 - half);
          expect(y, name).toBeGreaterThanOrEqual(half);
          expect(y, name).toBeLessThanOrEqual(240 - half);
        }
      }
    }
  });

  it("give each of the five services and three principles a different shape", () => {
    const all = [...serviceShapes, ...principleShapes];
    expect(serviceShapes).toHaveLength(5);
    expect(principleShapes).toHaveLength(3);
    expect(new Set(all).size).toBe(all.length);
  });

  it("reuses shapes in turn when a list is longer than its shapes", () => {
    expect(shapeAt(serviceShapes, 5)).toBe(serviceShapes[0]);
    expect(shapeAt(principleShapes, 4)).toBe(principleShapes[1]);
  });
});
