"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ListChecks,
  ShieldCheck,
  Heart,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Lock,
  Pause,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Feature = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  bullets: string[];
  Icon: typeof ListChecks;
};

const features: Feature[] = [
  {
    id: "pipeline",
    label: "Live Order Pipeline",
    title: "Reservation to delivery, tracked in real time",
    description:
      "Customers watch every state change instead of pinging the seller on Messenger. Reserved → Confirmed → Ordered → QC Ready → Approved → Batched → Shipped, with timestamps.",
    image: "/images/projects/sneaker-symphony/06-orders.png",
    bullets: [
      "6-stage pipeline with audit timestamps",
      "Active / Completed / Cancelled views",
      "Per-order progress bar tied to fulfillment state",
    ],
    Icon: ListChecks,
  },
  {
    id: "qc",
    label: "QC Photo Verification",
    title: "8-angle quality-control gallery before payment release",
    description:
      "No PH reseller exposes per-pair QC galleries to the buyer. We do — every angle is watermarked, timestamped, and locked behind QC PASSED before the buyer approves.",
    image: "/images/projects/sneaker-symphony/07-order-pipeline.jpg",
    bullets: [
      "8 watermarked photos per pair",
      "Tap-to-zoom inspection viewer",
      "QC PASSED audit signature with timestamp",
    ],
    Icon: ShieldCheck,
  },
  {
    id: "batch",
    label: "Batch Buying",
    title: "5-pair group buys with public progress",
    description:
      "Buyers join a batch, see the spots remaining, and share the link to fill faster. The faster the batch fills, the faster everyone ships — a network effect engineered into the funnel.",
    image: "/images/projects/sneaker-symphony/08-batch-progress.png",
    bullets: [
      "1/5 pairs counter with live capacity",
      "Share-to-fill referral link per batch",
      "Downpayment + balance ledger per buyer",
    ],
    Icon: Sparkles,
  },
  {
    id: "wishlist",
    label: "Personal Wishlist",
    title: "Save grails. Get notified when they drop.",
    description:
      "Native wishlist with badge counts in the navbar, pre-order tags surfaced inline, and per-pair pricing. Persists across devices via Supabase auth.",
    image: "/images/projects/sneaker-symphony/09-wishlist.png",
    bullets: [
      "Auth-synced across devices",
      "Pre-order indicators inline",
      "Wishlist badge in primary nav",
    ],
    Icon: Heart,
  },
  {
    id: "drops",
    label: "Drops Calendar",
    title: "Curated drops, brand-grouped, pre-order ready",
    description:
      "200+ live SKUs in the Drop Zone — featured carousel, brand carousels, search, and a percentage-off ribbon system. Built to drive return visits.",
    image: "/images/projects/sneaker-symphony/10-drops.jpg",
    bullets: [
      "200+ active pre-order SKUs",
      "Brand-grouped infinite carousels",
      "Featured rotator with deep-link inquiry",
    ],
    Icon: Calendar,
  },
];

const stats = [
  { value: "6", label: "Pipeline stages" },
  { value: "8", label: "QC photos per pair" },
  { value: "200+", label: "Live drops" },
  { value: "100%", label: "Self-service" },
];

export function SneakerPortalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(features[0].id);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const intervalMs = 5000;

  // Auto-advance
  useEffect(() => {
    if (paused || hovered) return;
    const id = window.setInterval(() => {
      setActiveId((current) => {
        const idx = features.findIndex((f) => f.id === current);
        return features[(idx + 1) % features.length].id;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, hovered]);

  // Scroll animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-portal-header]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
      gsap.fromTo(
        "[data-portal-stat]",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: "[data-portal-stats]",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const active = features.find((f) => f.id === activeId) ?? features[0];
  const activeIndex = features.findIndex((f) => f.id === activeId);

  return (
    <section
      ref={sectionRef}
      id="sneaker-portal"
      className="relative py-32 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 grid-lines-subtle opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[840px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div data-portal-header className="flex items-center gap-3 mb-6">
            <Badge
              variant="outline"
              className="px-3 py-1.5 rounded-full border-primary/40 bg-primary/8 text-primary font-mono text-[10px] uppercase tracking-[0.22em]"
            >
              <Lock className="w-3 h-3 mr-1.5" />
              Exclusive · Customer Portal
            </Badge>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live in production
            </span>
          </div>

          <h2
            data-portal-header
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5 tracking-tight"
          >
            Features no other PH reseller{" "}
            <span className="text-gradient-gold">ships</span>.
          </h2>

          <p
            data-portal-header
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            Competitors run on DMs and Messenger screenshots. SneakerSymphony
            customers get a full self-service portal — built solo, in
            production, end-to-end. This is the part of the stack hiring
            managers usually only see in funded scale-ups.
          </p>
        </div>

        {/* Two-column showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Tabs */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <ul className="flex flex-col gap-2.5">
              {features.map((f, i) => {
                const isActive = f.id === activeId;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(f.id);
                        setPaused(true);
                      }}
                      className={cn(
                        "group relative w-full text-left rounded-2xl border transition-all duration-500 overflow-hidden",
                        "px-5 py-4 sm:px-6 sm:py-5",
                        isActive
                          ? "border-primary/50 bg-primary/8 shadow-[0_8px_30px_-12px_rgba(212,175,55,0.35)]"
                          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70",
                      )}
                    >
                      {/* Active progress bar */}
                      {isActive && !paused && !hovered && (
                        <span
                          aria-hidden
                          key={`bar-${f.id}-${activeId}`}
                          className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary/30 overflow-hidden"
                        >
                          <span
                            className="portal-progress block h-full bg-primary"
                            style={
                              {
                                ["--portal-progress-duration" as string]: `${intervalMs}ms`,
                              } as React.CSSProperties
                            }
                          />
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500",
                            isActive
                              ? "border-primary/40 bg-primary/15 text-primary"
                              : "border-border/50 bg-muted/40 text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          <f.Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                              {String(i + 1).padStart(2, "0")} · {f.label}
                            </span>
                            <ArrowUpRight
                              className={cn(
                                "h-4 w-4 transition-all duration-300",
                                isActive
                                  ? "text-primary translate-x-0 opacity-100"
                                  : "text-muted-foreground -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                              )}
                            />
                          </div>
                          <h3
                            className={cn(
                              "mt-1 font-display text-lg sm:text-xl font-semibold tracking-tight transition-colors duration-300",
                              isActive
                                ? "text-foreground"
                                : "text-foreground/90 group-hover:text-foreground",
                            )}
                          >
                            {f.title}
                          </h3>
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out",
                              isActive
                                ? "grid-rows-[1fr] opacity-100 mt-3"
                                : "grid-rows-[0fr] opacity-0 mt-0",
                            )}
                          >
                            <div className="overflow-hidden">
                              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                {f.description}
                              </p>
                              <ul className="space-y-1.5">
                                {f.bullets.map((b) => (
                                  <li
                                    key={b}
                                    className="flex items-start gap-2 text-sm text-foreground/90"
                                  >
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Controls */}
            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 hover:border-primary/40 hover:text-foreground transition-colors"
                aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
              >
                {paused ? (
                  <Play className="h-3 w-3" />
                ) : (
                  <Pause className="h-3 w-3" />
                )}
                <span>{paused ? "Play" : "Pause"}</span>
              </button>
              <span>
                {String(activeIndex + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Screenshot frame */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <MagneticElement strength={0.06}>
              <div className="relative">
                {/* Glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl"
                />

                <div className="relative rounded-[1.5rem] border border-border/60 bg-card/80 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-3 border-b border-border/50 bg-background/40 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/70" />
                      <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-mono text-muted-foreground">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        <span className="hidden sm:inline">sneakersymphony.com</span>
                        <span className="text-foreground/70">/{active.id}</span>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                      Live
                    </span>
                  </div>

                  {/* Screenshot */}
                  <div className="relative aspect-[16/10] bg-background/30">
                    {features.map((f) => (
                      <div
                        key={f.id}
                        className={cn(
                          "absolute inset-0 transition-opacity duration-700 ease-in-out",
                          f.id === activeId ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden={f.id !== activeId}
                      >
                        <Image
                          src={f.image}
                          alt={f.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover object-top"
                          priority={f.id === features[0].id}
                        />
                      </div>
                    ))}
                    {/* Subtle bottom fade so caption pops */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card/80 to-transparent" />

                    {/* Floating caption pill */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 backdrop-blur px-3 py-1.5 text-xs">
                        <active.Icon className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium">{active.label}</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1">
                        {features.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            aria-label={f.label}
                            onClick={() => {
                              setActiveId(f.id);
                              setPaused(true);
                            }}
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300",
                              f.id === activeId
                                ? "w-6 bg-primary"
                                : "w-1.5 bg-foreground/30 hover:bg-foreground/60",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MagneticElement>

            {/* Visit live button */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="group relative rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 overflow-hidden"
              >
                <Link
                  href="https://sneakersymphony.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit the live portal
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700"
                  />
                </Link>
              </Button>
              <span className="text-xs font-mono text-muted-foreground">
                Next.js 15 · Supabase · Stripe-style portal UX
              </span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          data-portal-stats
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              data-portal-stat
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md px-5 py-5 text-center"
            >
              <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-gold">
                {s.value}
              </div>
              <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
