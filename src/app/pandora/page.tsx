"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Music,
  Palette,
  Rocket,
  Gem,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { hiddenTalents } from "@/data/portfolio-data";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { TextScramble } from "@/components/ui/text-scramble";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = { Music, Palette, Rocket, Workflow };
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

const slugOf = (category: string) => category.toLowerCase().replace(/\s+/g, "-");

// Curated per-exhibit content. Keys must match hiddenTalents categories exactly.
const exhibitDetails: Record<
  string,
  {
    headline: string;
    description: string;
    showcase: { label: string; value: string }[];
    tools: string[];
    quote?: string;
    image?: string;
    imageAlt?: string;
    imageCaption?: string;
    genres?: string[];
  }
> = {
  "Music Production": {
    headline: "Working Musician, Arranger & Audio Engineer",
    description:
      "Active keyboardist on a Nord Stage 4 88 in an indie band. Three originals are in pre-release with major-label discussions underway. Arranged two locally-released indie albums plus singles for independent artists. Tracking, comping, mixing, and stem export in Logic Pro X: comfortable at the stem level (drums, bass, vocals, synths, FX) and fluent in production techniques like sidechain, automation, and vocal processing.",
    showcase: [
      { value: "3", label: "Originals in pre-release" },
      { value: "2", label: "Albums arranged" },
      { value: "9", label: "Genres fluent" },
    ],
    tools: ["Nord Stage 4 88", "Logic Pro X", "Stem Separation", "Vocal Processing", "Live Performance"],
    image: "/images/music/keyboard-performance.jpg",
    imageAlt: "Performing on Nord Stage 4 88 in a chapel setting",
    imageCaption: "Nord Stage 4 88, live keys session",
    genres: ["R&B", "Pop", "OPM", "Rock", "Jazz", "Worship / Choral", "Electronic", "Indie", "Folk"],
  },
  "Choir Direction": {
    headline: "Fifteen Years of SATB Ear Training",
    description:
      "Directed a Catholic liturgical SATB choir for weekly services: arranging and adapting hymns, training voice leading, and developing the multi-part listening that powers every harmonic decision I make. Recently composed an original Communion hymn in 8.8.8.8 Long Meter compatible with traditional tune families.",
    showcase: [
      { value: "15+", label: "Years directing" },
      { value: "780+", label: "Weekly services led" },
      { value: "1", label: "Original hymn composed" },
    ],
    tools: ["SATB Direction", "Hymn Arrangement", "Voice Leading", "Harmonic Analysis", "Liturgical Composition"],
    quote: "Choral direction is the practiced ensemble leadership behind every architecture decision.",
  },
  "Visual Art": {
    headline: "Composition Practice, Off-Screen",
    description:
      "Abstract painting as a standing hobby practice: color relationships, balance, and negative space worked out on canvas instead of a screen. The same eye that resolves a composition resolves an interface: hierarchy, rhythm, and restraint transfer directly into UI work.",
    showcase: [
      { value: "Acrylic", label: "Primary medium" },
      { value: "Abstract", label: "Working style" },
      { value: "Every UI", label: "Where it shows up" },
    ],
    tools: ["Abstract Painting", "Color Composition", "Visual Design", "Aesthetic Judgment"],
    quote: "The same eye that balances a canvas balances an interface.",
  },
  "Solo Building": {
    headline: "Founder-Grade Ownership, Team of One",
    description:
      "Shipping personal products without a team: Sneaker Symphony, a live Philippine sneaker marketplace with dual-gateway payments; FocusCanvas, a desktop SaaS; and this portfolio. Strategy, PRD, design, code, deployment, and operations. Every layer owned end to end.",
    showcase: [
      { value: "3", label: "Products shipped solo" },
      { value: "2", label: "Payment gateways integrated" },
      { value: "0", label: "Handoffs, end to end" },
    ],
    tools: ["Product Strategy", "PRD Authoring", "Next.js / React", "PayMongo · HitPay", "Deployment & Ops"],
    quote: "When you are the whole team, every decision is yours to defend.",
  },
  "Workflow Automation": {
    headline: "Weeks Into Clicks",
    description:
      "Compressing manual workflows into clicks: a 4-week regulatory tax reporting cycle now runs as a 2-click operation, saving roughly 160 hours per cycle. WESM settlement invoicing, a full workday of ~50 manual invoices, now completes in under 30 seconds with zero transcription errors.",
    showcase: [
      { value: "2 clicks", label: "Was a 4-week cycle" },
      { value: "<30s", label: "Was a full workday" },
      { value: "160 hrs", label: "Saved per cycle" },
    ],
    tools: ["n8n", "Claude Code Pipelines", "ETL Design", "AWS SES", "Custom APIs"],
    quote: "The best code is the code you never have to write because a workflow handles it.",
  },
};

export default function PandoraPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [activeExhibit, setActiveExhibit] = useState<string>("");

  useEffect(() => {
    const mm = gsap.matchMedia(containerRef);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.15 }
      );

      gsap.fromTo(
        "[data-hero-bg]",
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-ghost]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 18 },
          {
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    // Desktop deck effect: as the next exhibit slides over, the pinned one recedes.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-exhibit]");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const inner = card.querySelector("[data-exhibit-inner]");
        if (!inner) return;
        gsap.to(inner, {
          scale: 0.93,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    });

    // Mobile: simple fade-up per exhibit.
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-exhibit]").forEach((section) => {
        gsap.fromTo(
          section.querySelector("[data-exhibit-inner]"),
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%" },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveExhibit(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    document.querySelectorAll("[data-exhibit]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToExhibit = (category: string) => {
    document.getElementById(slugOf(category))?.scrollIntoView({ behavior: "smooth" });
  };

  const marqueeItems = hiddenTalents.map((t) => t.category);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <style>{`
        @keyframes pandora-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Progress rail ─────────────────────────────────────── */}
      <nav
        aria-label="Exhibit navigation"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="mb-1 h-8 w-px bg-gradient-to-b from-transparent to-border" />
        {hiddenTalents.map((talent, i) => {
          const isActive = activeExhibit === slugOf(talent.category);
          return (
            <button
              key={talent.category}
              onClick={() => scrollToExhibit(talent.category)}
              aria-label={`Go to exhibit: ${talent.category}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full border font-display text-[11px] transition-all duration-300 ${
                isActive
                  ? "scale-110 border-primary bg-primary/10 text-primary glow-gold-subtle"
                  : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {ROMAN[i]}
            </button>
          );
        })}
        <span className="mt-1 h-8 w-px bg-gradient-to-t from-transparent to-border" />
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div data-hero-bg className="absolute inset-0">
            <Image
              src="/images/music/pandora-box.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_75%)]" />
          <div className="grid-lines absolute inset-0 opacity-15" />
        </div>

        <Link
          href="/"
          className="group absolute left-6 top-8 z-20 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:left-10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="container relative z-10 mx-auto px-6 py-28 text-center">
          {/* Plaque badge */}
          <div data-hero-reveal className="mb-10 flex justify-center">
            <div className="border-gradient flex items-center gap-3 rounded-full bg-card/40 px-6 py-2.5 backdrop-blur-sm">
                            <TextScramble
                trigger="mount"
                className="font-display text-xs uppercase tracking-[0.35em] text-primary"
              >
                Private Collection
              </TextScramble>
              <span className="text-xs text-muted-foreground">· 5 exhibits</span>
            </div>
          </div>

          <h1
            data-hero-reveal
            className="mb-8 font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl"
          >
            The Hidden
            <br />
            <span className="text-gradient-gold text-shadow-glow">Dimensions</span>
          </h1>

          <p
            data-hero-reveal
            className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Beyond the code, the cloud, and the databases: a curated exhibition of
            the disciplines that shape how I build.
          </p>

          {/* Floor guide */}
          <div
            data-hero-reveal
            className="mx-auto max-w-2xl border-y border-border/60 text-left"
          >
            <div className="flex items-center justify-between px-2 py-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Floor Guide
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Room
              </span>
            </div>
            {hiddenTalents.map((talent, i) => {
              const Icon = iconMap[talent.icon as keyof typeof iconMap] || Gem;
              return (
                <button
                  key={talent.category}
                  onClick={() => scrollToExhibit(talent.category)}
                  className="group flex w-full items-center gap-5 border-t border-border/60 px-2 py-4 transition-colors hover:bg-primary/5"
                >
                  <span className="w-8 shrink-0 font-display text-sm text-primary/80">
                    {ROMAN[i]}
                  </span>
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="flex-1 font-display text-lg transition-transform duration-300 group-hover:translate-x-2 md:text-xl">
                    {talent.category}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-border/40 bg-background/60 py-4 backdrop-blur-sm">
          <div
            className="flex w-max gap-0 whitespace-nowrap motion-reduce:[animation:none]"
            style={{ animation: "pandora-marquee 32s linear infinite" }}
            aria-hidden="true"
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {marqueeItems.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-6 px-6 font-display text-sm uppercase tracking-[0.3em] text-muted-foreground/70"
                  >
                    {item}
                    <span className="text-primary">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exhibit deck ──────────────────────────────────────── */}
      <div className="relative">
        {hiddenTalents.map((talent, index) => {
          const Icon = iconMap[talent.icon as keyof typeof iconMap] || Gem;
          const details = exhibitDetails[talent.category];
          if (!details) return null;

          return (
            <section
              key={talent.category}
              id={slugOf(talent.category)}
              data-exhibit
              className="noise-overlay relative flex min-h-screen items-center overflow-hidden bg-background lg:sticky lg:top-0 lg:rounded-t-[2.5rem] lg:border-t lg:border-border/60"
            >
              {/* Room lighting */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${talent.color} opacity-[0.06]`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/60" />

              {/* Ghost numeral */}
              <div
                data-ghost
                className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[16rem] font-bold leading-none text-foreground/[0.03] md:text-[24rem] lg:right-4"
                aria-hidden="true"
              >
                {ROMAN[index]}
              </div>

              <div data-exhibit-inner className="container relative z-10 mx-auto px-6 py-24 will-change-transform">
                {/* Plaque header */}
                <div className="mb-10 flex items-center gap-4">
                  <div
                    className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${talent.color} p-0.5`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.35em] text-primary">
                      Exhibit {ROMAN[index]} · Room 0{index + 1}
                    </span>
                    <h2 className="font-display text-xl font-semibold md:text-2xl">
                      {talent.category}
                    </h2>
                  </div>
                  <div className="ml-4 hidden h-px flex-1 bg-gradient-to-r from-border to-transparent md:block" />
                </div>

                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
                  {/* Editorial column */}
                  <div className="lg:col-span-7">
                    <h3 className="text-gradient-gold mb-6 font-display text-3xl font-bold leading-tight md:text-5xl">
                      {details.headline}
                    </h3>
                    <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                      {details.description}
                    </p>

                    <div className="mb-8">
                      <h4 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Materials & Instruments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {details.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-xs font-medium text-secondary-foreground"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {details.genres && (
                      <div className="mb-8">
                        <h4 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          Genre Fluency
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {details.genres.map((genre) => (
                            <span
                              key={genre}
                              className={`rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-medium text-white ${talent.color}`}
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {details.quote && (
                      <blockquote className="border-l-2 border-primary pl-5 text-sm italic leading-relaxed text-muted-foreground md:text-base">
                        &ldquo;{details.quote}&rdquo;
                        <cite className="mt-2 block text-[10px] not-italic uppercase tracking-[0.3em] text-primary/70">
                          Curator&apos;s note
                        </cite>
                      </blockquote>
                    )}
                  </div>

                  {/* Artifact column */}
                  <div className="lg:col-span-5">
                    {details.image ? (
                      <>
                        <div className="border-gradient group relative mb-6 overflow-hidden rounded-2xl">
                          <Image
                            src={details.image}
                            alt={details.imageAlt || talent.category}
                            width={1200}
                            height={800}
                            className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                            <p className="text-xs text-white/90">{details.imageCaption}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {details.showcase.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl border border-border/60 bg-card/40 p-4 text-center backdrop-blur-sm"
                            >
                              <div className="font-display text-3xl font-bold md:text-4xl">
                                {item.value}
                              </div>
                              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        {details.showcase.map((item) => (
                          <div
                            key={item.label}
                            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 px-7 py-6 backdrop-blur-sm"
                          >
                            <div
                              className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${talent.color}`}
                            />
                            <div className="font-display text-4xl font-bold md:text-5xl">
                              {item.value}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Finale ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <span className="mb-6 block text-[10px] uppercase tracking-[0.35em] text-primary">
            End of Exhibition
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold md:text-6xl">
            The box doesn&apos;t <span className="text-gradient-gold">close</span>.
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl">
            These disciplines make me a more complete problem solver. Let&apos;s talk
            about what this perspective could do for your project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticElement strength={0.3}>
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 py-6 text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/#contact">
                  Start a Conversation
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </MagneticElement>
            <MagneticElement strength={0.3}>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6" asChild>
                <Link href="/">Back to Portfolio</Link>
              </Button>
            </MagneticElement>
          </div>
        </div>
      </section>
    </div>
  );
}
