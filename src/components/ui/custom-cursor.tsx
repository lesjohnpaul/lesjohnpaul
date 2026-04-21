"use client";

// Custom cursor — visual behavior matches the original (ring + dot, lerped,
// grows on hoverable elements, pinches on click). Internal implementation
// rewritten for performance:
//  - One mousemove listener, writes to refs only (no DOM work per-event)
//  - Single rAF loop owns ALL DOM writes via direct style.transform updates
//  - Hover hit-test throttled to once per frame with last-result caching,
//    so gsap.to() only fires when the variant actually changes
//  - rAF + listeners cleaned up on unmount

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const HOVER_SELECTOR =
  "a, button, [data-cursor-hover], [data-cursor-magnetic]";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] =
    useState<"default" | "hover" | "click">("default");

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let lastMouseX = -1;
    let lastMouseY = -1;
    let lastHover = false;
    let rafId = 0;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
      start(); // wake the loop on any movement
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => {
      setIsVisible(true);
      start();
    };

    const onDown = () => {
      setCursorVariant("click");
      gsap.to(cursor, { scale: 0.9, duration: 0.15, ease: "power2.out" });
      start();
    };
    const onUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: "power2.out" });
      start();
    };

    const tick = () => {
      // Ring lerps for soft trailing; dot tracks more tightly.
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;

      cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

      // Hit-test ONLY when the pointer actually moved since the last frame.
      // Stationary cursors don't need a new elementFromPoint probe.
      if (mouseX !== lastMouseX || mouseY !== lastMouseY) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        const under = document.elementFromPoint(
          mouseX,
          mouseY
        ) as HTMLElement | null;
        const hoverable = !!under?.closest(HOVER_SELECTOR);
        if (hoverable !== lastHover) {
          lastHover = hoverable;
          setCursorVariant(hoverable ? "hover" : "default");
          gsap.to(cursor, {
            width: hoverable ? 48 : 32,
            height: hoverable ? 48 : 32,
            duration: 0.25,
            ease: "power2.out",
          });
        }
      }

      // If the lerp has converged AND the mouse is still, stop the loop.
      // onMove will restart it — zero frames while idle.
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const settled = dx * dx + dy * dy < 0.25; // < 0.5px from target
      if (settled) {
        running = false;
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        running = false;
      } else {
        start();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      cancelAnimationFrame(rafId);
      running = false;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[var(--z-cursor)] mix-blend-difference transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: 32, height: 32, willChange: "transform" }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-200 ${
            cursorVariant === "hover"
              ? "border-white/80 bg-white/5"
              : "border-white/50"
          }`}
        />
      </div>

      {/* Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[var(--z-cursor)] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
            cursorVariant === "hover" ? "bg-white scale-150" : "bg-white"
          }`}
        />
      </div>
    </>
  );
}
