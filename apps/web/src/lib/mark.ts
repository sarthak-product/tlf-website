// The LF mark as data, so it can be drawn inline and its three strokes can be animated.
// These values are the ones in design/assets/Logos/lf-mark-on-dark.svg and
// lf-mark-on-light.svg. They are never edited here: mark.test.ts reads both files and
// fails if anything below differs from them by a single character.
//
// The two files differ only in stroke colour: brand-deep on light grounds, brand-mist on
// dark grounds. The colour is set in CSS from those two tokens, never from a new value.

export const markViewBox = "0 0 530 280";
export const markWidth = 530;
export const markHeight = 280;
export const markStrokeWidth = "28";
export const markLineCap = "round";
export const markLineJoin = "round";

// In drawing order: the L, the F stem with its arm, the F top.
export const markPaths = [
  "M15 15v230h165c28 0 50-22 50-50v-60",
  "M290 245V135h225",
  "M290 75V65c0-28 22-50 50-50h175v60",
] as const;
