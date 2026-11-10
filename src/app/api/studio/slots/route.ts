import { fetchSlots, isTimeZone } from "@/lib/cal";
import { clientIp, isBot, rateLimit } from "@/lib/guards";

// Read-only Cal.com lookup: no device, no AI, so it keeps working when the AI budget is spent.
export async function GET(req: Request) {
  if (await isBot()) return Response.json({ error: "Blocked." }, { status: 403 });
  const tz = new URL(req.url).searchParams.get("tz") ?? "";
  if (!isTimeZone(tz)) return Response.json({ error: "Invalid time zone." }, { status: 400 });

  // Fail open if Redis errors or is missing: slots are read-only.
  const ok = await rateLimit("studio-slots-ip", clientIp(req), 30, "1 h").catch(() => null);
  if (ok === false) return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });

  try {
    return Response.json({ slots: await fetchSlots(tz) });
  } catch (err) {
    console.error("[studio] slots failed:", err instanceof Error ? err.message : "unknown");
    return Response.json({ error: "Times aren't available right now." }, { status: 503 });
  }
}
