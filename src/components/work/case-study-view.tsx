import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, CircleAlert, CircleCheck, Lock, Sparkles } from "lucide-react";
import type { Project } from "@/data/portfolio-data";
import type { CaseStudy } from "@/data/case-studies";
import { ProjectThumb } from "./project-thumb";
import { ArchitectureMap, Ownership, StackChips } from "./architecture-map";
import { EngineeringReel } from "./engineering-reel";

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

/** Captioned screenshots: desktop shots full width, phone shots side by side in a phone-width frame. */
type GalleryShot = NonNullable<Project["gallery"]>[number];

// Width reserved from w/h before the image loads, so nothing jumps (CLS).
function Shot({ s, priority, phone, half }: { s: GalleryShot; priority?: boolean; phone?: boolean; half?: boolean }) {
  return (
    <figure className="space-y-2.5">
      <a
        href={s.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full-size screenshot: ${s.caption}`}
        className="group relative block overflow-hidden border border-border bg-black/40 transition-colors hover:border-primary/50"
        style={{ aspectRatio: `${s.w} / ${s.h}` }}
      >
        <Image
          src={s.src}
          alt={s.caption}
          fill
          sizes={phone ? "(max-width: 640px) 33vw, 200px" : half ? "(max-width: 640px) 100vw, 360px" : "(max-width: 768px) 100vw, 720px"}
          priority={priority}
          className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </a>
      <figcaption className="text-sm leading-relaxed text-muted-foreground">{s.caption}</figcaption>
    </figure>
  );
}

/** Problem → fix chapters, each followed by the screens that show the fix. */
function FixStory({ fixes, project }: { fixes: NonNullable<CaseStudy["fixes"]>; project: Project }) {
  const bySrc = new Map((project.gallery ?? []).map((g) => [g.src, g]));
  return (
    <section aria-labelledby="fixes-heading" className="space-y-10 border-t border-border pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="fixes-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          What was broken, and what fixed it
        </h2>
        {project.galleryNote && <p className="text-xs text-muted-foreground">{project.galleryNote}</p>}
      </div>
      <ol className="space-y-14">
        {fixes.map((f, i) => {
          const shots = f.shots.map((src) => bySrc.get(src)).filter((g): g is GalleryShot => Boolean(g));
          const desktop = shots.filter((g) => !g.mobile);
          const phones = shots.filter((g) => g.mobile);
          // A wide first screen leads full width; tall ones pair up so the page doesn't scroll forever.
          const lead = desktop[0] && desktop[0].w > desktop[0].h ? desktop[0] : undefined;
          const pairs = lead ? desktop.slice(1) : desktop;
          return (
            <li key={f.problem} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[3.5rem_1fr]">
                <span aria-hidden className="font-display text-3xl font-bold leading-none text-primary/70 md:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-3">
                  <p className="flex gap-2.5 leading-relaxed text-muted-foreground">
                    <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-[oklch(0.7_0.17_35)]" aria-hidden />
                    <span><span className="font-semibold text-foreground/80">Problem: </span>{f.problem}</span>
                  </p>
                  <p className="flex gap-2.5 text-lg font-medium leading-relaxed">
                    <CircleCheck className="mt-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span><span className="font-semibold text-primary">Fix: </span>{f.fix}</span>
                  </p>
                </div>
              </div>
              {lead && <Shot s={lead} />}
              {pairs.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {pairs.map((g) => <Shot key={g.src} s={g} half />)}
                </div>
              )}
              {phones.length > 0 && (
                <div className={cn("grid gap-4", phones.length === 1 ? "max-w-[11rem]" : "grid-cols-2 sm:max-w-md sm:grid-cols-3")}>
                  {phones.map((g) => <Shot key={g.src} s={g} phone />)}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Gallery({ project }: { project: Project }) {
  const shots = project.gallery ?? [];
  const desktop = shots.filter((s) => !s.mobile);
  const mobile = shots.filter((s) => s.mobile);
  return (
    <section aria-label="Screenshots" className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Inside the system</h2>
        {project.galleryNote && <p className="text-xs text-muted-foreground">{project.galleryNote}</p>}
      </div>
      <div className="space-y-8">
        {desktop.map((s, i) => <Shot key={s.src} s={s} priority={i === 0} />)}
      </div>
      {mobile.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:max-w-lg">
          {mobile.map((s) => <Shot key={s.src} s={s} phone />)}
        </div>
      )}
    </section>
  );
}

/** The full case study, rendered on its own /work/[slug] page. */
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
  // The deeper fields are optional per project (big systems have them, small ones don't).
  const deep = study as CaseStudy & Partial<{
    headline: string;
    scale: string[];
    capabilities: { group: string; items: string[] }[];
    architecture: string[];
    engineering: string[];
  }>;
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
        {deep.headline && (
          <p className="max-w-2xl font-display text-xl font-semibold leading-snug text-foreground md:text-2xl">{deep.headline}</p>
        )}
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{study.summary}</p>
        {deep.scale?.length ? (
          <ul aria-label="Scale" className="flex flex-wrap gap-2 pt-1">
            {deep.scale.map((s) => (
              <li key={s} className="border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground/85">{s}</li>
            ))}
          </ul>
        ) : null}
      </header>

      {(!project.gallery?.length || study.fixes) && (
        <div className="relative aspect-video overflow-hidden border border-border bg-card">
          <ProjectThumb src={project.image} title={project.title} sizes="(max-width: 768px) 100vw, 720px" priority />
        </div>
      )}
      {project.gallery?.length && !study.fixes ? <Gallery project={project} /> : null}

      {project.result && (
        <p className="border-l-2 border-primary pl-4 font-display text-xl font-semibold leading-snug md:text-2xl">
          {project.result}
        </p>
      )}

      <Ownership role={study.role} tech={project.tech} />

      <dl>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stack</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            <StackChips tech={project.tech} />
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
        {study.fixes ? <FixStory fixes={study.fixes} project={project} /> : <Block label="The challenge" items={study.challenge} />}
        <Block label="Approach" items={study.approach} />
        {!deep.capabilities?.length && <Block label="What I built" items={study.built} />}
      </div>

      {deep.capabilities?.length ? (
        <section aria-labelledby="capabilities-heading" className="space-y-5 border-t border-border pt-8">
          <h2 id="capabilities-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            What it does
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {deep.capabilities.map((c) => (
              <div key={c.group} className="border border-border bg-card/40 p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{c.group}</h3>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <ArchitectureMap tech={project.tech} steps={deep.architecture ?? []} />
      <EngineeringReel items={deep.engineering ?? []} />
      <Block label="Outcome" items={study.outcome} />

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
          <Link href={`/work/${next.slug}`} className="group text-sm text-muted-foreground hover:text-foreground">
            Next: <span className="font-semibold text-foreground group-hover:text-primary">{next.title}</span> →
          </Link>
        )}
      </footer>
    </article>
  );
}
