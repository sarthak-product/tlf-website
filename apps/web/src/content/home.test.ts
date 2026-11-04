import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readLockedCopy } from "@/test/copy-doc";
import { bookCallLabel, choice, home } from "./home";

// Locked copy check. The source of truth is docs/context/03-home-copy.md, read at test
// time. If the document changes, update home.ts to match, never the other way round.
const doc = readLockedCopy();
const source = readFileSync(new URL("./home.ts", import.meta.url), "utf8");

describe("home.ts matches the locked copy in 03-home-copy.md", () => {
  it("reads the whole document, so a changed layout cannot make this suite pass on nothing", () => {
    expect(doc.headlines).toHaveLength(3);
    expect(doc.supportingLines).toHaveLength(2);
    expect(doc.firmStatements).toHaveLength(2);
    expect(doc.services).toHaveLength(5);
    expect(doc.principles).toHaveLength(3);
    expect(doc.questions).toHaveLength(6);
  });

  it("uses the button label from the document", () => {
    expect(bookCallLabel).toBe(doc.bookCallLabel);
  });

  it("carries the locked eyebrow, clients heading, people copy and closing headline", () => {
    expect(home.hero.eyebrow).toBe(doc.eyebrow);
    expect(home.clients.heading).toBe(doc.clientsHeading);
    expect(home.people.line).toBe(doc.peopleLine);
    expect(home.people.linkText).toBe(doc.peopleLinkText);
    expect(home.closing.headline).toBe(doc.closingHeadline);
  });

  it("shows the shortlist option that each `choice` number points to", () => {
    expect(home.hero.headline).toBe(doc.headlines[choice.heroHeadline - 1]);
    expect(home.hero.supportingLine).toBe(doc.supportingLines[choice.heroSupportingLine - 1]);
    expect(home.firm.statement).toBe(doc.firmStatements[choice.firmStatement - 1]);
  });

  it("keeps every shortlist option in the file, word for word, so a pick stays a one line change", () => {
    const options = [...doc.headlines, ...doc.supportingLines, ...doc.firmStatements];
    for (const option of options) {
      expect(source, option).toContain(JSON.stringify(option));
    }
  });

  it("lists the five services in the document order with their locked lines", () => {
    expect(home.whatWeDo.items.map(({ name, line }) => ({ name, line }))).toEqual(doc.services);
  });

  it("lists the three principles in the document order", () => {
    expect(home.howWeThink.items).toEqual(doc.principles);
  });

  it("holds the six questions and answers in the document order", () => {
    expect(home.questions.items).toEqual(doc.questions);
  });

  it("names the brand in answer 4 only", () => {
    const named = home.questions.items
      .map((item, index) => ({ index: index + 1, named: item.answer.includes("Lotus Feet") }))
      .filter((item) => item.named)
      .map((item) => item.index);
    expect(named).toEqual([4]);
  });
});

describe("sections with no content stay empty", () => {
  it("has no clients, no engagement steps, and the people section is not cleared", () => {
    expect(home.clients.items).toHaveLength(0);
    expect(home.engagement.steps).toHaveLength(0);
    expect(home.people.cleared).toBe(false);
  });
});
