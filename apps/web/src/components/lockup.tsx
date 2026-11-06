import Link from "next/link";
import styles from "./lockup.module.css";
import { Mark } from "./mark";

// The lockup is the mark followed by the firm name set as type in Quicksand 600.
// It carries the name only. Never add a descriptor line to it.
// The mark is drawn inline from the brand file's paths, in the brand file colour that
// suits the theme, so its strokes can be drawn in on load. The name beside it is the
// link text, so the mark is hidden from assistive technology.
export function Lockup() {
  return (
    <Link href="/" className={styles.lockup}>
      <Mark tone="theme" className={styles.mark} motion="header" />
      <span className={styles.name}>Lotus Feet</span>
    </Link>
  );
}
