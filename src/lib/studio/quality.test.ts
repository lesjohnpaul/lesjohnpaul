// Run: node --test src/lib/studio/quality.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickTier } from "./quality.ts";

const desktop = { webgl2: true, reducedMotion: false, isMobile: false, cores: 8, memoryGB: 8 };

test("no webgl2 → static", () => assert.equal(pickTier({ ...desktop, webgl2: false }), "static"));
test("reduced motion → static", () => assert.equal(pickTier({ ...desktop, reducedMotion: true }), "static"));
test("mobile → lite", () => assert.equal(pickTier({ ...desktop, isMobile: true }), "lite"));
test("4 cores → lite", () => assert.equal(pickTier({ ...desktop, cores: 4 }), "lite"));
test("4 GB memory → lite", () => assert.equal(pickTier({ ...desktop, memoryGB: 4 }), "lite"));
test("8 cores desktop → full", () => assert.equal(pickTier(desktop), "full"));
test("unknown memory on 8-core desktop → full", () => assert.equal(pickTier({ ...desktop, memoryGB: undefined }), "full"));
