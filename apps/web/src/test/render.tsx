import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "@/app/layout";
import HomePage from "@/app/page";

// The whole Home document as the server sends it: root layout (skip link, header,
// main) around the page. react-dom/server runs no effects and no hydration, so what
// comes back is the HTML a crawler reads.
export function renderHomeDocument(): string {
  return renderToStaticMarkup(
    <RootLayout>
      <HomePage />
    </RootLayout>,
  );
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
};

// The text a reader or a crawler sees: tags gone, entities decoded, spaces collapsed.
export function visibleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|lt|gt|quot|#x27|#39);/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

export type Anchor = { href: string; text: string };

export function anchors(html: string): Anchor[] {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: /\bhref="([^"]*)"/.exec(m[1] ?? "")?.[1] ?? "",
    text: visibleText(m[2] ?? ""),
  }));
}

export function headings(html: string, level: 1 | 2 | 3): string[] {
  return [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)</h${level}>`, "g"))].map(
    (m) => visibleText(m[1] ?? ""),
  );
}
