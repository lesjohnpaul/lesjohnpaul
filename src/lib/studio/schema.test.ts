// Run: node --test src/lib/studio/schema.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioRequest, parsePrototype, parseScreen } from "./schema.ts";

const dashboard = {
  type: "dashboard",
  title: "Overview",
  kpis: [
    { label: "Orders", value: "128" },
    { label: "Revenue", value: "$4.2k" },
  ],
  chart: { label: "Weekly orders", points: [3, 5, 4, 8, 7, 9] },
};
const table = {
  type: "table",
  title: "Orders",
  columns: ["Customer", "Item"],
  rows: [
    ["Ana", "Cake"],
    ["Ben", "Pie"],
    ["Cy", "Tart"],
  ],
};
const kanban = {
  type: "kanban",
  title: "Jobs",
  columns: [
    { name: "New", cards: ["Quote A"] },
    { name: "Doing", cards: [] },
    { name: "Done", cards: ["Quote B"] },
  ],
};
const proto = (over: Record<string, unknown> = {}) => ({
  business: "Sample Bakery",
  spec: "Track orders and deliveries in one place.",
  screens: [dashboard, table, kanban],
  ...over,
});

test("valid 3-screen prototype parses", () => {
  assert.notEqual(parsePrototype(proto()), null);
});

test("4 screens rejected", () => {
  assert.equal(parsePrototype(proto({ screens: [dashboard, table, kanban, dashboard] })), null);
});

test("unknown screen type rejected", () => {
  const chat = { type: "chat", title: "Chat" };
  assert.equal(parsePrototype(proto({ screens: [dashboard, table, chat] })), null);
  assert.equal(parseScreen(chat), null);
});

test("table row with wrong column count rejected", () => {
  const bad = { ...table, rows: [["Ana", "Cake"], ["Ben"], ["Cy", "Tart"]] };
  assert.equal(parsePrototype(proto({ screens: [dashboard, bad, kanban] })), null);
  assert.equal(parseScreen(bad), null);
});

test("strings over limits rejected", () => {
  assert.equal(parsePrototype(proto({ business: "x".repeat(41) })), null);
});

test("markup stays plain text", () => {
  const p = parsePrototype(proto({ business: "<b>Shop</b>" }));
  assert.equal(p?.business, "<b>Shop</b>");
});

test("StudioRequest rejects 501 chars and unknown chip values", () => {
  const ok = { text: "  We sell cakes  ", who: "team", pain: "manual" };
  assert.equal(StudioRequest.safeParse(ok).data?.text, "We sell cakes");
  assert.equal(StudioRequest.safeParse({ ...ok, text: "x".repeat(501) }).success, false);
  assert.equal(StudioRequest.safeParse({ ...ok, who: "everyone" }).success, false);
  assert.equal(StudioRequest.safeParse({ ...ok, pain: "cost" }).success, false);
});

const odontogram = (over: Record<string, unknown> = {}) => ({
  type: "odontogram",
  title: "Dental chart",
  patients: [
    { name: "Patient A", note: "Recall in 6 months", teeth: [{ tooth: 16, condition: "caries" }, { tooth: 36, condition: "filled" }] },
    { name: "Patient B", teeth: [] },
  ],
  ...over,
});

test("odontogram parses with valid FDI teeth", () => {
  const teeth = [11, 18, 21, 28, 31, 38, 41, 48].map((tooth) => ({ tooth, condition: "healthy" }));
  assert.notEqual(parseScreen(odontogram()), null);
  assert.notEqual(parseScreen(odontogram({ patients: [{ name: "P", teeth }] })), null);
  assert.notEqual(parsePrototype(proto({ screens: [odontogram(), table, kanban] })), null);
});

test("tooth 19 rejected", () => {
  for (const tooth of [19, 10, 20, 30, 49, 51, 16.5]) {
    assert.equal(parseScreen(odontogram({ patients: [{ name: "P", teeth: [{ tooth, condition: "caries" }] }] })), null, String(tooth));
  }
});

test("duplicate tooth rejected", () => {
  const teeth = [{ tooth: 16, condition: "caries" }, { tooth: 16, condition: "filled" }];
  assert.equal(parseScreen(odontogram({ patients: [{ name: "P", teeth }] })), null);
});

test("4 patients rejected", () => {
  const p = { name: "P", teeth: [] };
  assert.equal(parseScreen(odontogram({ patients: [p, p, p, p] })), null);
  assert.equal(parseScreen(odontogram({ patients: [] })), null);
  assert.equal(parseScreen(odontogram({ patients: [{ ...p, note: "x".repeat(61) }] })), null);
  assert.equal(parseScreen(odontogram({ patients: [{ name: "P", teeth: [{ tooth: 11, condition: "chipped" }] }] })), null);
});
