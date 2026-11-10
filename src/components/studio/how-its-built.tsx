"use client";

import type { TraceInfo, TraceNote, TraceStep } from "@/lib/studio/trace";
import { cn } from "@/lib/utils";
import type { BuildStatus } from "./use-build";
import s from "./studio.module.css";

// Fixed order, fixed copy. Nothing here ever comes from what the visitor typed.
const ROWS: [TraceStep, string, string][] = [
  ["input", "Input received", "Size and shape checked (500-character cap)."],
  ["guardrails", "Guardrails", "Bot check, abuse filter, 2 builds per device a day, daily AI budget."],
  ["model", "Model: claude-haiku-5-5", "Time until the first token came back."],
  ["stream", "Tool call: render_prototype", "Streamed as structured JSON; each screen appears as it completes."],
  ["validate", "Schema validation (zod)", "Checked on the server, then again in your browser. The AI never writes code."],
  ["render", "Render", "Les's own React components draw the screens from that data."],
];

const REASONS: Partial<Record<TraceNote, string>> = {
  unavailable: "the builder is offline, and it never calls the model without its safety checks",
  limit: "this device has used its 2 free builds today",
  budget: "today's AI budget is spent, so the model was never called",
  busy: "a safety check couldn't run, so it failed closed",
  cut_off: "the model's answer was cut off",
  model_error: "the model didn't answer",
  invalid: "the answer didn't match the schema, so it was thrown away",
};

const n = new Intl.NumberFormat("en");
const sec = new Intl.NumberFormat("en", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type RowState = "ok" | "fail" | "wait" | "off";

export function HowItsBuilt({ trace, status }: { trace: TraceInfo[]; status: BuildStatus }) {
  const by = new Map<TraceStep, TraceInfo>();
  for (const t of trace) if (!by.has(t.step)) by.set(t.step, t);
  const failAt = ROWS.findIndex(([k]) => by.get(k)?.ok === false);
  const lastAt = ROWS.reduce((m, [k], i) => (by.has(k) ? i : m), -1);

  // The server may skip a step (e.g. a model error before the first token): anything missing before the last
  // received step, or once the build has ended, is shown as skipped. Only steps still ahead of a live build pulse.
  const states: RowState[] = ROWS.map(([k], i) => {
    const t = by.get(k);
    if (failAt >= 0 && i > failAt) return "off";
    if (k === "render" && status === "fallback") return "off"; // what's drawn is the example, not this build
    if (t) return t.ok ? "ok" : "fail";
    if ((status === "building" && i > lastAt) || (k === "render" && status === "done")) return "wait";
    return "off";
  });

  const totalMs = ROWS.reduce((sum, [k], i) => sum + (states[i] === "ok" || states[i] === "fail" ? (by.get(k)?.ms ?? 0) : 0), 0);
  const stream = by.get("stream");
  const failed = failAt >= 0 ? by.get(ROWS[failAt][0]) : undefined;
  const stop = failed
    ? `Stopped here: ${(failed.note && REASONS[failed.note]) || "the build couldn't finish"}. You're seeing a labelled example instead.`
    : status !== "fallback"
      ? null
      : by.get("validate")?.ok === true
        ? "Stopped after validation: the result couldn't be saved. You're seeing a labelled example instead."
        : "Stopped early. You're seeing a labelled example instead.";

  return (
    <section aria-labelledby="trace-title" className={cn(s.glass, "rounded-2xl p-4 sm:p-5")}>
      <h2 id="trace-title" className={cn(s.display, "text-lg font-medium")}>
        How this build ran
      </h2>
      <p className={cn(s.muted, "mt-1 text-sm leading-relaxed")}>A live trace of this build only. Nothing you typed is shown here.</p>

      <ol className={cn(s.stagger, "mt-3 divide-y divide-white/10")}>
        {ROWS.map(([k, label, detail], i) => {
          const st = states[i];
          const t = by.get(k);
          return (
            <li key={k} className="grid grid-cols-[1fr_auto] gap-x-3 py-2.5">
              <div className="min-w-0">
                <p className={cn("text-[0.9375rem] font-medium leading-snug", st === "fail" && s.warn, st === "off" && "opacity-55")}>{label}</p>
                <p className={cn(s.muted, "mt-0.5 text-[0.8125rem] leading-snug")}>{detail}</p>
                {k === "validate" && t?.note === "salvaged" && (
                  <p className={cn(s.muted, "mt-1 text-[0.8125rem] leading-snug")}>Recovered the complete answer from the stream after a parsing hiccup.</p>
                )}
              </div>
              <span className={cn(s.num, "pt-0.5 text-right font-mono text-[0.8125rem] whitespace-nowrap", st === "fail" ? s.warn : s.muted, st === "off" && "opacity-55")}>
                {st === "ok" || st === "fail" ? (
                  `${n.format(t?.ms ?? 0)} ms`
                ) : st === "wait" ? (
                  <span className="inline-flex h-5 items-center">
                    <span className={cn(s.dot, "animate-pulse text-[var(--gold)]")} aria-hidden />
                    <span className="sr-only">waiting</span>
                  </span>
                ) : (
                  <>
                    <span aria-hidden>–</span>
                    <span className="sr-only">skipped</span>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {stop && <p className={cn(s.warn, "mt-3 text-sm leading-relaxed")}>{stop}</p>}

      {stream?.tokens && (
        <p className={cn(s.faint, s.num, "mt-3 border-t border-white/10 pt-3 font-mono text-xs leading-relaxed")}>
          {n.format(stream.tokens.in)} tokens in ({n.format(stream.tokens.cached)} cached) · {n.format(stream.tokens.out)} out · $
          {(stream.usd ?? 0).toFixed(4)} · {sec.format(totalMs / 1000)} s total
        </p>
      )}
    </section>
  );
}
