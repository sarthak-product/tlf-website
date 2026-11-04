# 02 Rules, claims and compliance

This is not legal advice. The CA or counsel must review the live site before launch.

## Two sites, two rule sets
| | LF corporate site (this repo) | CA personal site (not here) |
|---|---|---|
| Bound by ICAI website advisory | No (LF is outside ICAI registration, confirmed by Sarthak 2 Nov 2026) | Yes |
| Client names and logos | Allowed if real and consented in writing | No |
| Testimonials with names | Allowed if real and consented | No |
| Fees, free services | Allowed if supplied | No |
| Awards, rankings, media, empanelments | Allowed if real and verifiable | No |
| "Leading", "best", "why choose us" | Avoid superlatives. Claims must be provable | No |
| Photography | Real photos supplied by the firm | Passport-style only |
| Still applies to both | DPDP Act 2023, SEBI and RBI rules where a service touches them, no invented content, accessibility | Same |

Open: whether the split holds if the CA is a director or founder of LF is a legal question. Not answered here.

## Site-wide rules
- The CA's name is not used to market LF. No byline, schema `author`, `founder` or `employee` entry, meta tag or image alt naming the CA, unless the CA clears a specific person entry in writing.
- The Calendly booking page normally shows the host's name. That conflicts with the rule above. Open: decide whether to use a team or firm Calendly account.
- No phone, email or response time on the site. The CTA connects the visitor to the CA.
- No answer, article or page carries a byline unless Sarthak asks for one.
- Every public claim about services or credentials is checked against the claims standard of the regulator that applies to it, and must be provable.
- Terms of Service and Privacy Policy pages are drafted from real data practices (DPDP Act 2023). Missing details are marked "Draft for review".

## Claims flagged for the CA before publishing
These sit in locked copy but have not been verified. Build them, flag them in the demo.
1. "CFO-level" and "CFO-grade": what qualifies a person as CFO-level.
2. Valuation: some valuations in India must be done by a registered valuer. Which of LF's valuations qualify, and who signs them, is unconfirmed.
3. Business Funding and Pitch Deck: the position of SEBI and RBI on how fundraising help may be described is unchecked.
4. Statutory audit and some certifications are reserved to practising CAs. Which LF tasks go through a practising CA is unconfirmed.
5. "You keep the same people as you grow": a staffing promise. The CA must confirm it can be kept.
6. FAQ 5: "often lower than the cost of a full-time CFO" is a comparative cost claim. Needs support or removal.
7. FAQ 6: the list of what investors ask for in diligence is general knowledge, not sourced.
8. Principles and people line: "experienced professionals" and "leadership and advisory team" need real people behind them.

## Voice and copy rules
- Authoritative yet conversational. Senior adviser to a founder. "We" and "you".
- State the benefit in the first sentence. Passive selling: end on substance, not on a sales line.
- Open with true statements, not opinion.
- No begging tone ("give us"), no blunt tone, no hype.
- Sentence case. Lakhs and crores. Financial year April to March. GST, ITR, MCA as clients say them.
- No em dashes or en dashes. No "not X, but Y".
- Never invent testimonials, clients, logos, statistics or claims.
- Run `node scripts/check-copy.mjs` before every commit. It fails on dashes in source text.

## Compliance areas the site touches
- DPDP Act 2023: forms, newsletter, consent, deletion, breach process, privacy notice. See `05-data-and-dpdp.md`.
- ICAI: applies to the CA, not to LF as stated above. Keep the two sites separate.
- SEBI and RBI: wording about funding, valuation and investor matters. Flagged above.
- Accessibility: contrast and keyboard checks in both themes.
