"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

interface TextScrambleProps {
  children: string;
  className?: string;
  trigger?: "hover" | "mount" | "inView";
  speed?: number;
}

const chars = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function TextScramble({
  children,
  className = "",
  trigger = "hover",
  speed = 30,
}: TextScrambleProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = children;

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            if (letter === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
        setIsScrambling(false);
        setDisplayText(originalText);
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    if (trigger === "mount") {
      scramble();
    }
  }, []);

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      scramble();
    }
  };

  return (
    <span
      ref={elementRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      data-cursor-hover
    >
      {displayText}
    </span>
  );
}
