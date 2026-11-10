import { z } from "zod";
import { createBooking, isTimeZone, slotLabel } from "@/lib/cal";
import { clientIp, isBot, rateLimit, redis } from "@/lib/guards";
import { notifyLead } from "@/lib/notify";
import { deviceFromCookieHeader, studioSecret } from "@/lib/studio/device";
import { getBuild, keepBuild } from "@/lib/studio/store";

const MAX_BODY_BYTES = 2_000;
const Body = z.object({
  start: z.iso.datetime({ offset: true }),
  timeZone: z.string().max(64).refine(isTimeZone),
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  buildId: z.uuid().optional(),
});

export async function POST(req: Request) {
  let setCookie: string | null = null;
  const json = (body: unknown, status: number) => {
    const headers = new Headers();
    if (setCookie) headers.append("set-cookie", setCookie);
    return Response.json(body, { status, headers });
  };
  const unavailable = () => json({ error: "Booking isn't available right now. Use the contact form instead." }, 503);

  if (await isBot()) return json({ error: "Blocked." }, 403);

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ error: "Invalid request." }, 400);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "Invalid request." }, 400);
  const parsed = Body.safeParse((() => { try { return JSON.parse(raw); } catch { return null; } })());
  if (!parsed.success) return json({ error: "Invalid request." }, 400);
  const { start, timeZone, name, email, buildId } = parsed.data;
  if (new Date(start).getTime() < Date.now()) return json({ error: "That time has passed. Pick another." }, 400);

  // A weak or missing secret means unsigned cookies, so the feature is unavailable.
  const secret = studioSecret();
  if (!secret || !redis) return unavailable();
  const db = redis;
  const device = deviceFromCookieHeader(req.headers.get("cookie"), secret);
  setCookie = device.setCookie;

  try {
    const [perDevice, perEmail, perIp] = await Promise.all([
      rateLimit("studio-book-dev", device.id, 2, "1 d"),
      rateLimit("book-email", email.toLowerCase(), 2, "1 d"),
      // Backstop for clients that drop cookies and mint a fresh device each request.
      rateLimit("studio-book-ip", clientIp(req), 6, "1 d"),
    ]);
    if (!perDevice || !perEmail || !perIp) return json({ error: "Booking limit reached for today." }, 429);

    const prototype = buildId ? await getBuild(db, buildId) : null;
    const business = prototype?.business ?? "";

    if (!(await createBooking({ start, timeZone, name, email, metadata: { source: "studio", prototypeId: buildId ?? "", business } }))) {
      return json({ error: "That time was just taken. Pick another." }, 409);
    }

    const kept = prototype ? await keepBuild(db, buildId!).catch(() => false) : false;
    const when = slotLabel(start, timeZone);
    await notifyLead({
      source: "studio",
      name,
      email,
      message: "Booked a discovery call from the Studio.",
      details: {
        When: `${when} (visitor time)`,
        Business: business,
        Prototype: kept ? `https://lesjohnpauloliver.dev/studio/p/${buildId}` : undefined,
      },
    });
    return json({ ok: true, when }, 200);
  } catch (err) {
    console.error("[studio] book failed:", err instanceof Error ? err.message : "unknown");
    return unavailable();
  }
}
