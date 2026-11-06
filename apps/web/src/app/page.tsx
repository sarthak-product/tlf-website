import { BookCallButton } from "@/components/book-call-button";
import { FaqItem } from "@/components/faq-item";
import { Mark } from "@/components/mark";
import { Section } from "@/components/section";
import { home } from "@/content/home";
import styles from "./page.module.css";

// Home. Sections follow the order in docs/context/03-home-copy.md:
// hero, the firm, clients, what we do, case studies, how we think, how an engagement runs,
// key figures, testimonials, people, recent writing, questions, closing.
// A section with no content renders nothing, heading included. Case studies, key figures,
// testimonials and recent writing have no content and no layout yet, so they are not built.
//
// The hero and the closing sit on brand fields. `data-reveal` and `data-split` mark what
// the motion script (components/site-motion.tsx) reveals in the browser. They change
// nothing in this HTML: every word is here and visible whether or not JavaScript runs.
export default function HomePage() {
  const { hero, firm, clients, whatWeDo, howWeThink, engagement, people, questions, closing } =
    home;

  return (
    <>
      <Section marker="var(--type-label-line)" field="hero">
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow} data-reveal="">
              {hero.eyebrow}
            </p>
            <h1 className={styles.headline} data-split="">
              {hero.headline}
            </h1>
            <p className={styles.lead} data-reveal="">
              {hero.supportingLine}
            </p>
            <div className={styles.action} data-reveal="">
              <BookCallButton />
            </div>
          </div>
          <div className={styles.heroMark} data-parallax="">
            <Mark tone="mist" motion="hero" />
          </div>
        </div>
      </Section>

      <Section>
        <p className={styles.statement} data-reveal="">
          {firm.statement}
        </p>
      </Section>

      {clients.items.length > 0 ? (
        <Section heading={clients.heading} headingId="clients-heading">
          <ul className={styles.logos}>
            {clients.items.map((client) => (
              <li key={client.name}>
                {/* biome-ignore lint/performance/noImgElement: logo sizes are unknown until clients supply files. */}
                <img className={styles.logo} src={client.logoSrc} alt={client.logoAlt} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section heading={whatWeDo.heading} headingId="what-we-do-heading">
        <ul className={styles.rows}>
          {whatWeDo.items.map((service) => (
            <li key={service.name} className={styles.row} data-reveal="">
              <h3 className={styles.rowTitle}>
                {service.href ? <a href={service.href}>{service.name}</a> : service.name}
              </h3>
              <p className={styles.rowText}>{service.line}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={howWeThink.heading} headingId="how-we-think-heading">
        <ol className={`${styles.rows} ${styles.numbered}`}>
          {howWeThink.items.map((principle) => (
            <li key={principle.lead} className={styles.row} data-reveal="">
              <h3 className={styles.rowTitle}>{principle.lead}</h3>
              <p className={styles.rowText}>{principle.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {engagement.steps.length > 0 ? (
        <Section heading={engagement.heading} headingId="engagement-heading">
          <ol className={`${styles.rows} ${styles.numbered}`}>
            {engagement.steps.map((step) => (
              <li key={step.title} className={styles.row} data-reveal="">
                <h3 className={styles.rowTitle}>{step.title}</h3>
                <p className={styles.rowText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {people.cleared ? (
        <Section>
          <p className={styles.statement} data-reveal="">
            {people.line}
          </p>
          {people.href ? (
            <p className={styles.peopleLink}>
              <a href={people.href}>{people.linkText}</a>
            </p>
          ) : null}
        </Section>
      ) : null}

      <Section heading={questions.heading} headingId="questions-heading">
        <div className={styles.faq}>
          {questions.items.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer}>
              <BookCallButton variant="secondary" />
            </FaqItem>
          ))}
        </div>
      </Section>

      <Section marker="var(--type-h1-line)" field="closing">
        <h2 className={styles.closing} data-split="">
          {closing.headline}
        </h2>
        <div className={styles.action} data-reveal="">
          <BookCallButton />
        </div>
      </Section>
    </>
  );
}
