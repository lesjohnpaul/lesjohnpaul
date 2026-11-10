// Run: node --test src/lib/studio/proof.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { caseStudies } from "../../data/case-studies.ts";
import { PROOF_SLUGS, proofItems } from "./proof.ts";

const items = proofItems();

test("returns the four slugs in order", () => {
  assert.deepEqual(
    items.map((i) => i.slug),
    [
      "executive-live-collections-dashboard",
      "ai-assisted-refund-automation",
      "acirs-24-7-ai-customer-support",
      "wecare-pharmacy-pos-dispensing-platform",
    ],
  );
  assert.deepEqual(items.map((i) => i.slug), [...PROOF_SLUGS]);
});

test("every item has title, outcome ≤ 160 chars, href /work/<slug>", () => {
  for (const i of items) {
    assert.ok(i.title.length > 0, i.slug);
    assert.ok(i.outcome.length > 0 && i.outcome.length <= 160, `${i.slug}: ${i.outcome.length} chars`);
    assert.equal(i.href, `/work/${i.slug}`);
  }
});

test("every image exists under public/", () => {
  for (const i of items) assert.ok(existsSync(join(process.cwd(), "public", i.image)), i.image);
});

test("no item string contains its case study's client field", () => {
  for (const i of items) {
    const client = caseStudies[i.slug].client.toLowerCase();
    for (const v of Object.values(i)) assert.ok(!v.toLowerCase().includes(client), `${i.slug} leaks client`);
  }
});

test("unknown slug throws", () => {
  assert.throws(() => proofItems(["no-such-project"]), /no-such-project/);
});
