"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, Folder, Lock, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectImageCarousel } from "@/components/ui/project-image-carousel";
import { ProjectThumb } from "@/components/work/project-thumb";
import { projects, type Project } from "@/data/portfolio-data";
import { useScrollReveal } from "@/hooks/useGSAP";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

// The bento showcases live business systems first; the first title is the large hero tile.
const FEATURED_TITLES = [
  "WeCare: Pharmacy POS & Dispensing Platform",
  "Enterprise IT Service Management Platform",
  "AI-Assisted Refund Automation",
  "Consumer Billing & Self-Service Portal",
  "Consumer E-Invoicing & Notification Platform",
  "Meter Reading Platform: Legacy Modernization",
];
const featured = FEATURED_TITLES.map((t) => projects.find((p) => p.title === t)).filter(
  (p): p is Project => Boolean(p),
);
const rest = projects.filter((p) => !featured.includes(p));

const href = (p: Project) => `/work/${slugify(p.title)}`;
const tagline = (p: Project) => p.result ?? p.description.split(/(?<=\.)\s/)[0];
const isLive = (p: Project) => !p.private && /^https?:\/\//.test(p.link);

function Meta({ project }: { project: Project }) {
  return isLive(project) ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live
    </span>
  ) : project.private ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
      <Lock className="h-3 w-3" /> Confidential
    </span>
  ) : null;
}

function FeaturedCard({ project, hero }: { project: Project; hero: boolean }) {
  const images = project.images?.length ? project.images : [];
  return (
    <Link
      href={href(project)}
     
      data-reveal
      className={cn(
        "group relative flex min-h-[18rem] flex-col justify-end overflow-hidden border border-border bg-card outline-none",
        "transition-colors duration-300 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary",
        hero && "md:col-span-2 lg:row-span-2 min-h-[24rem]",
      )}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
        {hero && images.length > 1 ? (
          <ProjectImageCarousel images={images} alt={project.title} showIndicators={false} />
        ) : (
          <ProjectThumb
            src={project.image}
            title={project.title}
            sizes={hero ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        )}
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/5" />
      <div className="relative space-y-2 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Meta project={project} />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
            <UserRound className="h-3 w-3" /> Solo build
          </span>
        </div>
        <h3 className={cn("font-display font-semibold leading-tight", hero ? "text-2xl md:text-4xl" : "text-lg md:text-xl")}>
          {project.title}
        </h3>
        <p className={cn("text-sm leading-relaxed text-foreground/80", hero ? "max-w-xl md:text-base" : "line-clamp-2")}>
          {tagline(project)}
        </p>
        <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
          Read the case study <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export function ProjectsSection() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.08 });
  const [open, setOpen] = useState(false);

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden py-28 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-background" />

      <div className="container relative z-10 mx-auto px-6">
        <div data-reveal className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-6 rounded-full border-primary/30 bg-primary/5 px-4 py-2 text-primary">
              <Folder className="mr-2 h-4 w-4" />
              Featured Work
            </Badge>
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
              Problems I&apos;ve <span className="text-primary">Solved</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Results, not just a résumé. Every project here is a solo build: I scoped, designed,
              built, and shipped each one myself. Open any project for the full case study.
            </p>
          </div>
          <Button variant="outline" className="gap-2 rounded-full hover:border-primary/50 hover:bg-primary/5" asChild>
            <Link href="https://github.com/lesjohnpaul" target="_blank" rel="noopener noreferrer">
              More on GitHub <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bento: the strongest work, compact, every tile opens its case study */}
        <div className="grid gap-4 md:grid-cols-2 lg:auto-rows-[minmax(16rem,auto)] lg:grid-cols-3">
          {featured.map((p, i) => (
            <FeaturedCard key={p.title} project={p} hero={i === 0} />
          ))}
        </div>

        {/* Everything else, collapsed into an index */}
        <div data-reveal className="mt-6 border border-border">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="project-index"
            className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-card/60 md:px-6"
          >
            <span>
              <span className="font-display text-lg font-semibold">All projects</span>
              <span className="ml-3 text-sm text-muted-foreground">
                {rest.length} more case studies: automation, infrastructure, security, and products
              </span>
            </span>
            <ChevronDown
              className={cn("h-5 w-5 shrink-0 text-primary transition-transform duration-300", open && "rotate-180")}
            />
          </button>

          {/* grid-template-rows 0fr→1fr animates height without measuring it */}
          <div
            id="project-index"
            inert={!open}
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <ul className="overflow-hidden">
              {rest.map((p) => (
                <li key={p.title} className="border-t border-border">
                  <Link
                    href={href(p)}
                   
                    className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-card/60 md:grid-cols-[5.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:px-6"
                  >
                    <span className="relative aspect-[3/2] overflow-hidden border border-border bg-card">
                      <ProjectThumb src={p.image} title={p.title} sizes="88px" className="transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold group-hover:text-primary">{p.title}</span>
                      <span className="block truncate text-sm text-muted-foreground md:hidden">{tagline(p)}</span>
                      <span className="mt-0.5 hidden md:block"><Meta project={p} /></span>
                    </span>
                    <span className="hidden truncate text-sm text-muted-foreground md:block">{tagline(p)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
