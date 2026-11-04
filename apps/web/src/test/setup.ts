import { createElement } from "react";
import { vi } from "vitest";

// next/font/google only runs inside the Next.js build. The layout needs the two font
// objects for their CSS variable names, so tests use plain stand-ins.
vi.mock("@/lib/fonts", () => ({
  arimo: { variable: "font-arimo-stand-in" },
  quicksand: { variable: "font-quicksand-stand-in" },
}));

// next/image needs sizes that the Next.js build adds for imported files. Tests only
// need the markup, so a plain img stands in for it.
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: unknown; alt: string; className?: string }) =>
    createElement("img", {
      src: typeof src === "string" ? src : (src as { src: string }).src,
      alt,
      className,
    }),
}));
