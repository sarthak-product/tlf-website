"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { cubicBezier, parseCubicBezier, parseDuration } from "@/lib/ease";

// All motion on the site, in one client component that renders nothing.
//
// The server HTML is the final state: every word, line, stop and mark is there and
// visible, and no CSS hides anything. This script runs in the browser only, after the
// page is on screen, and sets each start state itself just before it animates. So
// without JavaScript, or for a crawler, the page is complete and still.
//
// Everything sits inside gsap.matchMedia on "(prefers-reduced-motion: no-preference)".
// A visitor who prefers reduced motion gets none of it and sees the final state.
//
// What it does, found by data attributes the server components set:
//   [data-mark] path      the three strokes of the mark draw one after another, once
//   [data-split]          headings reveal line by line (SplitText), then the split is undone
//   [data-reveal]         blocks fade and rise into place as they enter the viewport
//   [data-line]           the line down the left edge draws as the page scrolls (scrubbed)
//   [data-parallax]       the hero mark drifts a little slower than the page
//   [data-faq]            native details elements ease open and closed
//
// Nothing pins, loops, smooths the scroll or follows the cursor.

const REDUCE_OFF = "(prefers-reduced-motion: no-preference)";

// If the script starts this long after navigation, the visitor has already read what is
// on screen. Hiding it again to animate it would be worse than no motion, so anything
// already in view is left as it is.
const LATE_MS = 2000;

// Distances, from the spacing scale: space-4 rise for reveals, space-5 parallax drift.
const RISE_PX = 16;
const DRIFT_PX = 24;

// Where the line's pen sits in the viewport, and where reveals start.
const PEN = "70%";
const REVEAL_START = "top 90%";

// Set when the header mark has drawn once, so moving between pages does not redraw it.
let headerDrawn = false;

function readMotionTokens() {
  const root = getComputedStyle(document.documentElement);
  const curve = parseCubicBezier(root.getPropertyValue("--easing-standard"));
  const base = parseDuration(root.getPropertyValue("--duration-base"));
  return {
    ease: curve ? cubicBezier(...curve) : "power2.out",
    // duration-base for state changes such as the FAQ, twice that for entrances.
    base: base !== null && base > 0 ? base : 0.2,
  };
}

function inView(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// Draws the three strokes in order. The start state is set here, in the browser. When the
// draw ends the dash styles are removed, so the mark is exactly the brand file again.
function drawMark(
  svg: SVGSVGElement,
  duration: number,
  ease: gsap.EaseFunction | string,
  onDone?: () => void,
) {
  const paths = Array.from(svg.querySelectorAll("path"));
  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
      onDone?.();
    },
  });
  for (const path of paths) {
    const length = path.getTotalLength();
    // The gap is longer than the stroke and the offset one unit past it, so no round cap
    // shows as a dot before its stroke starts.
    gsap.set(path, { strokeDasharray: `${length} ${length * 2}`, strokeDashoffset: length + 1 });
    timeline.to(path, { strokeDashoffset: 0, duration, ease });
  }
  return timeline;
}

// Splits a heading into lines, reveals them in turn, then puts the original text back.
// While split, SplitText labels the heading with its full text and hides the line
// wrappers from assistive technology, so a screen reader reads it the same way.
function revealLines(
  heading: HTMLElement,
  duration: number,
  ease: gsap.EaseFunction | string,
  onDone?: () => void,
) {
  const split = SplitText.create(heading, { type: "lines", aria: "auto" });
  gsap.set(heading, { opacity: 1 });
  return gsap.from(split.lines, {
    opacity: 0,
    y: RISE_PX,
    duration,
    ease,
    stagger: duration / 5,
    onComplete: () => {
      split.revert();
      onDone?.();
    },
  });
}

// Eases a native details element open or closed. The browser still owns the open state,
// keyboard use and find in page; this only animates the height between the two states.
function bindFaq(details: HTMLDetailsElement, duration: number, ease: gsap.EaseFunction | string) {
  const summary = details.querySelector("summary");
  if (!summary) return () => {};
  let tween: gsap.core.Tween | null = null;
  let closing = false;

  const finish = () => {
    tween = null;
    gsap.set(details, { clearProps: "height,overflowY" });
  };

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    const from = details.getBoundingClientRect().height;
    const opening = closing || !details.open;
    tween?.kill();
    closing = false;

    if (opening) {
      details.open = true;
      gsap.set(details, { height: "auto" });
      const to = details.getBoundingClientRect().height;
      tween = gsap.fromTo(
        details,
        { height: from, overflowY: "clip" },
        { height: to, duration, ease, onComplete: finish },
      );
    } else {
      const border = details.offsetHeight - details.clientHeight;
      const to = summary.getBoundingClientRect().height + border;
      closing = true;
      tween = gsap.fromTo(
        details,
        { height: from, overflowY: "clip" },
        {
          height: to,
          duration,
          ease,
          onComplete: () => {
            closing = false;
            details.open = false;
            finish();
          },
        },
      );
    }
  };

  summary.addEventListener("click", onClick);
  return () => {
    summary.removeEventListener("click", onClick);
    tween?.kill();
    gsap.set(details, { clearProps: "height,overflowY" });
  };
}

export function SiteMotion() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run again on each page change, the DOM is new.
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const mm = gsap.matchMedia();

    mm.add(REDUCE_OFF, (context) => {
      const { ease, base } = readMotionTokens();
      const entrance = base * 2;
      const late = performance.now() > LATE_MS;
      const cleanups: Array<() => void> = [];
      let cancelled = false;

      // 1. The mark: header once per visit, hero on each load of the page.
      const header = document.querySelector<SVGSVGElement>('svg[data-mark="header"]');
      if (header && !headerDrawn && !late) {
        drawMark(header, entrance, ease, () => {
          headerDrawn = true;
        });
      }
      const heroMark = document.querySelector<SVGSVGElement>('svg[data-mark="hero"]');
      if (heroMark && !(late && inView(heroMark))) {
        drawMark(heroMark, entrance, ease);
      }

      // 2. Headings, line by line. Each waits until it enters, and until the fonts are in,
      // so the lines are split where the browser really breaks them.
      for (const heading of document.querySelectorAll<HTMLElement>("[data-split]")) {
        if (late && inView(heading)) continue;
        gsap.set(heading, { opacity: 0 });
        ScrollTrigger.create({
          trigger: heading,
          start: REVEAL_START,
          once: true,
          onEnter: () => {
            document.fonts.ready.then(() => {
              if (cancelled) return;
              context.add(() => revealLines(heading, entrance, ease));
            });
          },
        });
      }

      // 3. Blocks rise into place as they enter, in small batches so rows that enter
      // together follow one another.
      const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
        (block) => !(late && inView(block)),
      );
      if (blocks.length > 0) {
        gsap.set(blocks, { opacity: 0, y: RISE_PX });
        ScrollTrigger.batch(blocks, {
          start: REVEAL_START,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: entrance,
              ease,
              stagger: base / 2,
              clearProps: "opacity,transform",
            }),
        });
      }

      // 4. The line down the left edge draws with the scroll. Each section's piece runs
      // from its top to its bottom as they pass the pen. The last piece ends at the
      // bottom of the page, so the line always finishes. Each stop appears as the line
      // reaches it.
      for (const stop of document.querySelectorAll<HTMLElement>("[data-line]")) {
        const section = stop.closest("section") ?? stop;
        const stopTop = Number.parseFloat(getComputedStyle(stop, "::after").top) || 0;
        let shown = true;
        const showStop = (on: boolean) => {
          if (on === shown) return;
          shown = on;
          gsap.to(stop, { "--stop-draw": on ? 1 : 0, duration: base, ease });
        };
        gsap.set(stop, { "--line-draw": 0, "--stop-draw": 0 });
        shown = false;
        gsap.to(stop, {
          "--line-draw": 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: `top ${PEN}`,
            end: `clamp(bottom ${PEN})`,
            scrub: true,
            onUpdate: (self) => showStop(self.progress * stop.offsetHeight >= stopTop),
            onRefresh: (self) => showStop(self.progress * stop.offsetHeight >= stopTop),
          },
        });
      }

      // 5. A small parallax on the hero mark only: it drifts down a little as the hero
      // scrolls away. A transform, so nothing else moves.
      const drift = document.querySelector<HTMLElement>("[data-parallax]");
      if (drift) {
        gsap.to(drift, {
          y: DRIFT_PX,
          ease: "none",
          scrollTrigger: {
            trigger: drift.closest("section") ?? drift,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 6. FAQ items open and close smoothly. Native details elements throughout.
      for (const details of document.querySelectorAll<HTMLDetailsElement>("details[data-faq]")) {
        cleanups.push(bindFaq(details, base, ease));
      }

      return () => {
        cancelled = true;
        for (const cleanup of cleanups) cleanup();
      };
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}
