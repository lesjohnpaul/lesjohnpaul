import Anthropic from "@anthropic-ai/sdk";
import { clientIp, isBot, rateLimit, redis } from "@/lib/guards";
import { checkMessage } from "@/lib/chat/guard";
import { deviceFromCookieHeader, studioSecret } from "@/lib/studio/device";
import { pickFallback } from "@/lib/studio/fallbacks";
import { reserve, settle, spendKey, studioBudgetUsd, STUDIO_RESERVE_USD } from "@/lib/studio/budget";
import { eventsResponse, line } from "@/lib/studio/ndjson";
import { buildUserMessage, progress, RENDER_TOOL, STUDIO_SYSTEM, type StudioEvent } from "@/lib/studio/prompt";
import { parsePrototype, PrototypeSchema, StudioRequest, type Prototype } from "@/lib/studio/schema";
import { salvagePrototype } from "@/lib/studio/salvage";
import { saveBuild } from "@/lib/studio/store";
import { tracer, type TraceNote } from "@/lib/studio/trace";

export const maxDuration = 30;

const MODEL = "claude-haiku-5-5";
const MAX_BODY_BYTES = 2_000;

// Claude Haiku 5.5, prompts ≤100K tokens, USD per million tokens.
const PRICE = { input: 0.1, output: 0.5, cacheWrite: 0.125, cacheRead: 0.01 };

const costOf = (u: Anthropic.Usage) =>
  (u.input_tokens * PRICE.input +
    (u.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite +
    (u.cache_read_input_tokens ?? 0) * PRICE.cacheRead +
    u.output_tokens * PRICE.output) /
  1_000_000;

const json = (body: unknown, status: number) => Response.json(body, { status });

export async function POST(req: Request) {
  // Starts before BotID so its time counts under "input".
  const mark = tracer();
  if (await isBot()) return json({ error: "Blocked." }, 403);

  // Reject oversized bodies before reading them.
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ error: "Too long." }, 400);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "Too long." }, 400);
  const parsed = StudioRequest.safeParse((() => { try { return JSON.parse(raw); } catch { return null; } })());
  if (!parsed.success) return json({ error: "Invalid request." }, 400);
  const request = parsed.data;
  const inputTrace = mark("input");

  const verdict = checkMessage(request.text, 0);
  if (!verdict.ok) return json({ error: verdict.reply }, 400);

  // Every fallback is labelled and carries the example closest to what the visitor typed.
  const fb = pickFallback(request.text);
  const fallbackEvent: StudioEvent = { t: "fallback", v: { label: fb.label, prototype: fb.prototype } };
  const statsKey = `studio:stats:${new Date().toISOString().slice(0, 10)}`;
  const bump = (field: string) => { void redis?.pipeline().hincrby(statsKey, field, 1).expire(statsKey, 60 * 60 * 24 * 90).exec().catch(() => {}); };

  // A weak or missing secret means unsigned cookies; treat it as missing and never mint one.
  const secret = studioSecret();
  const device = secret ? deviceFromCookieHeader(req.headers.get("cookie"), secret) : null;
  const fallback = (note: TraceNote) => {
    bump("fallbacks");
    return eventsResponse([inputTrace, mark("guardrails", { ok: false, note }), fallbackEvent], device?.setCookie);
  };

  // Fail closed: without Redis there are no rate limits or budget, so no model calls.
  if (!redis || !process.env.ANTHROPIC_API_KEY || !device) return fallback("unavailable");
  const db = redis;

  // Reserve the worst case first, so budget- and limit-hit fallbacks never burn a device slot.
  // A check-then-record budget lets parallel requests all pass; reserving atomically keeps the cap strict.
  const budgetKey = spendKey();
  let reserved = false;
  try {
    if (!(await reserve(db, budgetKey, STUDIO_RESERVE_USD, studioBudgetUsd()))) return fallback("budget");
    reserved = true;
    const [perDevice, perIp] = await Promise.all([
      rateLimit("studio-dev", device.id, 2, "1 d"),
      rateLimit("studio-ip", clientIp(req), 20, "1 d"),
    ]);
    if (!perDevice || !perIp) {
      await settle(db, budgetKey, STUDIO_RESERVE_USD, 0);
      return fallback("limit");
    }
  } catch (err) {
    console.error("[studio] redis failed:", err);
    if (reserved) await settle(db, budgetKey, STUDIO_RESERVE_USD, 0).catch(() => {});
    return fallback("busy");
  }
  const guardTrace = mark("guardrails");

  const client = new Anthropic();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Once the visitor has disconnected, enqueue/close throw; the build must still settle.
      const send = (e: StudioEvent) => { try { controller.enqueue(line(e)); } catch {} };
      let spent = 0;
      let completed = false;
      let built = false;
      let salvaged = false;
      let finalized = false;
      let streamMarked = false;
      let modelMarked = false;
      let raw = "";
      // Anything but tool_use (max_tokens, refusal) means the tool JSON is cut off or missing: never salvage it.
      let stopReason: string | null = null;
      const usage = { in: 0, cacheRead: 0, cacheWrite: 0, out: 0 };
      const sent = { spec: false, screens: 0 };
      // The stream only emits a screen once its successor starts, so flush whatever is left (never twice).
      const finish = async (prototype: Prototype, note?: "salvaged") => {
        // Trace lines always precede the screens still to flush and the final done/fallback.
        send(mark("validate", { note }));
        if (!sent.spec) send({ t: "spec", v: { business: prototype.business, spec: prototype.spec } });
        sent.spec = true;
        for (; sent.screens < 3; sent.screens++) send({ t: "screen", i: sent.screens, v: prototype.screens[sent.screens] });
        send({ t: "done", buildId: await saveBuild(db, prototype) });
        built = true;
      };
      send(inputTrace);
      send(guardTrace);
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 2500,
          system: [{ type: "text", text: STUDIO_SYSTEM, cache_control: { type: "ephemeral" } }],
          tools: [RENDER_TOOL],
          tool_choice: { type: "tool", name: "render_prototype" },
          messages: [{ role: "user", content: buildUserMessage(request) }],
        }, { signal: req.signal });
        // streamEvent fires before the lazy snapshot getter that throws on junk, so the raw text is always complete.
        stream.on("streamEvent", (e) => {
          if (!modelMarked && e.type === "content_block_start") { modelMarked = true; send(mark("model", { model: MODEL })); }
          if (e.type === "content_block_delta" && e.delta.type === "input_json_delta") raw += e.delta.partial_json;
          else if (e.type === "message_delta") stopReason = e.delta.stop_reason;
        });
        stream.on("inputJson", (_partial, snapshot) => progress(snapshot, sent).forEach(send));
        const msg = await stream.finalMessage();
        spent = costOf(msg.usage);
        completed = true;
        usage.in = msg.usage.input_tokens;
        usage.cacheRead = msg.usage.cache_read_input_tokens ?? 0;
        usage.cacheWrite = msg.usage.cache_creation_input_tokens ?? 0;
        usage.out = msg.usage.output_tokens;
        streamMarked = true;
        const streamed = { screens: sent.screens, tokens: { in: usage.in, cached: usage.cacheRead, out: usage.out }, usd: spent };
        send(mark("stream", msg.stop_reason === "tool_use" ? streamed : { ...streamed, ok: false, note: "cut_off" }));

        if (msg.stop_reason !== "tool_use") {
          console.error(`[studio] stop_reason ${msg.stop_reason}`);
          send(fallbackEvent);
          return;
        }
        const tool = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
        const prototype = tool ? parsePrototype(tool.input) : salvagePrototype(raw);
        if (!prototype) {
          // Issue paths and codes only, never values or visitor text.
          const bad = PrototypeSchema.safeParse(tool?.input);
          if (!bad.success) console.error("[studio] invalid build", bad.error.issues.map((i) => `${i.path.join(".")}: ${i.code}`).join("; "));
          send(mark("validate", { ok: false, note: "invalid" }));
          send(fallbackEvent);
        } else {
          finalized = true;
          await finish(prototype);
        }
      } catch (err) {
        // finalMessage() can throw on trailing characters after a complete tool JSON (eager input streaming
        // skips API validation). The raw streamed text may still hold a full prototype; it must pass the same schema.
        const cutOff = stopReason !== null && stopReason !== "tool_use";
        if (cutOff) console.error(`[studio] stop_reason ${stopReason}`);
        const salvage = finalized || cutOff || err instanceof Anthropic.APIError || req.signal.aborted ? null : salvagePrototype(raw);
        // Error class only: parse messages can quote a snippet of the content.
        const cls = err instanceof Error ? ((err.cause as Error | undefined)?.name ?? err.name) : "error";
        if (!streamMarked) {
          streamMarked = true;
          if (salvage) send(mark("stream", { screens: sent.screens }));
          else send(mark("stream", cutOff ? { ok: false, note: "cut_off" } : { ok: false, note: "model_error" }));
        }
        if (salvage) {
          salvaged = true;
          console.error(`[studio] salvaged build after ${cls}`);
          try { await finish(salvage, "salvaged"); } catch (e2) { console.error(`[studio] salvage failed: ${e2 instanceof Error ? e2.name : "error"}`); send(fallbackEvent); }
        } else {
          if (err instanceof Anthropic.RateLimitError) console.error("[studio] anthropic rate limited");
          else if (err instanceof Anthropic.APIError) console.error(`[studio] anthropic ${err.status}:`, err.message);
          else console.error(`[studio] failed: ${cls}`);
          send(fallbackEvent);
        }
      } finally {
        // An aborted or failed model call keeps its full reservation, so disconnecting never refunds spend.
        const charged = completed ? spent : STUDIO_RESERVE_USD;
        await settle(db, budgetKey, STUDIO_RESERVE_USD, charged).catch((err) => console.error("[studio] settle failed:", err));
        // Token counts only, never visitor text.
        console.log(`[studio] usage ${JSON.stringify(usage)} cost=$${spent.toFixed(5)}`);
        const stats = db.pipeline();
        stats.hincrby(statsKey, built ? "builds" : "fallbacks", 1);
        if (salvaged && built) stats.hincrby(statsKey, "salvaged", 1);
        stats.hincrby(statsKey, "costMicroUsd", Math.round(charged * 1e6));
        stats.expire(statsKey, 60 * 60 * 24 * 90);
        await stats.exec().catch((err) => console.error("[studio] stats failed:", err));
        try { controller.close(); } catch {}
      }
    },
  });

  const headers = new Headers({ "content-type": "application/x-ndjson", "cache-control": "no-store" });
  if (device.setCookie) headers.append("set-cookie", device.setCookie);
  return new Response(body, { headers });
}
