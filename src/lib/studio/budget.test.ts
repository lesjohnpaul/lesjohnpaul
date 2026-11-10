import test from "node:test";
import assert from "node:assert/strict";
import { reserve, settle, spendKey, studioBudgetUsd, type Counter } from "./budget.ts";

function fake() {
  const m = new Map<string, number>();
  const db: Counter = {
    async incrbyfloat(k, n) {
      const v = (m.get(k) ?? 0) + n;
      m.set(k, v);
      return v;
    },
    async expire() {
      return 1;
    },
  };
  return { db, m };
}

test("reserve under cap returns true", async () => {
  const { db, m } = fake();
  assert.equal(await reserve(db, "k", 0.02, 2), true);
  assert.ok(Math.abs(m.get("k")! - 0.02) < 1e-9);
});

test("reserve over cap returns false and leaves total unchanged", async () => {
  const { db, m } = fake();
  m.set("k", 1.99);
  assert.equal(await reserve(db, "k", 0.02, 2), false);
  assert.ok(Math.abs(m.get("k")! - 1.99) < 1e-9);
});

test("settle replaces reservation with actual", async () => {
  const { db, m } = fake();
  await reserve(db, "k", 0.02, 2);
  await settle(db, "k", 0.02, 0.005);
  assert.ok(Math.abs(m.get("k")! - 0.005) < 1e-9);
});

test("spendKey and default budget", () => {
  assert.equal(spendKey(new Date("2026-11-10T05:00:00Z")), "studio:spend:2026-11-10");
  delete process.env.STUDIO_DAILY_BUDGET_USD;
  assert.equal(studioBudgetUsd(), 2);
});
