import type { ReactNode } from "react";
import styles from "./faq-item.module.css";

// One question and its answer as a native disclosure. The answer is in the server
// rendered HTML whether the item is open or closed, so search and AI engines read it.
// The question is a heading inside the summary. Keyboard use (Tab, Enter, Space) and the
// expanded state come from the browser, with no script. When motion is allowed, the
// motion script (site-motion.tsx) eases the height open and closed and leaves the native
// element in charge of the open state.
export function FaqItem({
  question,
  answer,
  children,
}: {
  question: string;
  answer: string;
  children?: ReactNode;
}) {
  return (
    <details className={styles.item} data-faq="" data-reveal="">
      <summary className={styles.summary}>
        <h3 className={styles.question}>{question}</h3>
        <span className={styles.icon} aria-hidden="true" />
      </summary>
      <div className={styles.answer}>
        <p className={styles.text}>{answer}</p>
        {children}
      </div>
    </details>
  );
}
