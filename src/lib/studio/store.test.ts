import test from "node:test";
import assert from "node:assert/strict";
import { saveBuild, getBuild, keepBuild, BUILD_TTL_S, KEEP_TTL_S, type KV } from "./store.ts";
import { FALLBACKS } from "./fallbacks.ts";

const sample = Object.values(FALLBACKS)[0] as never;

function fake() {
  let now = 0;
  const m = new Map<string, { v: unknown; exp: number }>();
  const live = (k: string) => {
    const e = m.get(k);
    return e && e.exp > now ? e : null;
  };
  const gets: string[] = [];
  const db: KV = {
    async set(k, v, o) {
      m.set(k, { v: JSON.parse(JSON.stringify(v)), exp: now + o.ex * 1000 });
      return "OK";
    },
    async get<T>(k: string) {
      gets.push(k);
      return (live(k)?.v as T) ?? null;
    },
    async expire(k, s) {
      const e = live(k);
      if (!e) return 0;
      e.exp = now + s * 1000;
      return 1;
    },
  };
  return { db, gets, advance: (s: number) => void (now += s * 1000) };
}

test("save then get returns prototype", async () => {
  const { db } = fake();
  const id = await saveBuild(db, sample);
  assert.deepEqual(await getBuild(db, id), sample);
});

test("get after 1801 s returns null", async () => {
  const { db, advance } = fake();
  const id = await saveBuild(db, sample);
  advance(BUILD_TTL_S + 1);
  assert.equal(await getBuild(db, id), null);
});

test("keepBuild extends to 30 days", async () => {
  const { db, advance } = fake();
  const id = await saveBuild(db, sample);
  assert.equal(await keepBuild(db, id), true);
  advance(KEEP_TTL_S - 1);
  assert.deepEqual(await getBuild(db, id), sample);
  advance(2);
  assert.equal(await getBuild(db, id), null);
});

test("keepBuild on expired id returns false", async () => {
  const { db, advance } = fake();
  const id = await saveBuild(db, sample);
  advance(BUILD_TTL_S + 1);
  assert.equal(await keepBuild(db, id), false);
});

test("non-uuid id returns null without a lookup", async () => {
  const { db, gets } = fake();
  assert.equal(await getBuild(db, "../../etc"), null);
  assert.equal(await keepBuild(db, "nope"), false);
  assert.equal(gets.length, 0);
});
