"use client";

// Career Log — git-log styled timeline. Replaces the previous 846-line
// zigzag timeline which ran 9+ ScrollTriggers plus per-hover clipPath +
// filter(blur) + rotateY animations.
//
// Design goals for this version:
//   1. Tell the *real* story: 10 years at ONE cooperative, 3 promotions.
//   2. Stay snappy: no GSAP, no ScrollTrigger, no scrub, no clipPath.
//      Section reveal is a single IntersectionObserver + a CSS keyframe
//      staggered via inline animation-delay.
//   3. Earn its motion: every animated thing conveys either entrance
//      (once) or focus state (user-initiated).
//   4. Add a keyboard affordance engineers will recognize (j/k/↑/↓/1-3).

import { useEffect, useRef, useState } from "react";
import { GitCommit, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/data/portfolio-data";

// --- Date math ---------------------------------------------------------------

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

// Parses tokens like "Sept 2022", "Mar 2016", or "Present".
function parseMonthYear(raw: string): Date | null {
  const s = raw.trim().toLowerCase();
  if (s.includes("present")) return new Date();
  const m = s.match(/([a-z]+)\s+(\d{4})/);
  if (!m) return null;
  const key = m[1].slice(0, 4) in MONTH_INDEX ? m[1].slice(0, 4) : m[1].slice(0, 3);
  const month = MONTH_INDEX[key];
  if (month === undefined) return null;
  return new Date(Date.UTC(parseInt(m[2], 10), month, 1));
}

function parsePeriod(period: string) {
  const [start, end] = period.split(/\s*[–—-]\s*/);
  return { start: parseMonthYear(start || ""), end: parseMonthYear(end || "") };
}

function monthsBetween(a: Date, b: Date): number {
  return (
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth())
  );
}

function formatDuration(months: number): string {
  if (months <= 0) return "—";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

// Deterministic short hash → fake commit SHA. DJB2 → 7 hex chars.
function shortHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

// --- Component ---------------------------------------------------------------

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Precompute role metadata once. experience[0] is the current role.
  const roles = experience.map((exp) => {
    const { start, end } = parsePeriod(exp.period);
    const months = start && end ? monthsBetween(start, end) : 0;
    return {
      ...exp,
      start,
      end,
      months,
      hash: shortHash(`${exp.role}:${exp.period}`),
    };
  });

  // Total tenure = from oldest role's start to newest role's end.
  const oldest = roles[roles.length - 1];
  const newest = roles[0];
  const totalMonths =
    oldest?.start && newest?.end ? monthsBetween(oldest.start, newest.end) : 0;

  // Section reveal — one IntersectionObserver, one CSS class toggle.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-revealed");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Keyboard navigation: j/k/↑/↓/1-3 step through roles. Guards:
  //  - section must be visible in viewport
  //  - focus must not be inside an editable field
  //  - no modifier keys pressed (avoid colliding with browser shortcuts)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const editable =
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;
      if (editable) return;

      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const onScreen =
        rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (!onScreen) return;

      let next = activeIdx;
      if (e.key === "j" || e.key === "ArrowDown") next = Math.min(roles.length - 1, activeIdx + 1);
      else if (e.key === "k" || e.key === "ArrowUp") next = Math.max(0, activeIdx - 1);
      else if (/^[1-9]$/.test(e.key)) {
        const target = parseInt(e.key, 10) - 1;
        if (target < roles.length) next = target;
        else return;
      } else return;

      e.preventDefault();
      setActiveIdx(next);
      itemRefs.current[next]?.focus({ preventScroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, roles.length]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="career-log relative py-28 md:py-32 overflow-hidden"
    >
      {/* Background — lean. One subtle gradient + a faint grid. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      <div className="absolute inset-0 grid-lines-subtle opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Badge
            variant="outline"
            className="px-3 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary mb-6 font-mono text-[0.7rem] uppercase tracking-[0.18em]"
          >
            <GitCommit className="w-3.5 h-3.5 mr-2" />
            $ git log --career
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
            Ten years. One cooperative.
            <br />
            <span className="text-primary">Three elevations.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            One employer since March 2016. Grew from the consumer desk to
            infrastructure lead — same building, bigger impact each year.
          </p>
        </div>

        {/* Tenure bar — proportional widths show how the 10 years distributed. */}
        <div className="mb-14" aria-hidden>
          <div className="flex items-center gap-3 mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Tenure</span>
            <span className="h-px flex-1 bg-border" />
            <span className="text-foreground">{formatDuration(totalMonths)}</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden bg-card/40 border border-border">
            {/* Oldest → newest so the current role caps the right edge. */}
            {roles
              .slice()
              .reverse()
              .map((role, i) => {
                const isCurrent = i === roles.length - 1;
                const width = totalMonths > 0 ? (role.months / totalMonths) * 100 : 0;
                return (
                  <div
                    key={role.role}
                    className={
                      isCurrent
                        ? "h-full bg-primary"
                        : i === roles.length - 2
                        ? "h-full bg-primary/55"
                        : "h-full bg-primary/25"
                    }
                    style={{ width: `${width}%` }}
                    title={`${role.role} — ${formatDuration(role.months)}`}
                  />
                );
              })}
          </div>
        </div>

        {/* Career log */}
        <ol className="career-log__list relative">
          {roles.map((role, i) => {
            const isCurrent = i === 0;
            const isActive = activeIdx === i;
            return (
              <li
                key={role.role}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                tabIndex={0}
                aria-current={isCurrent ? "true" : undefined}
                onFocus={() => setActiveIdx(i)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`career-log__item group relative pl-10 md:pl-14 pb-12 md:pb-14 outline-none rounded-md transition-[background,transform] duration-200 ${
                  isActive ? "is-active" : ""
                }`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {/* Spine — one thin line runs the full height of each item
                    except the last, where it stops at the node. */}
                {i < roles.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-3 bottom-0 w-px bg-border left-[12px] md:left-[18px]"
                  />
                )}

                {/* Commit node — aligned to spine center.
                    Mobile: spine at 12px, node left 6px. Desktop: spine at 18px, node left 12px. */}
                <span
                  aria-hidden
                  className={`absolute top-2.5 w-3 h-3 rounded-full border-2 z-10 left-[6px] md:left-[12px] ${
                    isCurrent
                      ? "border-primary bg-primary/20"
                      : "border-border bg-card"
                  }`}
                />
                {isCurrent && (
                  <span
                    aria-hidden
                    className="absolute top-2.5 w-3 h-3 rounded-full bg-primary/40 left-[6px] md:left-[12px] z-10"
                    style={{
                      animation: "career-ping 2.2s cubic-bezier(0,0,0.2,1) infinite",
                    }}
                  />
                )}

                {/* Commit metadata line — hash · period · duration · HEAD */}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3 font-mono text-[0.72rem] md:text-xs">
                  <span className="text-primary">{role.hash}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-foreground/70">{role.period}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-muted-foreground">
                    {formatDuration(role.months)}
                  </span>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-[0.62rem] uppercase tracking-[0.18em]">
                      <span className="inline-block w-1 h-1 rounded-full bg-primary animate-pulse" />
                      HEAD → present
                    </span>
                  )}
                </div>

                {/* Role title */}
                <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-1 transition-colors duration-200 group-hover:text-primary group-focus:text-primary">
                  {role.role}
                </h3>

                {/* Company */}
                <p className="text-sm md:text-base text-muted-foreground mb-5">
                  {role.company}
                </p>

                {/* Description */}
                <p className="text-foreground/80 leading-relaxed mb-6 max-w-2xl">
                  {role.description}
                </p>

                {/* Achievements as monospace bullets — code-review feel. */}
                <ul className="space-y-2 font-mono text-[13px] md:text-sm max-w-3xl">
                  {role.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-3 text-foreground/78 leading-relaxed"
                    >
                      <span aria-hidden className="text-primary/60 mt-0.5 select-none">
                        {">"}
                      </span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        {/* Keyboard hint — only shown on fine-pointer devices. */}
        <div className="mt-10 hidden md:flex items-center gap-2 text-[0.72rem] text-muted-foreground font-mono">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Walk through roles:</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-card/50 text-foreground">
            j
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-card/50 text-foreground">
            k
          </kbd>
          <span className="text-muted-foreground/70">or</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-card/50 text-foreground">
            ↑
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-card/50 text-foreground">
            ↓
          </kbd>
          <span className="text-muted-foreground/70">or</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-card/50 text-foreground">
            1-3
          </kbd>
        </div>
      </div>
    </section>
  );
}
