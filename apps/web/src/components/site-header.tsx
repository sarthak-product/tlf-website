import { Lockup } from "./lockup";
import styles from "./site-header.module.css";

// Header shell. It holds the lockup only. Navigation labels and the Book a call
// button wait for approved copy (docs/context/03-home-copy.md, Meta and footer).
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className="page">
        <div className={styles.bar}>
          <Lockup />
        </div>
      </div>
    </header>
  );
}
