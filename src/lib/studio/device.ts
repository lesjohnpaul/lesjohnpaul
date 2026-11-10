import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const DEVICE_COOKIE = "studio_did";

let warned = false;

/** The cookie-signing secret, or null when missing or too short (callers then serve fallbacks). Warns once per process. */
export function studioSecret(): string | null {
  const secret = process.env.STUDIO_COOKIE_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (!warned) console.error("[studio] STUDIO_COOKIE_SECRET missing or too short; serving fallbacks");
  warned = true;
  return null;
}

const mac = (id: string, secret: string) => createHmac("sha256", secret).update(id).digest("base64url");

export function signDeviceId(id: string, secret: string): string {
  return `${id}.${mac(id, secret)}`;
}

export function verifyDeviceCookie(value: string | undefined, secret: string): string | null {
  if (!value) return null;
  const i = value.lastIndexOf(".");
  if (i < 1) return null;
  const id = value.slice(0, i);
  const got = Buffer.from(value.slice(i + 1));
  const want = Buffer.from(mac(id, secret));
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  return id;
}

export function deviceFromCookieHeader(
  cookieHeader: string | null,
  secret: string,
): { id: string; setCookie: string | null } {
  const raw = cookieHeader
    ?.split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${DEVICE_COOKIE}=`))
    ?.slice(DEVICE_COOKIE.length + 1);
  const id = verifyDeviceCookie(raw, secret);
  if (id) return { id, setCookie: null };
  const fresh = randomUUID();
  return {
    id: fresh,
    setCookie: `${DEVICE_COOKIE}=${signDeviceId(fresh, secret)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax; Secure`,
  };
}
