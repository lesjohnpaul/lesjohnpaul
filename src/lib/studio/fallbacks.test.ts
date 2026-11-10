import test from "node:test";
import assert from "node:assert/strict";
import { FALLBACKS, pickFallback } from "./fallbacks.ts";
import { parsePrototype } from "./schema.ts";

test("every fallback is a valid prototype", () => {
  for (const [k, p] of Object.entries(FALLBACKS)) {
    assert.ok(parsePrototype(p), `${k} invalid`);
    assert.equal(p.screens.length, 3);
  }
});

test("keywords pick the right fallback", () => {
  assert.equal(pickFallback("may karinderya ako").key, "restaurant");
  assert.equal(pickFallback("courier na may 5 riders").key, "logistics");
  assert.equal(pickFallback("sari-sari store").key, "retail");
  assert.equal(pickFallback("law firm").key, "services");
});

test("label is always the exact disclosure", () => {
  for (const t of ["dentist", "cafe", "courier", "boutique", "law firm"]) {
    const { label } = pickFallback(t);
    assert.ok(label.startsWith("Here's an example for a "));
    assert.ok(label.endsWith("book a call and I'll build yours."));
  }
  assert.equal(
    pickFallback("law firm").label,
    "Here's an example for a service business. My builder is resting right now; book a call and I'll build yours.",
  );
});

test("dental keywords pick dental fallback", () => {
  assert.equal(pickFallback("dental clinic sa Dagupan").key, "dental");
  for (const t of ["Dentist ako", "dentista sa bayan", "sakit ng ngipin", "orthodontics practice"]) assert.equal(pickFallback(t).key, "dental", t);
  assert.equal(pickFallback("derma clinic").key, "clinic");
  assert.equal(
    pickFallback("dental clinic").label,
    "Here's an example for a dental clinic. My builder is resting right now; book a call and I'll build yours.",
  );
});

test("dental fallback includes an odontogram", () => {
  const types = FALLBACKS.dental.screens.map((s) => s.type);
  assert.deepEqual([...types].sort(), ["booking", "odontogram", "table"]);
});
