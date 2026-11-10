// Cal.com client shared by Pao chat and the Studio booking routes. No model calls here.
const CAL_API = "https://api.cal.com/v2";

export function isTimeZone(v: string): boolean {
  if (!v || v.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: v });
    return true;
  } catch {
    return false;
  }
}

export const slotLabel = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));

function calHeaders(version: string) {
  const key = process.env.CAL_API_KEY;
  if (!key || !process.env.CAL_EVENT_TYPE_ID) throw new Error("Cal.com not configured");
  return { Authorization: `Bearer ${key}`, "cal-api-version": version, "content-type": "application/json" };
}

export async function fetchSlots(timeZone: string, daysAhead = 7): Promise<{ start: string; label: string }[]> {
  const now = new Date();
  const end = new Date(now.getTime() + daysAhead * 86_400_000);
  const qs = new URLSearchParams({
    eventTypeId: process.env.CAL_EVENT_TYPE_ID ?? "",
    start: now.toISOString(),
    end: end.toISOString(),
    timeZone,
  });
  const res = await fetch(`${CAL_API}/slots?${qs}`, { headers: calHeaders("2024-09-04") });
  if (!res.ok) throw new Error(`cal slots ${res.status}`);
  const body: { data: Record<string, { start: string }[]> } = await res.json();

  // At most 2 per day and 6 total: a spread of days, and few enough that the model offers all of
  // them, so the tap-to-pick buttons match the times in its reply.
  return Object.values(body.data ?? {})
    .flatMap((day) => day.slice(0, 2))
    .slice(0, 6)
    .map((s) => ({ start: s.start, label: slotLabel(s.start, timeZone) }));
}

/** True when Cal.com confirmed the booking. Logs the status code only (no visitor details). */
export async function createBooking(i: {
  start: string;
  timeZone: string;
  name: string;
  email: string;
  metadata: Record<string, string>;
}): Promise<boolean> {
  const res = await fetch(`${CAL_API}/bookings`, {
    method: "POST",
    headers: calHeaders("2026-02-25"),
    body: JSON.stringify({
      start: new Date(i.start).toISOString(),
      eventTypeId: Number(process.env.CAL_EVENT_TYPE_ID),
      attendee: { name: i.name, email: i.email, timeZone: i.timeZone },
      metadata: i.metadata,
    }),
  });
  if (!res.ok) console.error("[cal] booking failed", res.status);
  return res.ok;
}
