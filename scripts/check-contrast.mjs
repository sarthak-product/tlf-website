#!/usr/bin/env node
// Checks the colour pairs in design/tokens.json against WCAG 2.2 contrast ratios, in both themes.
//   text pairs need 4.5 to 1
//   borders, focus rings and control fills need 3 to 1
// Pairs follow the "usage" notes in the tokens file. Add a pair here when a new one is used.
// Usage: node scripts/check-contrast.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(root, "design", "tokens.json"), "utf8"));

const TEXT = 4.5;
const UI = 3;

// [foreground, background, minimum ratio, what it is]
const PAIRS = [
  ["text", "bg", TEXT, "body text"],
  ["text", "surface", TEXT, "body text"],
  ["text", "surface-tint", TEXT, "body text"],
  ["text", "accent-tint", TEXT, "body text"],
  ["text-muted", "bg", TEXT, "secondary text"],
  ["text-muted", "surface", TEXT, "secondary text"],
  ["text-muted", "surface-tint", TEXT, "secondary text"],
  ["accent", "bg", TEXT, "link and accent text"],
  ["accent", "surface", TEXT, "link and accent text"],
  ["accent", "surface-tint", TEXT, "link and accent text"],
  ["accent", "accent-tint", TEXT, "link and accent text"],
  ["accent-hover", "bg", TEXT, "link hover text"],
  ["accent-hover", "surface", TEXT, "link hover text"],
  ["on-accent", "accent", TEXT, "button label"],
  ["on-accent", "accent-hover", TEXT, "button label on hover"],
  ["success", "surface", TEXT, "success text"],
  ["success", "success-tint", TEXT, "success text"],
  ["warning", "surface", TEXT, "warning text"],
  ["warning", "warning-tint", TEXT, "warning text"],
  ["danger", "surface", TEXT, "error text"],
  ["danger", "danger-tint", TEXT, "error text"],
  ["border-strong", "bg", UI, "input and control border"],
  ["border-strong", "surface", UI, "input and control border"],
  ["accent", "bg", UI, "focus ring and primary fill edge"],
  ["accent", "surface", UI, "focus ring and primary fill edge"],
  ["accent", "surface-tint", UI, "focus ring"],
  ["accent", "accent-tint", UI, "focus ring"],
  // Brand fields on Home: the hero (gradient from brand-ink to brand-deep) and the closing
  // (flat brand-deep). The brand colours are fixed, so these are the same in both themes.
  // Text is checked against both ends of the gradient. brand-deep is its lightest end.
  ["brand-mist", "brand-deep", TEXT, "field text, closing and lightest end of hero gradient"],
  ["brand-mist", "brand-ink", TEXT, "field text, darkest end of hero gradient"],
  ["brand-ink", "brand-sky", TEXT, "field button label"],
  ["brand-ink", "brand-mist", TEXT, "field button label on hover"],
  ["brand-mist", "brand-steel", TEXT, "field selected text"],
  ["brand-sky", "brand-deep", UI, "field focus ring, button fill, line and stop"],
  ["brand-sky", "brand-ink", UI, "field focus ring, button fill, line and stop"],
  ["brand-mist", "brand-deep", UI, "hero mark and button hover fill, lightest end"],
  ["brand-mist", "brand-ink", UI, "hero mark, darkest end"],
  // Home redesign (scope 4c): the alternating fields, the marquee and the shapes.
  ["brand-mist", "brand-deep", TEXT, "services text on the deep field"],
  ["brand-sky", "brand-deep", UI, "service shapes on the deep field"],
  ["brand-ink", "brand-sky", TEXT, "marquee type on the sky band"],
  ["text", "surface-tint", TEXT, "principles text on the pale field"],
  ["accent", "surface-tint", TEXT, "principle numerals on the pale field"],
  ["accent", "surface-tint", UI, "principle shapes on the pale field"],
  ["accent", "bg", UI, "shapes on the page background"],
  // The firm statement fills from text-muted to text. Every mix between the two sits
  // between these two ratios, so checking both ends covers each step.
  ["text-muted", "bg", TEXT, "statement words, start of the fill"],
  ["text", "bg", TEXT, "statement words, end of the fill"],
];

// Shown for information only. The border token is decorative and carries no meaning.
const INFO = [["border", "bg", "decorative divider (no minimum)"]];

function colour(name, theme) {
  const token = tokens.color.tokens.find((item) => item.name === name);
  if (!token) throw new Error(`Unknown colour token: ${name}`);
  const value = typeof token.value === "string" ? token.value : token.value[theme];
  const alias = value.match(/^\{([\w-]+)\}$/);
  return alias ? colour(alias[1], theme) : value;
}

function channel(hex, start) {
  const c = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
for (const theme of tokens.color.themes.map((item) => item.id)) {
  console.log(`\n${theme}`);
  for (const [fg, bg, min, what] of PAIRS) {
    const value = ratio(colour(fg, theme), colour(bg, theme));
    const ok = value >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? "pass" : "FAIL"}  ${value.toFixed(2).padStart(5)} (min ${min})  ${fg} on ${bg}  ${what}`,
    );
  }
  for (const [fg, bg, what] of INFO) {
    const value = ratio(colour(fg, theme), colour(bg, theme));
    console.log(`  info  ${value.toFixed(2).padStart(5)}        ${fg} on ${bg}  ${what}`);
  }
}

if (failed > 0) {
  console.error(`\ncheck-contrast: ${failed} pair(s) below the minimum`);
  process.exit(1);
}
console.log("\ncheck-contrast: every pair passes in both themes");
