import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { metadata } from "@/app/layout";
import { readLockedCopy } from "@/test/copy-doc";
import { anchors, headings, renderHomeDocument, visibleText } from "@/test/render";

// Sample address on a reserved domain. It is not a real booking page.
const SAMPLE_URL = "https://calendly.example/sample-booking";
const BOOK_CALL = "Book a call";
// Header, hero, one per answer (six) and the closing section.
const EXPECTED_BUTTONS = 1 + 1 + 6 + 1;

const doc = readLockedCopy();
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
const EMAIL = /[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+/;
// Ten or more digits, allowing spaces, dots, dashes and brackets between them.
const PHONE = /(?:\+?\d[\s().-]?){10,}/;

beforeEach(() => {
  vi.stubEnv("CALENDLY_URL", undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock("@/content/home");
  vi.resetModules();
});

describe("server rendered Home page: the copy", () => {
  it("renders the hero, firm statement, services, principles and closing from the locked copy", () => {
    const text = visibleText(renderHomeDocument());
    const expected = [
      doc.eyebrow,
      doc.headlines[0],
      doc.supportingLines[0],
      doc.firmStatements[0],
      ...doc.services.flatMap((s) => [s.name, s.line]),
      ...doc.principles.flatMap((p) => [p.lead, p.text]),
      doc.closingHeadline,
    ];
    for (const piece of expected) {
      expect(text, piece).toContain(piece);
    }
  });

  it("has one h1, and it is the hero headline", () => {
    expect(headings(renderHomeDocument(), 1)).toEqual([doc.headlines[0]]);
  });
});

describe("server rendered Home page: the six answers", () => {
  it("has all six questions as headings and all six answers in the HTML", () => {
    const html = renderHomeDocument();
    const text = visibleText(html);
    expect(doc.questions).toHaveLength(6);
    expect(headings(html, 3)).toEqual(expect.arrayContaining(doc.questions.map((q) => q.question)));
    for (const { question, answer } of doc.questions) {
      expect(text, question).toContain(question);
      expect(text, answer).toContain(answer);
    }
  });

  it("sends the answers while every item is closed, so no click is needed to read them", () => {
    const html = renderHomeDocument();
    const items = html.match(/<details\b[^>]*>/g) ?? [];
    expect(items).toHaveLength(6);
    for (const tag of items) {
      expect(tag).not.toMatch(/\bopen\b/);
    }
  });

  it("ends each answer with the Book a call button", () => {
    const html = renderHomeDocument();
    const items = html.match(/<details\b[\s\S]*?<\/details>/g) ?? [];
    expect(items).toHaveLength(6);
    for (const item of items) {
      expect(item).toMatch(/<a\b[^>]*>Book a call<\/a><\/div><\/details>$/);
    }
  });
});

describe("server rendered Home page: sections with no content", () => {
  it("renders only the headings for sections that have content", () => {
    const html = renderHomeDocument();
    expect(headings(html, 2)).toEqual([
      "What we do",
      "How we think",
      "Questions",
      doc.closingHeadline,
    ]);
  });

  it("renders no empty heading", () => {
    const html = renderHomeDocument();
    for (const level of [1, 2, 3] as const) {
      for (const heading of headings(html, level)) {
        expect(heading).not.toBe("");
      }
    }
  });

  it("shows no clients heading, no people copy and no engagement heading while those are empty", () => {
    const text = visibleText(renderHomeDocument());
    expect(text).not.toContain(doc.clientsHeading);
    expect(text).not.toContain(doc.peopleLine);
    expect(text).not.toContain(doc.peopleLinkText);
  });

  it("leaves no empty section behind (no gap)", () => {
    const html = renderHomeDocument();
    const sections = html.match(/<section\b[\s\S]*?<\/section>/g) ?? [];
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      expect(visibleText(section)).not.toBe("");
    }
  });

  it("shows those sections again once they have content, so the checks above are not vacuous", async () => {
    vi.resetModules();
    vi.doMock("@/content/home", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/content/home")>();
      return {
        ...actual,
        home: {
          ...actual.home,
          // Fixtures only. These names are not real clients or steps.
          clients: {
            ...actual.home.clients,
            items: [
              { name: "Sample client", logoSrc: "/sample-logo.svg", logoAlt: "Sample client" },
            ],
          },
          engagement: {
            heading: "Sample engagement heading",
            steps: [{ title: "Sample step", text: "Sample step text." }],
          },
          people: { ...actual.home.people, cleared: true },
        },
      };
    });
    const { renderHomeDocument: renderWithContent } = await import("@/test/render");
    const html = renderWithContent();
    expect(headings(html, 2)).toEqual([
      doc.clientsHeading,
      "What we do",
      "How we think",
      "Sample engagement heading",
      "Questions",
      doc.closingHeadline,
    ]);
    expect(visibleText(html)).toContain(doc.peopleLine);
  });
});

describe("server rendered Home page: Book a call buttons", () => {
  function bookCallAnchors(html: string) {
    return anchors(html).filter((a) => a.text === BOOK_CALL);
  }

  it("has a Book a call button in the header, the hero, each answer and the closing section", () => {
    const html = renderHomeDocument();
    expect(bookCallAnchors(html)).toHaveLength(EXPECTED_BUTTONS);
    // No other element, such as a stray button or a differently worded link, uses the label.
    expect(visibleText(html).split(BOOK_CALL).length - 1).toBe(EXPECTED_BUTTONS);
  });

  it("uses the label from the locked copy", () => {
    expect(doc.bookCallLabel).toBe(BOOK_CALL);
  });

  it("links every button to # while CALENDLY_URL is unset", () => {
    const found = bookCallAnchors(renderHomeDocument());
    expect(found).toHaveLength(EXPECTED_BUTTONS);
    for (const anchor of found) {
      expect(anchor.href).toBe("#");
    }
  });

  it("links every button to # while CALENDLY_URL is empty", () => {
    vi.stubEnv("CALENDLY_URL", "");
    for (const anchor of bookCallAnchors(renderHomeDocument())) {
      expect(anchor.href).toBe("#");
    }
  });

  it("links every button to CALENDLY_URL when it is set", () => {
    vi.stubEnv("CALENDLY_URL", SAMPLE_URL);
    const found = bookCallAnchors(renderHomeDocument());
    expect(found).toHaveLength(EXPECTED_BUTTONS);
    for (const anchor of found) {
      expect(anchor.href).toBe(SAMPLE_URL);
    }
  });
});

describe("server rendered Home page: nothing that does not belong", () => {
  it("has no em dash or en dash in the page or its title", () => {
    const html = renderHomeDocument();
    const title = typeof metadata.title === "string" ? metadata.title : "";
    for (const dash of [EM, EN]) {
      expect(html).not.toContain(dash);
      expect(title).not.toContain(dash);
    }
  });

  it("has no phone number and no email address in the text", () => {
    const text = visibleText(renderHomeDocument());
    expect(text).not.toMatch(PHONE);
    expect(text).not.toMatch(EMAIL);
  });

  it("has no tel: or mailto: link, and no link other than the booking link, the lockup and the skip link", () => {
    vi.stubEnv("CALENDLY_URL", SAMPLE_URL);
    const found = anchors(renderHomeDocument());
    for (const anchor of found) {
      expect(anchor.href).not.toMatch(/^(tel|mailto):/i);
    }
    const others = found.filter((a) => a.text !== BOOK_CALL).map((a) => a.href);
    expect(others.sort()).toEqual(["#main", "/"]);
  });

  it("has detectors that do catch a phone number or an email (sample values only)", () => {
    expect("Call +91 98765 43210 today").toMatch(PHONE);
    expect("Call 022-1234-5678 today").toMatch(PHONE);
    expect("Write to someone@example.com").toMatch(EMAIL);
    expect("Costs are usually a fixed monthly fee.").not.toMatch(PHONE);
  });
});

describe("server rendered Home page: the redesign layout (scope 4c)", () => {
  it("sets services and principles in a zig-zag, alternating sides, with one shape each", () => {
    const html = renderHomeDocument();
    const items = html.match(/<li\b[^>]*data-zig="(start|end)"[\s\S]*?<\/li>/g) ?? [];
    expect(items).toHaveLength(doc.services.length + doc.principles.length);
    const sides = items.map((item) => /data-zig="(start|end)"/.exec(item)?.[1]);
    expect(sides).toEqual(["start", "end", "start", "end", "start", "start", "end", "start"]);
    for (const item of items) {
      expect(item.match(/<svg\b[^>]*data-shape=/g) ?? []).toHaveLength(1);
    }
  });

  it("hides every shape and mark from assistive technology", () => {
    const html = renderHomeDocument();
    const svgs = html.match(/<svg\b[^>]*>/g) ?? [];
    expect(svgs.length).toBe(1 + 1 + doc.services.length + doc.principles.length);
    for (const svg of svgs) {
      expect(svg).toContain('aria-hidden="true"');
      expect(svg).toContain('focusable="false"');
    }
  });

  it("repeats only the hero eyebrow in the marquee, hidden from assistive technology", () => {
    const html = renderHomeDocument();
    const band = /<div\b[^>]*data-marquee=""[^>]*>[\s\S]*?<\/div><\/div>/.exec(html)?.[0] ?? "";
    expect(band).toContain('aria-hidden="true"');
    const copies = band.match(/<span\b[^>]*>([^<]*)<\/span>/g) ?? [];
    expect(copies.length).toBeGreaterThan(1);
    for (const copy of copies) {
      expect(visibleText(copy)).toBe(doc.eyebrow);
    }
  });

  it("sends the final state: no start state, pin or hidden style is in the server HTML", () => {
    const html = renderHomeDocument();
    expect(html).not.toContain("data-pinned");
    expect(html).not.toMatch(/style="[^"]*(opacity|visibility|display:\s*none|transform)/);
    expect(html).not.toMatch(/\shidden(=|\s|>)/);
  });

  it("keeps the questions as one column of native details elements after the zig-zag", () => {
    const html = renderHomeDocument();
    const questions = /<section\b[^>]*aria-labelledby="questions-heading"[\s\S]*?<\/section>/.exec(
      html,
    )?.[0];
    expect(questions).toBeDefined();
    expect(questions).not.toContain("data-zig");
    expect(questions?.match(/<details\b/g) ?? []).toHaveLength(6);
  });
});
