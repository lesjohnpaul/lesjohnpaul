import test from "node:test";
import assert from "node:assert/strict";
import { signDeviceId, verifyDeviceCookie, deviceFromCookieHeader, DEVICE_COOKIE, studioSecret } from "./device.ts";

const S = "test-secret";

test("sign → verify round-trips", () => {
  const v = signDeviceId("abc-123", S);
  assert.equal(verifyDeviceCookie(v, S), "abc-123");
  assert.equal(verifyDeviceCookie(v, "other"), null);
});

test("tampered cookie returns null", () => {
  const v = signDeviceId("abc-123", S);
  assert.equal(verifyDeviceCookie("zzz" + v.slice(3), S), null);
  assert.equal(verifyDeviceCookie(v + "x", S), null);
  assert.equal(verifyDeviceCookie("nodot", S), null);
  assert.equal(verifyDeviceCookie(undefined, S), null);
});

test("missing cookie mints id and Set-Cookie with HttpOnly", () => {
  const d = deviceFromCookieHeader(null, S);
  assert.ok(d.id.length > 0);
  assert.ok(d.setCookie?.startsWith(`${DEVICE_COOKIE}=`));
  assert.ok(d.setCookie?.includes("HttpOnly"));
  const again = deviceFromCookieHeader(`a=b; ${DEVICE_COOKIE}=${signDeviceId(d.id, S)}`, S);
  assert.equal(again.id, d.id);
  assert.equal(again.setCookie, null);
});

test("studioSecret rejects missing/short secrets and warns once", (t) => {
  const errors = t.mock.method(console, "error", () => {});
  const prev = process.env.STUDIO_COOKIE_SECRET;
  try {
    delete process.env.STUDIO_COOKIE_SECRET;
    assert.equal(studioSecret(), null);
    process.env.STUDIO_COOKIE_SECRET = "short";
    assert.equal(studioSecret(), null);
    assert.equal(errors.mock.callCount(), 1);
    process.env.STUDIO_COOKIE_SECRET = "x".repeat(32);
    assert.equal(studioSecret(), "x".repeat(32));
  } finally {
    if (prev === undefined) delete process.env.STUDIO_COOKIE_SECRET;
    else process.env.STUDIO_COOKIE_SECRET = prev;
  }
});
