import Link from "next/link";
import { ArrowRight, ArrowUpRight, Lock, Sparkles } from "lucide-react";
import type { Project } from "@/data/portfolio-data";
import type { CaseStudy } from "@/data/case-studies";
import { ProjectThumb } from "./project-thumb";

const isLive = (p: Project) => !p.private && /^https?:\/\//.test(p.link);

function Block({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="grid gap-3 border-t border-border pt-6 md:grid-cols-[10rem_1fr] md:gap-8">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-foreground/90">
            <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Shared by the /work/[slug] page and the homepage side panel, so both always say the same thing. */
export function CaseStudyView({
  project,
  study,
  next,
  headingId,
}: {
  project: Project;
  study: CaseStudy;
  next?: { title: string; slug: string };
  headingId?: string;
}) {
  return (
    <article className="space-y-10">
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="border border-primary/40 px-2.5 py-1 font-semibold text-primary">{study.status}</span>
          <span className="text-muted-foreground">{study.client}</span>
          {project.private && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" /> Confidential system, demo on request
            </span>
          )}
        </div>
        <h1 id={headingId} className="font-display text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl">
          {project.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{study.summary}</p>
      </header>

      <div className="relative aspect-video overflow-hidden border border-border bg-card">
        <ProjectThumb src={project.image} title={project.title} sizes="(max-width: 768px) 100vw, 720px" priority />
      </div>

      {project.result && (
        <p className="border-l-2 border-primary pl-4 font-display text-xl font-semibold leading-snug md:text-2xl">
          {project.result}
        </p>
      )}

      <dl className="grid gap-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Role</dt>
          <dd className="mt-1.5 text-sm">{study.role}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stack</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="border border-border px-2 py-0.5 text-xs text-foreground/80">{t}</span>
            ))}
          </dd>
        </div>
      </dl>

      {study.aiAngle && (
        <p className="flex gap-3 border border-[oklch(0.72_0.19_300/0.45)] bg-[oklch(0.72_0.19_300/0.08)] p-4 leading-relaxed">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.72_0.19_300)]" />
          <span><span className="font-semibold">Where AI does the work: </span>{study.aiAngle}</span>
        </p>
      )}

      <div className="space-y-8">
        <Block label="The challenge" items={study.challenge} />
        <Block label="Approach" items={study.approach} />
        <Block label="What I built" items={study.built} />
        <Block label="Outcome" items={study.outcome} />
      </div>

      <footer className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Have a similar problem? Book a call <ArrowRight className="h-4 w-4" />
          </Link>
          {isLive(project) && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-semibold hover:border-primary/50"
            >
              Visit live <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
        {next && (
          <Link href={`/work/${next.slug}`} scroll={false} className="group text-sm text-muted-foreground hover:text-foreground">
            Next: <span className="font-semibold text-foreground group-hover:text-primary">{next.title}</span> →
          </Link>
        )}
      </footer>
    </article>
  );
}
