"use client";

import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, RotateCcw } from "lucide-react";
import { track } from "@vercel/analytics";
import type { ProofItem } from "@/lib/studio/proof";
import { detectTier, type Tier } from "@/lib/studio/quality";
import type { Prototype, Screen, StudioRequest } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import { BookingPanel } from "./booking-panel";
import { DiscoveryForm } from "./discovery-form";
import { EmailCapture } from "./email-capture";
import { HowItsBuilt } from "./how-its-built";
import { BuildMagic, PrototypeView } from "./prototype-view";
import { ProofPanels } from "./proof-panels";
import { useBuild } from "./use-build";
import s from "./studio.module.css";

const StudioScene = dynamic(() => import("./scene/studio-scene"), { ssr: false });

/** A failed chunk/GLB/WebGL load drops the scene; onReady never fires, so the poster backdrop simply stays. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[studio] scene failed", error instanceof Error ? error.name : typeof error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** True once the page has loaded and the main thread is idle, so the three.js chunk never competes with first paint. */
function useAfterFirstPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let cancel = () => {};
    const go = () => {
      if (cancelled) return;
      setReady(true);
    };
    const idle = () => {
      if (typeof window.requestIdleCallback === "function") {
        const h = window.requestIdleCallback(go, { timeout: 1500 });
        cancel = () => window.cancelIdleCallback(h);
      } else {
        const h = setTimeout(go, 600);
        cancel = () => clearTimeout(h);
      }
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    const cap = setTimeout(go, 5000); // upper bound if `load` never fires
    return () => {
      cancelled = true;
      clearTimeout(cap);
      window.removeEventListener("load", idle);
      cancel();
    };
  }, []);
  return ready;
}

// Stand-in for a screen still on its way; PrototypeView only reads its type for the tab icon until it's revealed.
const PENDING = { type: "dashboard" } as Screen;

// The GPU probe runs once per page load; the server (and first hydration pass) renders the poster.
let tierCache: Tier | undefined;
const clientTier = () => (tierCache ??= detectTier());
const noSubscribe = () => () => {};

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/**
 * Backdrop behind the page. Static tier: the cinematic loop for good (poster only under reduced motion). Lite/full: the
 * poster alone (no video download for a few seconds of loading), cross-faded away once the 3D scene has drawn.
 */
function LoopBackdrop({ live, video }: { live: boolean; video: boolean }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => true);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setGone(true), 450); // after the 400 ms fade: unmount so the video stops downloading/decoding
    return () => clearTimeout(t);
  }, [live]);
  if (gone) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-[400ms]"
      style={{ backgroundImage: "url(/studio/loop.jpg)", opacity: live ? 0 : 1 }}
    >
      {video && !reduced && <video className="size-full object-cover" playsInline autoPlay muted loop preload="metadata" poster="/studio/loop.jpg" src="/studio/loop.mp4" />}
    </div>
  );
}

const smooth = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

export function StudioExperience({ proof }: { proof: ProofItem[] }) {
  const b = useBuild();
  const tier = useSyncExternalStore(noSubscribe, clientTier, () => null);
  const [last, setLast] = useState<StudioRequest>();
  const [sceneReady, setSceneReady] = useState(false);
  /** The GPU context was lost mid-visit: the scene is dropped for this page load and the loop backdrop takes over. */
  const [sceneLost, setSceneLost] = useState(false);
  const onSceneLost = useCallback(() => setSceneLost(true), []);
  const [traceOpen, setTraceOpen] = useState(false);
  /** Set when Escape closed the panel: keyboard actions don't animate. */
  const [traceInstant, setTraceInstant] = useState(false);
  const traceToggle = useRef<HTMLButtonElement>(null);
  const afterPaint = useAfterFirstPaint();
  const top = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const proofHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    track("studio_open");
  }, []);

  // Escape closes the trace panel and hands focus back to its toggle, unless the user is typing in a field outside the panel.
  useEffect(() => {
    if (!traceOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const a = document.activeElement;
      const inPanel = !!a && (a === traceToggle.current || !!a.closest("#how-its-built"));
      if (!inPanel && a?.matches("input, textarea, select, [contenteditable]")) return;
      setTraceInstant(true);
      setTraceOpen(false);
      traceToggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [traceOpen]);

  // Keyboard and screen-reader users land on the result when a build starts and again when it finishes.
  useEffect(() => {
    if (b.status === "building" || b.status === "done" || b.status === "fallback") heading.current?.focus({ preventScroll: true });
  }, [b.status]);

  const busy = b.status === "building";
  const finished = b.status === "done" || b.status === "fallback";
  const showResult = busy || finished;
  const phase = finished ? "done" : busy ? "building" : "hello";

  function build(r: StudioRequest) {
    setLast(r);
    setTraceOpen(false);
    b.start(r);
    top.current?.scrollIntoView({ behavior: smooth(), block: "start" });
  }

  function again() {
    setTraceOpen(false);
    b.reset();
    top.current?.scrollIntoView({ behavior: smooth(), block: "start" });
  }

  function book() {
    track("book_clicked");
    document.getElementById("book")?.scrollIntoView({ behavior: smooth(), block: "start" });
  }

  const proto: Prototype | null = b.spec
    ? { ...b.spec, screens: [0, 1, 2].map((i) => b.screens[i] ?? PENDING) as Prototype["screens"] }
    : null;

  const status = busy
    ? b.spec
      ? `Building screen ${Math.min(b.screens.length + 1, 3)} of 3…`
      : "Reading your business…"
    : b.status === "done"
      ? "Your prototype is ready. Tap through the screens."
      : b.status === "fallback"
        ? "Showing an example prototype."
        : "";

  return (
    <main className={cn(s.root, "min-h-dvh overflow-x-clip bg-[#0a0c13]")}>
      {/* Backdrop: the 3D scene on capable devices, a still poster otherwise (and until the tier is known). */}
      <div aria-hidden className={cn(s.poster, "fixed inset-0")}>
        {afterPaint && tier && tier !== "static" && !sceneLost && (
          <SceneBoundary>
            <StudioScene
              tier={tier}
              phase={phase}
              screensReady={finished ? 3 : b.screens.length}
              screenTypes={b.screens.map((x) => x.type)}
              onReady={() => setSceneReady(true)}
              onLost={onSceneLost}
            />
          </SceneBoundary>
        )}
        {/* Keyed so a lost scene gets a fresh backdrop: the faded-out one has already unmounted itself. */}
        <LoopBackdrop key={sceneLost ? "lost" : "live"} live={tier !== null && tier !== "static" && sceneReady && !sceneLost} video={tier === "static" || sceneLost} />
      </div>

      <div className="relative">
        <header className={cn(s.shift, showResult && traceOpen && s.shifted, "mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-6")}>
          <Link href="/" className="flex min-h-11 items-center text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
            Les John Paul Oliver
          </Link>
          <a
            href="#book"
            onClick={() => track("book_clicked")}
            className={cn(s.press, "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-[var(--muted)] backdrop-blur-md hover:text-[var(--ink)]")}
          >
            <CalendarDays className="size-3.5" aria-hidden />
            Book a call
          </a>
        </header>

        {/* Mounted from the start so its first message ("Reading your business…") is announced. */}
        <p role="status" className="sr-only">
          {status}
        </p>

        <section ref={top} aria-labelledby="studio-title" className={cn(s.shift, showResult && traceOpen && s.shifted, "mx-auto max-w-3xl scroll-mt-4 px-4 pb-16 pt-8 sm:px-6 sm:pt-14")}>
          {!showResult ? (
            <div className={s.enterIn}>
              <div className="mb-5 flex items-center gap-3">
                <Image
                  src="/images/pao/pao-avatar.webp"
                  alt=""
                  width={44}
                  height={44}
                  priority
                  className="size-11 shrink-0 rounded-full bg-[#dcdcdc] object-cover ring-2 ring-[var(--gold)]/50"
                />
                <p className="text-sm leading-tight">
                  <span className="block font-medium">Pao</span>
                  <span className={s.faint}>Les&apos;s AI assistant</span>
                </p>
                <span className={cn(s.pill, s.pillGold, "ml-auto")}>Studio</span>
              </div>
              <h1 id="studio-title" className={cn(s.display, "mb-6 text-balance text-[1.75rem] font-medium leading-[1.15] sm:mb-8 sm:text-[2.75rem]")}>
                Tell me about your business in one line. I&apos;ll build you a working prototype while you watch.
              </h1>
              <DiscoveryForm initial={last} autoFocus={last !== undefined} error={b.status === "error" ? b.error : undefined} onSubmit={build} />
              <a
                href="#proof"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("proof")?.scrollIntoView({ behavior: smooth(), block: "start" });
                  proofHeading.current?.focus({ preventScroll: true });
                }}
                className="mt-4 inline-flex min-h-11 items-center text-[0.9375rem] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                See systems Les has already shipped ↓
              </a>
            </div>
          ) : (
            <div className="grid gap-5">
              <h1 id="studio-title" ref={heading} tabIndex={-1} className="sr-only">
                {b.status === "fallback" ? "Example prototype" : "Your prototype"}
              </h1>

              {b.status === "fallback" ? (
                <p className={cn(s.selected, s.enter, "rounded-xl border px-4 py-3 text-[0.9375rem] leading-relaxed backdrop-blur-md")}>
                  {b.fallbackLabel}
                </p>
              ) : (
                <div className="min-h-[4.5rem]">
                  <p className={s.eyebrow}>Your prototype</p>
                  {b.spec ? (
                    <div className={s.swap}>
                      <p className={cn(s.display, "mt-1.5 text-2xl font-medium sm:text-3xl")}>{b.spec.business}</p>
                      <p className={cn(s.muted, "mt-1.5 text-[0.9375rem] leading-relaxed sm:text-base")}>{b.spec.spec}</p>
                    </div>
                  ) : (
                    <div className="mt-2 grid gap-2" aria-hidden>
                      <div className={cn(s.shimmer, "h-7 w-56 rounded-md")} />
                      <div className={cn(s.shimmer, "h-4 w-full max-w-md rounded")} />
                    </div>
                  )}
                </div>
              )}

              <div className="-my-3 flex items-center justify-between gap-3">
                <p key={status} aria-hidden className={cn(s.muted, s.swap, "flex min-h-5 items-center gap-2 text-sm")}>
                  {busy && <span className={cn(s.dot, "animate-pulse text-[var(--gold)]")} aria-hidden />}
                  {status}
                </p>
                {/* For recruiters; off by default and absent in hello, so business owners never meet it. */}
                <button
                  ref={traceToggle}
                  type="button"
                  aria-expanded={traceOpen}
                  aria-controls="how-its-built"
                  onClick={() => {
                    if (!traceOpen) track("trace_opened");
                    setTraceInstant(false);
                    setTraceOpen(!traceOpen);
                  }}
                  className="inline-flex min-h-11 shrink-0 items-center"
                >
                  <span className={cn(s.pill, s.press, traceOpen ? s.pillGold : "hover:text-[var(--ink)]")}>How it&apos;s built</span>
                </button>
              </div>

              {proto ? (
                <PrototypeView prototype={proto} building={busy} revealed={b.status === "fallback" ? 3 : b.screens.length} />
              ) : (
                <div className={cn(s.glass, "grid gap-3 overflow-hidden rounded-2xl p-4 sm:p-5")} aria-hidden>
                  <BuildMagic />
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={cn(s.shimmer, "h-9 rounded-lg")} />
                    ))}
                  </div>
                  <div className={cn(s.shimmer, "h-6 w-40 rounded-md")} />
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={cn(s.shimmer, "h-20 rounded-xl")} />
                    ))}
                  </div>
                  <div className={cn(s.shimmer, "h-48 rounded-xl")} />
                </div>
              )}

              {finished && (
                <div className={cn(s.enter, "grid gap-3")}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={book}
                      className={cn(s.press, s.primary, "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base")}
                    >
                      <CalendarDays className="size-4" aria-hidden />
                      Book a discovery call about this
                    </button>
                    {b.buildId && <EmailCapture key={b.buildId} buildId={b.buildId} />}
                  </div>
                  <button
                    type="button"
                    onClick={again}
                    className={cn(s.press, "inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-1 text-[0.9375rem] text-[var(--muted)] hover:text-[var(--ink)]")}
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Build another
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Outside the shifted sections: a transformed ancestor would pin the fixed side panel to it. */}
        {showResult && (
          <div id="how-its-built" className={cn(s.trace, traceOpen && s.traceOpen)} data-instant={traceInstant || undefined} inert={!traceOpen}>
            {/* From 80rem this is the panel's scroll box: focusable so keyboard users can scroll it. */}
            <div tabIndex={0} role="region" aria-label="Build trace">
              <div className="pb-16 xl:pb-0">
                <HowItsBuilt trace={b.trace} status={b.status} />
              </div>
            </div>
          </div>
        )}

        <section id="proof" aria-labelledby="proof-title" className={cn(s.shift, showResult && traceOpen && s.shifted, "mx-auto max-w-3xl scroll-mt-4 px-4 pb-16 sm:px-6")}>
          <p className={s.eyebrow}>Proof</p>
          <h2 id="proof-title" ref={proofHeading} tabIndex={-1} className={cn(s.display, "mt-1.5 text-2xl font-medium sm:text-3xl")}>
            Systems Les has already shipped
          </h2>
          <p className={cn(s.muted, "mb-5 mt-1.5 text-[0.9375rem] leading-relaxed sm:text-base")}>Real projects, real screens. Tap one for the full story.</p>
          <ProofPanels items={proof} />
        </section>

        <section id="book" aria-label="Book a discovery call" className={cn(s.shift, showResult && traceOpen && s.shifted, "mx-auto max-w-3xl scroll-mt-4 px-4 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-6")}>
          <BookingPanel buildId={b.buildId} />
        </section>
      </div>
    </main>
  );
}
