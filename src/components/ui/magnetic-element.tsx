"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticElement({
  children,
  className = "",
  strength = 0.3,
}: MagneticElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Reduced movement for more subtle, corporate feel
      const deltaX = (e.clientX - centerX) * strength * 0.3;
      const deltaY = (e.clientY - centerY) * strength * 0.3;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      // Smooth, sweet return to base position
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(0.4, 0.3)",
        overwrite: "auto",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div
      ref={elementRef}
      className={className}
      data-cursor-magnetic
    >
      {children}
    </div>
  );
}
