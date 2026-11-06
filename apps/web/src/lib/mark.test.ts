import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  markHeight,
  markLineCap,
  markLineJoin,
  markPaths,
  markStrokeWidth,
  markViewBox,
  markWidth,
} from "./mark";

// The inline mark must be the brand files, stroke for stroke. Both files are read at
// test time, so a change to either one fails here until mark.ts matches it again.
const files = {
  dark: { name: "lf-mark-on-dark.svg", stroke: "#EAF3FB" },
  light: { name: "lf-mark-on-light.svg", stroke: "#0F2A42" },
};

function read(name: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../../../../design/assets/Logos/${name}`, import.meta.url)),
    "utf8",
  );
}

function attr(svg: string, tag: string, name: string): string | undefined {
  const element = new RegExp(`<${tag}\\b[^>]*>`).exec(svg)?.[0] ?? "";
  return new RegExp(`\\b${name}="([^"]*)"`).exec(element)?.[1];
}

describe("the inline LF mark", () => {
  for (const [theme, file] of Object.entries(files)) {
    it(`matches ${file.name} exactly`, () => {
      const svg = read(file.name);
      const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]*)"/g)].map((m) => m[1]);
      expect(paths, theme).toEqual([...markPaths]);
      expect(attr(svg, "svg", "viewBox")).toBe(markViewBox);
      expect(attr(svg, "g", "stroke-width")).toBe(markStrokeWidth);
      expect(attr(svg, "g", "stroke-linecap")).toBe(markLineCap);
      expect(attr(svg, "g", "stroke-linejoin")).toBe(markLineJoin);
      expect(attr(svg, "g", "fill")).toBe("none");
      expect(attr(svg, "g", "stroke")).toBe(file.stroke);
    });
  }

  it("has width and height that agree with the viewBox", () => {
    expect(markViewBox).toBe(`0 0 ${markWidth} ${markHeight}`);
  });
});
