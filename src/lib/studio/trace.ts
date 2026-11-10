// Pipeline trace: enums, integers and token/cost numbers only. Never visitor text.
export type TraceStep = "input" | "guardrails" | "model" | "stream" | "validate" | "render";
export type TraceNote = "unavailable" | "limit" | "budget" | "busy" | "cut_off" | "model_error" | "invalid" | "salvaged";
export type TraceInfo = {
  step: TraceStep;
  ms: number;
  ok: boolean;
  note?: TraceNote;
  model?: string;
  screens?: number;
  tokens?: { in: number; cached: number; out: number };
  usd?: number;
};
export type TraceEvent = { t: "trace"; v: TraceInfo };

const NOTES: readonly string[] = ["unavailable", "limit", "budget", "busy", "cut_off", "model_error", "invalid", "salvaged"];
const num = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

export function tracer(now: () => number = () => performance.now()) {
  let last = now();
  return (step: TraceStep, extra: Partial<Omit<TraceInfo, "step" | "ms">> = {}): TraceEvent => {
    const t = now();
    const v: TraceInfo = { step, ms: Math.max(0, Math.round(t - last)), ok: extra.ok ?? true };
    last = t;
    if (typeof extra.note === "string" && NOTES.includes(extra.note)) v.note = extra.note;
    if (typeof extra.model === "string") v.model = extra.model.slice(0, 40);
    if (num(extra.screens)) v.screens = extra.screens;
    if (num(extra.usd)) v.usd = extra.usd;
    const k = extra.tokens;
    if (k && num(k.in) && num(k.cached) && num(k.out)) v.tokens = { in: k.in, cached: k.cached, out: k.out };
    return { t: "trace", v };
  };
}
