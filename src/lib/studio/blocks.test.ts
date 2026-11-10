// Run: node --test src/lib/studio/blocks.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { BLOCK_TYPES, arrivals } from "./blocks.ts";

test("no screens → nothing arrived, every slot keeps its home shape", () =>
  assert.deepEqual(arrivals([]), { rank: [-1, -1, -1, -1, -1, -1, -1], shape: BLOCK_TYPES }));

test("each screen flies out of its type's home slot, shapes unchanged", () => {
  const { rank, shape } = arrivals(["odontogram", "booking", "dashboard"]);
  assert.deepEqual(rank, [2, -1, -1, -1, 1, -1, 0]);
  assert.deepEqual(shape, BLOCK_TYPES);
});

test("a taken home slot makes the screen borrow the first free slot", () => {
  const { rank, shape } = arrivals(["table", "table", "dashboard"]);
  assert.deepEqual(rank, [1, 0, 2, -1, -1, -1, -1]); // 2nd table borrows slot 0, so dashboard borrows slot 2
  assert.deepEqual(shape, ["table", "table", "dashboard", "map", "booking", "kanban", "odontogram"]);
});

test("streaming: more arrivals never move or reshape earlier ones", () => {
  const all = ["table", "table", "dashboard"] as const;
  for (let k = 1; k < 3; k++) {
    const a = arrivals(all.slice(0, k));
    const b = arrivals(all);
    a.rank.forEach((r, i) => r >= 0 && assert.equal(b.rank[i], r));
    a.shape.forEach((t, i) => a.rank[i] >= 0 && assert.equal(b.shape[i], t));
  }
});

test("only the first three screens count", () =>
  assert.deepEqual(arrivals(["map", "form", "kanban", "booking"]), arrivals(["map", "form", "kanban"])));
