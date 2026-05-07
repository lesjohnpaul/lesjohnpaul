"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  showIndicators?: boolean;
  sizes?: string;
  priority?: boolean;
};

export function ProjectImageCarousel({
  images,
  alt,
  intervalMs = 3500,
  className,
  showIndicators = true,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={cn("absolute inset-0", className)}>
      {images.map((src, i) => (
        <div
          key={src + i}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority && i === 0}
            className="object-cover"
          />
        </div>
      ))}

      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
