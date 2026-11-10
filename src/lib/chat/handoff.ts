const VERB = /\b(build|make|create|develop|automate|digiti[sz]e|need|want)\b/i;
const NOUN = /\b(system|app|dashboard|portal|tracker|inventory|pos|booking|bookings|website|automation|tool|crm|ordering)\b/i;
const TAGLISH = /\b(pagawa|magpagawa|ipagawa|i-?automate|gawan ng)\b/i;
const PAST = /\b(did|has|have)\s+(he|les)\b|\bhow did\b/i;

/** Does the visitor want something built or automated (not asking about Les's past work)? */
export function wantsBuild(text: string): boolean {
  if (PAST.test(text)) return false;
  return TAGLISH.test(text) || (VERB.test(text) && NOUN.test(text));
}

// A lone surrogate (e.g. a slice through an emoji) makes encodeURIComponent throw.
const wellFormed = (s: string) =>
  typeof s.toWellFormed === "function" ? s.toWellFormed() : s.replace(/[\uD800-\uDFFF]/g, (c, i) => (/[\uD800-\uDBFF]/.test(c) && /[\uDC00-\uDFFF]/.test(s[i + 1] ?? "")) || (/[\uDC00-\uDFFF]/.test(c) && /[\uD800-\uDBFF]/.test(s[i - 1] ?? "")) ? c : "\uFFFD");

/** One Studio link for a build request. The text rides in the URL hash, which never leaves the browser. */
export function studioLink(text: string): { label: string; href: string }[] {
  if (!wantsBuild(text)) return [];
  return [{ label: "Watch Pao build a prototype of this", href: "/studio#q=" + encodeURIComponent(wellFormed(text.trim().slice(0, 500))) }];
}
