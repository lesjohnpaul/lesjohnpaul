import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyLead, sendAutoReply } from "@/lib/notify";
import { clientIp, isBot, rateLimit } from "@/lib/guards";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email.").max(200),
  message: z.string().trim().min(10, "Please add a bit more detail.").max(5000),
  website: z.string().optional(), // honeypot: hidden from humans, bots fill it
});

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  if (await isBot()) return fail("Request blocked.", 403);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  const { website, ...lead } = parsed.data;

  // Pretend success so bots don't learn the honeypot exists.
  if (website) return NextResponse.json({ ok: true });

  // Fail open if Redis is missing: losing a real lead costs more than a few spam emails.
  if ((await rateLimit("contact", clientIp(req), 5, "1 h")) === false) {
    return fail("Too many messages. Please try again in an hour, or email me directly.", 429);
  }

  const full = { ...lead, source: "contact form" as const };
  const delivered = await notifyLead(full);
  if (!delivered) return fail("Couldn't send right now. Please email me directly.", 502);

  // One auto-reply per address per day, so the form can't be used to spam someone's inbox.
  if ((await rateLimit("autoreply", lead.email.toLowerCase(), 1, "1 d")) !== false) {
    await sendAutoReply(full);
  }
  return NextResponse.json({ ok: true });
}
