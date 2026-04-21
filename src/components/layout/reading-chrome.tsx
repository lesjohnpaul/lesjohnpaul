"use client";

// Reading chrome — two thin affordances that raise the perceived polish of
// any long-scroll page without touching existing layout:
//
//   1. Skip-to-main link (WCAG 2.4.1) — keyboard-only, slides in on focus.
//   2. Scroll progress bar (gold, 2px, pinned top) — uses rAF + transform
//      only; no layout properties animated, no per-scroll React renders.

import { useEffect, useRef } from "react";

export function ReadingChrome() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let rafId = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const progress = Math.min(scrolled / max, 1);
      // transform instead of width — scaleX on a fixed-100%-width fill is
      // cheaper than animating `width` (no layout thrash).
      fill.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(update);
    };

    // Also handle resize — scrollHeight can change as images load.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip-to-main">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden>
        <div ref={fillRef} className="scroll-progress__fill" />
      </div>
    </>
  );
}
