"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import s from "./case-study.module.css";

const DUR = 6500;

type Kind = "tests" | "security" | "performance" | "deploy" | "data" | "ai" | "reliability";
const KINDS: { kind: Kind; label: string; tone: string; re: RegExp }[] = [
  // Speed evidence wins over "tested" (a load test is a speed claim).
  { kind: "performance", label: "Fast", tone: "var(--t-gold)", re: /\d\s?ms\b|load.test|p95|latenc|concurren|cach|under \d+ ?(?:s|sec|seconds)\b/i },
  { kind: "tests", label: "Tested", tone: "var(--t-green)", re: /\btest|pytest|playwright|matrix|assert|verified/i },
  { kind: "security", label: "Secured", tone: "var(--t-violet)", re: /secur|isolat|\brls\b|row-level|auth|password|encrypt|secret|inject|mtls|privacy|least.privilege|read-only|sanitiz/i },
  { kind: "deploy", label: "Shipped", tone: "var(--t-blue)", re: /\bci\b|deploy|docker|build|release|pipeline|lint|type-check/i },
  { kind: "data", label: "Data-safe", tone: "var(--t-teal)", re: /migrat|schema|backup|replica|ledger|transaction|sync|database|zero.downtime|side by side/i },
  { kind: "ai", label: "AI with guardrails", tone: "var(--t-violet)", re: /claude|llm|\bai\b|prompt|model/i },
  { kind: "reliability", label: "Reliable", tone: "var(--t-orange)", re: /./ },
];
const kindOf = (text: string) => KINDS.find((k) => k.re.test(text))!;

const NUM = /(\d[\d,]*(?:\.\d+)?\s?(?:%|ms|×|x\b|K\b|TB|GB|s\b)?)/;

/** Counts the leading number up from zero when the slide shows; keeps commas, decimals, and units. */
function CountUp({ value, run }: { value: string; run: boolean }) {
  const m = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  const target = m ? parseFloat(m[1].replace(/,/g, "")) : NaN;
  const animate = run && Number.isFinite(target) && target >= 2;
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!animate) return;
    const decimals = m![1].split(".")[1]?.length ?? 0;
    const commas = m![1].includes(",");
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 900);
      const v = target * (1 - Math.pow(1 - k, 3));
      const txt = commas ? Math.round(v).toLocaleString("en-US") : v.toFixed(decimals);
      setShown(txt + m![2]);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={cn("font-semibold", s.num)}>{animate ? shown : value}</span>;
}

function Highlighted({ text, run }: { text: string; run: boolean }) {
  return (
    <>
      {text.split(NUM).map((part, i) => (i % 2 ? <CountUp key={i} value={part} run={run} /> : part))}
    </>
  );
}

const k = (n: number) => ({ "--k": n }) as CSSProperties;

/** One looping CSS illustration per kind of engineering work. */
function Visual({ kind }: { kind: Kind }) {
  const svg = (children: ReactNode) => (
    <svg viewBox="0 0 100 100" className={s.vis} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      {children}
    </svg>
  );
  switch (kind) {
    case "tests":
      return (
        <div className={cn("grid h-full grid-cols-4 gap-1.5", s.vis)} aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={cn("flex items-center justify-center", s.check)} style={k(i)}>
              <Check className="h-4 w-4" />
            </span>
          ))}
        </div>
      );
    case "performance":
      return svg(
        <>
          <path d="M14 52a36 36 0 0 1 72 0" strokeOpacity="0.3" strokeWidth="6" />
          <path d="M62 19a36 36 0 0 1 24 33" strokeWidth="6" />
          <line className={s.needle} x1="50" y1="52" x2="50" y2="22" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="52" r="4" fill="currentColor" />
          {[0, 1, 2].map((i) => (
            <rect key={i} className={s.bar} style={{ ...k(i), "--w": `${1 - i * 0.22}` } as CSSProperties} x="14" y={68 + i * 9} width="72" height="5" fill="currentColor" stroke="none" opacity={1 - i * 0.25} />
          ))}
        </>,
      );
    case "security":
      return svg(
        <>
          <path className={s.ripple} d="M50 12 82 24v24c0 20-14 34-32 40-18-6-32-20-32-40V24Z" strokeOpacity="0.5" />
          <path d="M50 12 82 24v24c0 20-14 34-32 40-18-6-32-20-32-40V24Z" />
          <path d="m38 50 8 8 16-18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <line className={s.scan} x1="22" y1="0" x2="78" y2="0" strokeWidth="1.5" strokeOpacity="0.8" />
        </>,
      );
    case "deploy":
      return (
        <div className={cn("flex h-full items-center", s.vis)} aria-hidden>
          {["lint", "type", "test", "build", "ship"].map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <span className={cn("h-px flex-1", i ? "bg-current opacity-40" : "")} />
                <span className={cn("h-3.5 w-3.5 rounded-full border-2 border-current", s.stageDot)} style={k(i)} />
                <span className={cn("h-px flex-1", i < 4 ? "bg-current opacity-40" : "")} />
              </div>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider opacity-80">{label}</span>
            </div>
          ))}
        </div>
      );
    case "data":
      return svg(
        <>
          <ellipse cx="20" cy="26" rx="12" ry="5" />
          <path d="M8 26v44c0 3 5 5 12 5s12-2 12-5V26" />
          <ellipse cx="80" cy="26" rx="12" ry="5" />
          <path d="M68 26v44c0 3 5 5 12 5s12-2 12-5V26" />
          {[0, 1, 2].map((i) => (
            <rect key={i} className={s.row} style={{ ...k(i), "--hop": "58px" } as CSSProperties} x="12" y={38 + i * 11} width="16" height="6" fill="currentColor" stroke="none" />
          ))}
        </>,
      );
    case "ai":
      return svg(
        <>
          <circle cx="20" cy="50" r="12" />
          <path d="M14 50h12M20 44v12" strokeLinecap="round" />
          <rect x="58" y="30" width="4" height="40" fill="currentColor" stroke="none" />
          <rect x="74" y="38" width="20" height="24" />
          <path d="m78 50 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          {[0, 1, 2].map((i) => (
            <circle key={i} className={s.thought} style={{ ...k(i), "--to": i === 1 ? "36px" : "62px" } as CSSProperties} cx="22" cy={42 + i * 8} r="2.5" fill="currentColor" stroke="none" />
          ))}
        </>,
      );
    default:
      return svg(
        <>
          <g className={s.spin}>
            <path d="M50 18a32 32 0 0 1 30 20" strokeWidth="3" strokeLinecap="round" />
            <path d="m80 26 0 12-12 0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 82a32 32 0 0 1-30-20" strokeWidth="3" strokeLinecap="round" />
            <path d="m20 74 0-12 12 0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <path className={s.beat} d="M24 50h12l5-12 8 24 6-16 4 4h17" strokeWidth="2.5" strokeLinejoin="round" />
        </>,
      );
  }
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Engineering bullets as an autoplaying, pausable slide reel. Reduced motion gets a static list. */
export function EngineeringReel({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false); // hover / focus / manual pause
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCED).matches, () => false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const playing = inView && !hold && !userPaused && !reduced && items.length > 1;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((n) => (n + 1) % items.length), DUR);
    return () => clearTimeout(t);
  }, [playing, i, items.length]);

  if (!items.length) return null;
  const go = (n: number) => setI((n + items.length) % items.length);
  const cur = kindOf(items[i]);

  return (
    <section aria-labelledby="engineering-heading" className={cn("space-y-5 border-t border-border pt-8", s.tones)}>
      <h2 id="engineering-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        Engineering
      </h2>

      {/* Full text for screen readers and search; the reel below is the visual version. */}
      <ul className="sr-only">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>

      {reduced ? (
        <ul aria-hidden className="space-y-3">
          {items.map((t) => {
            const kd = kindOf(t);
            return (
              <li key={t} className="flex gap-4 border border-border bg-card/40 p-4" style={{ "--tone": kd.tone } as CSSProperties}>
                <div className="h-14 w-14 shrink-0"><Visual kind={kd.kind} /></div>
                <p className="leading-relaxed text-foreground/90"><Highlighted text={t} run={false} /></p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div
          ref={ref}
          className={cn("border border-border", s.stage, !playing && s.paused)}
          style={{ "--tone": cur.tone, "--dur": `${DUR}ms` } as CSSProperties}
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
        >
          <div aria-hidden key={i} className={cn("grid gap-6 p-6 sm:grid-cols-[9rem_1fr] sm:items-center sm:p-8", s.slideIn)}>
            <div className="h-28 w-full max-w-[9rem]"><Visual kind={cur.kind} /></div>
            <div className="space-y-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]" style={{ color: cur.tone }}>
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} · {cur.label}
              </p>
              <p className="font-display text-lg font-semibold leading-snug md:text-xl">
                <Highlighted text={items[i]} run={inView} />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-border px-4 py-2.5">
            <button type="button" aria-label="Previous point" onClick={() => go(i - 1)} className="p-1.5 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Engineering points">
              {items.map((t, n) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`Point ${n + 1}: ${kindOf(t).label}`}
                  onClick={() => setI(n)}
                  className="relative h-1.5 flex-1 overflow-hidden bg-border"
                >
                  {n < i && <span className="absolute inset-0" style={{ background: "var(--tone)", opacity: 0.6 }} />}
                  {n === i && <span key={i} className={cn("absolute inset-0", s.progress)} />}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={userPaused ? "Play" : "Pause"}
              onClick={() => setUserPaused((p) => !p)}
              className="p-1.5 text-muted-foreground hover:text-foreground"
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button type="button" aria-label="Next point" onClick={() => go(i + 1)} className="p-1.5 text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
