"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { STUDIO_BOOT } from "./boot";
import s from "./portal.module.css";

// What the boot log says is what actually happens on /studio (see lib/studio/*), so it is honest theatre.
const LINES: [string, string][] = [
  ["handshake", "studio session"],
  ["waking Pao", "claude-haiku"],
  ["guardrails", "BotID · limits · $2/day"],
  ["schema", "7 screen types · strict"],
  ["streaming", "3D blocks · meshopt"],
  ["render", "glass + gold"],
];
const LINE_MS = 150;
const PUSH_AT = 650; // navigate early so /studio renders under the overlay
const MIN_SHOW = 1500;
const MAX_SHOW = 7000; // never trap the visitor if navigation stalls

type Phase = "idle" | "boot" | "ready" | "exit";

export function StudioPortal() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const [pct, setPct] = useState(0);
  const start = useRef(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const arrived = pathname === "/studio";

  // Start on the custom event fired by onStudioClick.
  useEffect(() => {
    const go = () => {
      if (start.current) return;
      start.current = performance.now();
      router.prefetch("/studio");
      // Warm the 3D blocks the scene will ask for, so the boot is not just for show.
      const lite = window.matchMedia("(max-width: 767px)").matches;
      fetch(lite ? "/studio/blocks-lite.glb" : "/studio/blocks.glb").catch(() => {});
      setShown(0);
      setPct(0);
      setPhase("boot");
    };
    window.addEventListener(STUDIO_BOOT, go);
    return () => window.removeEventListener(STUDIO_BOOT, go);
  }, [router]);

  // Timeline: log lines, progress, navigation, safety cap.
  useEffect(() => {
    if (phase !== "boot") return;
    const timers = LINES.map((_, i) => window.setTimeout(() => setShown(i + 1), 120 + i * LINE_MS));
    timers.push(window.setTimeout(() => router.push("/studio"), PUSH_AT));
    timers.push(window.setTimeout(() => setPhase("ready"), MAX_SHOW));
    let raf = 0;
    const tick = () => {
      const t = performance.now() - start.current;
      // eases to 92% and holds there until the route is actually on screen
      setPct(Math.round(92 * (1 - Math.pow(1 - Math.min(t / MIN_SHOW, 1), 3))));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.documentElement.style.overflow = "hidden";
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [phase, router]);

  // Finish once we are on /studio and the minimum show time has passed.
  useEffect(() => {
    if (phase !== "boot" || !arrived) return;
    const wait = Math.max(0, MIN_SHOW - (performance.now() - start.current));
    const t = window.setTimeout(() => setPhase("ready"), wait);
    return () => clearTimeout(t);
  }, [phase, arrived]);

  useEffect(() => {
    if (phase === "ready") {
      const t = window.setTimeout(() => setPhase("exit"), 260);
      return () => clearTimeout(t);
    }
    if (phase === "exit") {
      document.documentElement.style.overflow = "";
      const t = window.setTimeout(() => {
        start.current = 0;
        setPhase("idle");
      }, 560);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Code rain. Only runs while the overlay is up.
  useEffect(() => {
    if (phase === "idle") return;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = window.innerWidth;
    const H = window.innerHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    ctx.scale(dpr, dpr);
    const size = W < 640 ? 13 : 15;
    const cols = Math.ceil(W / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -H / size);
    const speed = Array.from({ length: cols }, () => 0.35 + Math.random() * 0.65);
    const teal = Array.from({ length: cols }, () => Math.random() < 0.18);
    const glyphs = "01{}<>[]=+*/λΣ∂∆ABCDEF#$%&アイウエオカキクケコ";
    ctx.font = `${size}px ui-monospace, Menlo, monospace`;
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(6, 7, 11, 0.16)";
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        ctx.fillStyle = teal[i] ? "rgba(90, 220, 205, 0.85)" : "rgba(236, 190, 62, 0.85)";
        ctx.fillText(ch, i * size, y);
        drops[i] += speed[i];
        if (y > H && Math.random() > 0.975) drops[i] = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    ctx.fillStyle = "#06070b";
    ctx.fillRect(0, 0, W, H);
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [phase === "idle"]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "idle") return null;

  return (
    <div className={s.overlay} data-phase={phase} role="status" aria-live="polite" aria-label="Loading Studio">
      <canvas ref={canvas} className={s.rain} aria-hidden />
      <div className={s.vignette} aria-hidden />
      <div className={s.scan} aria-hidden />
      <div className={s.card}>
        <p className={s.eyebrow}>
          <span className={s.dot} /> Studio · boot
        </p>
        <h2 className={s.title}>{phase === "boot" ? "Entering the Studio" : "Studio ready"}</h2>
        <ol className={s.log}>
          {LINES.slice(0, phase === "boot" ? shown : LINES.length).map(([k, v], i) => (
            <li key={k} className={s.line}>
              <span className={s.prompt}>›</span>
              <span className={s.key}>{k}</span>
              <span className={s.val}>{v}</span>
              <span className={i < shown - 1 || phase !== "boot" ? s.ok : s.spin}>{i < shown - 1 || phase !== "boot" ? "ok" : ""}</span>
            </li>
          ))}
        </ol>
        <div className={s.bar}>
          <span style={{ transform: `scaleX(${(phase === "boot" ? pct : 100) / 100})` }} />
        </div>
        <p className={s.pct}>{phase === "boot" ? pct : 100}%</p>
      </div>
    </div>
  );
}
