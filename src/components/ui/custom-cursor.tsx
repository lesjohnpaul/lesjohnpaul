"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "click">("default");

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Dot follows immediately
      gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth cursor following
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;

      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
      });

      requestAnimationFrame(animateCursor);
    };

    // Handle hover states - simplified for corporate look
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for interactive elements
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.closest("[data-cursor-magnetic]")
      ) {
        setCursorVariant("hover");
        gsap.to(cursor, {
          width: 48,
          height: 48,
          duration: 0.25,
          ease: "power2.out",
        });
      } else {
        setCursorVariant("default");
        gsap.to(cursor, {
          width: 32,
          height: 32,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    // Handle clicks - subtle scale
    const handleMouseDown = () => {
      setCursorVariant("click");
      gsap.to(cursor, {
        scale: 0.9,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleElementHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    animateCursor();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring - subtle and professional */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 32,
          height: 32,
        }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-200 ${
            cursorVariant === "hover"
              ? "border-white/80 bg-white/5"
              : "border-white/50"
          }`}
        />
      </div>

      {/* Cursor dot - small and precise */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
            cursorVariant === "hover"
              ? "bg-white scale-150"
              : "bg-white"
          }`}
        />
      </div>
    </>
  );
}
