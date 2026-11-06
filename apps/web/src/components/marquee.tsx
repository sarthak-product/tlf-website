import styles from "./marquee.module.css";

// A band of large type that repeats a line of copy already on the page (the hero eyebrow),
// set on a brand-sky field between two sections. It is decoration, so it is hidden from
// assistive technology: a screen reader has already read the line in the hero.
//
// It never moves on its own. On desktop, when motion is allowed, the motion script slides
// the track sideways only while the page scrolls (scrubbed), so it stops when the reader
// stops and needs no pause control. Without JavaScript, below 1024px or for reduced motion
// it is still.
const REPEAT = 4;

export function Marquee({ text }: { text: string }) {
  return (
    <div className={styles.band} aria-hidden="true" data-marquee="">
      <div className={styles.track} data-marquee-track="">
        {Array.from({ length: REPEAT }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the copies are identical and never reorder.
          <span key={index} className={styles.item}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
