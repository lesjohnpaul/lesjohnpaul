"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom hook for scroll-triggered animations
export function useScrollReveal<T extends HTMLElement>(
  options: {
    threshold?: number;
    duration?: number;
    y?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      threshold = 0.2,
      duration = 0.8,
      y = 60,
      stagger = 0.1,
      delay = 0,
      ease = "power3.out",
    } = options;

    // Check if element has children to animate
    const children = element.querySelectorAll("[data-reveal]");
    const targets = children.length > 0 ? children : element;

    gsap.set(targets, { opacity: 0, y });

    const animation = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return ref;
}

// Custom hook for hero animations
export function useHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state
      gsap.set("[data-hero-title]", { opacity: 0, y: 80, clipPath: "inset(100% 0 0 0)" });
      gsap.set("[data-hero-subtitle]", { opacity: 0, y: 40 });
      gsap.set("[data-hero-text]", { opacity: 0, y: 30 });
      gsap.set("[data-hero-cta]", { opacity: 0, y: 20, scale: 0.9 });
      gsap.set("[data-hero-stat]", { opacity: 0, y: 40, scale: 0.95 });
      gsap.set("[data-hero-image]", { opacity: 0, scale: 1.1, filter: "blur(10px)" });
      gsap.set("[data-hero-badge]", { opacity: 0, x: -20 });
      gsap.set("[data-hero-decoration]", { opacity: 0, scale: 0 });

      // Animation sequence
      timeline.current
        .to("[data-hero-decoration]", { opacity: 0.5, scale: 1, duration: 0.6, stagger: 0.1 }, 0)
        .to("[data-hero-badge]", { opacity: 1, x: 0, duration: 0.5 }, 0.2)
        .to("[data-hero-title]", {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 1,
          stagger: 0.15,
        }, 0.3)
        .to("[data-hero-subtitle]", { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .to("[data-hero-text]", { opacity: 1, y: 0, duration: 0.6 }, 0.8)
        .to("[data-hero-cta]", { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, 1)
        .to("[data-hero-image]", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2 }, 0.4)
        .to("[data-hero-stat]", { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, 1.2);
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return containerRef;
}

// Magnetic button effect
export function useMagneticEffect<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return ref;
}

// Parallax effect
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = gsap.to(element, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [speed]);

  return ref;
}

// Text scramble effect
export function useTextScramble() {
  const scramble = useCallback((element: HTMLElement, finalText: string) => {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    const originalText = finalText;

    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return scramble;
}

// Smooth counter animation
export function useCountUp(end: number, duration: number = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const obj = { value: 0 };

    const animation = gsap.to(obj, {
      value: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        element.innerText = Math.round(obj.value).toString();
      },
    });

    return () => {
      animation.kill();
    };
  }, [end, duration]);

  return ref;
}
