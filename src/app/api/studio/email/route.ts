import { z } from "zod";
import { clientIp, isBot, rateLimit, redis } from "@/lib/guards";
import { notifyLead, sendPrototypeEmail } from "@/lib/notify";
import { deviceFromCookieHeader, studioSecret } from "@/lib/studio/device";
import { getBuild, keepBuild } from "@/lib/studio/store";

const MAX_BODY_BYTES = 2_000;
const Body = z.object({ buildId: z.uuid(), email: z.email().max(200) });
// The business name is model output from visitor text; never relay anything link-like in an email.
const LINKISH = /\b\S+\.(com|net|org|ph|co|io|xyz|link|app|site|me)\b|https?:|www\./i;

export async function POST(req: Request) {
  let setCookie: string | null = null;
  const json = (body: unknown, status: number) => {
    const headers = new Headers();
    if (setCookie) headers.append("set-cookie", setCookie);
    return Response.json(body, { status, headers });
  };
  const unavailable = () => json({ error: "Email isn't available right now. Book a call instead." }, 503);

  if (await isBot()) return json({ error: "Blocked." }, 403);

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ error: "Invalid request." }, 400);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "Invalid request." }, 400);
  const parsed = Body.safeParse((() => { try { return JSON.parse(raw); } catch { return null; } })());
  if (!parsed.success) return json({ error: "Invalid request." }, 400);
  const { buildId, email } = parsed.data;

  // A weak or missing secret means unsigned cookies, so the feature is unavailable.
  const secret = studioSecret();
  if (!secret || !redis || !process.env.RESEND_API_KEY) return unavailable();
  const db = redis;
  const device = deviceFromCookieHeader(req.headers.get("cookie"), secret);
  setCookie = device.setCookie;

  try {
    const [perDevice, perAddress, perIp, perBuild] = await Promise.all([
      rateLimit("studio-email-dev", device.id, 2, "1 d"),
      rateLimit("studio-email-to", email.toLowerCase(), 1, "1 d"),
      // Backstop for clients that drop cookies and mint a fresh device each request.
      rateLimit("studio-email-ip", clientIp(req), 5, "1 d"),
      // One build can't be relayed to many inboxes.
      rateLimit("studio-email-build", buildId, 2, "30 d"),
    ]);
    if (!perDevice || !perAddress || !perIp || !perBuild) return json({ error: "You've already emailed a prototype today." }, 429);

    const prototype = await getBuild(db, buildId);
    if (!prototype || !(await keepBuild(db, buildId))) {
      return json({ error: "This build expired. Build it again in a few seconds." }, 410);
    }

    const link = `https://lesjohnpauloliver.dev/studio/p/${buildId}`;
    if (!(await sendPrototypeEmail(email, LINKISH.test(prototype.business) ? "your business" : prototype.business, link))) {
      return json({ error: "Couldn't send the email. Try again or book a call." }, 502);
    }
    await notifyLead({
      source: "studio",
      name: "Studio visitor",
      email,
      message: prototype.spec,
      details: { Business: prototype.business, Prototype: link },
    });
    return json({ ok: true }, 200);
  } catch (err) {
    console.error("[studio] email failed:", err instanceof Error ? err.message : "unknown");
    return unavailable();
  }
}
