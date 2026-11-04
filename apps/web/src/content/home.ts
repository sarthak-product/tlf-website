// Home page copy. Locked in docs/context/03-home-copy.md, used verbatim.
// Do not reword, shorten or "improve" anything here. Change the file only when that
// document changes.
//
// Each shortlist below holds every option the CA can pick from. To change a choice,
// edit the matching number in `choice` (it is the option number in 03-home-copy.md).

export const choice = {
  heroHeadline: 1,
  heroSupportingLine: 1,
  firmStatement: 1,
} as const;

const heroHeadlines = [
  "CFO-grade finance and compliance for startups and growing businesses.",
  "Virtual CFO services in India: your finance function, owned end to end.",
  "The financial backbone for growing Indian businesses: CFO, compliance, funding.",
] as const;

const heroSupportingLines = [
  "Compliance starts the day you incorporate and never stops. We take the whole finance function, or any part of it.",
  "Every stage of growth brings new finance demands. We take on the whole function, or the one piece that needs it.",
] as const;

const firmStatements = [
  "Data-driven decisions are only as good as the data behind them. Lotus Feet Consultancy keeps your books accurate, your compliance current and your view clear, in whole or in part.",
  "You cannot steer what you cannot see. Lotus Feet Consultancy keeps your books accurate and your compliance current, so decisions are data-driven. Whole function or any part.",
] as const;

function pick<T>(options: readonly T[], number: number, name: string): T {
  const option = options[number - 1];
  if (option === undefined) {
    throw new Error(`home content: ${name} has no option ${number}`);
  }
  return option;
}

// Every call to action reads this label. The link comes from CALENDLY_URL (src/lib/booking.ts).
export const bookCallLabel = "Book a call";

type Client = { name: string; logoSrc: string; logoAlt: string };
type EngagementStep = { title: string; text: string };

// Section headings marked "stand-in" are the section names from 03-home-copy.md, used so
// the page has a heading outline. They are not locked copy and wait for the CA.
export const home = {
  hero: {
    eyebrow: "Virtual CFO. Compliance. Funding.",
    headline: pick(heroHeadlines, choice.heroHeadline, "hero headline"),
    supportingLine: pick(heroSupportingLines, choice.heroSupportingLine, "supporting line"),
  },

  // The statement has no heading in the locked copy.
  firm: {
    statement: pick(firmStatements, choice.firmStatement, "firm statement"),
  },

  // Hidden until a client has agreed in writing. Heading included.
  clients: {
    heading: "Proof, not promises.",
    items: [] as readonly Client[],
  },

  whatWeDo: {
    heading: "What we do", // stand-in
    // Add `href` to a service when its page exists. Services is parked.
    items: [
      {
        name: "Virtual CFO",
        line: "CFO-level planning and reporting, so compliance deadlines stop setting your agenda.",
      },
      {
        name: "Valuation",
        line: "A valuation you can put in front of investors, acquirers and your own board.",
      },
      {
        name: "Startup Consultancy",
        line: "A startup set up for the investor, the auditor and the years ahead.",
      },
      {
        name: "Business Funding",
        line: "Debt, equity or both: a funding plan built around what the business can carry.",
      },
      {
        name: "Pitch Deck and Financial Model",
        line: "The pitch deck wins attention. The financial model earns trust. Built as one.",
      },
    ] as readonly { name: string; line: string; href?: string }[],
  },

  // Case studies: none supplied, so the section is not built.

  howWeThink: {
    heading: "How we think", // stand-in
    items: [
      {
        lead: "Advice, not information.",
        text: "Anyone can hand you a report. We tell you what it means and what we would do in your position.",
      },
      {
        lead: "Technology for the routine, people for the call.",
        text: "Automation handles the repetitive work, so experienced professionals spend their time on the decisions that shape your business.",
      },
      {
        lead: "Continuity, not rotation.",
        text: "You keep the same people as you grow, so the context never has to be explained twice.",
      },
    ],
  },

  // How an engagement runs: no copy exists yet. Hidden slot. It shows when `steps` has entries.
  engagement: {
    heading: "", // copy not drafted
    steps: [] as readonly EngagementStep[],
  },

  // Key figures, testimonials and recent writing: none supplied or published, so the
  // sections are not built.

  // Hidden until the CA clears a person for publication.
  people: {
    cleared: false,
    line: "Lotus Feet Consultancy is led by finance and compliance professionals with hands-on experience across business stages and sectors. Meet the leadership and advisory team responsible for your mandate.",
    linkText: "Meet the leadership team.",
    // The About page is parked, so there is no route yet.
    href: undefined as string | undefined,
  },

  questions: {
    heading: "Questions", // stand-in
    // Each answer ends with the Book a call button. Only answer 4 names the brand.
    items: [
      {
        question: "How do I manage the finances of a growing business?",
        answer:
          "A growing business manages its finances best when four things work together: accurate books, compliance that stays current, cash flow planned ahead, and reporting that clarifies decisions. With all four in place, decisions start from numbers the business can trust, and growth is easier to steer. Senior finance expertise, in-house or part-time, is what holds the four together.",
      },
      {
        question: "Do I need a CFO for my startup or small business?",
        answer:
          "A startup does not always need a full-time CFO, but it does need CFO-level thinking from early on. That means reliable books, a cash forecast and clear answers on tax and funding. A part-time or virtual CFO brings that senior judgment at a scale that fits the stage.",
      },
      {
        question: "What financial services does a growing company need?",
        answer:
          "A growing company typically needs accounting and bookkeeping, tax and regulatory compliance, planning and reporting, and, as it scales, funding and valuation support. Bringing them under one finance function gives leadership a single, reliable view of the business. These can be taken separately or as one engagement, depending on the stage.",
      },
      {
        question: "Should I outsource my company's accounting, tax and compliance?",
        answer:
          "You can keep accounting in-house or outsource it, but a virtual CFO to guide either setup is the ideal choice. With an in-house team, the CFO adds direction, reporting and compliance oversight. Without one, the virtual CFO at Lotus Feet brings a team to handle accounting, tax and compliance.",
      },
      {
        question: "How much do outsourced finance and CFO services cost in India?",
        answer:
          "Costs depend on scope, not a fixed rate: the number of services, the size and complexity of the business, the volume of transactions, and how much senior time it needs. Outsourced finance is usually priced as a fixed monthly fee, often lower than the cost of a full-time CFO. The usual route is a short scoping call.",
      },
      {
        question: "How do I get my business ready to raise funding?",
        answer:
          "A business is ready to raise funding when its records, compliance and story all hold up to scrutiny. That means reconciled financials, up-to-date filings, a clear cap table, a financial model with stated assumptions and a reasoned view of valuation. Investors typically ask for these in diligence, so having them ready early avoids delays.",
      },
    ],
  },

  closing: {
    headline: "A business that is moving deserves finance that keeps pace.",
  },
};
