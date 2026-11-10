const MAX = 500;

/** Reads `q` from a URL hash like `#q=...`: control characters removed (newlines kept), trimmed, capped at 500. */
export function readPrefill(hash: string): string | null {
  const q = new URLSearchParams(hash.slice(1)).get("q");
  if (!q) return null;
  const clean = q.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim().slice(0, MAX).trim();
  return clean || null;
}
