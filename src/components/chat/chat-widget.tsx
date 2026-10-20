"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowUpRight, Send, X } from "lucide-react";
import gsap from "gsap";
import { track } from "@vercel/analytics";

type Msg = { role: "user" | "assistant"; text: string; links?: { label: string; href: string }[] };

const GREETING: Msg = {
  role: "assistant",
  text: "Hi! I'm Pao, Les's AI assistant. Ask me what he builds, whether he can help with your business, or I can book you a call with him.",
};
const SUGGESTIONS = ["What does Les build?", "Can he automate our reports?", "Book a call with Les"];
// On a case study page the server hands Pao that study, so the opener is about the project.
const STUDY_GREETING: Msg = {
  role: "assistant",
  text: "Hi! I'm Pao, Les's AI assistant. Want to know how this project was built, or whether Les can build something like it for you? Ask away.",
};
const STUDY_SUGGESTIONS = ["How did he build this?", "Can he build this for my business?", "Book a call with Les"];
// Shown after every reply so a visitor can always tap instead of type; slot times replace them while booking.
const NEXT_STEPS = ["Book a call with Les", "What has he built?", "How does a project work?", "Leave my details instead"];
const AFTER_BOOKING = ["What happens on the call?", "What has he built?"];
const MAX_CHARS = 500;
// 3D Pao loads only when the chat is opened (three.js stays out of the first page load).
const PaoStage = dynamic(() => import("@/components/pao/pao-stage").then((m) => m.PaoStage), { ssr: false });

// Pao's face: a Pixar-style chibi of Les (generated from his photo). 14 KB, so it's fine to show eagerly.
function PaoAvatar({ className }: { className?: string }) {
  return (
    <Image
      src="/images/pao/pao-avatar.webp"
      alt=""
      width={80}
      height={80}
      className={`shrink-0 rounded-full bg-[#dcdcdc] object-cover ${className ?? ""}`}
    />
  );
}

// Per-tab conversation id; the server keeps the actual history.
function conversationId(): string {
  try {
    const existing = sessionStorage.getItem("pao-conversation");
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem("pao-conversation", id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onStudy = pathname.startsWith("/work/");
  const [messages, setMessages] = useState<Msg[]>([onStudy ? STUDY_GREETING : GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [chips, setChips] = useState<string[]>(onStudy ? STUDY_SUGGESTIONS : SUGGESTIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<string | null>(null);
  // Phones get a full-screen sheet without the 3D stage (keeps three.js off mobile data).
  const [mobile, setMobile] = useState(false);
  // three.js parses for ~0.5s on desktop; mount the 3D stage after the panel has painted.
  const [stage, setStage] = useState(false);

  useEffect(() => {
    if (!open || mobile) return;
    const t = setTimeout(() => setStage(true), 260);
    return () => clearTimeout(t);
  }, [open, mobile]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    // Focusing on a phone pops the keyboard over the greeting, so only autofocus with a mouse.
    if (!mobile) inputRef.current?.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        panel,
        mobile ? { opacity: 0, y: 24 } : { opacity: 0, scale: 0.92, y: 12, transformOrigin: "bottom right" },
        { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power3.out", clearProps: "transform" },
      );
    }
    if (!mobile) return;
    // The sheet tracks the visible viewport, so the on-screen keyboard never covers the input
    // (iOS Safari doesn't shrink dvh for the keyboard). The page behind it stops scrolling.
    const vv = window.visualViewport;
    const fit = () => {
      if (!vv) return;
      panel.style.setProperty("--vvh", `${vv.height}px`);
      panel.style.setProperty("--vvt", `${vv.offsetTop}px`);
    };
    fit();
    vv?.addEventListener("resize", fit);
    vv?.addEventListener("scroll", fit);
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      vv?.removeEventListener("resize", fit);
      vv?.removeEventListener("scroll", fit);
      root.style.overflow = prev;
    };
  }, [open, mobile]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    if (!open) {
      track("chat_open");
      setMobile(window.matchMedia("(max-width: 639px)").matches);
    }
    setOpen((o) => !o);
  };

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    idRef.current ??= conversationId();
    setInput("");
    setBusy(true);
    setChips([]);
    let next = NEXT_STEPS;
    setMessages((m) => [...m, { role: "user", text: message }, { role: "assistant", text: "" }]);

    const append = (delta: string) =>
      setMessages((m) => {
        const last = m[m.length - 1];
        return [...m.slice(0, -1), { ...last, text: last.text + delta }];
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: idRef.current, message, page: pathname }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffered = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffered += value;
        const lines = buffered.split("\n");
        buffered = lines.pop() ?? "";
        for (const l of lines) {
          if (!l) continue;
          const evt = JSON.parse(l) as { t: string; v?: unknown };
          if (evt.t === "text" && typeof evt.v === "string") append(evt.v);
          if (evt.t === "chips" && Array.isArray(evt.v)) next = evt.v as string[];
          if (evt.t === "links" && Array.isArray(evt.v)) {
            const links = evt.v as Msg["links"];
            setMessages((m) => [...m.slice(0, -1), { ...m[m.length - 1], links }]);
          }
          if (evt.t === "event" && evt.v === "booked") {
            track("booking_made");
            next = AFTER_BOOKING;
          }
          if (evt.t === "event" && evt.v === "lead") track("chat_lead");
        }
      }
    } catch {
      append("Sorry, I couldn't connect. Please use the contact form below.");
    } finally {
      setChips(next.filter((c) => c !== message));
      setBusy(false);
    }
  }

  const waiting = busy && messages[messages.length - 1]?.text === "";

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-end gap-3 sm:right-5">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Pao, Les's AI assistant"
          className="fixed inset-x-0 top-[var(--vvt,0px)] flex h-[var(--vvh,100dvh)] w-full flex-col overflow-hidden border-border bg-background shadow-2xl shadow-primary/10 sm:static sm:h-[min(600px,calc(100dvh-7rem))] sm:w-[min(400px,calc(100vw-2.5rem))] sm:rounded-2xl sm:border sm:bg-background/95 sm:backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 border-b border-border px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-3">
            <PaoAvatar className="h-10 w-10" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-semibold">Pao</p>
              <p className="truncate text-xs text-muted-foreground">Les&apos;s AI assistant · usually instant</p>
            </div>
            <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-mono uppercase text-primary">AI</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="-mr-2 rounded-md p-2.5 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
            {messages.length === 1 &&
              (mobile || !stage ? (
                <PaoAvatar className="mx-auto h-20 w-20" />
              ) : (
                <PaoStage className="mx-auto -mb-2 h-44 w-40" />
              ))}
            {messages.map((m, i) =>
              m.text || m.role === "user" ? (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-card border border-border"
                  }`}
                >
                  {m.text}
                  {m.links?.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10"
                    >
                      Open the {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    </Link>
                  ))}
                </div>
              ) : null,
            )}
            {waiting && (
              <div className="flex items-center gap-2" aria-label="Pao is typing">
                <PaoAvatar className="h-7 w-7" />
                <div className="flex w-14 gap-1 rounded-2xl border border-border bg-card px-3.5 py-3">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </div>
              </div>
            )}
            {!busy && chips.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {chips.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="min-h-10 rounded-full border border-primary/30 px-3.5 py-2 text-sm text-primary transition-colors hover:bg-primary/10 active:scale-95 sm:min-h-0 sm:py-1.5 sm:text-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_CHARS}
                placeholder="Ask about Les's work…"
                aria-label="Message"
                enterKeyHint="send"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-base outline-none focus:border-primary/50 sm:text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform active:scale-90 disabled:opacity-40 sm:h-10 sm:w-10"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              AI assistant. It can make mistakes; Les confirms everything personally.
            </p>
          </form>
        </div>
      )}

      <button
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with Pao, Les's AI assistant"}
        data-chat-launcher
        className={`group relative items-center gap-2 rounded-full ${open ? "hidden sm:flex" : "flex"} bg-primary py-1.5 pl-1.5 pr-4 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95`}
      >
        {!open && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40 [animation-duration:2.5s]" />}
        {open ? <X className="h-6 w-6" /> : <PaoAvatar className="h-9 w-9 ring-2 ring-primary-foreground/30" />}
        <span className="text-sm font-semibold">{open ? "Close" : "Ask Pao"}</span>
      </button>
    </div>
  );
}
