"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { ChevronDown, CircleCheck, Inbox } from "lucide-react";
import type { Screen } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "../studio.module.css";

type Props = { screen: Extract<Screen, { type: "form" }> };
type Entry = { id: number; values: string[] };

export function FormScreen({ screen }: Props) {
  const { fields, submitLabel } = screen;
  const uid = useId();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [toast, setToast] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(0), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = fields.map((f, i) => {
      const v = String(data.get(`f${i}`) ?? "").trim();
      // Date inputs give ISO; show it the way a person would write it.
      return f.kind === "date" && v ? new Date(`${v}T00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : v;
    });
    setEntries((prev) => [{ id: Date.now(), values }, ...prev].slice(0, 5));
    setToast(Date.now());
    e.currentTarget.reset();
  }

  return (
    <div className={cn(s.stagger, "grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]")}>
      <form onSubmit={submit} className={cn(s.tile, "grid gap-4 rounded-xl p-4 sm:p-5")}>
        {fields.map((f, i) => {
          const id = `${uid}-f${i}`;
          const name = `f${i}`;
          return (
            <div key={i} className="grid gap-1.5">
              <label htmlFor={id} className="text-sm font-medium">
                {f.label}
              </label>
              {f.kind === "select" && f.options?.length ? (
                <div className="relative">
                  <select id={id} name={name} required defaultValue="" className={cn(s.field, "cursor-pointer")}>
                    <option value="" disabled>
                      Choose one
                    </option>
                    {f.options.map((o, j) => (
                      <option key={j} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={cn(s.faint, "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2")} aria-hidden />
                </div>
              ) : (
                <input
                  id={id}
                  name={name}
                  required
                  type={f.kind === "number" ? "number" : f.kind === "date" ? "date" : "text"}
                  inputMode={f.kind === "number" ? "decimal" : undefined}
                  min={f.kind === "number" ? 0 : undefined}
                  step={f.kind === "number" ? "any" : undefined}
                  autoComplete="off"
                  className={cn(s.field, s.num)}
                />
              )}
            </div>
          );
        })}
        <button type="submit" className={cn(s.press, s.primary, "mt-1 min-h-11 rounded-xl px-5 text-[0.9375rem]")}>
          {submitLabel}
        </button>
      </form>

      <section className={cn(s.tile, "relative flex min-h-48 flex-col rounded-xl p-4 pb-16 sm:p-5 sm:pb-16")} aria-label="Recent entries">
        <div className="flex items-center justify-between gap-3">
          <p className={s.label}>Recent entries</p>
          <span className={cn(s.pill, s.num)}>{entries.length}</span>
        </div>
        {entries.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
            <Inbox className={cn(s.faint, "size-6")} aria-hidden />
            <p className={cn(s.muted, "text-sm")}>Nothing saved yet.</p>
            <p className={cn(s.faint, "max-w-56 text-xs")}>Fill in the form and your entry shows up here.</p>
          </div>
        ) : (
          <ul className="mt-3 grid gap-2">
            {entries.map((e, n) => (
              <li key={e.id} className={cn(s.interactive, n === 0 && s.enter, "rounded-lg px-3 py-2.5")}>
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">{e.values[0]}</span>
                  <span className={cn(s.faint, "shrink-0 text-xs")}>{n === 0 ? "Just now" : "Earlier"}</span>
                </div>
                {e.values.length > 1 && (
                  <p className={cn(s.muted, s.num, "mt-0.5 truncate text-xs")}>
                    {e.values.slice(1).map((v, i) => (
                      <span key={i}>
                        {i > 0 && <span className={s.faint}> · </span>}
                        {fields[i + 1].label}: {v}
                      </span>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center" role="status" aria-live="polite">
          {toast ? (
            <span key={toast} className={cn(s.glass, s.toast, "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium")}>
              <CircleCheck className="size-4 text-[var(--ok)]" aria-hidden />
              Saved
            </span>
          ) : null}
        </div>
      </section>
    </div>
  );
}
