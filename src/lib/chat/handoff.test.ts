// Run: node --test src/lib/chat/handoff.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { studioLink, wantsBuild } from "./handoff.ts";
import { readPrefill } from "../studio/prefill.ts";

test("wantsBuild: build requests", () => {
  for (const q of [
    "Can Les build an inventory system for my bakery?",
    "I want to automate our clinic bookings",
    "Pwede ba magpagawa ng POS para sa tindahan ko?",
    "May bakery ako, gusto ko i-automate yung orders sa Messenger",
  ]) assert.equal(wantsBuild(q), true, q);
});

test("wantsBuild: past work and other questions", () => {
  for (const q of ["What projects has Les built?", "How did he build the WeCare dashboard?", "Is Les available next week?"])
    assert.equal(wantsBuild(q), false, q);
});

test("studioLink: one link, q capped at 500, round-trips", () => {
  assert.deepEqual(studioLink("hello"), []);
  const text = "  I want to build a booking app " + "x".repeat(600);
  const links = studioLink(text);
  assert.equal(links.length, 1);
  assert.equal(links[0].label, "Watch Pao build a prototype of this");
  assert.ok(links[0].href.startsWith("/studio#q="));
  const back = readPrefill(new URL(links[0].href, "https://x").hash);
  assert.equal(back, text.trim().slice(0, 500));
  assert.equal(back?.length, 500);
});

test("readPrefill: sanitizes and rejects empty", () => {
  assert.equal(readPrefill("#q=%00a%07b%0Ac%1B"), "ab\nc");
  assert.equal(readPrefill("#q=" + encodeURIComponent("<b>hi</b>")), "<b>hi</b>");
  assert.equal(readPrefill("#q=%20%20"), null);
  for (const h of ["", "#", "#other=1"]) assert.equal(readPrefill(h), null, h);
  assert.equal(readPrefill("#q=" + "y".repeat(600))?.length, 500);
});

test("studioLink: a lone surrogate at the cap does not throw", () => {
  const links = studioLink("I want to build an app " + "x".repeat(476) + "😀");
  assert.equal(links.length, 1);
});
