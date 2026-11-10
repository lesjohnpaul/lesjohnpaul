"use client";

import { useId, useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import s from "./studio.module.css";

type State = { kind: "closed" | "open" | "sending" | "sent" } | { kind: "error"; message: string };

const MESSAGES: Record<number, string> = {
  400: "That email address doesn't look right. Check it and try again.",
  403: "We couldn't verify this request. Please try again, or email Les.",
};
const FALLBACK = "Couldn't send it right now. Try again, or book a call below.";

export function EmailCapture({ buildId }: { buildId: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "closed" });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/studio/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ buildId, email: email.trim() }),
      });
      if (res.ok) {
        track("prototype_emailed");
        setState({ kind: "sent" });
        return;
      }
      // 410/429/502/503 carry visitor-ready copy; 400 and 403 are ours to phrase.
      const body: { error?: unknown } = await res.json().catch(() => ({}));
      const message = MESSAGES[res.status] ?? (typeof body.error === "string" ? body.error : FALLBACK);
      setState({ kind: "error", message });
    } catch {
      setState({ kind: "error", message: FALLBACK });
    }
  }

  if (state.kind === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState({ kind: "open" })}
        className={cn(s.press, s.interactive, "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-medium")}
      >
        <Mail className="size-4" aria-hidden />
        Email me this prototype
      </button>
    );
  }

  if (state.kind === "sent") {
    return (
      <p role="status" className={cn(s.glass, s.swap, "flex items-center gap-3 rounded-xl px-4 py-3 text-[0.9375rem]")}>
        <Check className="size-5 shrink-0 text-[var(--ok)]" aria-hidden />
        Sent. Check your inbox for the link; it stays up for 30 days.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={cn(s.glass, s.swap, "grid w-full gap-3 rounded-xl p-4")}>
      <label htmlFor={`${id}-email`} className="text-[0.9375rem] font-medium">
        Where should I send it?
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          autoFocus
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-describedby={state.kind === "error" ? `${id}-err` : undefined}
          className={cn(s.field, "min-h-12 sm:flex-1")}
        />
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className={cn(s.press, s.primary, "inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl px-5 text-base disabled:opacity-60")}
        >
          {state.kind === "sending" ? "Sending…" : "Send link"}
        </button>
      </div>
      {state.kind === "error" ? (
        <p id={`${id}-err`} role="alert" className="text-sm text-[oklch(0.8_0.12_45)]">
          {state.message}
        </p>
      ) : (
        <p className={cn(s.faint, "text-sm")}>One email with a private link. Les may reply to it personally.</p>
      )}
    </form>
  );
}
