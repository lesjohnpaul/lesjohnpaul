import { Resend } from "resend";
import { personalInfo } from "@/data/portfolio-data";

export type Lead = {
  source: "contact form" | "chat assistant" | "booking";
  name: string;
  email: string;
  message: string;
  details?: Record<string, string | undefined>;
};

const FROM = process.env.RESEND_FROM ?? "Les John Paul Oliver <hello@lesjohnpauloliver.dev>";
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Plain text everywhere: visitor input never gets rendered as HTML or Telegram markup.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 120);

function summarize(lead: Lead): string {
  const extra = Object.entries(lead.details ?? {})
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return [
    `New lead via ${lead.source}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    ...extra,
    "",
    lead.message,
  ].join("\n");
}

async function emailOwner(lead: Lead, text: string) {
  if (!resend) throw new Error("RESEND_API_KEY not set");
  const { error } = await resend.emails.send({
    from: FROM,
    to: personalInfo.email,
    replyTo: lead.email,
    subject: oneLine(`New ${lead.source} lead: ${lead.name}`),
    text,
  });
  if (error) throw new Error(`resend: ${error.message}`);
}

async function telegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram not configured");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 4000), disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`telegram: ${res.status}`);
}

/** Notifies the owner by email and Telegram. True if at least one channel delivered. */
export async function notifyLead(lead: Lead): Promise<boolean> {
  const text = summarize(lead);
  const results = await Promise.allSettled([emailOwner(lead, text), telegram(text)]);
  for (const r of results) {
    if (r.status === "rejected") console.error("[notify] channel failed:", r.reason);
  }
  return results.some((r) => r.status === "fulfilled");
}

/** Confirmation to the visitor. Callers must rate-limit per email so this can't be used to spam inboxes. */
export async function sendAutoReply(lead: Lead): Promise<void> {
  if (!resend) return;
  const first = oneLine(lead.name).split(" ")[0];
  const { error } = await resend.emails.send({
    from: FROM,
    to: lead.email,
    replyTo: personalInfo.email,
    subject: "Got your message, I'll reply within 24 hours",
    text: [
      `Hi ${first},`,
      "",
      "Thanks for reaching out. I read every message myself and usually reply within 24 hours.",
      "If it's easier to talk it through, you can book a call from my site: https://lesjohnpauloliver.dev/#contact",
      "",
      "Les John Paul Oliver",
      "AI Engineer · lesjohnpauloliver.dev",
    ].join("\n"),
  });
  if (error) console.error("[notify] auto-reply failed:", error.message);
}
