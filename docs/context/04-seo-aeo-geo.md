# 04 SEO, AEO and GEO

Goal: when a founder or CXO asks a general question about outsourced finance, a virtual or fractional CFO, compliance, valuation or funding, Lotus Feet's content is found and cited. Almost nobody will type "Lotus Feet", so pages answer the general question first.

Labels: **Evidence** means a documented fact. **Opinion** means judgment, to be tested.

## Build requirements (opinion, standard practice)
- Server-rendered HTML for every public page. Full content visible without JavaScript.
- One `h1` per page. Clear heading hierarchy. Each FAQ question is a heading, with the direct answer in the first sentence under it.
- Unique title and meta description per page, canonical URL, Open Graph tags.
- `sitemap.xml` and `robots.txt`, generated from the database for blog posts.
- Fast pages: no large unoptimised images, no layout shift, fonts loaded without blocking.
- Plain, crawlable internal links. Home links to each service and the latest posts. Articles link to the relevant service and to each other.
- Image alt text from the database field, required.

## Structured data (JSON-LD)
Evidence: schema.org defines these types. Validate each with Google's Rich Results Test and the schema.org validator after build.
- `Organization` (or `ProfessionalService`) for Lotus Feet Consultancy: name, URL, logo. No phone, email or people unless cleared.
- `WebSite`.
- `FAQPage` on Home, one entry per question, text identical to the visible answer.
- `Article` and `BreadcrumbList` on blog posts. No `author` naming the CA. Use the organisation as publisher.
- `Service` entries only for services that have real pages.
Open: Google restricted FAQ rich results to a narrow set of sites in 2023 (general knowledge, not rechecked). The markup is still worth shipping for answer engines, but do not promise Sarthak a rich result in Google.

## Answer-engine writing rules (opinion)
- Lead with the direct answer. Definitions in the first two sentences.
- Self-contained answers: each answer makes sense if quoted alone.
- Tables for comparisons (for example in-house team versus outsourced versus virtual CFO), once the CA has approved the claims.
- Include dated facts for anything regulatory, and a "last reviewed" date on articles.
- Cite primary sources (law text, circulars, ministry pages) in articles.
- Unique point of view backed by practice. No filler.

## AI crawlers
Open decision for Sarthak: allow or block AI crawlers in `robots.txt`. Recommendation (opinion): allow, because the goal is citation. Do not decide silently: build `robots.txt` from a config list and ask.
An `llms.txt` file is an unofficial proposal with unproven effect (opinion). Optional. Do not spend time on it before the core is done.

## Measurement (to set up after launch)
- Google Search Console and Bing Webmaster Tools verification.
- Track the six FAQ questions and a short list of target queries by hand, monthly: does the site appear, is it cited in AI answers. No tool is chosen. Do not claim rankings or traffic numbers anywhere.

## Keyword work
Not done. No keyword volumes or competitor names have been verified. Do not invent them. If keyword research is needed, `/architect` should ask Sarthak first, then use a real source and record it in a spec.

## Content engine (later phase)
Blog posts that teach with Indian context (Union Budget, startup tax structures, RBI circulars) and lead softly to "Book a call". Posts carry no byline. Every post is reviewed by the CA before it is published (process: Sarthak decides, since admin has no approval flag). Newsletter reuses the posts.
