import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { notifyLead, sendAutoReply } from "@/lib/notify";
import { rateLimit } from "@/lib/guards";

const CAL_API = "https://api.cal.com/v2";

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "get_available_slots",
    description:
      "List open 30-minute discovery-call times on Les's calendar. Returns start values to pass to book_meeting and readable labels in the visitor's time zone.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        time_zone: { type: "string", description: "Visitor's IANA time zone, e.g. America/New_York or Asia/Manila." },
        days_ahead: { type: "integer", minimum: 1, maximum: 14, description: "How many days ahead to search. Default 7." },
      },
      required: ["time_zone"],
    },
  },
  {
    name: "book_meeting",
    description:
      "Book a discovery call with Les. Only call after the visitor has explicitly confirmed the time, their name, and their email.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        start: { type: "string", description: "A start value exactly as returned by get_available_slots." },
        time_zone: { type: "string", description: "Visitor's IANA time zone." },
        name: { type: "string" },
        email: { type: "string" },
        problem: { type: "string", description: "One or two sentences on what they want to solve." },
        company: { type: "string" },
      },
      required: ["start", "time_zone", "name", "email", "problem"],
    },
  },
  {
    name: "submit_lead",
    description:
      "Send the visitor's details to Les so he can follow up by email. Use when the visitor prefers not to book a call; confirm details first.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        problem: { type: "string", description: "What they want to solve." },
        company: { type: "string" },
        timeline: { type: "string", description: "Only if the visitor mentioned one." },
        budget: { type: "string", description: "Only if the visitor mentioned one." },
      },
      required: ["name", "email", "problem"],
    },
  },
];

const tz = z.string().max(64).refine((v) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: v });
    return true;
  } catch {
    return false;
  }
}, "unknown time zone");

const SlotsInput = z.object({ time_zone: tz, days_ahead: z.number().int().min(1).max(14).optional() });
const BookInput = z.object({
  start: z.iso.datetime({ offset: true }),
  time_zone: tz,
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  problem: z.string().trim().min(1).max(500),
  company: z.string().trim().max(100).optional(),
});
const LeadInput = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  problem: z.string().trim().min(1).max(1000),
  company: z.string().trim().max(100).optional(),
  timeline: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(100).optional(),
});

// chips: tap-to-reply options shown to the visitor, taken from real tool data (never model-invented).
export type ToolOutcome = { content: string; isError?: boolean; event?: "booked" | "lead"; chips?: string[] };

const label = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));

function calHeaders(version: string) {
  const key = process.env.CAL_API_KEY;
  if (!key || !process.env.CAL_EVENT_TYPE_ID) throw new Error("Cal.com not configured");
  return { Authorization: `Bearer ${key}`, "cal-api-version": version, "content-type": "application/json" };
}

async function getSlots(input: z.infer<typeof SlotsInput>): Promise<ToolOutcome> {
  const now = new Date();
  const end = new Date(now.getTime() + (input.days_ahead ?? 7) * 86_400_000);
  const qs = new URLSearchParams({
    eventTypeId: process.env.CAL_EVENT_TYPE_ID ?? "",
    start: now.toISOString(),
    end: end.toISOString(),
    timeZone: input.time_zone,
  });
  const res = await fetch(`${CAL_API}/slots?${qs}`, { headers: calHeaders("2024-09-04") });
  if (!res.ok) throw new Error(`cal slots ${res.status}`);
  const body: { data: Record<string, { start: string }[]> } = await res.json();

  // At most 2 per day and 6 total: a spread of days, and few enough that the model offers all of
  // them, so the tap-to-pick buttons match the times in its reply.
  const slots = Object.values(body.data ?? {})
    .flatMap((day) => day.slice(0, 2))
    .slice(0, 6)
    .map((s) => ({ start: s.start, label: label(s.start, input.time_zone) }));
  if (!slots.length) return { content: "No open times in that range. Suggest a longer range or the contact form." };
  return { content: JSON.stringify(slots), chips: slots.map((s) => s.label) };
}

async function book(input: z.infer<typeof BookInput>, ip: string): Promise<ToolOutcome> {
  if (new Date(input.start).getTime() < Date.now()) return { content: "That time has passed. Fetch fresh slots.", isError: true };
  // Two attempts per email and per IP per day stops calendar spam without blocking a typo retry.
  const [byEmail, byIp] = await Promise.all([
    rateLimit("book-email", input.email.toLowerCase(), 2, "1 d"),
    rateLimit("book-ip", ip, 2, "1 d"),
  ]);
  if (byEmail === false || byIp === false) {
    return { content: "Booking limit reached for today. Suggest the contact form instead.", isError: true };
  }

  const res = await fetch(`${CAL_API}/bookings`, {
    method: "POST",
    headers: calHeaders("2026-02-25"),
    body: JSON.stringify({
      start: new Date(input.start).toISOString(),
      eventTypeId: Number(process.env.CAL_EVENT_TYPE_ID),
      attendee: { name: input.name, email: input.email, timeZone: input.time_zone },
      metadata: { source: "pao-assistant", problem: input.problem, company: input.company ?? "" },
    }),
  });
  if (!res.ok) {
    console.error("[chat] cal booking failed", res.status, await res.text().catch(() => ""));
    return { content: "The calendar couldn't confirm that time (it may have just been taken). Offer other slots.", isError: true };
  }

  const when = label(input.start, input.time_zone);
  await notifyLead({
    source: "booking",
    name: input.name,
    email: input.email,
    message: input.problem,
    details: { When: `${when} (visitor time)`, Company: input.company },
  });
  return { content: `Booked for ${when}. A calendar invite with the meeting link was emailed to ${input.email}.`, event: "booked" };
}

async function lead(input: z.infer<typeof LeadInput>, ip: string): Promise<ToolOutcome> {
  if ((await rateLimit("lead-ip", ip, 2, "1 d")) === false) {
    return { content: "Already received details from this visitor today.", isError: true };
  }
  const payload = {
    source: "chat assistant" as const,
    name: input.name,
    email: input.email,
    message: input.problem,
    details: { Company: input.company, Timeline: input.timeline, Budget: input.budget },
  };
  if (!(await notifyLead(payload))) return { content: "Couldn't deliver the details. Suggest the contact form.", isError: true };
  if ((await rateLimit("autoreply", input.email.toLowerCase(), 1, "1 d")) !== false) await sendAutoReply(payload);
  return { content: "Sent to Les. He usually replies within 24 hours.", event: "lead" };
}

/** Model-supplied input is untrusted: every tool validates before doing anything. */
export async function runTool(name: string, raw: unknown, ip: string): Promise<ToolOutcome> {
  try {
    switch (name) {
      case "get_available_slots": {
        const p = SlotsInput.safeParse(raw);
        return p.success ? await getSlots(p.data) : { content: `Invalid input: ${p.error.issues[0]?.message}`, isError: true };
      }
      case "book_meeting": {
        const p = BookInput.safeParse(raw);
        return p.success ? await book(p.data, ip) : { content: `Invalid input: ${p.error.issues[0]?.message}`, isError: true };
      }
      case "submit_lead": {
        const p = LeadInput.safeParse(raw);
        return p.success ? await lead(p.data, ip) : { content: `Invalid input: ${p.error.issues[0]?.message}`, isError: true };
      }
      default:
        return { content: `Unknown tool ${name}`, isError: true };
    }
  } catch (err) {
    console.error(`[chat] tool ${name} failed:`, err);
    return { content: "That didn't work on our side. Apologize and suggest the contact form.", isError: true };
  }
}
