"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  ArrowRight,
  Check,
  MessageSquare,
  Bot,
  GitBranch,
  BellRing,
  Database,
  ScanSearch,
  Sparkles,
  FileCheck2,
  Store,
  RefreshCw,
  TriangleAlert,
  MonitorSmartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiOperations, services, processSteps } from "@/data/portfolio-data";
import { useScrollReveal } from "@/hooks/useGSAP";
import { cn } from "@/lib/utils";

const icons = {
  MessageSquare, Bot, GitBranch, BellRing, Database, ScanSearch,
  Sparkles, FileCheck2, Store, RefreshCw, TriangleAlert, MonitorSmartphone,
};

const STEP_MS = 1300; // one workflow step lighting up
const HOLD_MS = 3400; // pause on the finished run before rotating to the next operation

function openPao() {
  const launcher = document.querySelector<HTMLButtonElement>("[data-chat-launcher]");
  if (launcher?.getAttribute("aria-expanded") === "false") launcher.click();
}

export function ServicesSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const consoleRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // step = how many workflow steps have completed; steps.length means the run finished.
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);

  const op = aiOperations[active];
  const total = op.steps.length;
  const running = step < total;

  // Only run the demo while the console is on screen.
  useEffect(() => {
    const el = consoleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t: number | undefined;
    if (reduced) {
      // No step-by-step motion: show the finished workflow, and don't auto-rotate.
      if (step < total) t = window.setTimeout(() => setStep(total), 0);
    } else if (step < total) {
      t = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    } else if (!manual && !paused) {
      t = window.setTimeout(() => {
        setActive((a) => (a + 1) % aiOperations.length);
        setStep(0);
      }, HOLD_MS);
    }
    return () => window.clearTimeout(t);
  }, [inView, step, total, manual, paused]);

  const select = (i: number) => {
    setManual(true);
    setActive(i);
    setStep(0);
    track("ops_demo", { operation: aiOperations[i].id });
  };

  return (
    <section ref={sectionRef} id="services" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div data-reveal className="max-w-3xl mb-14 md:mb-20">
          <Badge
            variant="outline"
            className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
          >
            What I Solve
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-6">
            AI That Makes Your <span className="text-primary">Business Run</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            The three operations businesses ask AI to take over first. Pick one and watch the
            workflow run: the same pattern I ship, wired into your systems in weeks.
          </p>
        </div>

        {/* Operations console */}
        <div
          ref={consoleRef}
          data-reveal
          className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div role="tablist" aria-label="AI operations" className="flex flex-col gap-3">
            {aiOperations.map((o, i) => {
              const selected = i === active;
              return (
                <button
                  key={o.id}
                  id={`op-tab-${o.id}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="op-panel"
                  onClick={() => select(i)}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden text-left border px-5 py-5 md:px-6 md:py-6 transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected ? "border-primary/50 bg-primary/[0.06]" : "border-border hover:border-primary/30 hover:bg-card/60",
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "font-display text-3xl md:text-4xl font-bold tabular-nums transition-colors duration-300",
                        selected ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-semibold leading-snug">{o.title}</h3>
                      <p
                        className={cn(
                          "mt-1.5 text-sm leading-relaxed transition-colors duration-300",
                          selected ? "text-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {o.pain}
                      </p>
                    </div>
                  </div>
                  {/* Run progress for the selected operation */}
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent">
                    <span
                      className="block h-full origin-left bg-primary transition-transform ease-linear"
                      style={{
                        transform: `scaleX(${selected ? step / total : 0})`,
                        transitionDuration: selected && step > 0 ? `${STEP_MS}ms` : "0ms",
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="op-panel"
            role="tabpanel"
            aria-labelledby={`op-tab-${op.id}`}
            className="border border-border bg-card/40"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 md:px-7">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Workflow <span className="text-muted-foreground/60">· simulated run</span>
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-2 text-xs font-medium",
                  running ? "text-primary" : "text-foreground/80",
                )}
              >
                {running ? (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                ) : (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
                {running ? "Running" : "Completed"}
              </span>
            </div>

            {/* key resets connector transitions when switching operations */}
            <div key={op.id} className="grid gap-8 px-5 py-7 md:px-7 md:py-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <ol className="relative">
                {op.steps.map((s, i) => {
                  const Icon = icons[s.icon as keyof typeof icons] ?? Bot;
                  const done = step > i;
                  const current = step === i;
                  return (
                    <li key={s.title} className="relative grid grid-cols-[2.75rem_1fr] gap-4 pb-7 last:pb-0">
                      {i < total - 1 && (
                        <span aria-hidden className="absolute left-[1.375rem] top-11 bottom-0 w-px -translate-x-1/2 bg-border">
                          <span
                            className="block h-full w-full origin-top bg-primary transition-transform ease-out"
                            style={{ transform: `scaleY(${done ? 1 : 0})`, transitionDuration: `${STEP_MS * 0.6}ms` }}
                          />
                        </span>
                      )}
                      <span
                        className={cn(
                          "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300",
                          done && "border-primary bg-primary text-primary-foreground",
                          current && "border-primary bg-background text-primary",
                          !done && !current && "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {current && (
                          <span aria-hidden className="absolute inset-0 rounded-full border border-primary opacity-60 motion-safe:animate-ping" />
                        )}
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className={cn("pt-0.5 transition-opacity duration-500", step >= i ? "opacity-100" : "opacity-40")}>
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">{s.kind}</p>
                        <p className="font-display text-base md:text-lg font-semibold leading-snug">{s.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Event log: lines are always rendered (no layout shift) and fade in as the run advances */}
              <div className="flex flex-col border border-border bg-background/70">
                <p className="border-b border-border px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Event log
                </p>
                <div aria-hidden className="flex-1 space-y-2 px-4 py-4 font-mono text-[11px] leading-relaxed md:text-xs">
                  {op.log.map((l, i) => {
                    const [time, event, ...detail] = l.split(/\s{2,}/);
                    const live = i === step && running;
                    return (
                      <p
                        key={l}
                        className={cn(
                          "flex flex-wrap gap-x-3 transition-[opacity,transform] duration-500 ease-out",
                          i <= step ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                        )}
                      >
                        <span className="text-muted-foreground/70 tabular-nums">{time}</span>
                        <span className={live ? "text-primary" : "text-foreground/85"}>{event}</span>
                        <span className={live ? "text-primary/80" : "text-muted-foreground"}>{detail.join(" ")}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-border px-5 py-4 md:px-7">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-primary">Proven: </span>
                <span className="text-foreground/85">{op.proof}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Everything else on the menu */}
        <div data-reveal className="mt-20 md:mt-28">
          <p className="mb-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">Also on the menu</p>
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.title} className="border-t border-border pt-4">
                <h3 className="font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.problem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How an engagement runs */}
        <div data-reveal className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((s) => (
            <div key={s.step} className="border-t border-primary/30 pt-6">
              <div className="font-display text-sm font-semibold text-primary tabular-nums mb-2">{s.step}</div>
              <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div data-reveal className="mt-20 grid gap-8 border-t border-primary/40 pt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h3 className="font-display text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight max-w-2xl">
              Which one is costing your team the most hours?
            </h3>
            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
              Tell me the workflow. On a 30-minute call we map it, and I show you what automating
              it looks like before you commit to anything.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold gap-2"
              asChild
            >
              <Link href="#contact" onClick={() => track("cta_click", { location: "services" })}>
                Book a discovery call
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-border px-8 py-6 text-base font-semibold gap-2 cursor-pointer"
              onClick={() => {
                track("cta_click", { location: "services-pao" });
                openPao();
              }}
            >
              <Bot className="w-5 h-5" />
              Ask Pao instead
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
