"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import type { StudioEvent } from "@/lib/studio/prompt";
import type { TraceInfo } from "@/lib/studio/trace";
import { parsePrototype, parseScreen, type Screen, type StudioRequest } from "@/lib/studio/schema";

export type BuildStatus = "idle" | "building" | "done" | "fallback" | "error";

type BuildState = {
  status: BuildStatus;
  spec?: { business: string; spec: string };
  screens: Screen[];
  buildId?: string;
  fallbackLabel?: string;
  error?: string;
  trace: TraceInfo[];
};

const IDLE: BuildState = { status: "idle", screens: [], trace: [] };
const STEPS: readonly string[] = ["input", "guardrails", "model", "stream", "validate", "render"];
const SOMETHING_WRONG = "Something went wrong on my side. Try again in a moment, or book a call below.";
const INTERRUPTED = "The connection dropped before your build finished. Try again, or book a call below.";

/** Streams a build from /api/studio/build. Screens arrive one by one; a fallback replaces whatever was shown. */
export function useBuild() {
  const [state, setState] = useState<BuildState>(IDLE);
  const ctrl = useRef<AbortController | null>(null);
  useEffect(() => () => ctrl.current?.abort(), []);

  const reset = useCallback(() => {
    ctrl.current?.abort();
    setState(IDLE);
  }, []);

  const start = useCallback(async (r: StudioRequest) => {
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    setState({ status: "building", screens: [], trace: [] });
    track("build_started");
    let ended = false;

    // "Rendered": from receiving done/fallback to the second frame, i.e. the paint after React commits it.
    const timeRender = () => {
      const t0 = performance.now();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          // reset() aborts without replacing the controller; start() replaces it. Either way, drop the stray frame.
          if (c.signal.aborted || ctrl.current !== c) return;
          const v: TraceInfo = { step: "render", ms: Math.round(performance.now() - t0), ok: true };
          setState((s) => ({ ...s, trace: [...s.trace, v] }));
        }),
      );
    };

    const apply = (e: StudioEvent) => {
      if (e.t === "trace") {
        const v = e.v;
        if (STEPS.includes(v?.step) && Number.isFinite(v.ms) && v.ms >= 0) setState((s) => ({ ...s, trace: [...s.trace, v] }));
      } else if (e.t === "spec") {
        setState((s) => ({ ...s, spec: e.v }));
      } else if (e.t === "screen") {
        // Validated again on the client: only schema-shaped screens ever reach the components.
        const v = parseScreen(e.v);
        if (v) setState((s) => (s.screens.length === e.i ? { ...s, screens: [...s.screens, v] } : s));
      } else if (e.t === "done") {
        ended = true;
        setState((s) => ({ ...s, status: "done", buildId: e.buildId }));
        timeRender();
        track("build_completed");
      } else if (e.t === "fallback") {
        ended = true;
        const p = parsePrototype(e.v.prototype);
        if (!p) {
          setState({ ...IDLE, status: "error", error: SOMETHING_WRONG });
          return;
        }
        // Ruling 2: the labelled example replaces any partial build; it's never shown as theirs.
        setState((s) => ({ status: "fallback", spec: { business: p.business, spec: p.spec }, screens: [...p.screens], fallbackLabel: e.v.label, trace: s.trace }));
        timeRender();
        track("fallback_example_shown");
      }
    };

    try {
      const res = await fetch("/api/studio/build", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(r),
        signal: c.signal,
      });
      if (!res.ok || !res.body) {
        const msg = await res
          .json()
          .then((b: { error?: unknown }) => (typeof b.error === "string" ? b.error : null))
          .catch(() => null);
        // 400 carries a message meant for the visitor (too long, off-topic); anything else is on us.
        setState({ ...IDLE, status: "error", error: res.status === 400 && msg ? msg : SOMETHING_WRONG });
        return;
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffered = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffered += value;
        const lines = buffered.split("\n");
        buffered = lines.pop() ?? "";
        for (const l of lines) if (l) apply(JSON.parse(l) as StudioEvent);
      }
      if (buffered) apply(JSON.parse(buffered) as StudioEvent);
      if (!ended && !c.signal.aborted) setState({ ...IDLE, status: "error", error: INTERRUPTED });
    } catch {
      // A finished build stays on screen even if something trails after it.
      if (!c.signal.aborted && !ended) setState({ ...IDLE, status: "error", error: SOMETHING_WRONG });
    }
  }, []);

  return { ...state, start, reset };
}
