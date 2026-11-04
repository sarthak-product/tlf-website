import { BookCallButton } from "./book-call-button";
import { Lockup } from "./lockup";
import styles from "./site-header.module.css";

// The header holds the lockup and the Book a call button only. Navigation labels wait
// for approved copy (docs/context/03-home-copy.md, Meta and footer).
// The button is secondary here so the hero keeps the one primary action in view.
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className="page">
        <div className={styles.bar}>
          <Lockup />
          <BookCallButton variant="secondary" />
        </div>
      </div>
    </header>
  );
}
