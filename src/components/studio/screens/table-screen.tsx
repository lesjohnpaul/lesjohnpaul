"use client";

import { useState, type CSSProperties } from "react";
import { Check, Search } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";
import { colorOf, initials, toneOf } from "./tone";

type Props = { screen: Extract<Screen, { type: "table" }> };

// ponytail: a word-only cell outside the first column reads as a status ("Pending", "Paid"), so it gets a pill.
const isStatus = (col: number, v: string) => col > 0 && !/\d/.test(v) && v.length <= 16;

export function TableScreen({ screen }: Props) {
  const { columns, rows } = screen;
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  // Rows keep their original index, so the selection survives filtering.
  const visible = rows.map((row, r) => ({ row, r })).filter(({ row }) => !q || row.some((v) => v.toLowerCase().includes(q)));
  // Names get an avatar; ids and dates ("Order 1023", "Oct 02") don't.
  const named = rows.every((row) => !/\d/.test(row[0]));
  const lead = (v: string) =>
    named ? (
      <span className="flex min-w-0 items-center gap-2.5">
        <span className={cn(s.chip, "flex size-7 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold")} style={{ "--t": colorOf(v) } as CSSProperties} aria-hidden>
          {initials(v)}
        </span>
        <span className="truncate font-medium">{v}</span>
      </span>
    ) : (
      <span className="truncate font-medium">{v}</span>
    );
  // One markup for both sizes: stacked key/value cards on phones, a real grid from sm up.
  const grid = { gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr)) 1.5rem` };

  return (
    <div className={cn(s.tile, "overflow-hidden rounded-xl")}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <label className={cn(s.interactive, "flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 sm:max-w-60")}>
          <Search className={cn(s.faint, "size-4 shrink-0")} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search records"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--faint)]"
          />
        </label>
        <span className={cn(s.pill, s.num, "shrink-0")}>
          {q ? `${visible.length} of ${rows.length}` : `${rows.length} records`}
        </span>
      </div>

      <div
        className="hidden gap-4 border-b border-white/10 px-4 py-2.5 sm:grid"
        style={grid}
        aria-hidden
      >
        {columns.map((c, i) => (
          <span key={i} className={cn(s.eyebrow, "truncate")}>{c}</span>
        ))}
      </div>

      <ul className={cn(s.stagger, "divide-y divide-white/[0.06]")}>
        {visible.map(({ row, r }) => {
          const on = selected === r;
          return (
            <li key={r}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(on ? null : r)}
                className={cn(
                  s.press,
                  "relative grid min-h-11 w-full gap-x-4 gap-y-1.5 border-l-2 px-4 py-3 text-left sm:items-center",
                  on ? "border-l-[var(--gold)] bg-[var(--gold)]/[0.09]" : "border-l-transparent hover:bg-white/[0.04]",
                )}
              >
                <span className="contents sm:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {lead(row[0])}
                    {on && <Check className="size-4 shrink-0 text-[var(--gold)]" aria-hidden />}
                  </span>
                  <span className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {row.slice(1).map((v, c) => (
                      <span key={c} className="min-w-0 text-sm">
                        <span className={cn(s.faint, "block truncate text-xs")}>{columns[c + 1]}</span>
                        <Cell value={v} col={c + 1} />
                      </span>
                    ))}
                  </span>
                </span>
                <span className="hidden gap-4 sm:grid sm:items-center" style={grid}>
                  {row.map((v, c) => (
                    <span key={c} className="min-w-0 truncate text-sm">
                      {c === 0 ? lead(v) : <Cell value={v} col={c} />}
                    </span>
                  ))}
                  <span className="flex justify-end">
                    {on && <Check className="size-4 text-[var(--gold)]" aria-hidden />}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {visible.length === 0 && <li className={cn(s.faint, "px-4 py-6 text-center text-sm")}>No records match &ldquo;{query.trim()}&rdquo;</li>}
      </ul>

      <div className="flex min-h-11 items-center gap-2 border-t border-white/10 px-4 py-2.5 text-sm" aria-live="polite">
        {selected === null ? (
          <span className={s.faint}>Tap a row to select</span>
        ) : (
          <>
            <span className={cn(s.pill, s.pillGold)}>
              <span className={s.dot} />
              Selected
            </span>
            <span className="truncate">{rows[selected][0]}</span>
          </>
        )}
      </div>
    </div>
  );
}

function Cell({ value, col }: { value: string; col: number }) {
  if (isStatus(col, value)) {
    const tone = toneOf(value);
    return (
      <span className={cn(s.pill, tone && s.tone)} style={tone ? ({ "--t": tone } as CSSProperties) : undefined}>
        {tone && <span className={s.dot} />}
        {value}
      </span>
    );
  }
  return <span className={cn(s.num, s.muted, "block truncate")}>{value}</span>;
}
