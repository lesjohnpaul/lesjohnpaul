"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";
import { CATEGORICAL } from "./tone";

type Props = { screen: Extract<Screen, { type: "kanban" }> };
type Card = { id: number; text: string };

export function KanbanScreen({ screen }: Props) {
  const names = screen.columns.map((c) => c.name);
  const [cols, setCols] = useState<Card[][]>(() => {
    let id = 0;
    return screen.columns.map((c) => c.cards.map((text) => ({ id: id++, text })));
  });
  const [moved, setMoved] = useState<number | null>(null);
  // Moving re-parents the card's button, so focus would drop to <body>; hand it back.
  const btns = useRef(new Map<number, HTMLButtonElement>());
  useEffect(() => {
    if (moved !== null) btns.current.get(moved)?.focus();
  }, [moved, cols]);
  // A pipeline reads left to right: blue for what just came in, the categorical hues in between, green for done.
  const colorAt = (i: number) => (i === cols.length - 1 ? "var(--ok)" : i === 0 ? "var(--info)" : CATEGORICAL[(i + 3) % CATEGORICAL.length]);
  const total = cols.reduce((n, list) => n + list.length, 0);
  const done = cols[cols.length - 1].length;
  const lg = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[names.length] ?? "lg:grid-cols-3";

  // Cards stop in the last column: that's "done".
  function move(from: number, card: Card) {
    const to = from + 1;
    if (to >= cols.length) return;
    setCols((prev) =>
      prev.map((list, i) => {
        if (i === from) return list.filter((c) => c.id !== card.id);
        if (i === to) return [...list, card];
        return list;
      }),
    );
    setMoved(card.id);
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {/* Where the work stands: one bar, a segment per column, sized by its cards. */}
      <div className={cn(s.tile, "rounded-xl px-4 py-3")}>
        <div className="flex items-baseline justify-between gap-3">
          <p className={s.label}>Progress</p>
          <p className={cn(s.num, s.muted, "text-sm")} aria-live="polite">
            <span className="font-semibold text-[var(--ok)]">{done}</span> of {total} done
          </p>
        </div>
        <div className="mt-2.5 flex h-2 gap-0.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
          {cols.map((list, i) => (
            <span key={i} className="h-full rounded-full transition-[flex-grow] duration-300" style={{ flexGrow: list.length, background: colorAt(i) }} />
          ))}
        </div>
      </div>
      <div className={cn(s.stagger, "grid gap-3 sm:grid-cols-2 sm:gap-4", lg)}>
        {cols.map((list, i) => {
          const last = i === cols.length - 1;
          const next = names[i + 1];
          return (
            <section key={i} style={{ "--t": colorAt(i) } as CSSProperties} className={cn(s.tile, s.tint, "flex flex-col rounded-xl p-3")} aria-label={names[i]}>
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <h4 className={cn(s.display, "flex min-w-0 items-center gap-2 text-sm font-medium")}>
                  <span className="size-2 shrink-0 rounded-full bg-[var(--t)]" aria-hidden />
                  <span className="truncate">{names[i]}</span>
                </h4>
                <span className={cn(s.pill, s.tone, s.num)}>{list.length}</span>
              </div>
              <ul className="grid gap-2">
                {list.map((card) => (
                  <li key={card.id}>
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) btns.current.set(card.id, el);
                        else btns.current.delete(card.id);
                      }}
                      onClick={() => move(i, card)}
                      aria-disabled={last}
                      aria-label={last ? `${card.text}. Done, in ${names[i]}` : `${card.text}. Move to ${next}`}
                      className={cn(
                        s.press,
                        s.interactive,
                        moved === card.id && s.flash,
                        last && "cursor-default active:scale-100",
                        "group flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border-l-2 !border-l-[var(--t)] px-3 py-2.5 text-left shadow-sm shadow-black/30",
                      )}
                    >
                      <span className="min-w-0 text-sm leading-snug">{card.text}</span>
                      {last ? (
                        <Check className="size-4 shrink-0 text-[var(--ok)]" aria-hidden />
                      ) : (
                        <span className={cn(s.faint, "flex shrink-0 items-center gap-1 text-xs transition-colors group-hover:text-[var(--gold)]")}>
                          <span className="hidden max-w-24 truncate sm:inline">{next}</span>
                          <ArrowRight className="size-3.5" aria-hidden />
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                {list.length === 0 && (
                  <li className={cn(s.faint, "rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-xs")}>
                    Nothing here
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
