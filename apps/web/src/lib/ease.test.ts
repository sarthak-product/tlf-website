import { describe, expect, it } from "vitest";
import { cubicBezier, parseCubicBezier, parseDuration } from "./ease";

describe("the easing curve", () => {
  it("reads the token's cubic-bezier", () => {
    expect(parseCubicBezier("cubic-bezier(0.2, 0, 0, 1)")).toEqual([0.2, 0, 0, 1]);
    expect(parseCubicBezier(" cubic-bezier(0.2,0,0,1) ")).toEqual([0.2, 0, 0, 1]);
    expect(parseCubicBezier("ease-out")).toBeNull();
    expect(parseCubicBezier("cubic-bezier(0.2, 0, 1)")).toBeNull();
  });

  it("starts at 0, ends at 1 and only rises", () => {
    const ease = cubicBezier(0.2, 0, 0, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    let previous = 0;
    for (let x = 0.05; x < 1; x += 0.05) {
      const y = ease(x);
      expect(y).toBeGreaterThanOrEqual(previous);
      previous = y;
    }
  });

  it("is the straight line for cubic-bezier(0, 0, 1, 1)", () => {
    const linear = cubicBezier(0, 0, 1, 1);
    for (const x of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(linear(x)).toBeCloseTo(x, 5);
    }
  });

  it("matches known points of the standard curve", () => {
    // cubic-bezier(0.2, 0, 0, 1) is a strong ease out: past the midpoint by x = 0.5.
    const ease = cubicBezier(0.2, 0, 0, 1);
    expect(ease(0.5)).toBeGreaterThan(0.8);
    expect(ease(0.1)).toBeLessThan(0.5);
  });
});

describe("the duration tokens", () => {
  it("reads milliseconds and seconds, as the minifier may write either", () => {
    expect(parseDuration("200ms")).toBe(0.2);
    expect(parseDuration(" .2s")).toBe(0.2);
    expect(parseDuration("0ms")).toBe(0);
    expect(parseDuration("fast")).toBeNull();
    expect(parseDuration("")).toBeNull();
  });
});
