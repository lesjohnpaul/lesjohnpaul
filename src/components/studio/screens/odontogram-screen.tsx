"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type SVGProps } from "react";
import { X } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";

type Odontogram = Extract<Screen, { type: "odontogram" }>;
type Props = { screen: Odontogram };
type Condition = Odontogram["patients"][number]["teeth"][number]["condition"];

// Colour + letter + glyph mark, so no condition is told apart by colour alone.
const COND: Record<Condition, { label: string; short: string; color: string }> = {
  healthy: { label: "Healthy", short: "", color: "oklch(0.88 0.01 260)" },
  caries: { label: "Caries", short: "C", color: "oklch(0.7 0.19 30)" },
  filled: { label: "Filled", short: "F", color: "oklch(0.74 0.13 240)" },
  crown: { label: "Crown", short: "Cr", color: "oklch(0.74 0.15 300)" },
  root_canal: { label: "Root canal", short: "RC", color: "oklch(0.78 0.12 175)" },
  extraction: { label: "For extraction", short: "X", color: "oklch(0.7 0.2 355)" },
  missing: { label: "Missing", short: "M", color: "oklch(0.62 0.01 260)" },
};
const ORDER = Object.keys(COND) as Condition[];

// FDI: quadrant 1 upper right, 2 upper left, 3 lower left, 4 lower right. Charted as seen facing the patient.
const UPPER = [[18, 17, 16, 15, 14, 13, 12, 11], [21, 22, 23, 24, 25, 26, 27, 28]];
const LOWER = [[48, 47, 46, 45, 44, 43, 42, 41], [31, 32, 33, 34, 35, 36, 37, 38]];
const QUAD = ["", "upper right", "upper left", "lower left", "lower right"];
const KIND = ["", "central incisor", "lateral incisor", "canine", "first premolar", "second premolar", "first molar", "second molar", "third molar"];
// Molars are drawn wider than incisors; these are also the phone tap widths (all at least 44px).
const WIDTH = [0, 44, 44, 44, 46, 46, 54, 54, 54];

const toothName = (n: number) => `${QUAD[Math.floor(n / 10)]} ${KIND[n % 10]}`;

function summarise(chart: Record<number, Condition>): string {
  const n: Partial<Record<Condition, number>> = {};
  for (const c of Object.values(chart)) if (c !== "healthy") n[c] = (n[c] ?? 0) + 1;
  const plural = (k: number, w: string) => `${k} ${w}${k > 1 ? "s" : ""}`;
  const parts = [
    n.caries && `${n.caries} caries`,
    n.filled && `${n.filled} filled`,
    n.crown && plural(n.crown, "crown"),
    n.root_canal && plural(n.root_canal, "root canal"),
    n.extraction && `${n.extraction} for extraction`,
    n.missing && `${n.missing} missing`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "All 32 teeth healthy";
}

export function ToothIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 3c-2.5 0-4 2-4 4.5 0 2.2 1 3.6 1.6 5.3.6 1.8.9 4 1.4 6.2.3 1.4.8 2 1.5 2s1.1-.8 1.4-2.2c.3-1.5.7-3.3 1.6-3.3h1c.9 0 1.3 1.8 1.6 3.3.3 1.4.7 2.2 1.4 2.2s1.2-.6 1.5-2c.5-2.2.8-4.4 1.4-6.2.6-1.7 1.6-3.1 1.6-5.3C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z" />
    </svg>
  );
}

function Glyph({ tooth, upper, cond }: { tooth: number; upper: boolean; cond: Condition }) {
  const pos = tooth % 10;
  const w = pos <= 3 ? 24 : pos <= 5 ? 30 : 38;
  const H = 56;
  const c = COND[cond].color;
  const missing = cond === "missing";
  const tint = (pct: number) => `color-mix(in oklch, ${c} ${pct}%, transparent)`;
  const crownFill = cond === "healthy" ? "rgb(255 255 255 / 0.14)" : cond === "crown" ? tint(70) : missing ? "none" : tint(28);
  const crownStroke = cond === "healthy" ? "rgb(255 255 255 / 0.4)" : c;
  const rootFill = cond === "root_canal" ? tint(75) : missing ? "none" : "rgb(255 255 255 / 0.07)";
  const rootStroke = cond === "root_canal" ? c : missing ? c : "rgb(255 255 255 / 0.25)";
  const dash = missing ? "3 3" : undefined;
  const roots =
    pos >= 6
      ? [`M${w * 0.14} 27 L${w * 0.26} 3 L${w * 0.44} 27`, `M${w * 0.56} 27 L${w * 0.74} 3 L${w * 0.86} 27`]
      : [`M${w * 0.24} 27 Q${w * 0.5} -4 ${w * 0.76} 27`];
  // Drawn as an upper tooth (roots up); lower teeth are mirrored so crowns face the bite line.
  const flip = upper ? undefined : `translate(0 ${H}) scale(1 -1)`;
  const crownMid = upper ? 41 : H - 41;

  return (
    <svg viewBox={`-1 -1 ${w + 2} ${H + 2}`} width={w + 2} height={H + 2} aria-hidden className="shrink-0 overflow-visible">
      <g transform={flip} opacity={missing ? 0.75 : 1}>
        {roots.map((d, i) => (
          <path key={i} d={d} fill={rootFill} stroke={rootStroke} strokeWidth={1.25} strokeDasharray={dash} strokeLinejoin="round" />
        ))}
        <rect x={1} y={26} width={w - 2} height={29} rx={pos <= 3 ? 6 : 9} fill={crownFill} stroke={crownStroke} strokeWidth={1.5} strokeDasharray={dash} />
        {cond === "caries" && <circle cx={w * 0.62} cy={36} r={3.2} fill={c} />}
        {cond === "filled" && <rect x={w / 2 - 5} y={35} width={10} height={9} rx={1.5} fill={c} />}
      </g>
      {cond === "extraction" && (
        <path d={`M2 4 L${w - 2} ${H - 4} M${w - 2} 4 L2 ${H - 4}`} stroke={c} strokeWidth={2.25} strokeLinecap="round" />
      )}
      {COND[cond].short && cond !== "extraction" && (
        <text
          x={w / 2}
          y={crownMid + (cond === "caries" || cond === "filled" ? (upper ? 10 : -6) : 4)}
          textAnchor="middle"
          fontSize={cond === "caries" || cond === "filled" ? 8 : 10}
          fontWeight={700}
          fill={cond === "crown" ? "oklch(0.16 0.015 260)" : "oklch(0.96 0.005 260)"}
        >
          {COND[cond].short}
        </text>
      )}
    </svg>
  );
}

export function OdontogramScreen({ screen }: Props) {
  const { patients } = screen;
  const [active, setActive] = useState(0);
  const [charts, setCharts] = useState<Record<number, Condition>[]>(() =>
    patients.map((p) => Object.fromEntries(p.teeth.map((t) => [t.tooth, t.condition]))),
  );
  const [open, setOpen] = useState<number | null>(null);
  const teeth = useRef(new Map<number, HTMLButtonElement>());
  const picker = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pickerId = useId();

  const chart = charts[active];
  const condOf = (n: number): Condition => chart[n] ?? "healthy";

  // Phones see the chart from the midline out, like a dentist facing the patient.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  // Opening the picker moves focus onto the tooth's current condition.
  useEffect(() => {
    if (open !== null) picker.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
  }, [open]);

  function close(focusTooth = true) {
    const n = open;
    setOpen(null);
    if (focusTooth && n !== null) teeth.current.get(n)?.focus();
  }

  function setCondition(n: number, c: Condition) {
    setCharts((prev) => prev.map((ch, i) => (i === active ? { ...ch, [n]: c } : ch)));
    close();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && open !== null) {
      e.preventDefault();
      close();
    }
  }

  const findings = (ch: Record<number, Condition>) => Object.values(ch).filter((c) => c !== "healthy").length;

  const arch = (rows: number[][], upper: boolean) =>
    rows.map((half, h) => (
      <div key={`${upper ? "u" : "l"}${h}`} className={cn("flex gap-1", h === 0 ? "justify-end" : "justify-start")}>
        {half.map((n) => {
          const c = condOf(n);
          const on = open === n;
          return (
            <button
              key={n}
              type="button"
              ref={(el) => {
                if (el) teeth.current.set(n, el);
                else teeth.current.delete(n);
              }}
              aria-label={`Tooth ${n}, ${toothName(n)}: ${COND[c].label}`}
              aria-expanded={on}
              aria-controls={on ? pickerId : undefined}
              onClick={() => (on ? close() : setOpen(n))}
              style={{ flex: `${WIDTH[n % 10]} 1 ${WIDTH[n % 10]}px` }}
              className={cn(
                s.press,
                "flex min-h-11 flex-col items-center justify-end gap-1 rounded-lg border px-0.5 pt-1.5 pb-1",
                on ? s.selected : "border-transparent hover:border-white/15 hover:bg-white/[0.05]",
              )}
            >
              <Glyph tooth={n} upper={upper} cond={c} />
              <span className={cn(s.num, "text-[10px] leading-none", on ? "text-[var(--gold)]" : s.faint)}>{n}</span>
            </button>
          );
        })}
      </div>
    ));

  const [upperR, upperL] = arch(UPPER, true);
  const [lowerR, lowerL] = arch(LOWER, false);
  const tooth = open;
  const toothCond = tooth === null ? null : condOf(tooth);

  return (
    <div className={cn(s.stagger, "grid gap-3 sm:gap-4")} onKeyDown={onKey}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Patients">
        {patients.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setActive(i);
                setOpen(null);
              }}
              className={cn(
                s.press,
                "flex min-h-11 max-w-full items-center gap-2 rounded-full border px-4 text-sm font-medium",
                on ? s.selected : s.interactive,
              )}
            >
              <span className="truncate">{p.name}</span>
              <span className={cn(s.pill, s.num, "px-1.5 py-0 text-[11px]", on && s.pillGold)}>{findings(charts[i])}</span>
            </button>
          );
        })}
      </div>

      <div className={cn(s.tile, "grid gap-x-6 gap-y-1 rounded-xl px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center")}>
        <div className="min-w-0">
          <p className={s.label}>Chart summary</p>
          <p className={cn(s.num, "text-sm font-medium")} aria-live="polite">
            {patients[active].name}: {summarise(chart)}
          </p>
        </div>
        {patients[active].note && <p className={cn(s.muted, "min-w-0 text-sm sm:max-w-xs sm:text-right")}>{patients[active].note}</p>}
      </div>

      <div className={cn(s.tile, "min-w-0 overflow-hidden rounded-xl")}>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 border-b border-white/10 px-4 py-3" aria-label="Legend">
          {ORDER.map((k) => (
            <li key={k} className={cn(s.muted, "flex items-center gap-1.5 text-xs")}>
              <span
                aria-hidden
                className="flex h-4 min-w-4 items-center justify-center rounded px-0.5 text-[9px] font-bold text-[oklch(0.16_0.015_260)]"
                style={{ background: COND[k].color }}
              >
                {COND[k].short}
              </span>
              {COND[k].label}
            </li>
          ))}
        </ul>

        <div ref={scroller} className="overflow-x-auto overscroll-x-contain">
          <div className="grid min-w-[880px] grid-cols-[1fr_auto_1fr] px-3 py-4 sm:px-4">
            <p className={cn(s.eyebrow, "col-span-3 mb-1 flex justify-between")}>
              <span>Upper · Right</span>
              <span>Left</span>
            </p>
            {upperR}
            <div className="row-span-3 mx-2 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/50 to-transparent" aria-hidden />
            {upperL}
            <div className="col-start-1 my-2 h-px bg-white/15" aria-hidden />
            <div className="col-start-3 my-2 h-px bg-white/15" aria-hidden />
            {lowerR}
            {lowerL}
            <p className={cn(s.eyebrow, "col-span-3 mt-1 flex justify-between")}>
              <span>Lower · Right</span>
              <span>Left</span>
            </p>
          </div>
        </div>

        {tooth !== null && toothCond !== null ? (
          <div
            ref={picker}
            id={pickerId}
            role="group"
            aria-label={`Condition for tooth ${tooth}`}
            className={cn(s.enter, "border-t border-white/10 px-4 py-3")}
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <p className="min-w-0 text-sm">
                <span className={cn(s.display, s.num, "font-medium")}>Tooth {tooth}</span>
                <span className={cn(s.muted, "first-letter:uppercase")}> · {toothName(tooth)}</span>
              </p>
              <button
                type="button"
                onClick={() => close()}
                aria-label="Close condition picker"
                className={cn(s.press, s.interactive, "flex size-11 shrink-0 items-center justify-center rounded-lg")}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {ORDER.map((k) => {
                const on = toothCond === k;
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCondition(tooth, k)}
                    className={cn(s.press, "flex min-h-11 items-center gap-2 rounded-lg border px-3 text-left text-sm", on ? s.selected : s.interactive)}
                  >
                    <span
                      aria-hidden
                      className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded px-0.5 text-[10px] font-bold text-[oklch(0.16_0.015_260)]"
                      style={{ background: COND[k].color }}
                    >
                      {COND[k].short}
                    </span>
                    <span className="min-w-0 truncate">{COND[k].label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className={cn(s.faint, "border-t border-white/10 px-4 py-3 text-xs")}>
            Tap a tooth to chart it.<span className="sm:hidden"> Swipe sideways to see every tooth.</span>
          </p>
        )}
      </div>
    </div>
  );
}
