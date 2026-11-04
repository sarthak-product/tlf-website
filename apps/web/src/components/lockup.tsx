import markOnDark from "@design/assets/Logos/lf-mark-on-dark.svg";
import markOnLight from "@design/assets/Logos/lf-mark-on-light.svg";
import Image from "next/image";
import Link from "next/link";
import styles from "./lockup.module.css";

// The lockup is the mark followed by the firm name set as type in Quicksand 600.
// It carries the name only. Never add a descriptor line to it.
// Both mark files are rendered and CSS shows the one that suits the theme, so the
// brand files stay untouched. The name beside each mark is its text, so alt is empty.
export function Lockup() {
  return (
    <Link href="/" className={styles.lockup}>
      <Image className={styles.markOnLight} src={markOnLight} alt="" loading="eager" unoptimized />
      <Image className={styles.markOnDark} src={markOnDark} alt="" loading="eager" unoptimized />
      <span className={styles.name}>Lotus Feet</span>
    </Link>
  );
}
