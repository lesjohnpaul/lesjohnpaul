"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { onStudioClick } from "@/components/studio/portal/boot";
import s from "./studio-teaser.module.css";

// Generic examples only (never a real client).
const EXAMPLES: [string, string[]][] = [
  ["Dental clinic: patient records and a digital odontogram", ["Dashboard", "Odontogram", "Booking"]],
  ["Bakery: custom cake orders and pickup dates", ["Orders", "Kanban", "Form"]],
  ["Logistics: track 40 delivery trucks across Luzon", ["Map", "Table", "Dashboard"]],
  ["Salon: bookings and SMS reminders", ["Booking", "Table", "Form"]],
];

const RM = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const m = matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Homepage call-out for /studio: an always-dark glass panel with a typing demo and the loop video. */
export function StudioTeaser() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [ex, setEx] = useState(0);
  const [typed, setTyped] = useState(0);
  const still = useSyncExternalStore(subscribeMotion, () => matchMedia(RM).matches, () => false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // Play the loop only while visible.
  useEffect(() => {
    const v = video.current;
    if (!v || still) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, still]);

  // Type the example, hold, then move to the next one.
  const text = EXAMPLES[ex][0];
  const done = still || typed >= text.length;
  useEffect(() => {
    if (!inView || still) return;
    const t = done
      ? window.setTimeout(() => { setTyped(0); setEx((i) => (i + 1) % EXAMPLES.length); }, 2600)
      : window.setTimeout(() => setTyped((n) => n + 1), 28 + Math.random() * 40);
    return () => clearTimeout(t);
  }, [inView, still, done, typed]);

  return (
    <section ref={root} id="studio" className="relative px-4 py-20 md:py-28" aria-labelledby="studio-teaser-title">
      <div className={s.panel}>
        <div className={s.glow} aria-hidden />
        <div className={s.copy}>
          <p className={s.eyebrow}>
            <span className={s.live} aria-hidden />
            Live now · Studio
          </p>
          <h2 id="studio-teaser-title" className={s.title}>
            Tell Pao your business in one line. <span className={s.gold}>Watch it get built.</span>
          </h2>
          <p className={s.lede}>
            A clickable 3-screen prototype of your system in about 20 seconds. Free, no sign-up. It&apos;s
            how I work: one discovery call, and you see a working system before we even talk price.
          </p>

          <div className={s.input} aria-hidden>
            <span className={s.caret}>›</span>
            <span>{still ? text : text.slice(0, typed)}</span>
            {!done && <span className={s.cursor} />}
          </div>
          <div className={s.chips} aria-hidden data-on={done}>
            {EXAMPLES[ex][1].map((c, i) => (
              <span key={ex + c} className={s.chip} style={{ animationDelay: `${i * 70}ms` }}>
                {c}
              </span>
            ))}
          </div>

          <div className={s.actions}>
            <Link
              href="/studio"
              className={s.cta}
              onClick={(e) => {
                track("cta_click", { location: "home-studio-teaser" });
                onStudioClick(e);
              }}
            >
              Enter the Studio
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <span className={s.note}>~20s build · real AI, not a video</span>
          </div>
        </div>

        <div className={s.media}>
          <video
            ref={video}
            className={s.video}
            src="/studio/loop.mp4"
            poster="/studio/loop.jpg"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          />
          <div className={s.badge}>
            <span className={s.live} aria-hidden /> building…
          </div>
        </div>
      </div>
    </section>
  );
}
