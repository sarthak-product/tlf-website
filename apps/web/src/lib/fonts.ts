import { Arimo, Quicksand } from "next/font/google";

// next/font downloads these files at build time and serves them from our own
// domain, so visitors' browsers never call Google.
// The CSS variable names are the ones scripts/build-tokens.mjs reads.

// Arimo sets everything. Variable font, so one file covers weights 400 to 700.
export const arimo = Arimo({
  subsets: ["latin"],
  display: "swap",
  variable: "--next-font-arimo",
});

// Quicksand 600 sets the firm name in the lockup and nothing else.
export const quicksand = Quicksand({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--next-font-quicksand",
});
