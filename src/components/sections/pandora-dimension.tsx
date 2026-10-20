"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import nextDynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Music, Palette, Rocket, Workflow, X } from "lucide-react";
import { exhibitDetails, hiddenTalents } from "@/data/portfolio-data";

const WarpCanvas = nextDynamic(() => import("@/components/three/warp-canvas"), { ssr: false });

const iconMap = { Music, Palette, Rocket, Workflow };

export function PandoraDimension({
  onClose,
  reducedMotion,
}: {
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    if (reducedMotion) return onClose();
    setLeaving(true);
    setTimeout(onClose, 450);
  }, [onClose, reducedMotion]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setActive((i) => (i + 1) % hiddenTalents.length);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + hiddenTalents.length) % hiddenTalents.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus({ preventScroll: true });
    };
  }, [close]);

  const talent = hiddenTalents[active];
  const details = exhibitDetails[talent.category];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Inside Pandora's box"
      data-leaving={leaving || undefined}
      className="pd-root fixed inset-0 z-[100] overflow-y-auto bg-[#08060f] text-white"
    >
      {/* nebula wash behind the warp field */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(124,58,237,0.28), transparent 70%), radial-gradient(40% 35% at 70% 70%, rgba(212,175,55,0.12), transparent 70%)",
        }}
      />
      {!reducedMotion && (
        <div aria-hidden className="pd-warp pointer-events-none fixed inset-0">
          <WarpCanvas />
        </div>
      )}
      {!reducedMotion && <div aria-hidden className="pd-flash pointer-events-none fixed inset-0" />}

      <div className="pd-content relative mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 sm:px-8 md:py-10">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="font-display text-lg font-semibold text-[#c4b5fd]">Pandora&apos;s box</p>
            <p className="mt-1 max-w-sm text-sm text-zinc-400">
              What I do when the terminal is closed.
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#c4b5fd]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
          >
            <X className="h-4 w-4" aria-hidden />
            Close the box
          </button>
        </header>

        <div className="mt-8 grid flex-1 gap-8 md:mt-14 md:grid-cols-[220px_1fr] md:gap-14">
          {/* chapter list: horizontal scroller on mobile, rail on desktop */}
          <nav aria-label="Exhibits" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
            <ul className="flex gap-2 md:flex-col md:gap-1">
              {hiddenTalents.map((t, i) => {
                const Icon = iconMap[t.icon as keyof typeof iconMap] ?? Music;
                const isActive = i === active;
                return (
                  <li key={t.category}>
                    <button
                      onClick={() => setActive(i)}
                      aria-current={isActive || undefined}
                      className={`flex w-full items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-left text-sm transition-colors md:rounded-none md:border-l-2 md:px-4 md:py-3 focus-visible:outline-2 focus-visible:outline-[#c4b5fd] ${
                        isActive
                          ? "bg-white/10 text-white md:border-[#f5d476] md:bg-transparent"
                          : "text-zinc-400 hover:text-zinc-100 md:border-white/10"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-[#f5d476]" : ""}`} aria-hidden />
                      {t.category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <article key={talent.category} className="pd-exhibit grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
                {details?.headline ?? talent.category}
              </h2>
              <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-zinc-300">
                {details?.description ?? talent.description}
              </p>

              {details && (
                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                  {details.showcase.map((s) => (
                    <div key={s.label}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="font-display text-2xl font-semibold text-[#f5d476] sm:text-4xl">{s.value}</dd>
                      <dd className="mt-1 text-xs leading-snug text-zinc-400 sm:text-sm">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <ul className="mt-6 flex flex-wrap gap-2">
                {(details?.tools ?? talent.skills).map((tool) => (
                  <li key={tool} className="rounded-full border border-[#a78bfa]/30 px-3 py-1 text-xs text-zinc-200">
                    {tool}
                  </li>
                ))}
              </ul>

              {details?.genres && (
                <p className="mt-6 text-sm text-zinc-400">
                  Plays across {details.genres.join(", ")}.
                </p>
              )}
            </div>

            <aside className="flex flex-col gap-6">
              {details?.image && (
                <figure className="overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={details.image}
                    alt={details.imageAlt ?? ""}
                    width={600}
                    height={750}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  {details.imageCaption && (
                    <figcaption className="px-4 py-3 text-xs text-zinc-400">{details.imageCaption}</figcaption>
                  )}
                </figure>
              )}
              {details?.quote && (
                <blockquote className="border-l-2 border-[#a78bfa]/60 pl-4 font-display text-xl leading-snug text-[#ede4ff]">
                  {details.quote}
                </blockquote>
              )}
            </aside>
          </article>
        </div>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-400">
          <span>Use the arrow keys to move between exhibits.</span>
          <Link href="/pandora" className="text-[#c4b5fd] underline-offset-4 hover:text-white hover:underline">
            Walk the full exhibition
          </Link>
        </footer>
      </div>
    </div>,
    document.body
  );
}
