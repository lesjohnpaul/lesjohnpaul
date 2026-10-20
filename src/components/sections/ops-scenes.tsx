import type { ReactNode } from "react";
import { Bell, Check, FileText, Flag, Moon, Send, Smartphone, Sparkles, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import s from "./ops-scenes.module.css";

// Illustrative motion only: names and values are placeholders, labeled "simulated run" in the UI.

type Cue = "c05" | "c15" | "c25" | "c35" | "c45" | "c55" | "c65" | "c75";
const cue = (at: Cue, from?: "pop" | "fromLeft" | "fromRight") => cn(s.cue, s[at], from && s[from]);

type Tone = "trigger" | "automate" | "ai" | "decide" | "done";
const tone = (t: Tone) => `var(--k-${t})`;

const Chip = ({ children, solid, color = "done", className }: { children: ReactNode; solid?: boolean; color?: Tone; className?: string }) => (
  <span
    className={cn("inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-[11px] font-semibold", className)}
    style={
      solid
        ? { background: tone(color), borderColor: tone(color), color: "var(--background)" }
        : { borderColor: tone(color), color: tone(color) }
    }
  >
    {children}
  </span>
);

function SupportScene() {
  return (
    <>
      <p className="absolute left-4 top-3 flex items-center gap-1.5 text-[11px] text-muted-foreground md:left-6">
        <Moon className="h-3.5 w-3.5" /> 03:12 AM · after hours
      </p>
      <div className={cn("absolute right-4 top-3 md:right-6", cue("c65", "fromRight"))}>
        <Chip color="trigger"><Bell className="h-3 w-3" /> Owner notified</Chip>
      </div>
      <div className="absolute inset-x-0 bottom-4 mx-auto flex w-[min(22rem,88%)] flex-col gap-2 text-[12px] md:bottom-6 md:text-[13px]">
        <p className={cn("max-w-[78%] self-start bg-muted px-3 py-2 text-foreground", cue("c05"))}>
          Hi! Do you deliver to Cebu?
        </p>
        <div className="relative h-0 self-end">
          <span className={cn("absolute right-0 -top-1 flex gap-1 bg-card px-3 py-2.5", s.blip)} aria-hidden>
            {[0, 1, 2].map((d) => <span key={d} className={cn("h-1.5 w-1.5 rounded-full", s.dot)} style={{ background: tone("ai") }} />)}
          </span>
        </div>
        <p className={cn("max-w-[82%] self-end border px-3 py-2 text-foreground", cue("c25"))} style={{ borderColor: tone("ai"), background: `color-mix(in oklch, ${tone("ai")} 14%, transparent)` }}>
          Yes, 2 to 3 days. Want me to book a quick call for a bulk quote?
        </p>
        <p className={cn("max-w-[78%] self-start bg-muted px-3 py-2 text-foreground", cue("c35"))}>Sure, tomorrow morning.</p>
        <div className={cn("self-end", cue("c55", "pop"))}>
          <Chip solid><Check className="h-3 w-3" /> Booked · Tue 10:00</Chip>
        </div>
      </div>
    </>
  );
}

function LeadGenScene() {
  const leads: [string, "Hot" | "Warm" | "Skip"][] = [
    ["Restaurant · Makati", "Hot"],
    ["Dental clinic · QC", "Hot"],
    ["Auto shop · Cebu", "Warm"],
    ["Salon · Pasig", "Skip"],
  ];
  const cues: Cue[] = ["c15", "c25", "c35", "c45"];
  return (
    <div className="absolute inset-0 grid grid-cols-[0.8fr_1fr] items-center gap-4 px-4 md:gap-6 md:px-6">
      {/* Sources being scanned */}
      <div className="relative h-[78%] overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-x-0 border border-border bg-card/80 p-2"
            style={{ top: `${i * 22}%`, left: `${i * 6}%`, right: `${(2 - i) * 6}%`, height: "52%" }}
          >
            <div className="mb-2 flex gap-1">
              {[0, 1, 2].map((d) => <span key={d} className="h-1 w-1 rounded-full bg-muted-foreground/40" />)}
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-3/4 bg-muted-foreground/25" />
              <div className="h-1.5 w-1/2 bg-muted-foreground/15" />
              <div className="h-1.5 w-2/3 bg-muted-foreground/15" />
            </div>
          </div>
        ))}
        <div className={cn("absolute inset-0", s.scan)} aria-hidden>
          <div className="h-px w-full" style={{ background: tone("automate"), boxShadow: `0 0 14px 2px ${tone("automate")}` }} />
        </div>
      </div>
      {/* Extracted, scored leads */}
      <div className="flex flex-col gap-1.5 text-[11px] md:text-[12px]">
        <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Qualified leads</p>
        {leads.map(([name, score], i) => (
          <div key={name} className={cn("flex items-center justify-between gap-2 border-b border-border/70 pb-1.5", cue(cues[i], "fromLeft"))}>
            <span className={score === "Skip" ? "text-muted-foreground line-through" : "text-foreground"}>{name}</span>
            <span className="text-[10px] font-semibold uppercase" style={{ color: score === "Hot" ? tone("decide") : score === "Warm" ? tone("trigger") : "var(--muted-foreground)" }}>{score}</span>
          </div>
        ))}
        <div className={cn("mt-1", cue("c65", "pop"))}>
          <Chip solid><Sparkles className="h-3 w-3" /> Synced to CRM · drafts ready</Chip>
        </div>
      </div>
    </div>
  );
}

function BackOfficeScene() {
  const files = ["soa_batch_0412.csv", "refund_req_77.pdf", "invoices_oct.xlsx"];
  const fileCues: Cue[] = ["c05", "c15", "c25"];
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 text-[11px] md:gap-6 md:px-6 md:text-[12px]">
      <div className="flex flex-col gap-1.5">
        <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Incoming</p>
        {files.map((f, i) => (
          <p key={f} className={cn("flex items-center gap-1.5 truncate border border-border bg-card/80 px-2 py-1.5 text-foreground/85", cue(fileCues[i], "fromLeft"))}>
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{f}</span>
          </p>
        ))}
      </div>
      {/* Processor */}
      <div className="relative flex h-16 w-16 items-center justify-center md:h-20 md:w-20">
        <span className={cn("absolute inset-0 rounded-full border border-dashed", s.spin)} style={{ borderColor: tone("automate") }} aria-hidden />
        <span className="absolute inset-3 rounded-full" style={{ background: `color-mix(in oklch, ${tone("automate")} 14%, transparent)` }} aria-hidden />
        <span className="relative text-[10px] font-semibold uppercase tracking-wider" style={{ color: tone("automate") }}>Validate</span>
        <span className="absolute left-full top-1/2 hidden h-px w-6 overflow-hidden bg-border md:block" aria-hidden>
          <span className={cn("block h-full w-1/3", s.flow)} style={{ background: tone("automate") }} />
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Result</p>
        <p className={cn("flex items-center gap-1.5 text-foreground", cue("c35"))}><Check className="h-3.5 w-3.5" style={{ color: tone("done") }} /> 48 records matched</p>
        <p className={cn("flex items-center gap-1.5 border border-dashed px-2 py-1", cue("c45", "pop"))} style={{ borderColor: tone("ai"), color: tone("ai") }}>
          <Flag className="h-3.5 w-3.5" /> 2 flagged · AI: likely duplicate
        </p>
        <p className={cn("flex items-center gap-1.5 text-foreground", cue("c55"))}><Check className="h-3.5 w-3.5" style={{ color: tone("decide") }} /> Approved by you</p>
        <div className={cn("mt-1", cue("c65", "pop"))}>
          <Chip solid><Send className="h-3 w-3" /> PDFs + emails sent</Chip>
        </div>
      </div>
    </div>
  );
}

function DashboardScene() {
  const bars = [72, 58, 88, 30, 64];
  return (
    <div className="absolute inset-0 grid grid-cols-[1.4fr_1fr] items-end gap-4 px-4 pb-5 pt-10 md:gap-8 md:px-6">
      <p className="absolute left-4 top-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:left-6">Collections today · by branch</p>
      <div className="flex h-full items-end gap-2 md:gap-3">
        {bars.map((h, i) => (
          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
            {i === 3 && (
              <div
                className={cn("absolute left-1/2 z-10 -translate-x-1/2", cue("c45", "pop"))}
                style={{ bottom: `calc(${h * 0.72}% + 26px)` }}
              >
                <Chip color="decide" className="bg-background">Falling behind</Chip>
              </div>
            )}
            <div
              className={cn("w-full", s.grow, i === 3 && "border border-dashed")}
              style={{
                height: `${h * 0.72}%`,
                animationDelay: `${i * 0.08}s`,
                ...(i === 3
                  ? { borderColor: tone("decide"), background: `color-mix(in oklch, ${tone("decide")} 18%, transparent)` }
                  : {
                      background: `linear-gradient(to top, color-mix(in oklch, ${tone("trigger")} 30%, transparent), color-mix(in oklch, ${tone("trigger")} 75%, transparent))`,
                      borderTop: `2px solid ${tone("trigger")}`,
                    }),
              }}
            />
            <span className="mt-1.5 text-center text-[10px] text-muted-foreground">B{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="flex h-full items-end justify-center gap-3 pb-5">
        <div className={cn("relative flex h-20 w-28 items-center justify-center border border-border bg-card/80 md:h-24 md:w-36", cue("c55", "pop"))}>
          <Tv className="h-6 w-6 text-primary" />
          <span className="absolute right-2 top-2 flex items-center gap-1 text-[9px] font-semibold" style={{ color: tone("done") }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone("done") }} /> LIVE
          </span>
        </div>
        <div className={cn("flex h-16 w-9 items-center justify-center border border-border bg-card/80 md:h-20 md:w-11", cue("c65", "pop"))}>
          <Smartphone className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsScene() {
  return (
    <div className="absolute inset-0 grid grid-cols-1 items-center gap-3 px-4 md:grid-cols-[1.25fr_1fr] md:gap-6 md:px-6">
      <div className="relative h-[72%] md:h-[78%]">
        <p className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Item A stock · branch 2</p>
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <line x1="0" y1="104" x2="300" y2="104" stroke="var(--border)" strokeDasharray="3 4" />
          <text x="296" y="100" textAnchor="end" fontSize="8" fill="var(--muted-foreground)">stockout</text>
          {/* Actual history */}
          <path className={s.draw} pathLength={1} d="M0 40 L40 44 L80 38 L120 46 L160 52 L190 62" fill="none" stroke="var(--foreground)" strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round" />
          {/* Risky forecast */}
          <path className={s.until70} d="M190 62 L230 82 L262 104" fill="none" stroke="var(--k-decide)" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
          {/* Corrected forecast after the suggestion */}
          <path className={s.drawLate} pathLength={1} d="M190 62 L230 54 L300 48" fill="none" stroke="var(--k-done)" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        {/* Anomaly marker at the turn */}
        <span className={cn("absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2", cue("c45", "pop"))} style={{ left: "63.3%", top: "51.7%" }}>
          <span className={cn("absolute inset-0 rounded-full border", s.ring)} style={{ borderColor: tone("decide") }} />
          <span className="absolute inset-[3px] rounded-full" style={{ background: tone("decide") }} />
        </span>
        <div className={cn("absolute right-0 top-0", cue("c75", "pop"))}>
          <Chip solid><Check className="h-3 w-3" /> Stockout prevented</Chip>
        </div>
      </div>
      <div className={cn("hidden border bg-background/90 p-3 text-[12px] leading-relaxed md:block", cue("c55", "fromRight"))} style={{ borderColor: tone("ai"), boxShadow: `0 0 0 4px color-mix(in oklch, ${tone("ai")} 12%, transparent)` }}>
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: tone("ai") }}>
          <Sparkles className="h-3 w-3" /> AI suggestion
        </p>
        <p className="text-foreground/90">
          Item A at branch 2 runs out by Thursday at this pace. Transfer stock from branch 4 today, where it is moving slowly.
        </p>
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
