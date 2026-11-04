import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Reads the locked copy file, docs/context/03-home-copy.md, and returns the strings the
// Home page must carry word for word. The document is the source of truth, so nothing
// here is typed in by hand.

const DOC_PATH = fileURLToPath(
  new URL("../../../../docs/context/03-home-copy.md", import.meta.url),
);

export type LockedCopy = {
  bookCallLabel: string;
  eyebrow: string;
  headlines: string[];
  supportingLines: string[];
  firmStatements: string[];
  clientsHeading: string;
  services: { name: string; line: string }[];
  principles: { lead: string; text: string }[];
  peopleLine: string;
  peopleLinkText: string;
  questions: { question: string; answer: string }[];
  closingHeadline: string;
};

function sections(doc: string): Map<number, string> {
  const map = new Map<number, string>();
  const parts = doc.split(/^## (?=\d+\. )/m).slice(1);
  for (const part of parts) {
    const number = Number.parseInt(part, 10);
    map.set(number, part);
  }
  return map;
}

function need<T>(value: T | undefined | null, what: string): T {
  if (value === undefined || value === null) {
    throw new Error(`03-home-copy.md: could not find ${what}`);
  }
  return value;
}

function section(all: Map<number, string>, number: number): string {
  return need(all.get(number), `section ${number}`);
}

function lockedLine(text: string, label: string): string {
  const match = new RegExp(`^- ${label} \\(locked\\): (.+)$`, "m").exec(text);
  return need(match?.[1], `"${label} (locked)"`).trim();
}

// Numbered option lines such as "  1. text", read between two markers.
function options(text: string, from: string, to: string): string[] {
  const start = need(text.indexOf(from) >= 0 ? text.indexOf(from) : null, from);
  const end = text.indexOf(to, start);
  const block = text.slice(start, end > start ? end : undefined);
  return [...block.matchAll(/^\s*\d+\. (.+)$/gm)].map((m) => need(m[1], "option").trim());
}

export function readLockedCopy(): LockedCopy {
  const doc = readFileSync(DOC_PATH, "utf8");
  const all = sections(doc);

  const label = need(
    /Every call-to-action button reads \*\*(.+?)\*\*/.exec(doc)?.[1],
    "the button label",
  );

  const hero = section(all, 1);
  const eyebrow = lockedLine(hero, "Eyebrow");
  const headlines = options(hero, "- Headline", "- Supporting line");
  const supportingLines = options(hero, "- Supporting line", "- Button");

  const firmStatements = options(section(all, 2), "Statement", "\n\n");

  const clientsHeading = lockedLine(section(all, 3), "Heading");

  const services = [...section(all, 4).matchAll(/^\| (.+?) \| (.+?) \|$/gm)]
    .map((m) => ({ name: need(m[1], "service").trim(), line: need(m[2], "line").trim() }))
    .filter((row) => row.name !== "Service" && !/^-+$/.test(row.name));

  const principles = [...section(all, 6).matchAll(/^\d+\. \*\*(.+?)\*\* (.+)$/gm)].map((m) => ({
    lead: need(m[1], "principle lead").trim(),
    text: need(m[2], "principle text").trim(),
  }));

  const people = section(all, 10);
  const peopleLine = lockedLine(people, "Line");
  const peopleLinkText = lockedLine(people, "Link text");

  // "**1. Question text**" on one line, the answer on the next line.
  const questions = [...section(all, 12).matchAll(/^\*\*\d+\. (.+?)\*\*\n(.+)$/gm)].map((m) => ({
    question: need(m[1], "question").trim(),
    answer: need(m[2], "answer").trim(),
  }));

  const closingHeadline = lockedLine(section(all, 13), "Headline");

  return {
    bookCallLabel: label,
    eyebrow,
    headlines,
    supportingLines,
    firmStatements,
    clientsHeading,
    services,
    principles,
    peopleLine,
    peopleLinkText,
    questions,
    closingHeadline,
  };
}
