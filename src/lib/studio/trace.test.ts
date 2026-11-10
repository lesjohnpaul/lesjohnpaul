// Run: node --test src/lib/studio/trace.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { tracer } from "./trace.ts";

const clock = (...ts: number[]) => { let i = 0; return () => ts[Math.min(i++, ts.length - 1)]; };
const KEYS = ["step", "ms", "ok", "note", "model", "screens", "tokens", "usd"];

test("ms is the delta between marks", () => {
  const mark = tracer(clock(0, 12.4, 40));
  assert.equal(mark("input").v.ms, 12);
  assert.equal(mark("guardrails").v.ms, 28);
});
test("ms never negative", () => {
  const mark = tracer(clock(50, 10));
  assert.equal(mark("input").v.ms, 0);
});
test("ok defaults to true", () => assert.equal(tracer(clock(0, 1))("input").v.ok, true));
test("unknown keys are dropped", () => {
  const e = tracer(clock(0, 1))("input", { text: "secret", spec: "x" } as unknown as object);
  assert.deepEqual(Object.keys(e.v).sort(), ["ms", "ok", "step"]);
  assert.ok(Object.keys(e.v).every((k) => KEYS.includes(k)));
});
test("invalid note is dropped", () => {
  const e = tracer(clock(0, 1))("guardrails", { ok: false, note: "hello visitor" } as unknown as object);
  assert.equal("note" in e.v, false);
});
test("serialised event contains only the expected keys", () => {
  const e = tracer(clock(0, 1))("stream", { screens: 2, tokens: { in: 1, cached: 2, out: 3, text: "x" } as never, usd: 0.01, model: "m" });
  const o = JSON.parse(JSON.stringify(e));
  assert.deepEqual(Object.keys(o), ["t", "v"]);
  assert.deepEqual(Object.keys(o.v.tokens).sort(), ["cached", "in", "out"]);
  assert.deepEqual(Object.keys(o.v).sort(), ["model", "ms", "ok", "screens", "step", "tokens", "usd"]);
});
test("non-finite numbers are dropped", () => {
  const e = tracer(clock(0, 1))("stream", { screens: NaN, usd: Infinity });
  assert.deepEqual(Object.keys(e.v).sort(), ["ms", "ok", "step"]);
});
