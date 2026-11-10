"use client";

import { useId, useState } from "react";
import { MapPin } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";

type Props = { screen: Extract<Screen, { type: "map" }> };

// Abstract terrain: no real geography, just soft contours, a river and two roads.
function Terrain() {
  const gid = useId();
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id={gid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="white" strokeOpacity="0.045" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${gid})`} />
      <g fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="1">
        <path d="M60 60c30-28 92-30 118-4s10 70-30 78-84 2-96-24 -12-32 8-50z" />
        <path d="M72 68c24-18 72-20 92 0s8 52-22 58-66 0-74-18-10-24 4-40z" />
        <path d="M86 78c16-10 48-12 62 2s4 32-16 36-44 0-50-12-6-16 4-26z" />
        <path d="M270 150c36-20 96-10 108 22s-26 62-72 58-74-22-70-46 10-24 34-34z" />
        <path d="M284 162c26-12 70-6 78 16s-20 42-52 40-52-16-48-32 6-16 22-24z" />
      </g>
      <path
        d="M-10 190c50-12 80-46 130-40s70 40 120 30 90-70 170-60"
        fill="none"
        stroke="oklch(0.55 0.09 235)"
        strokeOpacity="0.35"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <g fill="none" stroke="white" strokeOpacity="0.13" strokeLinecap="round">
        <path d="M0 110C90 100 150 120 220 96s120-30 190-20" strokeWidth="3" />
        <path d="M180 -10c-6 70 20 120 10 170s-30 70-22 100" strokeWidth="2.5" />
        <path d="M220 96c30 30 70 40 120 34" strokeWidth="1.5" strokeOpacity="0.09" />
      </g>
    </svg>
  );
}

export function MapScreen({ screen }: Props) {
  const { pins } = screen;
  const [active, setActive] = useState<number | null>(0);
  const pin = active === null ? null : pins[active];

  return (
    <div className={cn(s.stagger, "grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]")}>
      <div className={cn(s.tile, s.mapCanvas, "relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/10]")}>
        <Terrain />
        {pins.map((p, i) => {
          const on = active === i;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={on}
              aria-label={p.status ? `${p.label}, ${p.status}` : p.label}
              onClick={() => setActive(on ? null : i)}
              className={cn(s.pin, "absolute flex size-11 -translate-x-1/2 -translate-y-full items-end justify-center rounded-full", on && "z-20")}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              <span className="relative flex flex-col items-center">
                <span
                  className={cn(
                    s.pinHead,
                    "relative flex size-7 items-center justify-center rounded-full border shadow-lg shadow-black/50",
                    on ? "border-[var(--gold)] bg-[var(--gold)] text-[oklch(0.16_0.015_260)]" : "border-white/30 bg-[oklch(0.22_0.015_260)] text-[var(--ink)]",
                  )}
                >
                  <MapPin className="size-3.5" aria-hidden />
                </span>
                <span className="mt-0.5 size-1.5 rounded-full bg-white/60" />
                {on && <span className={cn(s.pulse, "absolute bottom-0 size-4 translate-y-1/4 rounded-full bg-[var(--gold)]/50")} />}
              </span>
            </button>
          );
        })}

        {pin && active !== null && (
          <div
            key={active}
            className={cn(
              s.enter,
              // Solid, not glass: it sits over pins and roads and must read cleanly.
              "pointer-events-none absolute z-30 w-max max-w-[11rem] rounded-lg border border-white/15 bg-[oklch(0.2_0.015_260)]/95 px-3 py-2 shadow-xl shadow-black/50",
              pin.x > 0.6 ? "-translate-x-full" : pin.x < 0.3 ? "" : "-translate-x-1/2",
              pin.y < 0.35 ? "translate-y-3" : "-translate-y-[calc(100%+3.25rem)]",
            )}
            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
          >
            <p className="truncate text-sm font-semibold">{pin.label}</p>
            <p className={cn(s.muted, "truncate text-xs")}>{pin.status ?? "Location"}</p>
          </div>
        )}

        <span className={cn(s.pill, s.num, "absolute left-3 top-3 bg-black/40 backdrop-blur")}>
          <span className={cn(s.dot, "text-[var(--ok)]")} />
          {pins.length} on map
        </span>
      </div>

      <ul className={cn(s.tile, "grid content-start gap-1 rounded-xl p-2")} aria-label="Locations">
        {pins.map((p, i) => {
          const on = active === i;
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setActive(on ? null : i)}
                className={cn(
                  s.press,
                  "flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left",
                  on ? s.selected : "border-transparent hover:bg-white/[0.05]",
                )}
              >
                <span className={cn("size-2 shrink-0 rounded-full", on ? "bg-[var(--gold)]" : "bg-white/35")} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.label}</span>
                {p.status && <span className={cn(s.pill, on && s.pillGold)}>{p.status}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
