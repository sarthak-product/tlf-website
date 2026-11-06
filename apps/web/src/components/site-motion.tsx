"use client";

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { cubicBezier, parseCubicBezier, parseDuration } from "@/lib/ease";

// All motion on the site, in one client component that renders nothing.
//
// The server HTML is the final state: every word, shape and mark is there and visible, and
// no CSS hides anything. This script runs in the browser only, after the page is on screen,
// and sets each start state itself just before it animates. So without JavaScript, or for
// a crawler, the page is complete and still.
//
// Everything sits inside gsap.matchMedia. A visitor who prefers reduced motion gets none of
// it and sees the final state. The desktop moments (smooth scrolling, the pinned
// principles, the scrubbed marquee, words and shapes) run only from 1024px wide.
//
// What it does, found by data attributes the server components set:
//   everywhere
//     [data-mark] path      the three strokes of the mark draw one after another, once
//     [data-split]          headings rise line by line out of a mask, then the split is undone
//     [data-reveal]         blocks fade and rise (or slide in from their side) as they enter
//     [data-draw] path      shapes draw once as they enter (below 1024px)
//     [data-parallax]       the hero mark drifts a little slower than the page
//     [data-faq]            native details elements ease open and closed
//   from 1024px
//     [data-smooth-*]       ScrollSmoother eases the scroll
//     [data-pin]            the principles are held while they step through, scrubbed
//     [data-draw] path      shapes draw with the scroll (scrubbed)
//     [data-words]          the firm statement fills word by word with the scroll
//     [data-marquee-track]  the marquee slides sideways only while the page scrolls
//
// Nothing loops, nothing follows the cursor, and nothing moves while the reader is still.

const REDUCE_OFF = "(prefers-reduced-motion: no-preference)";
const WIDE = "(min-width: 64rem)";
// Where the zig-zag puts text and shapes on alternate sides (page.module.css).
const TWO_COLUMNS = "(min-width: 48rem)";

// If the script starts this long after navigation, the visitor has already read what is
// on screen. Hiding it again to animate it would be worse than no motion, so anything
// already in view is left as it is.
const LATE_MS = 2000;

// Distances, from the spacing scale: space-4 rise, space-7 slide, space-5 parallax drift.
const RISE_PX = 16;
const SLIDE_PX = 48;
const DRIFT_PX = 24;

const REVEAL_START = "top 90%";

// Set when the header mark has drawn once, so moving between pages does not redraw it.
let headerDrawn = false;

type Ease = gsap.EaseFunction | string;

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

// Hides each stroke behind its own dash, so it can be drawn from its start. The gap is
// longer than the stroke and the offset one unit past it, so no round cap shows as a dot
// before its stroke starts.
function hideStrokes(paths: SVGPathElement[]) {
  for (const path of paths) {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: `${length} ${length * 2}`, strokeDashoffset: length + 1 });
  }
}

// Draws strokes one after another into a timeline. When `clear` is set, the dash styles
// are removed at the end so the drawing is exactly the server SVG again.
function drawStrokes(
  paths: SVGPathElement[],
  each: number,
  ease: Ease,
  clear: boolean,
  onDone?: () => void,
) {
  hideStrokes(paths);
  const timeline = gsap.timeline({
    onComplete: () => {
      if (clear) gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
      onDone?.();
    },
  });
  for (const path of paths) {
    timeline.to(path, { strokeDashoffset: 0, duration: each, ease });
  }
  return timeline;
}

function strokesOf(element: Element) {
  return Array.from(element.querySelectorAll<SVGPathElement>("path"));
}

// Splits a heading into lines, lifts each out of its own mask in turn, then puts the
// original text back. While split, SplitText labels the heading with its full text and
// hides the line wrappers from assistive technology, so a screen reader reads it the same.
function revealLines(heading: HTMLElement, duration: number, ease: Ease) {
  const split = SplitText.create(heading, { type: "lines", mask: "lines", aria: "auto" });
  gsap.set(heading, { opacity: 1 });
  return gsap.from(split.lines, {
    yPercent: 100,
    duration: duration * 1.5,
    ease,
    stagger: duration / 4,
    onComplete: () => split.revert(),
  });
}

// Which way a block slides in: zig-zag text comes in from its own side once the layout is
// two columns, anything else rises.
function entranceFrom(block: HTMLElement, twoColumns: boolean) {
  const zig = block.closest<HTMLElement>("[data-zig]")?.dataset.zig;
  if (!zig || !twoColumns) return { x: 0, y: RISE_PX };
  return { x: zig === "end" ? SLIDE_PX : -SLIDE_PX, y: 0 };
}

// Eases a native details element open or closed. The browser still owns the open state,
// keyboard use and find in page; this only animates the height between the two states.
function bindFaq(details: HTMLDetailsElement, duration: number, ease: Ease) {
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

// Desktop only: holds the principles section while its items step through in one place.
// The list is stacked by CSS only while data-pinned is set, so phones, reduced motion and
// no JavaScript keep the plain zig-zag. Every item stays in the accessibility tree
// (opacity only, never visibility), so a screen reader reads all three.
function pinPrinciples(list: HTMLElement, ease: Ease) {
  const section = list.closest("section");
  const steps = Array.from(list.querySelectorAll<HTMLElement>(":scope > [data-step]"));
  if (!section || steps.length < 2) return () => {};

  list.setAttribute("data-pinned", "");
  // While held, the section fills the screen, so the pale field is the only colour in view.
  gsap.set(section, {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  });
  const shapes = steps.map((step) => strokesOf(step.querySelector("[data-draw]") ?? step));
  for (const paths of shapes) hideStrokes(paths);
  gsap.set(steps.slice(1), { opacity: 0, y: RISE_PX * 2 });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () => `+=${steps.length * window.innerHeight * 0.8}`,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  steps.forEach((step, index) => {
    const paths = shapes[index] ?? [];
    if (index > 0) {
      const previous = steps[index - 1];
      if (previous) timeline.to(previous, { opacity: 0, y: -RISE_PX * 2, duration: 0.5 });
      timeline.to(step, { opacity: 1, y: 0, duration: 0.5, ease }, "<0.25");
    }
    for (const path of paths)
      timeline.to(path, { strokeDashoffset: 0, duration: 1 / paths.length });
    // A short hold, so each principle can be read before the next arrives.
    timeline.to({}, { duration: 0.5 });
  });

  return () => {
    list.removeAttribute("data-pinned");
    gsap.set(section, { clearProps: "minHeight,display,flexDirection,justifyContent" });
  };
}

// Desktop only: the firm statement fills from muted to full text colour word by word as
// it passes. Each word mixes the two theme colours by --fill, so the colours stay right if
// the theme changes, and every step between them keeps the contrast of the muted text.
function fillWords(block: HTMLElement) {
  const split = SplitText.create(block, { type: "words", aria: "auto" });
  for (const word of split.words) {
    (word as HTMLElement).style.color =
      "color-mix(in srgb, var(--color-text) calc(var(--fill, 1) * 100%), var(--color-text-muted))";
  }
  gsap.fromTo(
    split.words,
    { "--fill": 0 },
    {
      "--fill": 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: block, start: "top 80%", end: "bottom 45%", scrub: true },
    },
  );
  return () => split.revert();
}

export function SiteMotion() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run again on each page change, the DOM is new.
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
    const mm = gsap.matchMedia();

    mm.add({ allowed: REDUCE_OFF, wide: WIDE }, (context) => {
      const { allowed, wide } = context.conditions ?? {};
      if (!allowed) return;

      const { ease, base } = readMotionTokens();
      const entrance = base * 2;
      const late = performance.now() > LATE_MS;
      const twoColumns = window.matchMedia(TWO_COLUMNS).matches;
      const cleanups: Array<() => void> = [];
      let cancelled = false;

      // 0. Smooth scrolling, desktop only. Created first, so every ScrollTrigger below
      // follows it. Touch scrolling is never smoothed.
      const wrapper = document.querySelector<HTMLElement>("[data-smooth-wrapper]");
      const content = document.querySelector<HTMLElement>("[data-smooth-content]");
      if (wide && wrapper && content) {
        const smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1,
          effects: false,
          smoothTouch: false,
        });
        cleanups.push(() => smoother.kill());
      }

      // 1. The mark: header once per visit, hero on each load of the page.
      const header = document.querySelector<SVGSVGElement>('svg[data-mark="header"]');
      if (header && !headerDrawn && !late) {
        drawStrokes(strokesOf(header), entrance, ease, true, () => {
          headerDrawn = true;
        });
      }
      // The hero mark can sit below the fold on a short screen, so it draws as it enters.
      const heroMark = document.querySelector<SVGSVGElement>('svg[data-mark="hero"]');
      if (heroMark && !(late && inView(heroMark))) {
        const paths = strokesOf(heroMark);
        hideStrokes(paths);
        ScrollTrigger.create({
          trigger: heroMark,
          start: REVEAL_START,
          once: true,
          onEnter: () => {
            context.add(() => drawStrokes(paths, entrance, ease, true));
          },
        });
      }

      // 2. Desktop moments: the pinned principles, the statement words, the marquee.
      const pinned = wide ? document.querySelector<HTMLElement>("[data-pin]") : null;
      if (pinned) cleanups.push(pinPrinciples(pinned, ease));

      const words = document.querySelector<HTMLElement>("[data-words]");
      if (words && wide) cleanups.push(fillWords(words));

      const band = document.querySelector<HTMLElement>("[data-marquee]");
      const track = band?.querySelector<HTMLElement>("[data-marquee-track]");
      if (band && track && wide) {
        // One of the four copies across the time the band takes to cross the screen.
        gsap.fromTo(
          track,
          { xPercent: 0 },
          {
            xPercent: -25,
            ease: "none",
            scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      // 3. Shapes. With the scroll on desktop, once as they enter on smaller screens. The
      // pinned principles draw their own.
      for (const holder of document.querySelectorAll<HTMLElement>("[data-draw]")) {
        if (pinned?.contains(holder)) continue;
        if (late && inView(holder)) continue;
        const paths = strokesOf(holder);
        if (wide) {
          const timeline = drawStrokes(paths, 1, "none", false);
          ScrollTrigger.create({
            trigger: holder.closest("[data-zig]") ?? holder,
            start: "top 85%",
            end: "center 50%",
            scrub: true,
            animation: timeline,
          });
        } else {
          hideStrokes(paths);
          ScrollTrigger.create({
            trigger: holder,
            start: REVEAL_START,
            once: true,
            onEnter: () => {
              context.add(() => drawStrokes(paths, entrance, ease, true));
            },
          });
        }
      }

      // 4. Headings, line by line. Each waits until it enters, and until the fonts are in,
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

      // 5. Blocks enter in small batches, so items that enter together follow one another.
      // The statement joins them below 1024px; the pinned principles step on their own.
      const blockList = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (words && !wide) blockList.push(words);
      const blocks = blockList.filter(
        (block) => !(late && inView(block)) && !pinned?.contains(block),
      );
      if (blocks.length > 0) {
        for (const block of blocks) {
          gsap.set(block, { opacity: 0, ...entranceFrom(block, twoColumns) });
        }
        ScrollTrigger.batch(blocks, {
          start: REVEAL_START,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              x: 0,
              y: 0,
              duration: entrance,
              ease,
              stagger: base / 2,
              clearProps: "opacity,transform",
            }),
        });
      }

      // 6. A small parallax on the hero mark only: it drifts down a little as the hero
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

      // 7. FAQ items open and close smoothly. Native details elements throughout.
      for (const details of document.querySelectorAll<HTMLDetailsElement>("details[data-faq]")) {
        cleanups.push(bindFaq(details, base, ease));
      }

      // Fonts can change line breaks and heights after start, so measure again once.
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        for (const cleanup of cleanups.reverse()) cleanup();
      };
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}
