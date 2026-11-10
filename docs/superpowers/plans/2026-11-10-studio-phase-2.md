# Studio Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scene's placeholder RoundedBox blocks with seven custom Higgsfield-generated 3D building blocks (one per screen type) rendered in our own frosted glass + gold, and add a cinematic loop video used as the loading backdrop, the low-end/reduced-motion fallback and the share preview.

**Architecture:** Higgsfield supplies geometry only (untextured GLBs). An offline asset script normalises, simplifies and compresses them (gltf-transform + meshoptimizer) into one `public/studio/blocks.glb` (full) and one `public/studio/blocks-lite.glb` (phones), each block a named node. The scene loads the right file with drei `useGLTF` (meshopt decoder) and applies the existing materials, so the look stays in code. The video is generated from a still of our own scene.

**Tech Stack:** existing R3F 9 / drei 10 / three r185; `@gltf-transform/cli` (dev dependency, used by a script only); Higgsfield Hunyuan3D v3.1 Pro (geometry) and MiniMax H3 (video).

**Spec:** `docs/superpowers/specs/2026-11-10-studio-3d-mode-design.md` §7 "Custom 3D assets from Higgsfield".

## Global Constraints

- Higgsfield credit cap for Phase 2: **600** total (batch 1 = 252 for 21 block candidates; video ≈ 250; rest reserve). Show cost before each new batch.
- Asset budget: **≤ 1.5 MB total** for all models (full + lite combined, compressed); lite file ≤ 400 KB.
- Geometry only from Higgsfield; materials stay in code (frosted glass `MeshTransmissionMaterial` on full, `meshPhysicalMaterial` on lite, gold accents) — no baked textures.
- Block node names (exact): `block_dashboard`, `block_table`, `block_form`, `block_map`, `block_booking`, `block_kanban`, `block_odontogram`. Each normalised to fit a 1×1×1 box, centred on its base.
- Performance: full tier ≥ 55 FPS, lite ≥ 55 FPS under 4× CPU throttle (same checks as Phase 1 Task 9). Homepage `/` bundle unchanged (assets load only on `/studio`).
- Never mention past private clients anywhere.

---

### Task P2-1: Pick and process the blocks

**Files:**
- Create: `scripts/studio-blocks.mjs` (download → normalise → simplify → merge → meshopt compress), `public/studio/blocks.glb`, `public/studio/blocks-lite.glb`
- Modify: `package.json` (devDependency `@gltf-transform/cli` / `@gltf-transform/functions` + `meshoptimizer`; script `"studio:blocks": "node scripts/studio-blocks.mjs"`)

- [ ] Owner picks one candidate per block from batch 1 renders (controller shows them). Picks recorded in `scripts/studio-blocks.picks.json` (`{ "dashboard": "<job_id>", ... }`, URLs fetched at run time).
- [ ] Script: for each pick, download GLB; `weld` + `simplify` (full ≈ 6k tris, lite ≈ 1.2k tris per block); normalise scale to 1×1×1 and centre on base; rename root node to the exact name; drop materials/textures; merge into one document per tier; `meshopt` compress; write the two files.
- [ ] Verify: file sizes within budget (print them); a node `node --test` check (`scripts/studio-blocks.test.mjs`) loads each output with `@gltf-transform/core` and asserts the 7 node names, triangle counts within ±25% of targets, bounding boxes ≤ 1.05.
- [ ] Commit `feat(studio): custom 3D building blocks (processed)`.

### Task P2-2: Use the blocks in the scene

**Files:** Modify `src/components/studio/scene/studio-scene.tsx`

- [ ] Load `blocks.glb` (full) or `blocks-lite.glb` (lite) via `useGLTF(url, true /* meshopt */)` inside `Suspense`; the current RoundedBox blocks stay as the Suspense fallback.
- [ ] Map screen types to blocks: the arriving screen's `type` picks its block (needs the scene to receive `screenTypes: Screen["type"][]` from `StudioExperience`); `hello` orbit uses all seven.
- [ ] Apply existing glass/gold materials; keep the spring choreography; dispose on unmount.
- [ ] Verify on the lab scene page + `/studio`: screenshots (full + lite + 390), FPS as in Global Constraints, owner-Chrome FPS via browser-use. Commit `feat(studio): scene uses custom blocks`.

### Task P2-3: Cinematic loop video

**Files:** Create `public/studio/loop.mp4` (+ `loop.jpg` poster), modify `src/components/studio/studio-experience.tsx` (static tier + loading backdrop), `src/app/studio/page.tsx` (OpenGraph video/image)

- [ ] Capture a clean 16:9 still of the hello scene (no UI) at 1920×1080 from the lab page.
- [ ] Owner approves the cost quote, then generate with MiniMax H3 (start_image = end_image = the still, 8 s, slow camera drift, glass shimmer, no new objects, no text) — at most 2 takes.
- [ ] Encode to H.264 ≤ 2.5 MB (ffmpeg, `-movflags +faststart`, no audio) and a JPEG poster.
- [ ] Static tier and pre-load backdrop play the muted looping video (`playsInline autoPlay muted loop`, poster first, `preload="metadata"`); reduced motion shows the poster only.
- [ ] `/studio` metadata: `openGraph.images` = poster; `openGraph.videos` = loop.
- [ ] Verify sizes, playback on 390 static tier, Lighthouse LCP on `/studio` not worse than Phase 1 by > 300 ms. Commit `feat(studio): cinematic loop backdrop and share preview`.
