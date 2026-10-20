// Checks that run BEFORE any model call, so abusive input never costs a token.
// No imports on purpose: `node --test src/lib/chat/guard.test.ts` runs this file directly.

export const LIMITS = { maxChars: 500, maxTurns: 20 } as const;

export const REPLIES = {
  empty: "Ask me anything about Les's work, services, or booking a call.",
  tooLong: `Please keep messages under ${LIMITS.maxChars} characters. What would you like to know about Les's work?`,
  code: "I can't read, write, or debug code here. I only answer questions about Les's services and projects, and I can help you book a call. If you need help with a codebase, that's exactly the kind of work Les takes on. Want me to find a time?",
  turns: "We've covered a lot! The best next step is a quick call with Les, or a message through the contact form below.",
  rate: "You've reached the message limit for now. Please try again later, or use the contact form below and Les will reply within 24 hours.",
  budget: "I'm resting for today. Please use the contact form below and Les will reply within 24 hours.",
  unavailable: "I'm not available right now. Please use the contact form below and Les will reply within 24 hours.",
  error: "Sorry, something went wrong on my side. Please try again, or use the contact form below.",
  filler: "That looks like filler text. Ask me something about Les's services or projects, or I can help you book a call.",
  refusal: "That's outside what I can help with here. I can answer questions about Les's services and projects, or help you book a call.",
} as const;

// ponytail: heuristic, not a parser. Short prose with one code-ish token passes; real pasted code
// (a fence, or several code signals, or one signal over many lines) is blocked.
const CODE_SIGNALS = [
  /[{};]\s*$/m, // a line ending in ; { or }
  /\b(function|const|let|var|def|class|import|return|public|private|SELECT|INSERT|UPDATE|DELETE)\b[^\n]*[({=]/,
  /<\/?[a-z][\w-]*(\s[^>]*)?>/i, // HTML/XML tags
  /=>|::|#include|\$\w+\s*=|\bconsole\.|\bprint\(/,
];

// Pasted error output is a debugging request even with no code in it.
const ERROR_LOG = /Traceback \(most recent call last\)|^\s*at \S+ \(?\S+:\d+:\d+\)?$|\b\w+(Error|Exception): .+\n|\.(js|ts|tsx|py|java|cs|php|go|rb):\d+/m;

export function looksLikeCode(text: string): boolean {
  if (text.includes("```") || ERROR_LOG.test(text)) return true;
  const hits = CODE_SIGNALS.filter((re) => re.test(text)).length;
  const lines = text.split("\n").length;
  return hits >= 2 || (hits >= 1 && lines >= 4);
}

// ponytail: catches keyboard-mash and repeated-filler floods, not clever spam. The rate limits and
// daily budget bound everything this misses.
export function looksLikeFiller(text: string): boolean {
  if (/(.)\1{14,}/.test(text)) return true; // 15+ of the same character in a row
  if (/(\S{3,20})(\s*\1){7,}/.test(text)) return true; // a 3+ char chunk repeated 8+ times
  const compact = text.replace(/\s+/g, "");
  return compact.length >= 40 && new Set(compact.toLowerCase()).size < 6;
}

/** Cache key form of a question: case, spacing, and trailing punctuation don't make it a new one. */
export const normalizeQuestion = (text: string) =>
  text.toLowerCase().replace(/\s+/g, " ").replace(/[\s?!.]+$/, "").trim();

export type Verdict = { ok: true; text: string } | { ok: false; reply: string };

/** `turnsSoFar` = visitor messages already in this conversation. */
export function checkMessage(raw: string, turnsSoFar: number): Verdict {
  const text = raw.trim();
  if (!text) return { ok: false, reply: REPLIES.empty };
  if (text.length > LIMITS.maxChars) return { ok: false, reply: REPLIES.tooLong };
  if (turnsSoFar >= LIMITS.maxTurns) return { ok: false, reply: REPLIES.turns };
  if (looksLikeCode(text)) return { ok: false, reply: REPLIES.code };
  if (looksLikeFiller(text)) return { ok: false, reply: REPLIES.filler };
  return { ok: true, text };
}
