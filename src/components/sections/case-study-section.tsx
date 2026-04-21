"use client";

// Flagship case study — the one section designed specifically for a
// technical hiring manager's 2-minute scan. Problem / Approach / Architecture
// / Outcome / Reflection, with a hand-crafted SVG diagram as centerpiece.
//
// No GSAP. One IntersectionObserver fades the section in. Everything else
// is static typography + the SVG's built-in dash animation.

import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Layers,
  ListChecks,
  Target,
  Trophy,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AzureMigrationDiagram } from "@/components/ui/azure-migration-diagram";
import { caseStudy } from "@/data/portfolio-data";

export function CaseStudySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-revealed");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="case-study"
      className="case-study relative py-28 md:py-36 overflow-hidden"
    >
      {/* Background — tight, minimal. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/15 to-background" />
      <div className="absolute inset-0 grid-lines-subtle opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header block */}
        <header className="case-study__reveal mb-14 md:mb-20 max-w-3xl">
          <Badge
            variant="outline"
            className="px-3 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary mb-6 font-mono text-[0.7rem] uppercase tracking-[0.2em]"
          >
            <Target className="w-3.5 h-3.5 mr-2" />
            {caseStudy.eyebrow}
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-6 max-w-[22ch]">
            {caseStudy.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {caseStudy.subtitle}
          </p>

          {/* Role + period chips */}
          <div className="flex flex-wrap items-center gap-3 mt-6 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/40">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {caseStudy.role}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-card/40">
              {caseStudy.period}
            </span>
          </div>
        </header>

        {/* Two-column: sticky sidebar + scrollable content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* SIDEBAR — outcomes + stack + artifact links */}
          <aside className="case-study__reveal lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Outcomes */}
              <div>
                <div className="flex items-center gap-2 text-[0.7rem] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  Outcomes
                </div>
                <dl className="space-y-3">
                  {caseStudy.outcomes.map((outcome) => (
                    <div
                      key={outcome.label}
                      className="flex items-baseline justify-between gap-4 py-3 border-b border-border/60"
                    >
                      <dt className="text-sm text-muted-foreground">
                        {outcome.label}
                      </dt>
                      <dd className="font-display text-2xl font-bold text-primary tabular-nums">
                        {outcome.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Stack */}
              <div>
                <div className="flex items-center gap-2 text-[0.7rem] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  Stack
                </div>
                <ul className="flex flex-wrap gap-2">
                  {caseStudy.stack.map((item) => (
                    <li
                      key={item}
                      className="px-3 py-1 rounded-full text-xs bg-secondary/80 text-secondary-foreground border border-border"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verification links — proof this isn't vaporware */}
              {caseStudy.ctaLinks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[0.7rem] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    Verify
                  </div>
                  <ul className="space-y-2">
                    {caseStudy.ctaLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* STORY column */}
          <div className="case-study__reveal lg:col-span-8 space-y-14">
            {/* PROBLEM */}
            <Block icon={<Target className="w-4 h-4" />} label="Problem">
              <p className="text-foreground/85 text-lg leading-relaxed">
                {caseStudy.problem}
              </p>
            </Block>

            {/* APPROACH */}
            <Block icon={<ListChecks className="w-4 h-4" />} label="Approach">
              <ol className="space-y-4">
                {caseStudy.approach.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-4 group"
                  >
                    <span
                      aria-hidden
                      className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/40 bg-primary/5 flex items-center justify-center font-mono text-xs text-primary tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground/85 leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Block>

            {/* ARCHITECTURE */}
            <Block icon={<Layers className="w-4 h-4" />} label="Architecture">
              <AzureMigrationDiagram />
            </Block>

            {/* REFLECTION — the line that signals seniority */}
            <Block icon={<Lightbulb className="w-4 h-4" />} label="What I'd tell the next engineer">
              <blockquote className="relative pl-0 text-foreground/85 text-lg leading-relaxed">
                <span
                  aria-hidden
                  className="font-display absolute -left-1 -top-6 text-6xl leading-none text-primary/40 select-none"
                >
                  &ldquo;
                </span>
                <span className="block pl-8 italic">{caseStudy.reflection}</span>
              </blockquote>
            </Block>
          </div>
        </div>
      </div>
    </section>
  );
}

// Small internal helper — keeps the block headers visually consistent
// without inventing a new primitive.
function Block({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20">
          {icon}
        </span>
        <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </h3>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      <div>{children}</div>
    </div>
  );
}
