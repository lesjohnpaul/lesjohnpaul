import type { CSSProperties, ReactNode } from "react";
import { Bell, Bot, Check, FileText, Flag, Globe, Mail, MessageCircle, Moon, Send, Smartphone, Sparkles, Stamp, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import s from "./ops-scenes.module.css";

// Illustrative motion only: names and values are placeholders, labeled "simulated run" in the UI.
// Everything animates with CSS (transform, opacity, stroke-dashoffset, a registered integer property).

type Cue = "c05" | "c15" | "c25" | "c35" | "c45" | "c55" | "c65" | "c75";
const cue = (at: Cue, from?: "pop" | "fromLeft" | "fromRight") => cn(s.cue, s[at], from && s[from]);

type Tone = "trigger" | "automate" | "ai" | "decide" | "done";
const tone = (t: Tone) => `var(--s-${t})`;
const css = (v: Record<string, string | number>) => v as CSSProperties;

const Chip = ({ children, solid, color = "done", className }: { children: ReactNode; solid?: boolean; color?: Tone; className?: string }) => (
  <span
    className={cn("inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-[11px] font-semibold md:text-xs", className)}
    style={solid ? { background: tone(color), borderColor: tone(color), color: "var(--background)" } : { borderColor: tone(color), color: tone(color) }}
  >
    {children}
  </span>
);

/** A glowing core with a rotating conic ring: the "brain" each workflow passes through. */
const Core = ({ color, label, icon: Icon, className }: { color: Tone; label: string; icon: typeof Bot; className?: string }) => (
  <div className={cn("flex flex-col items-center gap-2", className)}>
    <div className={cn(s.core, "h-20 w-20 md:h-24 md:w-24")} style={css({ "--c": tone(color) })}>
      <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border bg-background md:h-14 md:w-14" style={{ borderColor: tone(color), color: tone(color) }}>
        <Icon className="h-6 w-6" />
      </span>
    </div>
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: tone(color) }}>{label}</span>
  </div>
);

/** Data comets flowing along paths in a 100x100 space (stretches with the scene). */
const Flow = ({ paths }: { paths: { d: string; color: Tone; delay?: number }[] }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
    {paths.map((p, i) => (
      <g key={i} style={{ color: tone(p.color) }}>
        <path d={p.d} className={s.track} stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d={p.d} className={s.comet} stroke="currentColor" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${p.delay ?? i * 0.45}s` }} />
      </g>
    ))}
  </svg>
);

const Burst = ({ color, at }: { color: Tone; at: string }) => (
  <span className={s.burst} style={css({ "--c": tone(color), "--at": at })} aria-hidden>
    {Array.from({ length: 8 }, (_, i) => <i key={i} style={css({ "--a": `${i * 45}deg` })} />)}
  </span>
);

const Counter = ({ to, className }: { to: number; className?: string }) => (
  <span className={cn(s.count, "tabular-nums", className)} style={css({ "--to": to })} />
);

function SupportScene() {
  const channels = [
    { icon: Globe, label: "Web chat" },
    { icon: MessageCircle, label: "Messenger" },
    { icon: Smartphone, label: "Viber" },
  ];
  return (
    <div className={s.stage}>
      <Flow paths={[
        { d: "M14 26 C 26 26, 30 50, 44 50", color: "trigger" },
        { d: "M14 50 L 44 50", color: "trigger" },
        { d: "M14 74 C 26 74, 30 50, 44 50", color: "trigger" },
        { d: "M56 50 C 62 50, 62 40, 68 40", color: "ai", delay: 0.9 },
      ]} />
      <p className="absolute left-4 top-3 flex items-center gap-1.5 text-[11px] text-muted-foreground md:left-6">
        <Moon className="h-3.5 w-3.5" /> 03:12 AM · after hours
      </p>
      <div className={cn("absolute right-4 top-3 md:right-6", cue("c65", "fromRight"))}>
        <Chip color="trigger"><Bell className="h-3 w-3" /> Owner notified</Chip>
      </div>
      <ul className="absolute left-3 top-1/2 flex -translate-y-1/2 flex-col gap-6 md:left-6 md:gap-9">
        {channels.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card"><c.icon className="h-4 w-4" style={{ color: tone("trigger") }} /></span>
            <span className="hidden lg:inline">{c.label}</span>
          </li>
        ))}
      </ul>
      <Core color="ai" label="AI agent" icon={Bot} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute right-3 top-12 flex w-[38%] flex-col gap-2 text-[11px] md:right-6 md:text-[13px]">
        <p className={cn("max-w-[90%] self-start bg-muted px-3 py-2", cue("c05"))}>Hi! Do you deliver to Cebu?</p>
        <div className="relative h-0 self-end">
          <span className={cn("absolute -top-1 right-0 flex gap-1 bg-card px-3 py-2.5", s.blip)} aria-hidden>
            {[0, 1, 2].map((d) => <span key={d} className={cn("h-1.5 w-1.5 rounded-full", s.dot)} style={{ background: tone("ai") }} />)}
          </span>
        </div>
        <p className={cn("max-w-[95%] self-end border px-3 py-2", cue("c25"))} style={{ borderColor: tone("ai"), background: `color-mix(in oklch, ${tone("ai")} 14%, transparent)` }}>
          Yes, 2 to 3 days. Want a quick call for a bulk quote?
        </p>
        <p className={cn("max-w-[90%] self-start bg-muted px-3 py-2", cue("c35"))}>Sure, tomorrow morning.</p>
        <div className={cn("relative self-end", cue("c55", "pop"))}>
          <Chip solid><Check className="h-3 w-3" /> Booked · Tue 10:00</Chip>
          <Burst color="done" at="calc(var(--loop) * 0.56)" />
        </div>
      </div>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground md:bottom-5">
        Leads answered tonight: <Counter to={37} className="font-semibold text-foreground" />
      </p>
    </div>
  );
}

function LeadGenScene() {
  const leads: [string, "Hot" | "Warm" | "Skip"][] = [
    ["Restaurant · Makati", "Hot"], ["Dental clinic · QC", "Hot"], ["Auto shop · Cebu", "Warm"], ["Salon · Pasig", "Skip"],
  ];
  const cues: Cue[] = ["c25", "c35", "c45", "c55"];
  return (
    <div className={s.stage}>
      <Flow paths={[
        { d: "M30 30 C 38 30, 40 50, 46 50", color: "automate" },
        { d: "M30 70 C 38 70, 40 50, 46 50", color: "automate" },
        { d: "M54 50 C 60 50, 60 30, 64 30", color: "ai", delay: 0.8 },
        { d: "M54 50 C 60 50, 60 62, 64 62", color: "ai", delay: 1.3 },
      ]} />
      <div className="absolute left-3 top-1/2 h-[66%] w-[27%] -translate-y-1/2 overflow-hidden md:left-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute inset-x-0 border border-border bg-card/90 p-2" style={{ top: `${i * 24}%`, left: `${i * 7}%`, right: `${(2 - i) * 7}%`, height: "48%" }}>
            <div className="mb-2 flex gap-1">{[0, 1, 2].map((d) => <span key={d} className="h-1 w-1 rounded-full bg-muted-foreground/40" />)}</div>
            <div className="space-y-1.5"><div className="h-1.5 w-3/4 bg-muted-foreground/25" /><div className="h-1.5 w-1/2 bg-muted-foreground/15" /><div className="h-1.5 w-2/3 bg-muted-foreground/15" /></div>
          </div>
        ))}
        <div className={cn("absolute inset-0", s.scan)} aria-hidden>
          <div className="h-0.5 w-full" style={{ background: tone("automate"), boxShadow: `0 0 16px 3px ${tone("automate")}` }} />
        </div>
      </div>
      <Core color="ai" label="Enrich + score" icon={Sparkles} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute right-3 top-1/2 flex w-[32%] -translate-y-1/2 flex-col gap-1.5 text-[11px] md:right-6 md:text-[12px]">
        <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Qualified leads</p>
        {leads.map(([name, score], i) => (
          <div key={name} className={cn("flex items-center justify-between gap-2 border-b border-border/70 pb-1.5", cue(cues[i], "fromLeft"))}>
            <span className={score === "Skip" ? "text-muted-foreground line-through" : "text-foreground"}>{name}</span>
            <span className="text-[10px] font-semibold uppercase" style={{ color: score === "Hot" ? tone("decide") : score === "Warm" ? tone("trigger") : "var(--muted-foreground)" }}>{score}</span>
          </div>
        ))}
        <div className={cn("relative mt-1", cue("c65", "pop"))}>
          <Chip solid><Sparkles className="h-3 w-3" /> Synced to CRM</Chip>
          <Burst color="done" at="calc(var(--loop) * 0.66)" />
        </div>
      </div>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground md:bottom-5">
        Records scanned: <Counter to={318} className="font-semibold text-foreground" />
      </p>
    </div>
  );
}

function BackOfficeScene() {
  const files = ["soa_batch_0412.csv", "refund_req_77.pdf", "invoices_oct.xlsx"];
  const fileCues: Cue[] = ["c05", "c15", "c25"];
  return (
    <div className={s.stage}>
      <Flow paths={[
        { d: "M30 32 C 38 32, 40 50, 46 50", color: "automate" },
        { d: "M30 50 L 46 50", color: "automate" },
        { d: "M30 68 C 38 68, 40 50, 46 50", color: "automate" },
        { d: "M54 50 C 60 50, 60 36, 66 36", color: "ai", delay: 1 },
      ]} />
      <div className="absolute left-3 top-1/2 flex w-[28%] -translate-y-1/2 flex-col gap-2.5 text-[11px] md:left-6 md:text-[12px]">
        <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Incoming</p>
        {files.map((f, i) => (
          <p key={f} className={cn("flex items-center gap-1.5 truncate border border-border bg-card/90 px-2 py-1.5 text-foreground/85", cue(fileCues[i], "fromLeft"))}>
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><span className="truncate">{f}</span>
          </p>
        ))}
      </div>
      <Core color="automate" label="Validate" icon={Check} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute right-3 top-1/2 flex w-[32%] -translate-y-1/2 flex-col gap-2 text-[11px] md:right-6 md:text-[12px]">
        <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Result</p>
        <p className={cn("flex items-center gap-1.5", cue("c35"))}><Check className="h-3.5 w-3.5" style={{ color: tone("done") }} /> 48 records matched</p>
        <p className={cn("flex items-center gap-1.5 border border-dashed px-2 py-1", cue("c45", "pop"))} style={{ borderColor: tone("ai"), color: tone("ai") }}>
          <Flag className="h-3.5 w-3.5" /> 2 flagged · AI: likely duplicate
        </p>
        <div className="relative h-9">
          <span className={cn("absolute left-0 top-0 inline-flex items-center gap-1.5 border-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider", s.stamp)} style={{ borderColor: tone("decide"), color: tone("decide") }}>
            <Stamp className="h-3.5 w-3.5" /> Approved
          </span>
          <span className={cn("absolute left-28 top-1", s.plane)} style={{ color: tone("done") }}><Send className="h-5 w-5" /></span>
        </div>
        <div className={cn("relative", cue("c75", "pop"))}>
          <Chip solid><Mail className="h-3 w-3" /> PDFs + emails sent</Chip>
          <Burst color="done" at="calc(var(--loop) * 0.76)" />
        </div>
      </div>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground md:bottom-5">
        Documents generated: <Counter to={48} className="font-semibold text-foreground" />
      </p>
    </div>
  );
}

function DashboardScene() {
  const bars = [72, 58, 88, 30, 64];
  return (
    <div className={s.stage}>
      <Flow paths={[
        { d: "M58 40 C 66 40, 68 34, 74 34", color: "trigger" },
        { d: "M58 60 C 66 60, 70 66, 80 66", color: "trigger", delay: 0.7 },
      ]} />
      <p className="absolute left-4 top-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:left-6">Collections today · by branch</p>
      <div className="absolute bottom-10 left-4 top-12 flex w-[52%] items-end gap-2 md:left-6 md:gap-3">
        {bars.map((h, i) => (
          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
            {i === 3 && (
              <div className={cn("absolute left-1/2 z-10 -translate-x-1/2", cue("c45", "pop"))} style={{ bottom: `calc(${h * 0.8}% + 26px)` }}>
                <Chip color="decide" className="bg-background">Falling behind</Chip>
              </div>
            )}
            {i === 3 && (
              <span className="absolute left-1/2 z-0 h-8 w-8 -translate-x-1/2" style={{ bottom: `calc(${h * 0.8}% - 16px)` }} aria-hidden>
                <span className={s.ripple} style={css({ "--c": tone("decide") })} />
              </span>
            )}
            <div
              className={cn("w-full", s.grow, i !== 3 && s.shimmer, i === 3 && "border border-dashed")}
              style={{
                height: `${h * 0.8}%`,
                animationDelay: `${i * 0.08}s`,
                ...(i === 3
                  ? { borderColor: tone("decide"), background: `color-mix(in oklch, ${tone("decide")} 18%, transparent)` }
                  : { background: `linear-gradient(to top, color-mix(in oklch, ${tone("trigger")} 30%, transparent), color-mix(in oklch, ${tone("trigger")} 80%, transparent))`, borderTop: `2px solid ${tone("trigger")}` }),
              }}
            />
            <span className="mt-1.5 text-center text-[10px] text-muted-foreground">B{i + 1}</span>
          </div>
        ))}
      </div>
      <div className={cn("absolute right-4 top-[22%] flex h-28 w-44 flex-col justify-between border border-border bg-card/90 p-3 md:right-6 md:h-32 md:w-52", cue("c55", "pop"))}>
        <span className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Tv className="h-3.5 w-3.5" /> Office TV</span>
          <span className="flex items-center gap-1 font-semibold" style={{ color: tone("done") }}><span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: tone("done") }} /> LIVE</span>
        </span>
        <span className="font-display text-2xl font-bold md:text-3xl">₱<Counter to={482} />K</span>
        <span className="text-[10px] text-muted-foreground">collected so far today</span>
      </div>
      <div className={cn("absolute bottom-10 right-8 flex h-20 w-11 flex-col items-center justify-center gap-1 border border-border bg-card/90 md:right-10", cue("c65", "pop"))}>
        <Smartphone className="h-4 w-4" style={{ color: tone("trigger") }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: tone("done") }} />
      </div>
    </div>
  );
}

function AnalyticsScene() {
  return (
    <div className={s.stage}>
      <div className="absolute inset-y-6 left-4 w-[58%] md:left-6">
        <p className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Item A stock · branch 2</p>
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <line x1="0" y1="104" x2="300" y2="104" stroke="var(--border)" strokeDasharray="3 4" />
          <path className={s.draw} pathLength={1} d="M0 40 L40 44 L80 38 L120 46 L160 52 L190 62" fill="none" stroke="var(--foreground)" strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round" />
          <path className={s.until70} d="M190 62 L230 82 L262 104" fill="none" stroke="var(--s-decide)" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
          <path className={s.drawLate} pathLength={1} d="M190 62 L230 54 L300 48" fill="none" stroke="var(--s-done)" strokeWidth="3" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px var(--s-done))" }} />
        </svg>
        <span className="absolute bottom-[10%] right-0 text-[10px] text-muted-foreground">stockout</span>
        <span className={cn("absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2", cue("c45", "pop"))} style={{ left: "63.3%", top: "51.7%" }}>
          <span className={s.ripple} style={css({ "--c": tone("decide") })} />
          <span className="absolute inset-[3px] rounded-full" style={{ background: tone("decide") }} />
        </span>
        <div className={cn("absolute right-0 top-0", cue("c75", "pop"))}>
          <Chip solid><Check className="h-3 w-3" /> Stockout prevented</Chip>
          <Burst color="done" at="calc(var(--loop) * 0.76)" />
        </div>
      </div>
      <Flow paths={[{ d: "M40 52 C 52 52, 56 34, 66 34", color: "ai", delay: 0.5 }]} />
      <div className={cn("absolute right-4 top-1/2 w-[34%] -translate-y-1/2 border bg-background/95 p-3 text-[12px] leading-relaxed md:right-6 md:p-4 md:text-[13px]", cue("c55", "fromRight"))} style={{ borderColor: tone("ai"), boxShadow: `0 0 0 6px color-mix(in oklch, ${tone("ai")} 12%, transparent), 0 0 40px -8px ${tone("ai")}` }}>
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: tone("ai") }}>
          <Sparkles className="h-3.5 w-3.5" /> AI suggestion
        </p>
        <p className="text-foreground/90">Item A at branch 2 runs out by Thursday at this pace. Transfer stock from branch 4 today, where it is moving slowly.</p>
      </div>
    </div>
  );
}

const scenes: Record<string, () => ReactNode> = {
  support: SupportScene,
  leadgen: LeadGenScene,
  backoffice: BackOfficeScene,
  dashboards: DashboardScene,
  analytics: AnalyticsScene,
};

/** Mount with `key={id}` so CSS animations restart from frame 0 when the operation changes. */
export function OpsScene({ id, playing }: { id: string; playing: boolean }) {
  const Scene = scenes[id];
  if (!Scene) return null;
  return (
    <div className={s.scene} data-playing={playing} aria-hidden>
      <Scene />
    </div>
  );
}
