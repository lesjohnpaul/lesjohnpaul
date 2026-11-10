import type { StudioEvent } from "./prompt.ts";

const encoder = new TextEncoder();

// The wire format to the client: one JSON object per line.
export const line = (e: StudioEvent): Uint8Array => encoder.encode(JSON.stringify(e) + "\n");

export function eventsResponse(events: StudioEvent[], setCookie?: string | null): Response {
  const headers = new Headers({ "content-type": "application/x-ndjson", "cache-control": "no-store" });
  if (setCookie) headers.append("set-cookie", setCookie);
  return new Response(new Blob(events.map((e) => JSON.stringify(e) + "\n")).stream(), { headers });
}
