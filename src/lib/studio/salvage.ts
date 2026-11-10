import { parsePrototype, type Prototype } from "./schema.ts";

// End index (exclusive) of the first complete top-level JSON object/array in `s`, or -1.
function firstValueEnd(s: string): number {
  let depth = 0, inStr = false, esc = false, started = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === "{" || c === "[") { depth++; started = true; }
    else if (c === "}" || c === "]") { if (--depth === 0 && started) return i + 1; if (depth < 0) return -1; }
  }
  return -1;
}

// Raw streamed tool JSON -> prototype, tolerating junk after a complete top-level value.
// A truncated value never parses, so a cut-off prototype is never salvaged; the schema decides the rest.
export function salvagePrototype(raw: string): Prototype | null {
  try { return parsePrototype(JSON.parse(raw)); } catch {}
  const end = firstValueEnd(raw);
  if (end < 0) return null;
  try { return parsePrototype(JSON.parse(raw.slice(0, end))); } catch { return null; }
}
