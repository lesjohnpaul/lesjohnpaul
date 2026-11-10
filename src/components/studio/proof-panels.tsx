"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ProofItem } from "@/lib/studio/proof";
import { cn } from "@/lib/utils";
import s from "./studio.module.css";

/** Four shipped systems: a snap carousel on phones (next card peeking), a 2×2 grid from `sm`. */
export function ProofPanels({ items }: { items: ProofItem[] }) {
  // Cards stagger in as the grid scrolls into view. Hidden only once JS runs (data-reveal), so without JS they just show.
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    // Already on screen at hydration: don't hide then re-show (flicker).
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.dataset.reveal = "in";
      return;
    }
    el.dataset.reveal = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={list} role="list" aria-label="Shipped systems" className={cn(s.stagger, s.track, "-mx-4 -mb-4 -mt-1 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-6 pt-1 sm:mx-0 sm:my-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0")}>
      {items.map((p) => (
        <li key={p.slug} className="w-[80vw] shrink-0 snap-start sm:w-auto">
          <Link
            href={p.href}
            onClick={() => track("proof_opened", { slug: p.slug })}
            className={cn(
              s.glass,
              s.card,
              "group flex h-full flex-col overflow-hidden rounded-2xl",
            )}
          >
            <div className="relative aspect-[16/10] border-b border-white/10 bg-black/30">
              <Image
                src={p.image}
                alt={`${p.title}: screenshot`}
                fill
                sizes="(min-width: 640px) 22rem, 80vw"
                loading="lazy"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <h3 className="text-base font-medium leading-snug">{p.title}</h3>
              <p className={cn(s.muted, "line-clamp-2 text-sm leading-relaxed")}>{p.outcome}</p>
              <span className="mt-auto pt-1 text-sm text-[var(--gold)]">Read the case study <span aria-hidden>→</span></span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
