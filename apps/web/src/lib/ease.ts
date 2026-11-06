// The site's one easing curve as a function GSAP can use, and the duration tokens in
// seconds. Both are read from the CSS variables at run time, so their numbers live only
// in design/tokens.json.

// Parses "cubic-bezier(x1, y1, x2, y2)". Returns null for anything else.
export function parseCubicBezier(value: string): [number, number, number, number] | null {
  const match = /cubic-bezier\(\s*([^)]+)\)/.exec(value);
  const parts = match?.[1]?.split(",").map((part) => Number.parseFloat(part));
  if (parts?.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  const [x1, y1, x2, y2] = parts as [number, number, number, number];
  return [x1, y1, x2, y2];
}

// Reads a CSS time in seconds. The token is written "200ms", but the production CSS
// minifier may rewrite it as ".2s", so both units are read. Returns null for anything else.
export function parseDuration(value: string): number | null {
  const match = /^\s*(-?[\d.]+)(ms|s)\s*$/.exec(value);
  const amount = match?.[1] === undefined ? Number.NaN : Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return null;
  return match?.[2] === "ms" ? amount / 1000 : amount;
}

// The same curve CSS draws for cubic-bezier(x1, y1, x2, y2): find t for the given x, then
// return y at t. Newton steps first, bisection as the fallback. Ends are exact.
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  function solveT(x: number): number {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return t;
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    let low = 0;
    let high = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const value = sampleX(t);
      if (Math.abs(value - x) < 1e-6) return t;
      if (value < x) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return t;
  }

  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : sampleY(solveT(x)));
}
