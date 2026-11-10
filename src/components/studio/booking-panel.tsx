"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CalendarCheck, Mail } from "lucide-react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/data/portfolio-data";
import s from "./studio.module.css";

type Slot = { start: string; label: string };
type Slots = { kind: "idle" | "loading" } | { kind: "ready"; slots: Slot[] } | { kind: "error"; message: string };
// `mailto` marks errors where retrying won't help, so emailing Les is the next action.
type Submit = { kind: "idle" | "sending" } | { kind: "error"; message: string; mailto?: boolean } | { kind: "booked"; when: string };

const UNAVAILABLE = "Online booking isn't available right now.";
const BLOCKED = "We couldn't verify this request. Please try again, or email Les.";
const ERR = "text-sm text-[oklch(0.8_0.12_45)]";

function EmailLes({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${personalInfo.email}?subject=${encodeURIComponent("Discovery call")}`}
      className={cn(s.press, s.interactive, "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-[0.9375rem] font-medium", className)}
    >
      <Mail className="size-4" aria-hidden />
      Email Les instead
    </a>
  );
}

export function BookingPanel({ buildId }: { buildId?: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [tz, setTz] = useState("");
  const [slots, setSlots] = useState<Slots>({ kind: "idle" });
  const [pick, setPick] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState<Submit>({ kind: "idle" });

  const load = useCallback(async (timeZone: string) => {
    setSlots({ kind: "loading" });
    setPick(null);
    try {
      const res = await fetch(`/api/studio/slots?tz=${encodeURIComponent(timeZone)}`);
      const body: { slots?: Slot[]; error?: unknown } = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(body.slots)) setSlots({ kind: "ready", slots: body.slots });
      else setSlots({ kind: "error", message: res.status === 403 ? BLOCKED : res.status === 429 && typeof body.error === "string" ? body.error : UNAVAILABLE });
    } catch {
      setSlots({ kind: "error", message: UNAVAILABLE });
    }
  }, []);

  // Cal.com is asked only once the panel is near the screen, not on every page view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        setTz(zone);
        void load(zone);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  async function confirm(e: FormEvent) {
    e.preventDefault();
    if (!pick) return;
    setSubmit({ kind: "sending" });
    try {
      const res = await fetch("/api/studio/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ start: pick, timeZone: tz, name: name.trim(), email: email.trim(), buildId }),
      });
      const body: { when?: unknown; error?: unknown } = await res.json().catch(() => ({}));
      if (res.ok) {
        track("booking_made");
        setSubmit({ kind: "booked", when: typeof body.when === "string" ? body.when : "" });
        return;
      }
      const msg = typeof body.error === "string" ? body.error : UNAVAILABLE;
      if (res.status === 409 || (res.status === 400 && msg.includes("passed"))) {
        // The time went; show fresh ones and keep what they typed.
        setSubmit({ kind: "error", message: msg });
        void load(tz);
        return;
      }
      if (res.status === 400) setSubmit({ kind: "error", message: "Check your name and email, then try again." });
      else if (res.status === 403) setSubmit({ kind: "error", message: BLOCKED, mailto: true });
      else if (res.status === 429) setSubmit({ kind: "error", message: msg, mailto: true });
      else setSubmit({ kind: "error", message: UNAVAILABLE, mailto: true });
    } catch {
      setSubmit({ kind: "error", message: UNAVAILABLE, mailto: true });
    }
  }

  const fmt = useMemo(
    () =>
      tz
        ? {
            day: new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "short", day: "numeric" }),
            time: new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }),
          }
        : null,
    [tz],
  );
  // Group by the visitor's day so phones show a short list per day.
  const days = new Map<string, Slot[]>();
  if (slots.kind === "ready" && fmt) {
    for (const sl of slots.slots) {
      const day = fmt.day.format(new Date(sl.start));
      days.set(day, [...(days.get(day) ?? []), sl]);
    }
  }
  const time = (iso: string) => fmt?.time.format(new Date(iso)) ?? "";

  return (
    <div ref={ref} className={cn(s.glass, "rounded-2xl p-4 sm:p-6")}>
      <p className={s.eyebrow}>Free · 30 minutes · Online</p>
      <h2 className={cn(s.display, "mt-2 text-2xl font-medium sm:text-3xl")}>Book a discovery call</h2>
      <p className={cn(s.muted, "mt-2 max-w-xl text-[0.9375rem] leading-relaxed")}>
        {buildId
          ? "Les sees the prototype you just built before the call, so you can skip the basics and talk about what a working version would take."
          : "We look at how your business runs today and what a working system would take. No slides, no pressure."}
      </p>

      {submit.kind === "booked" ? (
        <div role="status" className={cn(s.tile, s.swap, "mt-6 flex items-start gap-3 rounded-xl p-4")}>
          <CalendarCheck className="mt-0.5 size-5 shrink-0 text-[var(--ok)]" aria-hidden />
          <div>
            <p className="font-medium">You&apos;re booked{submit.when ? ` for ${submit.when}` : ""}.</p>
            <p className={cn(s.muted, "mt-1 text-[0.9375rem]")}>A calendar invite with the meeting link is on its way to {email.trim()}.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={confirm} className="mt-6 grid gap-6">
          <fieldset className="min-w-0">
            <legend className={cn(s.display, "mb-1 text-base font-medium")}>Pick a time</legend>
            {tz && <p className={cn(s.faint, "mb-3 text-sm")}>Times shown in your time zone ({tz.replace(/_/g, " ")}).</p>}
            {(slots.kind === "idle" || slots.kind === "loading") && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-busy aria-label="Loading times">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cn(s.shimmer, "h-11 rounded-lg")} />
                ))}
              </div>
            )}
            {slots.kind === "error" && (
              <div className="grid justify-items-start gap-3">
                <p className={ERR}>{slots.message}</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => load(tz)} className={cn(s.press, s.interactive, "min-h-11 rounded-xl px-4 text-[0.9375rem] font-medium")}>
                    Try again
                  </button>
                  <EmailLes />
                </div>
              </div>
            )}
            {slots.kind === "ready" && slots.slots.length === 0 && (
              <div className="grid justify-items-start gap-3">
                <p className={s.muted}>No open times this week. Send Les a note and he&apos;ll find one.</p>
                <EmailLes />
              </div>
            )}
            {slots.kind === "ready" && slots.slots.length > 0 && (
              <div className={cn(s.swap, "grid gap-4")}>
                {[...days].map(([day, list]) => (
                  <div key={day}>
                    <p className={cn(s.muted, "mb-2 text-sm")}>{day}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {list.map((sl) => {
                        const on = pick === sl.start;
                        return (
                          <button
                            key={sl.start}
                            type="button"
                            aria-pressed={on}
                            aria-label={sl.label}
                            onClick={() => setPick(on ? null : sl.start)}
                            className={cn(s.press, s.num, "min-h-11 rounded-lg border px-3 text-[0.9375rem] font-medium", on ? cn(s.primary, "border-transparent") : s.interactive)}
                          >
                            {time(sl.start)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {pick && (
            <div className={cn(s.enter, "grid gap-4")}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-name`} className="mb-2 block text-[0.9375rem] font-medium">
                    Your name
                  </label>
                  <input id={`${id}-name`} required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={s.field} />
                </div>
                <div>
                  <label htmlFor={`${id}-email`} className="mb-2 block text-[0.9375rem] font-medium">
                    Email for the invite
                  </label>
                  <input
                    id={`${id}-email`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={s.field}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <button
                  type="submit"
                  disabled={submit.kind === "sending"}
                  className={cn(s.press, s.primary, "inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 text-base disabled:opacity-60 sm:w-auto sm:justify-self-start")}
                >
                  {submit.kind === "sending" ? "Booking…" : "Confirm booking"}
                </button>
                {submit.kind === "error" && (
                  <div className="grid justify-items-start gap-3">
                    <p role="alert" className={ERR}>
                      {submit.message}
                    </p>
                    {submit.mailto && <EmailLes />}
                  </div>
                )}
              </div>
            </div>
          )}
          {submit.kind === "error" && !pick && (
            <p role="alert" className={ERR}>
              {submit.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
