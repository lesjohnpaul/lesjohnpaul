import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import type { TraceEvent } from "./trace.ts";
import { PrototypeSchema, parseScreen, type Prototype, type Screen, type StudioRequest } from "./schema.ts";

export type StudioEvent =
  | { t: "spec"; v: { business: string; spec: string } }
  | { t: "screen"; i: number; v: Screen }
  | { t: "done"; buildId: string }
  | { t: "fallback"; v: { label: string; prototype: Prototype } }
  | TraceEvent;

const FDI_TEETH = [1, 2, 3, 4].flatMap((q) => [1, 2, 3, 4, 5, 6, 7, 8].map((p) => q * 10 + p));

type Node = { [k: string]: unknown };
const node = (v: unknown): Node | undefined => (typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Node) : undefined);

function toolSchema(): Anthropic.Tool["input_schema"] {
  const json = z.toJSONSchema(PrototypeSchema) as Node;
  delete json.$schema;
  const props = node(json.properties) ?? {};
  const prefix = node(props.screens)?.prefixItems;
  if (Array.isArray(prefix)) {
    // Tool input schemas must be plain JSON Schema; parsePrototype still enforces the tuple server-side.
    props.screens = { type: "array", items: prefix[0], minItems: 3, maxItems: 3 };
  }
  // zod refines don't reach JSON Schema: state the FDI set and the unique-teeth rule explicitly.
  const oneOf = node(node(props.screens)?.items)?.oneOf;
  const odonto = Array.isArray(oneOf) ? oneOf.find((o) => node(node(node(o)?.properties)?.type)?.const === "odontogram") : undefined;
  const teeth = node(node(node(node(node(odonto)?.properties)?.patients)?.items)?.properties)?.teeth;
  const t = node(teeth);
  if (t) {
    t.description = "Each tooth at most once; list only non-healthy teeth.";
    const toothProps = node(node(t.items)?.properties);
    if (toothProps) toothProps.tooth = { type: "integer", enum: FDI_TEETH, description: "FDI tooth number" };
  }
  return json as Anthropic.Tool["input_schema"];
}

export const RENDER_TOOL: Anthropic.Tool = {
  name: "render_prototype",
  description: "Render the visitor's prototype: a business name, a one-line spec, and exactly 3 screens.",
  eager_input_streaming: true,
  input_schema: toolSchema(),
};

export const STUDIO_SYSTEM = `You are Pao, Les's build assistant. A visitor describes their business or a work problem. Read it and build a small prototype of the software they need.

- Pick the 3 screen types that best fit their problem.
- Use the odontogram screen only for dental businesses, and always include it for them.
- Write every string (business name, spec line, titles, labels, sample data) in the same language as the visitor's text: English in, English out; Taglish or Filipino in, the same Taglish or Filipino out. Never use any other language, such as Spanish.
- Invent generic, realistic sample data: no real people, companies, brands, URLs or addresses.
- Never mention Les's past clients or projects.
- Output only by calling render_prototype. Do not write any other text.
- If the text is not a business or work problem, build a simple generic small-business prototype.`;

const WHO = { team: "my team", customers: "my customers", both: "my team and my customers" } as const;
const PAIN = { manual: "manual work", visibility: "no visibility", slow: "slow orders" } as const;

export function buildUserMessage(r: StudioRequest): string {
  const text = r.text.replace(/<\s*\/?\s*discovery/gi, "(discovery");
  return `<discovery>${text}</discovery>\nUsers: ${WHO[r.who]}\nBiggest pain: ${PAIN[r.pain]}`;
}

export function progress(snapshot: unknown, sent: { spec: boolean; screens: number }): StudioEvent[] {
  const s = snapshot as { business?: unknown; spec?: unknown; screens?: unknown } | null;
  const out: StudioEvent[] = [];
  if (!s || !Array.isArray(s.screens)) return out;
  if (!sent.spec && typeof s.business === "string" && typeof s.spec === "string") {
    sent.spec = true;
    out.push({ t: "spec", v: { business: s.business, spec: s.spec } });
  }
  while (s.screens.length > sent.screens + 1) {
    const v = parseScreen(s.screens[sent.screens]);
    if (!v) break;
    out.push({ t: "screen", i: sent.screens, v });
    sent.screens++;
  }
  return out;
}
