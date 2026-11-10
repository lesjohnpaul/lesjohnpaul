"use client";

import { useId, useState } from "react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";

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

export function DashboardScreen({ screen }: Props) {
  const { kpis, chart } = screen;
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
        {kpis.map((k, i) => (
          <div
            key={i}
            className={cn(s.tile, "rounded-xl p-4", kpis.length === 3 && i === 2 && "col-span-2 sm:col-span-1")}
          >
            <p className={cn(s.label, "truncate")}>{k.label}</p>
            <p className={cn(s.display, s.num, "mt-2 truncate text-2xl font-medium sm:text-[1.75rem]")}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className={cn(s.tile, "rounded-xl p-4 sm:p-5")}>
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
    </div>
  );
}
