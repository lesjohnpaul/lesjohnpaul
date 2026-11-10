"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { readPrefill } from "@/lib/studio/prefill";
import type { StudioRequest } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";
import s from "./studio.module.css";

const MAX = 500;
const WHO: { v: StudioRequest["who"]; label: string }[] = [
  { v: "team", label: "My team" },
  { v: "customers", label: "My customers" },
  { v: "both", label: "Both" },
];
const PAIN: { v: StudioRequest["pain"]; label: string }[] = [
  { v: "manual", label: "Manual work" },
  { v: "visibility", label: "No visibility" },
  { v: "slow", label: "Slow orders" },
];

function Chips<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { v: T; label: string }[];
  value?: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={cn(s.display, "mb-2.5 text-base font-medium")}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          // Native radios: arrow keys, form semantics and screen readers come for free.
          <label
            key={o.v}
            className={cn(
              s.press,
              "relative flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[0.9375rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--gold)]",
              value === o.v ? s.selected : s.interactive,
              value === o.v && "text-[var(--gold)]",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.v}
              checked={value === o.v}
              onChange={() => onChange(o.v)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function DiscoveryForm({
  initial,
  autoFocus,
  error,
  onSubmit,
}: {
  initial?: StudioRequest;
  /** Focus the textarea on mount: set when coming back from a build ("Build another" or an error). */
  autoFocus?: boolean;
  error?: string;
  onSubmit: (r: StudioRequest) => void;
}) {
  const id = useId();
  const [text, setText] = useState(initial?.text ?? "");
  const [who, setWho] = useState<StudioRequest["who"] | undefined>(initial?.who);
  const [pain, setPain] = useState<StudioRequest["pain"] | undefined>(initial?.pain);
  const [hint, setHint] = useState<string | null>(null);
  /** Neutral status carried over from the chat; cleared on the first edit or chip pick. */
  const [note, setNote] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const sentRef = useRef(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  // Text handed over from the chat arrives in the URL hash on load (the chat widget isn't mounted on /studio).
  // Prefill only: never focus (phone keyboard) and never submit.
  useEffect(() => {
    if (initial) return;
    function take() {
      const q = readPrefill(location.hash);
      if (!q) return;
      setText(q);
      setNote("Carried over from your chat. Pick an answer for each question, then tap Build it.");
      history.replaceState(null, "", location.pathname + location.search);
    }
    // The hash only exists in the browser, so it can only be read after mount (a lazy initial state would mismatch hydration).
    take();
  }, [initial]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return setHint("Tell me a little about your business first.");
    if (!who || !pain) return setHint("Pick one answer for each question.");
    setHint(null);
    // One start per submit: a double tap must not start two builds (or count build_started twice).
    if (sentRef.current) return;
    sentRef.current = true;
    setSent(true);
    onSubmit({ text: t, who, pain });
  }

  const message = hint ?? error;

  return (
    <form onSubmit={submit} noValidate className={cn(s.glass, "grid gap-6 rounded-2xl p-4 sm:p-6")}>
      <div>
        <label htmlFor={`${id}-text`} className={cn(s.display, "mb-2.5 block text-base font-medium")}>
          Your business, in one line
        </label>
        <textarea
          id={`${id}-text`}
          ref={textRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setNote(null);
          }}
          maxLength={MAX}
          rows={3}
          required
          aria-describedby={`${id}-count${message ? ` ${id}-msg` : ""}`}
          placeholder="e.g. Bakery in Dagupan. Orders come in through Messenger and we lose track of who paid."
          className={cn(s.field, "block resize-none py-3 leading-relaxed")}
        />
        <div className="mt-2 flex items-start justify-between gap-3 text-sm">
          <p id={`${id}-msg`} role="alert" className="min-h-5 text-[oklch(0.8_0.12_45)]">
            {message}
          </p>
          <p id={`${id}-count`} className={cn(s.faint, s.num, "shrink-0")} aria-label={`${text.length} of ${MAX} characters`}>
            {text.length}/{MAX}
          </p>
        </div>
        <p role="status" className="mt-1 min-h-10 text-sm text-[var(--gold)] sm:min-h-5">
          {note}
        </p>
      </div>

      <Chips legend="Who will use it?" name={`${id}-who`} options={WHO} value={who} onChange={(v) => {
          setWho(v);
          setNote(null);
        }} />
      <Chips legend="What hurts most today?" name={`${id}-pain`} options={PAIN} value={pain} onChange={(v) => {
          setPain(v);
          setNote(null);
        }} />

      <div className="grid gap-3">
        <button
          type="submit"
          disabled={sent}
          className={cn(s.press, s.primary, "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-base disabled:opacity-60 sm:w-auto sm:justify-self-start")}
        >
          Build it →
        </button>
        <p className={cn(s.faint, "text-sm")}>Your build is kept for 30 minutes so you can email it or share it when you book, then deleted.</p>
      </div>
    </form>
  );
}
