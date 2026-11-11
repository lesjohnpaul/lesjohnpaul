"use client";

import { useId, useState, type CSSProperties } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Banknote, ClipboardList, Clock, Package, Users, type LucideIcon } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";
import { CATEGORICAL } from "./tone";

type Props = { screen: Extract<Screen, { type: "dashboard" }> };

const W = 600;
const H = 200;
const PAD = 14;

// Catmull-Rom through every point, as cubic beziers: smooth and never misses a value.
function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1] ?? pts[i];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[i + 2] ?? pts[i + 1];
    d += ` C${x1 + (x2 - x0) / 6},${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6},${y2 - (y3 - y1) / 6} ${x2},${y2}`;
  }
  return d;
}

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

const tint = (color: string) => ({ "--t": color }) as CSSProperties;

// ponytail: the icon is guessed from the KPI's words (English + Tagalog); anything unrecognised gets a neutral pulse.
const KPI_ICONS: [RegExp, LucideIcon][] = [
  [/sale|revenue|income|earn|benta|kita|bayad|paid|ticket|₱|\$/i, Banknote],
  [/customer|client|patient|rider|staff|team|member|student|suki|guest/i, Users],
  [/order|booking|appoint|job|deliver|visit|request/i, ClipboardList],
  [/wait|pending|late|time|delay|overdue|due/i, Clock],
  [/stock|inventory|item|product|seller/i, Package],
];
const kpiIcon = (text: string) => KPI_ICONS.find(([re]) => re.test(text))?.[1] ?? Activity;
const DELTA_TONE = { good: "var(--ok)", bad: "var(--bad)", neutral: "var(--muted)" } as const;

/** Donut of one total split into parts; hovering a legend row (or focusing it) lifts its slice. */
function Breakdown({ data }: { data: NonNullable<Props["screen"]["breakdown"]> }) {
  const [on, setOn] = useState<number | null>(null);
  const total = data.items.reduce((sum, it) => sum + it.value, 0);
  const slices = data.items.map((it, i) => {
    const before = (data.items.slice(0, i).reduce((sum, x) => sum + x.value, 0) / total) * 100;
    // Offset 25 starts the ring at 12 o'clock; each slice begins where the ones before it end.
    return { ...it, pct: (it.value / total) * 100, offset: 25 - before, color: CATEGORICAL[i % CATEGORICAL.length] };
  });
  const shown = on === null ? null : slices[on];
  return (
    <div className={cn(s.tile, "flex flex-col rounded-xl p-4 sm:p-5")} onMouseLeave={() => setOn(null)}>
      <p className={s.label}>{data.label}</p>
      <div className="relative mx-auto my-3 size-32 shrink-0">
        {/* r = 15.915 makes the circumference 100, so dash lengths are percentages. */}
        <svg viewBox="0 0 42 42" className="size-full" aria-hidden>
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="5" />
          {slices.map((sl, i) => (
            <circle
              key={i}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              stroke={sl.color}
              strokeWidth={on === i ? 6.5 : 5}
              strokeDasharray={`${Math.max(0, sl.pct - 1)} ${100 - Math.max(0, sl.pct - 1)}`}
              strokeDashoffset={sl.offset}
              opacity={on === null || on === i ? 1 : 0.3}
              className="transition-[opacity,stroke-width] duration-150"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn(s.display, s.num, "text-lg font-medium leading-none")}>{shown ? `${shown.pct.toFixed(0)}%` : fmt(total)}</span>
          <span className={cn(s.faint, "mt-1 max-w-20 truncate text-[0.6875rem]")}>{shown ? shown.label : "total"}</span>
        </div>
      </div>
      <ul className="grid gap-0.5">
        {slices.map((sl, i) => (
          <li key={i}>
            <button
              type="button"
              aria-label={`${sl.label}: ${fmt(sl.value)}, ${sl.pct.toFixed(0)}%`}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onBlur={() => setOn(null)}
              onClick={() => setOn(i)}
              className={cn("flex min-h-8 w-full items-center gap-2 rounded-md px-1.5 text-left text-sm", on === i && "bg-white/[0.06]")}
            >
              <span className="size-2 shrink-0 rounded-full" style={{ background: sl.color }} />
              <span className="min-w-0 flex-1 truncate">{sl.label}</span>
              <span className={cn(s.num, s.muted, "shrink-0")}>{fmt(sl.value)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardScreen({ screen }: Props) {
  const { kpis, chart, breakdown } = screen;
  const points = chart.points;
  const [active, setActive] = useState<number | null>(null);
  const gid = useId();

  const max = Math.max(...points);
  const min = Math.min(0, ...points);
  const span = max - min || 1;
  const xy = points.map((v, i): [number, number] => [
    (i / (points.length - 1)) * W,
    PAD + (1 - (v - min) / span) * (H - PAD * 2),
  ]);
  const line = smoothPath(xy);
  const area = `${line} L${W},${H} L0,${H} Z`;

  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const change = prev ? ((last - prev) / Math.abs(prev)) * 100 : 0;
  const shown = active ?? points.length - 1;

  return (
    <div className={cn(s.stagger, "grid gap-3 sm:gap-4")}>
      <div className={cn("grid grid-cols-2 gap-3 sm:gap-4", kpis.length === 3 && "sm:grid-cols-3", kpis.length === 4 && "sm:grid-cols-4")}>
        {kpis.map((k, i) => {
          const Icon = kpiIcon(`${k.label} ${k.value}`);
          const Arrow = /^\s*[-−]/.test(k.delta ?? "") ? ArrowDownRight : ArrowUpRight;
          return (
            <div
              key={i}
              style={tint(CATEGORICAL[i % CATEGORICAL.length])}
              className={cn(s.tile, s.tint, "rounded-xl p-4", kpis.length === 3 && i === 2 && "col-span-2 sm:col-span-1")}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn(s.chip, "flex size-8 shrink-0 items-center justify-center rounded-lg")}>
                  <Icon className="size-4" aria-hidden />
                </span>
                {k.delta && (
                  <span className={cn(s.pill, s.num, k.tone && k.tone !== "neutral" && s.tone)} style={tint(DELTA_TONE[k.tone ?? "neutral"])}>
                    <Arrow className="size-3" aria-hidden />
                    {k.delta}
                  </span>
                )}
              </div>
              <p className={cn(s.label, "mt-3 truncate")}>{k.label}</p>
              <p className={cn(s.display, s.num, "mt-1 truncate text-2xl font-medium sm:text-[1.75rem]")}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className={cn("grid gap-3 sm:gap-4", breakdown && "lg:grid-cols-3")}>
        <div className={cn(s.tile, "rounded-xl p-4 sm:p-5", breakdown && "lg:col-span-2")}>
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div>
              <p className={s.label}>{chart.label}</p>
              <p className={cn(s.display, s.num, "mt-1 text-xl font-medium")}>
                {fmt(points[shown])}
                <span className={cn(s.faint, "ml-2 text-xs font-normal")}>
                  {active === null ? "latest" : `point ${active + 1} of ${points.length}`}
                </span>
              </p>
            </div>
            <span className={cn(s.pill, s.num, change >= 0 && s.pillGold)}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(0)}% vs previous
            </span>
          </div>

          <div className="relative mt-4 h-44 sm:h-52" onMouseLeave={() => setActive(null)}>
            {/* Guide lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-dashed border-white/[0.07]" />
              ))}
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden
            >
              <defs>
                <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill={`url(#${gid})`} />
              <path
                d={line}
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2.25"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Points and their hit areas, in HTML so circles stay round at any width. */}
            {xy.map(([x, y], i) => {
              const on = active === i;
              const left = (x / W) * 100;
              return (
                <div key={i}>
                  <span
                    className={cn(
                      "pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform",
                      on ? "scale-125 border-[var(--gold)] bg-[oklch(0.16_0.015_260)]" : "border-transparent bg-[var(--gold)]/60",
                    )}
                    style={{ left: `${left}%`, top: `${(y / H) * 100}%` }}
                  />
                  {on && (
                    <>
                      <span
                        className="pointer-events-none absolute bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--gold)]/50 to-transparent"
                        style={{ left: `${left}%`, top: `${(y / H) * 100}%` }}
                      />
                      <span
                        className={cn(
                          s.glass,
                          s.num,
                          "pointer-events-none absolute z-10 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-lg px-2.5 py-1 text-sm font-semibold",
                          left < 12 ? "translate-x-0" : left > 88 ? "-translate-x-full" : "-translate-x-1/2",
                        )}
                        style={{ left: `${left}%`, top: `${(y / H) * 100}%` }}
                      >
                        {fmt(points[i])}
                      </span>
                    </>
                  )}
                  <button
                    type="button"
                    aria-label={`${chart.label}, point ${i + 1}: ${fmt(points[i])}`}
                    aria-pressed={on}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(i)}
                    className="absolute inset-y-0 -translate-x-1/2 rounded-md focus-visible:bg-white/5"
                    style={{ left: `${left}%`, width: `${100 / points.length}%`, minWidth: 24 }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {breakdown && <Breakdown data={breakdown} />}
      </div>
    </div>
  );
}
