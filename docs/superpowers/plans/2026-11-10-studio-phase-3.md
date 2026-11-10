# Studio Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Studio with Act 3 (Proof: four real case studies as glass panels), the "How it's built" panel for recruiters (a live trace of the visitor's own build), and a handoff from the 2D Pao chat to the Studio that fills in the visitor's text.

**Architecture:** Three pure modules with no `@/` imports, each tested with `node --test`: `src/lib/studio/proof.ts` (pulls the four panels from the existing data), `src/lib/studio/trace.ts` (a trace clock that only allows known keys), and `src/lib/studio/prefill.ts` plus `src/lib/chat/handoff.ts` (reads and strips `q`, and detects build intent in chat). The server page builds the Proof items and passes them as props, so the portfolio data never ships to the client. The build route adds `{ t: "trace" }` NDJSON events alongside the existing `StudioEvent`s. `useBuild` collects them and the panel shows them. The chat sends the Studio link through its existing `links` event, so there is no new tool and no extra model cost.

**Tech Stack:** The existing Next 16.0.7, React 19.2, Tailwind 4, `next/image`, `@vercel/analytics` and `@vercel/speed-insights`. **No new dependencies.**

**Spec:** `docs/superpowers/specs/2026-11-10-studio-3d-mode-design.md` §4 (Entry: chat handoff; Act 3 Proof; "How it's built" layer), §8 Privacy, §9 Measurement, §10 Phase 3.

## Global Constraints

- **Never mention any past private client, its name, brand, places, people, screens or numbers** beyond what the four approved case-study pages already publish. The `client` field of a case study is **never** rendered in the Studio. Task 1 tests this, and Task 5 runs the confidentiality grep.
- **Visitor text never appears in logs, analytics or trace events.** Trace events carry only enums, integers and token/cost numbers. Analytics events carry no content. `proof_opened` carries `{ slug }` only.
- Proof slugs, in this exact order: `executive-live-collections-dashboard`, `ai-assisted-refund-automation`, `acirs-24-7-ai-customer-support`, `wecare-pharmacy-pos-dispensing-platform`. Data comes from `src/data/portfolio-data.ts` and `src/data/case-studies.ts`, never copied.
- New analytics events (exact): `proof_opened` (props `{ slug }`), `trace_opened`, `studio_from_chat`.
- Trace steps, in this exact order: `input`, `guardrails`, `model`, `stream`, `validate`, `render`. The server emits the first five and the client adds `render`. Model id shown: `claude-haiku-5-5`.
- Handoff is **prefill only**. The Studio never starts a build by itself. The text travels in the URL **hash** (`/studio#q=…`), which browsers never send to the server, analytics or logs. It is trimmed, stripped of control characters and capped at **500** characters, read on the client only, and the hash is cleared right after reading.
- Mobile-first: works at 390 px, tap targets ≥ 44 px, and no horizontal page scroll (the carousel scrolls inside its own track).
- Motion: only `transform` and `opacity`, about 240 ms on `cubic-bezier(0.22, 1, 0.36, 1)` (same as `.enter`). Nothing pops in, and under `prefers-reduced-motion` there is no transform motion.
- Performance: `/studio` mobile Lighthouse LCP stays about 1 s (within +100 ms of the baseline taken before Task 1) and CLS stays < 0.05. Proof images are lazy-loaded and sized through `next/image` `sizes`. `studio-scene.tsx` is not changed in this phase.
- Pure modules use **relative imports only**, so `npm test` can run them.
- Brand: obsidian background, gold `--primary`, existing `studio.module.css` classes (`glass`, `eyebrow`, `pill`, `enter`, `muted`, `faint`, `press`).

## Review Focus

1. **Visitor text leaks through the handoff link** into analytics, Speed Insights or logs. Prevention: the text rides in the URL hash (`#q=`), never the query string, and the client clears the hash with `replaceState` right after reading it. Covered by the Task 4 prefill tests and the Task 4 network check.
2. **A trace event carries text.** Example: someone later adds `err.message` or `spec` to a trace event. The tracer drops any key not on its allow-list and `note` is an enum. Covered by the Task 2 test "unknown keys are dropped" and the curl grep in Task 2.
3. **Fallback paths that skip the trace or send it out of order.** The early `eventsResponse` fallbacks (no key, limit, budget, Redis error) must send their trace lines **before** the `fallback` line, with `ok:false` and a reason. Otherwise the panel shows "pending" forever. Covered by the Task 2 smoke tests for each path and the Task 3 screenshot of a fallback trace.
4. **Proof makes `/studio` heavier.** Two ways this happens: `studio-experience.tsx` imports `proof.ts` as a value, which pulls about 180 KB of data into the client, or the screenshots load eagerly and compete with LCP. Prevention: only the server page imports `proof.ts`, and the images use `loading="lazy"` and `sizes`. Covered by the Task 1 route-size check and the Task 5 Lighthouse run.
5. **The handoff misfires.** Two failure modes: the detector adds a Studio button to "How did Les build the WeCare dashboard?", or a prefilled form submits without the chips and the visitor's tap. Covered by the Task 4 detector tests and a manual check that the form waits for both chip answers.

---

### Task 1: Proof act (case-study glass panels)

**Files:**
- Create: `src/lib/studio/proof.ts`, `src/lib/studio/proof.test.ts`, `src/components/studio/proof-panels.tsx`
- Modify: `src/app/studio/page.tsx` (build the items on the server and pass `proof` to `StudioExperience`), `src/components/studio/studio-experience.tsx` (accept a `proof` prop, add a `#proof` section between the act section and `#book`, add a link from hello), `src/components/studio/studio.module.css` (carousel track only, if Tailwind doesn't cover it)

**Interfaces:**
- Consumes: `projects` (`../../data/portfolio-data.ts`), `caseStudies` (`../../data/case-studies.ts`), `slugify` (`../slug.ts`)
- Produces:
  - `PROOF_SLUGS` (readonly tuple, in the order from Global Constraints)
  - `type ProofItem = { slug: string; title: string; outcome: string; image: string; href: string }`
  - `proofItems(): ProofItem[]`. Built as: `title = project.title`, `outcome = project.result ?? study.outcome[0]`, `image = project.image`, `href = /work/<slug>`. Throws at build time if a slug has no non-hidden project or no case study, so a renamed slug fails `next build` instead of shipping an empty panel.
  - `ProofPanels({ items }: { items: ProofItem[] })`, a client component. It imports `ProofItem` **as a type only**.
- Current values, for reference: images are `gm-dashboard/tv-mode.webp`, `refund-automation-ai/01-pending-review.webp`, `acirs.jpg` and `wecare/01-executive-dashboard.webp`. The dashboard has no `result`, so its outcome comes from `outcome[0]`.

Layout:
- Section `id="proof"` with `scroll-mt-4`, eyebrow `Proof`, h2 `Systems Les has already shipped`, and the subline `Real projects, real screens. Tap one for the full story.`
- Each card is a `.glass` `<Link>` containing the screenshot (`next/image` `fill`, `sizes="(min-width: 640px) 22rem, 80vw"`, `loading="lazy"`, `object-cover object-top`, in a 16:10 box), then the title, the outcome (clamped to 2 lines) and `Read the case study →`. Alt text is `{title}: screenshot`.
- Phones: a horizontal snap carousel (`flex overflow-x-auto snap-x snap-mandatory`, cards `w-[80vw] shrink-0 snap-start`, `scroll-px-4`, the next card peeking in). `sm` and up: a 2×2 grid.
- Hover: translateY(-2px) over 200 ms, none under reduced motion.
- Hello state gets a text link below the form: `See systems Les has already shipped ↓` pointing to `#proof`, using `smooth()` scrolling and ≥ 44 px tall.
- Clicking a card calls `track("proof_opened", { slug })`.

- [ ] **Step 0 (before any change):** take the baseline. Run `npm run build && npm start`, then a mobile Lighthouse run on `/studio`. Record LCP, CLS and TBT in the task notes.
- [ ] **Step 1: Write failing tests** in `proof.test.ts`:
  - `returns the four slugs in order`
  - `every item has title, outcome ≤ 160 chars, href /work/<slug>`
  - `every image exists under public/` (`existsSync`)
  - `no item string contains its case study's client field` (privacy)
  - `unknown slug throws`. Make the slug list a default parameter so this can be tested.
- [ ] **Step 2: Run** `npm test` and expect FAIL. **Step 3: Implement** `proof.ts`. **Step 4: Run** and expect PASS.
- [ ] **Step 5:** Build `ProofPanels` and wire up the page and experience. Run `npx tsc --noEmit` and `npm run lint`.
- [ ] **Step 6: Bundle check:** `npm run build`. The `/studio` First Load JS grows by **≤ 3 KB** over Step 0. Grepping `.next/static` for a case-study-only string (for example `"Solo full-stack engineer"`) finds nothing.
- [ ] **Step 7: Look:** take headed browser screenshots of `/studio` at 1440 and 390 in the hello state and after a fallback build. Open them and check:
  - the panels sit between the result and Book
  - the 390 carousel snaps with a card peeking and the page itself has no horizontal scroll
  - images are sharp and not stretched
  - the four `/work/<slug>` links open
- [ ] **Step 8: Commit** `feat(studio): proof act with four case-study panels`

### Task 2: Build trace events (server)

**Files:**
- Create: `src/lib/studio/trace.ts`, `src/lib/studio/trace.test.ts`
- Modify: `src/lib/studio/prompt.ts` (add `TraceEvent` to the `StudioEvent` union; `ndjson.ts` then needs no change), `src/app/api/studio/build/route.ts`

**Interfaces:**
- Produces (`trace.ts`, no imports):
  - `type TraceStep = "input" | "guardrails" | "model" | "stream" | "validate" | "render"`
  - `type TraceNote = "unavailable" | "limit" | "budget" | "busy" | "cut_off" | "model_error" | "invalid" | "salvaged"`
  - `type TraceInfo = { step: TraceStep; ms: number; ok: boolean; note?: TraceNote; model?: string; screens?: number; tokens?: { in: number; cached: number; out: number }; usd?: number }`
  - `type TraceEvent = { t: "trace"; v: TraceInfo }`
  - `tracer(now: () => number = () => performance.now()): (step: TraceStep, extra?: Partial<Omit<TraceInfo, "step" | "ms">>) => TraceEvent`. `ms` is the whole number of milliseconds since the previous mark (the first mark measures from tracer creation), clamped to ≥ 0. `ok` defaults to `true`. **Only allow-listed keys get copied**, `note` must be in the enum, and number fields must be finite.

Route wiring (decisions, not code):
- `const mark = tracer()` goes at the very top of `POST`, so BotID time counts under `input`.
- `input` is marked after `StudioRequest` parses. 400 responses stay JSON with no trace.
- `guardrails` is marked after `checkMessage`, budget `reserve` and both `rateLimit`s pass.
- Each early fallback returns `eventsResponse([...marks, fallbackEvent])`, with the `guardrails` mark set to `ok:false` and one of these notes:
  - no Redis, API key or secret → `unavailable`
  - budget `reserve` false → `budget`
  - rate limit hit → `limit`
  - Redis throws → `busy`
- `model` is marked on the **first** `streamEvent` of type `content_block_start`, with `model: MODEL`. It measures time to first token.
- `stream` is marked after `finalMessage()`, with `screens: sent.screens` (screens emitted live), `tokens: { in: input_tokens, cached: cache_read_input_tokens, out: output_tokens }` and `usd: spent`.
  - If the stop reason is not `tool_use`: `stream` gets `ok:false, note:"cut_off"`.
  - If the API errors with no salvage: `stream` gets `ok:false, note:"model_error"`, with no tokens.
- `validate` is marked after `parsePrototype` or salvage, **before** `finish()` sends any screens. Outcomes: `ok:true`; `ok:true, note:"salvaged"`; or `ok:false, note:"invalid"`.
- Every trace line is sent before `done` or `fallback`. The existing token log and stats stay unchanged.

- [ ] **Step 1: Write failing tests:**
  - `ms is the delta between marks` (fake clock 0 → 12.4 → 40: `input` 12, `guardrails` 28)
  - `ms never negative`
  - `ok defaults to true`
  - `unknown keys are dropped` (passing `{ text: "secret", spec: "x" }` cast through `unknown` adds nothing; `Object.keys(v)` is a subset of the allow-list)
  - `invalid note is dropped`
  - `serialised event contains only the expected keys`
- [ ] **Step 2: Run** and expect FAIL. **Step 3: Implement.** **Step 4: Run** and expect PASS.
- [ ] **Step 5:** Wire up the route, then `npx tsc --noEmit`.
- [ ] **Step 6: Fallback smoke test:** run `ANTHROPIC_API_KEY= npm run dev`, then send the Phase 1 Task 5 curl. Expected lines: `trace input`, `trace guardrails ok:false note:"unavailable"`, then `fallback`.
- [ ] **Step 7: Live smoke test** (one real call, about $0.01; same curl with the water-refilling text):
  - Expected order: `trace input`, `trace guardrails`, `trace model` (model `claude-haiku-5-5`), `spec`, `screen` lines, `trace stream` (tokens, usd), `trace validate`, the remaining screens, `done`.
  - Check that `grep '"t":"trace"'` piped into `grep -ci refilling` returns `0`.
  - From the same cookie jar, the third call returns `trace … note:"limit"` followed by `fallback`.
- [ ] **Step 8: Commit** `feat(studio): pipeline trace events on the build stream`

### Task 3: "How it's built" panel (client)

**Files:**
- Create: `src/components/studio/how-its-built.tsx`
- Modify: `src/components/studio/use-build.ts` (collect `trace`), `src/components/studio/studio-experience.tsx` (toggle and panel, only after a build has started)

**Interfaces:**
- Consumes: `TraceInfo`, `TraceStep` and `TraceNote` from `@/lib/studio/trace`, **type imports only**.
- `useBuild` gains `trace: TraceInfo[]`. It resets to `[]` on `start` and `reset`. An incoming `trace` event is appended only if `step` is in the enum and `ms` is a finite number ≥ 0. Older clients already ignore unknown `t`.
- After `done` or `fallback` is applied, the client appends `{ step: "render", ms, ok: true }`. `ms` runs from receiving that event to the second `requestAnimationFrame`, which is the paint after the commit.
- `HowItsBuilt({ trace, status }: { trace: TraceInfo[]; status: BuildStatus })`

UI:
- The toggle button `How it's built` (`aria-expanded`, `aria-controls`, ≥ 44 px, `.pill` style) is **off by default**. It appears only once `showResult` is true, next to the status line, so business owners in hello never see it.
- Switching it on calls `track("trace_opened")`.
- Panel layout:
  - `lg` and up: a `.glass` side panel fixed on the right (width `22rem`, top `5rem`). It enters with translateX(16px) and fades from 0 to 1 over 240 ms.
  - Below `lg`: an inline collapsible card under the result actions. It animates opacity and `grid-template-rows: 0fr → 1fr`.
  - Reduced motion: opacity only.
- Title `How this build ran`. Intro: `A live trace of this build only. Nothing you typed is shown here.`
- Six rows in fixed order, each with a label, a one-line plain-English detail and right-aligned `{ms} ms` in mono:
  1. `Input received`: `Size and shape checked (500-character cap).`
  2. `Guardrails passed`: `Bot check, abuse filter, 2 builds per device a day, daily AI budget.`
  3. `Model: claude-haiku-5-5`: `Time until the first token came back.`
  4. `Tool call: render_prototype`: `Streamed as structured JSON; each screen appears as it completes.`
  5. `Schema validation (zod)`: `Checked on the server, then again in your browser. The AI never writes code.`
  6. `Rendered`: `Les's own React components draw the screens from that data.`
- Row states:
  - Rows still waiting during `building` show a pulsing dot (static under reduced motion).
  - When a row has `ok:false`, it turns amber and the panel shows `Stopped here: {reason}. You're seeing a labelled example instead.` Rows after it show as greyed-out dashes.
  - `salvaged` shows under validate: `Recovered the complete answer from the stream after a parsing hiccup.`
- Reasons:
  - `unavailable`: `the builder is offline, and it never calls the model without its safety checks`
  - `limit`: `this device has used its 2 free builds today`
  - `budget`: `today's AI budget is spent, so the model was never called`
  - `busy`: `a safety check couldn't run, so it failed closed`
  - `cut_off`: `the model's answer was cut off`
  - `model_error`: `the model didn't answer`
  - `invalid`: `the answer didn't match the schema, so it was thrown away`
- Footer (only when the `stream` row has tokens): `{in} tokens in ({cached} cached) · {out} out · ${usd.toFixed(4)} · {total} s total`. Numbers use `Intl.NumberFormat("en")` and `total` is the sum of all `ms`.

- [ ] **Step 1:** `npx tsc --noEmit` and `npm run lint`.
- [ ] **Step 2: Look:** take headed browser screenshots at 1440 and 390 of each state below, then open them and check:
  - hello (no toggle)
  - mid-build with the panel open (rows filling in, no layout jump in the result)
  - a finished live build with the full trace and footer
  - a fallback build (third build, or `ANTHROPIC_API_KEY=` empty) showing the stop line and greyed rows
  - the same flow with reduced motion emulated
  - at 390, the panel doesn't cover the prototype or the Book button
- [ ] **Step 3: Commit** `feat(studio): "How it's built" trace panel`

### Task 4: Chat → Studio handoff

**Files:**
- Create: `src/lib/chat/handoff.ts`, `src/lib/chat/handoff.test.ts`, `src/lib/studio/prefill.ts`, `src/lib/studio/prefill.test.ts`
- Modify:
  - `src/app/api/chat/route.ts`: links in both the cached and live paths become `[...studioLink, ...caseStudyLinks]`, sliced to 3
  - `src/lib/chat/page-context.ts`: labels become `Open the {short} case study`
  - `src/components/chat/chat-widget.tsx`: renders `l.label` as-is, and clicking a `/studio` link calls `track("studio_from_chat")`
  - `src/lib/chat/knowledge.ts`: one prompt paragraph
  - `src/components/studio/discovery-form.tsx`: prefill on mount
  - (no analytics wrapper needed: the hash never reaches analytics)

**Interfaces:**
- `handoff.ts` (no imports):
  - `wantsBuild(text: string): boolean`. True when the text has a build verb (`build|make|create|develop|automate|digiti[sz]e|need|want`) **and** a system noun (`system|app|dashboard|portal|tracker|inventory|pos|booking|website|automation|tool|crm|ordering`), or Taglish (`pagawa|magpagawa|ipagawa|i-?automate|gawan ng`). False when it asks about Les's past work (`\b(did|has|have)\s+(he|les)\b`, `how did`).
  - `studioLink(text: string): { label: string; href: string }[]`. Returns `[]` or one link: `{ label: "Watch Pao build a prototype of this", href: "/studio#q=" + encodeURIComponent(text.trim().slice(0, 500)) }`. It runs on the guarded `verdict.text` (the text that passed `checkMessage`), not the model reply, so it costs no tokens.
- `prefill.ts` (no imports):
  - `readPrefill(hash: string): string | null`. Parses `q` from a hash like `#q=…` (via `new URLSearchParams(hash.slice(1))`), removes control characters except `\n`, trims, caps at 500 and trims again. Returns null when empty.
  - (no `stripPrefill`: clearing the hash is enough)
- Prompt paragraph, exact text, added after "Matching a need": `Studio. Les's Studio at lesjohnpauloliver.dev/studio turns a one-line description of a business into a free, clickable prototype in seconds. When a visitor wants something built or automated, you may suggest they try it before booking a call.` This changes `PROMPT_VERSION`, which retires the cached first-turn answers once. That is expected.
- Discovery form: on mount, when there is no `initial`, it runs `readPrefill(location.hash)`. If that returns text:
  - set the textarea text, without focusing it (so the phone keyboard doesn't open)
  - show the hint `Carried over from your chat. Pick an answer for each question, then tap Build it.`
  - call `history.replaceState(null, "", location.pathname + location.search)` (drops the hash)
  - **never call `onSubmit`**
- Analytics: unchanged (the hash is never sent).

- [ ] **Step 1: Write failing tests:**
  - `wantsBuild` true for:
    - `"Can Les build an inventory system for my bakery?"`
    - `"I want to automate our clinic bookings"`
    - `"Pwede ba magpagawa ng POS para sa tindahan ko?"`
  - `wantsBuild` false for:
    - `"What projects has Les built?"`
    - `"How did he build the WeCare dashboard?"`
    - `"Is Les available next week?"`
  - `studioLink` returns one link and caps `q` at 500
  - round-trip: `readPrefill(new URL(href, "https://x").hash)` equals the trimmed text
  - `readPrefill` strips control characters, keeps `<b>hi</b>` as plain text, and returns null for missing or blank input
  - `readPrefill("")`, `readPrefill("#")`, `readPrefill("#other=1")` return null
- [ ] **Step 2: Run** and expect FAIL. **Step 3: Implement.** **Step 4: Run** and expect PASS.
- [ ] **Step 5:** Wire up the route, widget, prompt, form and analytics, then `npx tsc --noEmit` and `npm run lint`.
- [ ] **Step 6: Look:** on the homepage chat at 1440 and 390, type `May bakery ako, gusto ko i-automate yung orders sa Messenger`. Check:
  - the reply has the button `Watch Pao build a prototype of this`
  - existing case-study buttons still read `Open the … case study`
  - tapping the button opens `/studio` with the text filled in, the hint visible, no chips selected and **no build started**
  - the address bar shows `/studio` with no query
  - DevTools Network shows the visitor's text in no request at all (the hash never leaves the browser)
  - `/studio#q=` with 600 characters fills in exactly 500
  - take screenshots and look at them
- [ ] **Step 7: Regression:** asking Pao for times still shows chip buttons, and a guard reply (pasted code) still declines.
- [ ] **Step 8: Commit** `feat(studio): chat hands off to the Studio with the visitor's text`

### Task 5: Final verification

- [ ] **Step 1:** `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run build` all pass.
- [ ] **Step 2: Confidentiality check:** run the same commands as Phase 1 Task 12 Step 2 (`.superpowers/private-terms.txt`) on `git diff cb4037a..HEAD` and on `git grep`. Expect no hits beyond the approved case-study pages. Also confirm that none of the four `client` strings appears in `src/components/studio/`.
- [ ] **Step 3: Lighthouse:** run `npm run build && npm start`, then a mobile Lighthouse run on `/studio` (and on `/studio#q=test`). Expect LCP within +100 ms of the Task 1 Step 0 baseline (about 1 s), CLS < 0.05, and no proof image in the LCP element or the initial request waterfall. Also check that homepage `/` First Load JS is unchanged within 1 KB, since the widget gained only a few lines.
- [ ] **Step 4: Full walk-through** at 1440 and 390 in a headed browser:
  - chat handoff → prefill
  - live build with the trace panel open
  - Proof card → `/work/<slug>` → back
  - a fallback build with its trace
  - booking up to the confirm button
  - Take screenshots of each step and look at them.
- [ ] **Step 5: Report to Les:**
  - the screenshots
  - Lighthouse before and after
  - smoke-test cost
  - the prompt-cache reset caused by the new prompt line
  - anything skipped

### Task 4b: Design-engineering polish pass (Emil Kowalski) — added 2026-11-10 at Les's request

Goal: the Studio must feel crafted, not template-made: remove "AI slop" and the flat look, without changing behaviour, copy, layout structure or performance budgets.

Scope (UI only): `src/components/studio/**` (studio-experience, discovery-form, prototype-view + screens incl. odontogram, proof-panels, how-its-built, booking-panel, email-capture), `src/components/studio/studio.module.css`, and the hero/nav Studio CTA. NOT the 3D scene (studio-scene.tsx), NOT APIs.

Read first and follow: /Users/lesjohnpauloliver/.claude/skills/emil-design-eng/SKILL.md (the whole file — it is the rulebook for this task).

Required:
1. Audit every transition/animation/hover/active state against the skill's Review Checklist. Report findings as ONE markdown table `| Before | After | Why |` (exact format from the skill), one row per issue, with file:line.
2. Motion tokens in studio.module.css: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`; no `transition: all`; UI animations ≤ 300 ms (button press 100–160 ms; panels/drawers ≤ 300 ms); exits faster than enters; no ease-in; never animate from scale(0); keyboard-initiated actions (tab arrows, Escape) are not animated.
3. Press feedback: every pressable (buttons, chips, cards, slots, tabs, kanban cards, teeth) gets `transform: scale(0.97)` on `:active` with a ~160 ms ease-out transition; hover effects gated by `@media (hover: hover) and (pointer: fine)`.
4. Not flat — give the glass real depth: layered shadows (a tight contact shadow + a soft ambient one), a 1px inner top highlight (inset box-shadow or ::before gradient), a subtle gradient border (e.g. border-image / mask trick or pseudo-element), and slightly different elevation levels for page cards vs inner tiles vs pressed states. Keep the obsidian + gold brand; gold stays sparing.
5. Entrances: stagger the prototype screens/tiles, proof cards and trace rows (30–80 ms between items, transform+opacity, @starting-style or the existing data-mounted pattern, CSS not JS for predetermined motion); state crossfades (e.g. building → ready, email form → sent) use a short blur(2px→0) to bridge the swap.
6. Remove AI slop: generic purple/teal glow blobs or gradients that don't serve hierarchy, emoji, over-used ALL-CAPS eyebrows (keep at most one per section), identical card templates where hierarchy should differ, filler copy. Keep all approved copy text exactly.
7. Accessibility: reduced motion = opacity/colour only (no transform motion, no stagger delays); focus rings stay visible (gold); contrast ≥ WCAG AA for text.

Verification: `npm test`, `npx tsc --noEmit`, eslint on changed files, `npm run build`. Before/after screenshots (headed Chrome, same states) at 1440 and 390: hello, mid-build, result with a screen open, proof section, trace panel open, booking panel, email sent — save to .superpowers/sdd/2026-11-10-studio-phase-3/t4b-shots/{before,after}-*.png and LOOK at them side by side. A slow-motion check: record press + entrance animations at 4× duration (temporarily) and confirm no two-states-overlap or wrong origin. One Lighthouse mobile run on /studio: LCP stays ≈ 1 s, CLS < 0.05. Commit `style(studio): design-engineering polish (motion, depth, press feedback)`.
