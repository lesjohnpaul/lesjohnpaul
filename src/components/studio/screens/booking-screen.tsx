"use client";

import { useState } from "react";
import { CalendarCheck, CalendarDays } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";

type Props = { screen: Extract<Screen, { type: "booking" }> };

export function BookingScreen({ screen }: Props) {
  const { service, slots } = screen;
  const [pick, setPick] = useState<{ d: number; t: number } | null>(null);
  const cols = { 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5" }[slots.length] ?? "sm:grid-cols-3";

  return (
    // minmax(0,1fr): a long service name (truncate = nowrap) must not widen the screen past a phone's frame.
    <div className={cn(s.stagger, "grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-4")}>
      <div className={cn(s.tile, "flex items-center gap-3 rounded-xl p-4")}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)]">
          <CalendarDays className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className={s.label}>Service</p>
          <p className="truncate font-medium">{service}</p>
        </div>
        <span className={cn(s.pill, s.num, "ml-auto")}>
          {slots.reduce((n, d) => n + d.times.length, 0)} open slots
        </span>
      </div>

      <div className={cn("grid grid-cols-2 gap-3", cols)} role="group" aria-label="Available times">
        {slots.map((day, d) => (
          <div key={d} className={cn(s.tile, "min-w-0 rounded-xl p-3")}>
            <p className={cn(s.display, "mb-2.5 px-1 text-sm font-medium")}>{day.day}</p>
            <div className="grid gap-2">
              {day.times.map((time, t) => {
                const on = pick?.d === d && pick.t === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${day.day} ${time}`}
                    onClick={() => setPick(on ? null : { d, t })}
                    className={cn(
                      s.press,
                      s.num,
                      "min-h-11 rounded-lg border px-2 text-sm font-medium",
                      on ? cn(s.primary, "border-transparent") : s.interactive,
                    )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={cn(s.tile, "flex min-h-16 items-center gap-3 rounded-xl px-4 py-3")} aria-live="polite">
        {pick ? (
          <div key={`${pick.d}-${pick.t}`} className={cn(s.swap, "flex min-w-0 items-center gap-3")}>
            <CalendarCheck className="size-5 shrink-0 text-[var(--ok)]" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-semibold">Booked (demo)</p>
              <p className={cn(s.muted, s.num, "truncate text-sm")}>
                {service} · {slots[pick.d].day} {slots[pick.d].times[pick.t]}
              </p>
            </div>
          </div>
        ) : (
          <p className={cn(s.faint, "text-sm")}>Pick a time to book.</p>
        )}
      </div>
    </div>
  );
}
