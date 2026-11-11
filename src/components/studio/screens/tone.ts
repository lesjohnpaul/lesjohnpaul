// Shared colour helpers for the prototype screens. Colours are CSS variables defined on the Studio root.

export const CATEGORICAL = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)"] as const;

// ponytail: keyword match (English + Tagalog), bad before good so "unpaid" and "hindi pa bayad" don't read as paid.
// Add a per-cell tone to the schema if the guesses start missing.
const BAD = /overdue|late|cancel|unpaid|fail|out of|missing|declin|reject|no.?show|hindi|wala|urgent|expired|lost|blocked/i;
const WARN = /pending|wait|process|progress|partial|low|due|hold|review|draft|schedul|naghihintay|ongoing|prepar|new|open|transit/i;
const GOOD = /paid|done|complete|deliver|active|confirm|approv|ready|in stock|bayad|tapos|on time|available|resolved|closed|settled|shipped|ok/i;

/** The status colour a short label suggests, or undefined when it reads as plain text. */
export function toneOf(text: string): string | undefined {
  if (BAD.test(text)) return "var(--bad)";
  if (WARN.test(text)) return "var(--warn)";
  if (GOOD.test(text)) return "var(--ok)";
  return undefined;
}

/** A stable categorical colour for a name, so the same person or item keeps its colour between renders. */
export function colorOf(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return CATEGORICAL[h % CATEGORICAL.length];
}

export const initials = (text: string) =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
