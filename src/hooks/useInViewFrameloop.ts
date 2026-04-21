"use client";

// useInViewFrameloop — returns a ref and a React Three Fiber `frameloop`
// value ("always" | "never") driven by an IntersectionObserver on the ref.
//
// The point: three separate <Canvas> components on the same page each run
// their own useFrame loop at 60fps. When a canvas is scrolled off-screen,
// that work is pure waste. Passing `frameloop="never"` to Canvas pauses the
// render loop entirely — no useFrame ticks, no shader work, nothing.
//
// This is the single biggest perf lever the portfolio has, because the
// three canvases are visually disjoint (hero vs pandora vs credentials)
// and at any given moment only one of them is on screen.

import { useEffect, useRef, useState } from "react";

type Frameloop = "always" | "never";

export function useInViewFrameloop<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): {
  ref: React.RefObject<T | null>;
  frameloop: Frameloop;
  inView: boolean;
} {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Mild rootMargin gives the canvas a head start on resume so the first
    // visible frame already has a tick's worth of updates.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "120px 0px 120px 0px",
        ...options,
      }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, frameloop: inView ? "always" : "never", inView };
}
