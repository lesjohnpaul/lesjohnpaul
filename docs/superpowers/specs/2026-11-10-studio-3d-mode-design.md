# Studio: an interactive 3D "discovery call" mode for lesjohnpaul.dev

Date: 2026-11-10 · Owner: Les John Paul Oliver · Status: all decisions taken in conversation; pending Les's final sign-off of this document

## 1. Intent

Les wins clients with one repeatable practice: after a single discovery call he shows up to the first meeting
with a spec and a working, clickable prototype of the client's own system, and closes on trust instead of promises.
The portfolio currently *describes* his work. The Studio lets a visitor *experience* that practice in about a minute:
they describe their business in a sentence, and Les's AI agent Pao builds them a mini spec and a clickable prototype
live, in a frosted-glass 3D space, then invites them to book the real discovery call.

The core message: "I won't convince you with words. I'll show you your system before you pay me."

Inspiration (not to copy): dalrympleramos.dev's 3D mode ("the fold": vanilla three r169, GSAP ScrollTrigger,
CSS3DObject, InstancedMesh, 7 decorative chapters). Its 3D is a frame around flat 2D content, its activity chapter is
broken in production, one chapter drops to 52 FPS on an M4 Pro, and its concept is generic. The Studio must beat it on
meaning (the 3D *is* the content), interactivity, and performance.

## 2. Audience and success

- **Primary: business owners who could become direct clients.** Mostly non-technical, mostly on phones. They are
  impressed by seeing *their own business* become a system, not by technical terms.
- **Secondary: recruiters and hiring managers.** Same experience, plus an optional "How it's built" layer.
- **Success = booked discovery calls from the Studio**, measured as a funnel (section 9). "Wow" without bookings is a
  failure.

## 3. Goals, non-goals, anti-goals

Goals
- Visitor goes from landing to a personalised, clickable prototype in under ~10 seconds of waiting.
- Smooth, impressive 3D with smooth motion: stable 60 FPS on a mid-range Android, 120 FPS where available.
- Frosted-glass look (real refractive glass + glass UI) in the site's dark obsidian + gold brand.
- Every path ends at "Book a discovery call" or "Email me this prototype" (lead).

Non-goals
- Not a replacement for the 2D site. About, skills, experience, blog stay in 2D.
- Not a code generator. The prototype is never AI-written HTML/JS.
- No 7-chapter scrollytelling.

Anti-goals (a failure even if it technically works)
- Slow or janky on phones.
- Jargon a business owner can't follow.
- Live AI generation that can be abused or blows the budget.
- **Any mention of Fiesta Gas or any detail from that engagement** (name, brand, places, screens, numbers, timeline).
  There is no NDA. Only the generic practice may appear. This applies to copy, examples, sample data, demo
  prototypes, Pao's knowledge base and alt text.

## 4. Experience

### Entry (decided)
- Dedicated route **`/studio`**, lazy-loaded so the homepage gets no heavier.
- A prominent "Try it: build your system →" button in the hero and the nav.
- The `/studio` link is shareable; Les sends it to prospects before calls.
- Pao chat widget (2D) suggests the Studio when a visitor asks to build something, carrying their text over (phase 3).

### Four acts (decided)
1. **Hello.** Pao greets with a one-sentence promise.
2. **Your discovery call (the centrepiece).**
   - Visitor types one free-text line about their business and problem (existing 500-char cap applies).
   - Then two tap-only questions (chips, no AI cost), for example:
     "Who will use it? → my team / my customers / both" and
     "What hurts most today? → manual work / no visibility / slow orders".
   - The build streams in: a one-line spec appears within ~1 s, then three screens fly in and assemble from glass
     building blocks, complete in ~8 s.
   - The result is clickable (navigate between the 3 screens, interact with sample data).
   - Two actions: **"Book a discovery call about this"** (opens Pao's existing booking flow with the prototype as
     context) and **"Email me this prototype"** (saves it for 30 days, sends a link, submits a lead).
3. **Proof.** Four real, non-confidential case studies as glass panels, linking to their pages:
   `executive-live-collections-dashboard`, `ai-assisted-refund-automation`, `acirs-24-7-ai-customer-support`,
   `wecare-pharmacy-pos-dispensing-platform` (slugs from `src/data/case-studies.ts`).
4. **Book.** The real discovery-call booking: a Studio booking screen calling Cal.com directly (see 12b).

### Language (decided)
Studio UI is English. Prototype content (labels, sample data, spec line) follows the visitor's language; Taglish in,
Taglish out.

### Pao's presence (decided)
Use the existing procedural Pao mascot (`src/components/pao/createPaoModel.ts`, R3F), animated in code, as the guide
who visibly "assembles" the prototype. No GLB or rigging needed.

### "How it's built" layer (decided)
Toggle, off by default. Opens a glass side panel showing the live pipeline for the current build:
visitor input → guardrails → model → tool calls → schema validation → render, with latency and token counts.
Aimed at recruiters; must not distract business owners.

## 5. The generated prototype (decided: structured, never code)

- The model returns **structured JSON only**, validated with zod on the server and again on the client.
- Content: business name, one-line spec, and exactly **3 screens chosen from a fixed library of 6 screen types**:
  dashboard (KPIs + chart), table/list (orders, customers), form (order or intake), map (deliveries, branches),
  booking calendar, kanban/workflow (request status). Each screen carries its fields and fake sample data.
- Les-designed React components render it. The model never produces HTML, CSS, JS or URLs that get executed or
  injected. Text is rendered as text.
- Sample data is fake and generic. It must never resemble a real client.
- If validation fails or the model refuses, show the closest pre-made example (section 6) instead of an error.

## 6. Cost and abuse (decided)

- Reuse Pao's existing guards: Vercel BotID, Upstash rate limiting, daily USD budget reserved atomically in Redis,
  fail-closed without Redis or API key, message caps, prompt-injection guard (`src/app/api/chat/route.ts`,
  `src/lib/guards.ts`, `src/lib/chat/guard.ts`).
- **2 builds per visitor per day**, counted against the Studio's own daily USD budget (see 12b).
- No build cache (see 12a).
- When the budget or limit is hit, show a **pre-made example** (e.g. clinic, restaurant, logistics) instead of an error,
  so the experience never breaks.
- Model: same family as Pao (`claude-haiku-5-5`, currently called through `@anthropic-ai/sdk`).

## 7. Visual and motion (decided)

- **Frosted glass** chosen from four live mockups (depth of field, frosted glass, soft atmosphere, living glow).
  Reference mockup: `.superpowers/brainstorm/55673-1794216015/content/blur-depth-options.html` (option B).
- Brand: dark obsidian background, gold accent (`--primary` gold `oklch(0.78 0.16 85)` in `src/app/globals.css`),
  existing fonts (Clash Display, Satoshi, JetBrains Mono).
- Stack: R3F 9 + drei 10 + three r185 + GSAP (already installed). Glass via drei `MeshTransmissionMaterial`.
  Add **`@react-three/postprocessing`** (the one new dependency) for subtle bloom and depth.
- Smooth motion comes from the runtime (springs/GSAP at 60–120 FPS), not from pre-made animation.

### Custom 3D assets from Higgsfield (decided)
- Six custom "building blocks", one per screen type: glass bar-chart (dashboard), stacked glass rows (table),
  glass input card (form), gold map pin on a small island (map), glass calendar (booking), cards in columns (kanban).
  One consistent style: frosted glass + gold + obsidian. They fly in and combine during the build moment.
- Generated with Higgsfield image/text-to-3D (Meshy 7, Tripo H3.1 or Hunyuan3D v3), exported GLB.
- **Budget: ≤ 1.5 MB total for all models**, compressed with Meshopt + KTX2, with low-poly variants for phones. Remesh
  (Meshy Remesh) or replace anything over budget.
- One 6–8 s **cinematic loop video** (Higgsfield, rendered from our scene), used as the loading backdrop, the
  low-end and reduced-motion fallback, and the share preview for `/studio` links.
- **Credit cap: ≤ 600 Higgsfield credits** total. Show preview and estimated cost before every batch; Les approves
  each batch. (Balance at writing: 5,118 credits, Ultra plan.)

### Devices (decided)
- Adaptive quality: full transmission glass on capable desktops; lighter glass (CSS blur, fewer refraction samples),
  lower DPR on phones; static/video version under `prefers-reduced-motion` or weak GPUs.
- Target: stable 60 FPS on a mid-range Android.

## 8. Privacy (decided)

- The visitor's build is held for **30 minutes** (so they can email it), then deleted. Only "Email me this
  prototype" keeps it, for 30 days, with their email, and notifies Les as a lead (see 12a).
- Analytics count events only, never content.
- One line under the input says this. Aligns with RA 10173.

## 9. Measurement (decided)

Vercel Analytics (already installed) funnel events:
`studio_open` → `build_started` → `build_completed` → `book_clicked` → `booking_made`
(plus `prototype_emailed`, `fallback_example_shown`).

## 10. Phasing (decided)

- **Phase 1:** `/studio` with Acts 1, 2 and 4 using simple glass geometry (no Higgsfield assets yet). Fully working
  and booking-capable, so Les can start sharing it.
- **Phase 2:** Higgsfield building blocks + intro/fallback video.
- **Phase 3:** Proof act, "How it's built" recruiter panel, 2D chat → Studio handoff.

## 11. Existing system facts (from recon, 2026-11-09)

- Next 16.0.7, React 19.2, Tailwind 4 (config in CSS), TypeScript 5, npm.
- Pao: `src/app/api/chat/route.ts`, custom NDJSON stream (`text`, `event`, `chips`, `links`, `done`), up to 4 tool
  rounds, prompt caching, `maxDuration = 60`. Tools in `src/lib/chat/tools.ts`: `get_available_slots`,
  `book_meeting` (Cal.com v2), `submit_lead` (Resend email + Telegram). Bookings limited to 2 per email and per IP per day.
- Existing 3D: Pao mascot (R3F, procedural), Living Grid (R3F + drei), Warp canvas. GSAP hook in `src/hooks/useGSAP.ts`.
- Theme: dark by default, custom ThemeProvider.
- Tests: only `src/lib/chat/guard.test.ts` (Node test runner). No CI.

## 12. Calls made by Claude (Les can override)

- Route name `/studio`.
- Exact chip wording in Act 2.
- The four Proof case studies.
- Postprocessing library choice (`@react-three/postprocessing`).
- 30-day retention for emailed prototypes.

## 12a. Calls settled after builder review (Claude's calls, Les can override)

- **Who is "one visitor":** Philippine mobile carriers put many users behind one IP (CGNAT), so the 2-builds limit is
  keyed per device (signed httpOnly cookie) with a looser per-IP ceiling (20/day) as an abuse backstop. The daily
  budget is the real cost cap. Fallback examples do not count toward the limit.
- **No build cache.** Dropped to keep the privacy promise literal ("not stored unless you email it"). With 2 builds
  per visitor the cache saved little.
- **Where the prototype lives:** the 3D build assembles in the scene, then the 3 screens become real, clickable HTML
  panels in glass. Desktop: panels placed in 3D (drei `Html transform`). Phones, weak GPUs and reduced motion: the
  same React screen components in a 2D glass layout over a calm background. **Everyone gets a clickable
  prototype**; only the 3D choreography degrades. In Phase 1 (no video yet) the low-end background is a static
  gradient poster.
- **Fallback examples are always labelled**, never passed off as the visitor's build: "Here's an example for a
  clinic. My builder is resting right now; book a call and I'll build yours." Closest example picked by keyword
  match (no model). Tracked as `fallback_example_shown`, not `build_completed`.
- **Email flow:** the server keeps each build in Redis for 30 minutes (ephemeral, keyed by a random id, needed so the
  browser can't tamper with what gets stored). "Email me this prototype" asks for email only, promotes the build to
  30-day storage, and sends a fixed-template email containing only the business name and an unlisted link to
  `/studio/p/[id]` (noindex, 2D glass viewer with light 3D). Lead goes to Les via the existing notify stack.
  Own limit: 2 emails per device per day. Privacy line reworded: "Your build is kept for 30 minutes so you can email
  it to yourself, then deleted."

## 12b. Les's answers after builder review (2026-11-10)

- **Booking in the Studio is its own screen, direct to Cal.com, no model call**, so it never stops when the AI budget
  runs out. The booking carries the prototype id in Cal.com metadata so Les sees the visitor's prototype before the
  call. (Pao chat booking stays as is.) Existing booking limits still apply (2 per email/day), keyed per device as in 12a.
- **Claude designs the 6 screen-type components and the fallback examples** in the house style; Les reviews before
  each ship.
- **Budget:** the Studio gets its **own $2/day cap** (separate env var, e.g. `STUDIO_DAILY_BUDGET_USD`, reserved
  atomically in Redis like the chat budget), in addition to the chat's existing `CHAT_DAILY_BUDGET_USD`. Studio
  traffic can never shut down the chat. One build ≈ one Haiku call ≈ $0.005–0.01, so ~200–400 builds/day before
  fallback examples take over. Worst case ≈ $60/month if maxed every day; expected far lower.

## 13. Left to the builder

- Component structure, file layout, API shape for the build endpoint (whether it extends `/api/chat` or is a sibling
  route), zod schema details, streaming protocol details (prefer reusing Pao's NDJSON style).
- Exact camera choreography and animation timings within the stated targets.
- GPU tiering method for adaptive quality.
- Test strategy (at minimum: schema validation, guard limits, fallback-on-failure, and a smoke test of `/studio`).
