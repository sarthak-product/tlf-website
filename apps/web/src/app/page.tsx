import { BookCallButton } from "@/components/book-call-button";
import { FaqItem } from "@/components/faq-item";
import { Mark } from "@/components/mark";
import { Marquee } from "@/components/marquee";
import { Section } from "@/components/section";
import { Shape } from "@/components/shape";
import { home } from "@/content/home";
import { principleShapes, serviceShapes, shapeAt } from "@/lib/shapes";
import styles from "./page.module.css";

// Home. Sections follow the order in docs/context/03-home-copy.md:
// hero, the firm, clients, what we do, case studies, how we think, how an engagement runs,
// key figures, testimonials, people, recent writing, questions, closing.
// A section with no content renders nothing, heading included. Case studies, key figures,
// testimonials and recent writing have no content and no layout yet, so they are not built.
//
// The page alternates deep blue and pale fields, and services and principles sit in a
// zig-zag with an original monoline shape opposite each one (design.md, Page structure of
// Home). The marquee repeats the hero eyebrow as decoration and is hidden from assistive
// technology.
//
// Data attributes mark what the motion script (components/site-motion.tsx) animates in the
// browser. They change nothing in this HTML: every word is here and visible whether or not
// JavaScript runs.
export default function HomePage() {
  const { hero, firm, clients, whatWeDo, howWeThink, engagement, people, questions, closing } =
    home;

  return (
    <>
      <Section field="hero">
        <p className={styles.eyebrow} data-reveal="">
          {hero.eyebrow}
        </p>
        <h1 className={styles.headline} data-split="">
          {hero.headline}
        </h1>
        <div className={styles.heroFoot}>
          <div className={styles.heroText}>
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

      <Marquee text={hero.eyebrow} />

      <Section>
        <p className={styles.statement} data-words="">
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

      <Section field="deep" heading={whatWeDo.heading} headingId="what-we-do-heading">
        <ul className={styles.zigzag}>
          {whatWeDo.items.map((service, index) => (
            <li key={service.name} className={styles.zig} data-zig={index % 2 ? "end" : "start"}>
              <div className={styles.zigText} data-reveal="">
                <h3 className={styles.zigTitle}>
                  {service.href ? <a href={service.href}>{service.name}</a> : service.name}
                </h3>
                <p className={styles.zigLine}>{service.line}</p>
              </div>
              <div className={styles.zigShape} data-draw="">
                <Shape name={shapeAt(serviceShapes, index)} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section field="tint" heading={howWeThink.heading} headingId="how-we-think-heading">
        <ol className={`${styles.zigzag} ${styles.numbered}`} data-pin="">
          {howWeThink.items.map((principle, index) => (
            <li
              key={principle.lead}
              className={styles.zig}
              data-zig={index % 2 ? "end" : "start"}
              data-step=""
            >
              <div className={styles.zigText} data-reveal="">
                <h3 className={styles.zigTitle}>{principle.lead}</h3>
                <p className={styles.zigLine}>{principle.text}</p>
              </div>
              <div className={styles.zigShape} data-draw="">
                <Shape name={shapeAt(principleShapes, index)} />
              </div>
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

      <Section field="deep">
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
