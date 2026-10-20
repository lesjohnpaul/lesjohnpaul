import type { CSSProperties } from "react";
import { Check, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { techFor, techsIn, TechIcon, type Layer, type Tech } from "@/lib/tech-icons";
import s from "./case-study.module.css";

const LAYERS: { id: Layer; label: string; tone: string }[] = [
  { id: "interface", label: "Interface", tone: "var(--t-blue)" },
  { id: "ai", label: "AI", tone: "var(--t-violet)" },
  { id: "logic", label: "Logic & APIs", tone: "var(--t-teal)" },
  { id: "data", label: "Data", tone: "var(--t-green)" },
  { id: "infra", label: "Infrastructure & delivery", tone: "var(--t-orange)" },
];

const style = (v: Record<string, string>) => v as CSSProperties;

/** Stack tags (plus tech named in the architecture text), grouped into layers with a request flowing down. */
function LayerStack({ tech, steps }: { tech: string[]; steps: string[] }) {
  const all = new Map<string, Tech>();
  for (const t of tech.map(techFor)) all.set(t.name.toLowerCase(), t);
  for (const t of techsIn(steps.join(" "), 99)) {
    if (![...all.values()].some((a) => a.brand === t.brand && a.icon === t.icon)) all.set(t.name.toLowerCase(), t);
  }
  const rows = LAYERS.map((l) => ({ ...l, items: [...all.values()].filter((t) => t.layer === l.id) })).filter(
    (r) => r.items.length,
  );
  let n = 0;
  return (
    <div aria-label="Stack by layer" className="border border-border bg-card/40 p-4 sm:p-6">
      {rows.map((r, ri) => (
        <div key={r.id} className={s.layer} style={style({ "--tone": r.tone, "--delay": `${ri * 0.35}s` })}>
          <p className={cn("mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em]", s.layerLabel)}>{r.label}</p>
          <ul className="flex flex-wrap gap-2">
            {r.items.map((t) => (
              <li
                key={t.name}
                className={cn("flex items-center gap-2 px-3 py-2 text-sm text-foreground/90", s.tile)}
                style={style({ "--i-delay": `${n++ * 0.05}s` })}
              >
                <TechIcon tech={t} className="h-5 w-5" />
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Architecture bullets as a data-flow rail; each step shows the tech it mentions. */
function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <ol className={cn("space-y-5", s.rail)}>
      {steps.map((step, i) => {
        const icons = techsIn(step);
        return (
          <li key={step} className="flex gap-4">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center border bg-background font-display text-sm font-bold",
                s.node,
              )}
              style={style({ "--node-delay": `${(i / steps.length) * 4.5}s` })}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-1">
              {icons.length > 0 && (
                <div className="mb-1.5 flex flex-wrap gap-1.5">
                  {icons.map((t) => (
                    <span key={t.name} className="inline-flex items-center gap-1.5 border border-border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">
                      <TechIcon tech={t} className="h-3.5 w-3.5" />
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="leading-relaxed text-foreground/90">{step}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ArchitectureMap({ tech, steps }: { tech: string[]; steps: string[] }) {
  return (
    <section aria-labelledby="architecture-heading" className={cn("space-y-6 border-t border-border pt-8", s.tones)}>
      <h2 id="architecture-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        Architecture
      </h2>
      <LayerStack tech={tech} steps={steps} />
      {steps.length > 0 && <FlowSteps steps={steps} />}
    </section>
  );
}

/** Stack tags as icon chips (used in the Role / Stack row). */
export function StackChips({ tech }: { tech: string[] }) {
  return (
    <>
      {tech.map(techFor).map((t) => (
        <span key={t.name} className="inline-flex items-center gap-1.5 border border-border px-2 py-1 text-xs text-foreground/85">
          <TechIcon tech={t} className="h-3.5 w-3.5" />
          {t.name}
        </span>
      ))}
    </>
  );
}

const OWNED: Record<Layer, string> = {
  interface: "UI & UX",
  ai: "AI & prompts",
  logic: "Backend & APIs",
  data: "Database",
  infra: "Infra & deployment",
};

/** "Team of one" panel: every layer this project's stack touches, owned by one person. */
export function Ownership({ role, tech }: { role: string; tech: string[] }) {
  const layers = new Set(tech.map((t) => techFor(t).layer));
  const owned = LAYERS.filter((l) => layers.has(l.id));
  return (
    <section aria-label="Who built this" className={cn("border border-primary/40 bg-primary/5 p-4 sm:p-5", s.tones)}>
      <p className="flex items-center gap-2 font-display text-lg font-semibold">
        <UserRound className="h-5 w-5 text-primary" /> Team of one
        <span className="text-sm font-normal text-muted-foreground">· {role}</span>
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        No team, no agency, no hand-offs. I owned this project end to end:
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {[{ id: "scope", label: "Requirements", tone: "var(--t-gold)" }, { id: "arch", label: "Architecture", tone: "var(--t-gold)" }, ...owned.map((l) => ({ ...l, label: OWNED[l.id] }))].map((o) => (
          <li
            key={o.id}
            className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium text-foreground/90"
            style={style({ borderColor: `color-mix(in oklch, ${o.tone} 45%, transparent)` })}
          >
            <Check className="h-3.5 w-3.5" style={{ color: o.tone }} />
            {o.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
