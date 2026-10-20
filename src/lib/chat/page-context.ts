import { getWork, workItems } from "@/lib/work";

// Case studies are too big to keep in the system prompt (20 of them), so the one the visitor is
// reading is added to the conversation once, on demand. After that, history caching keeps it cheap.
export function studyContext(path: string | undefined): { slug: string; text: string } | null {
  const slug = path?.match(/^\/work\/([a-z0-9-]+)$/)?.[1];
  const w = slug ? getWork(slug) : null;
  if (!w) return null;
  const s = w.study;
  const lines = [
    `Case study: ${w.project.title} (status: ${s.status}). Client: ${s.client}. Les's role: ${s.role}.`,
    `Summary: ${s.summary}`,
    s.scale?.length && `Scale: ${s.scale.join("; ")}`,
    `Challenge: ${s.challenge.join(" ")}`,
    `Approach: ${s.approach.join(" ")}`,
    `Built: ${s.built.join("; ")}`,
    s.capabilities?.length && `Capabilities: ${s.capabilities.map((c) => `${c.group}: ${c.items.join(", ")}`).join(". ")}`,
    s.architecture?.length && `Architecture: ${s.architecture.join(" ")}`,
    s.engineering?.length && `Engineering: ${s.engineering.join(" ")}`,
    `Outcome: ${s.outcome.join(" ")}`,
    s.aiAngle && `AI angle: ${s.aiAngle}`,
    `Stack: ${w.project.tech.join(", ")}`,
  ].filter(Boolean);
  return { slug: w.slug, text: lines.join("\n") };
}

// "WeCare: Pharmacy POS" is usually written as "WeCare"; titles without a colon are matched whole.
const NAMES = workItems.map((w) => ({
  slug: w.slug,
  title: w.project.title.toLowerCase(),
  short: w.project.title.split(":")[0].replace(/\s*\(.*\)$/, "").trim(),
}));
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Case studies a reply mentions, as link buttons. Found in the text, so it costs no tokens. */
export function caseStudyLinks(reply: string, exclude?: string) {
  const lower = reply.toLowerCase();
  return NAMES.filter(
    (n) => n.slug !== exclude && (lower.includes(n.title) || new RegExp(`\\b${escape(n.short)}\\b`).test(reply)),
  )
    .slice(0, 2)
    .map((n) => ({ label: `${n.short} case study`, href: `/work/${n.slug}` }));
}
