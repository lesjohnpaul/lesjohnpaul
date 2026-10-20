import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { clientIp, isBot, rateLimit, redis } from "@/lib/guards";
import { checkMessage, normalizeQuestion, REPLIES } from "@/lib/chat/guard";
import { caseStudyLinks, studyContext } from "@/lib/chat/page-context";
import { SYSTEM_PROMPT } from "@/lib/chat/knowledge";
import { TOOLS, runTool } from "@/lib/chat/tools";

export const maxDuration = 60;

const MODEL = "claude-haiku-5-5";
const MAX_TOOL_ROUNDS = 4;
const HISTORY_TTL_S = 60 * 60 * 24;
const MAX_BODY_BYTES = 8_000;
// Worst case for one request: 4 rounds × (~50K-token prompt+history in + 2,000 out) ≈ $0.024.
const RESERVE_USD = 0.03;
const DAILY_BUDGET_USD = Number(process.env.CHAT_DAILY_BUDGET_USD ?? "1");

// Claude Haiku 5.5, prompts ≤100K tokens, USD per million tokens.
const PRICE = { input: 0.1, output: 0.5, cacheWrite: 0.125, cacheRead: 0.01 };

const Body = z.object({ conversationId: z.uuid(), message: z.string().max(2000), page: z.string().max(200).optional() });

// First-turn answers are cached and replayed for free: many visitors tap the same starter chip.
// The key hashes the prompt, tools, and model, so editing any of them retires every old answer.
const ANSWER_TTL_S = 60 * 60 * 24 * 7;
const sha = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 24);
const PROMPT_VERSION = sha(MODEL + SYSTEM_PROMPT + JSON.stringify(TOOLS));

// The wire format to the widget: one JSON object per line.
type Event =
  | { t: "text"; v: string }
  | { t: "event"; v: "booked" | "lead" }
  | { t: "chips"; v: string[] }
  | { t: "links"; v: { label: string; href: string }[] }
  | { t: "done" };
const encoder = new TextEncoder();
const line = (e: Event) => encoder.encode(JSON.stringify(e) + "\n");

function cannedReply(text: string, status = 200) {
  return new Response(new Blob([line({ t: "text", v: text }), line({ t: "done" })]).stream(), {
    status,
    headers: { "content-type": "application/x-ndjson" },
  });
}

const costOf = (u: Anthropic.Usage) =>
  (u.input_tokens * PRICE.input +
    (u.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite +
    (u.cache_read_input_tokens ?? 0) * PRICE.cacheRead +
    u.output_tokens * PRICE.output) /
  1_000_000;

export async function POST(req: Request) {
  if (await isBot()) return cannedReply(REPLIES.refusal, 403);

  // Reject oversized bodies before reading them; a valid body is well under 3 KB.
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return cannedReply(REPLIES.tooLong, 413);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return cannedReply(REPLIES.tooLong, 413);
  const parsed = Body.safeParse((() => { try { return JSON.parse(raw); } catch { return null; } })());
  if (!parsed.success) return cannedReply(REPLIES.error, 400);
  const { conversationId, message, page } = parsed.data;

  // Fail closed: without Redis there are no rate limits or budget, so no model calls.
  if (!redis || !process.env.ANTHROPIC_API_KEY) return cannedReply(REPLIES.unavailable, 503);
  const db = redis;

  // Per-IP limits sit well above one conversation's 20-turn cap, so a visitor mid-booking (or an
  // office sharing one IP) isn't cut off. Spend is still bounded by DAILY_BUDGET_USD (~$0.0003/msg).
  const ip = clientIp(req);
  const [hourly, daily] = await Promise.all([
    rateLimit("chat-h", ip, 40, "1 h"),
    rateLimit("chat-d", ip, 100, "1 d"),
  ]);
  if (!hourly || !daily) return cannedReply(REPLIES.rate, 429);

  // History lives server-side, so a client can't forge earlier assistant turns or reset the turn cap.
  const historyKey = `chat:conv:${conversationId}`;
  const history = (await redis.get<Anthropic.MessageParam[]>(historyKey)) ?? [];
  const turns = history.filter((m) => m.role === "user" && typeof m.content === "string").length;
  const verdict = checkMessage(message, turns);
  if (!verdict.ok) return cannedReply(verdict.reply);

  // The case study the visitor is reading goes in once per conversation, ahead of their message.
  const study = studyContext(page);
  const studyNew = study && !history.some((m) => typeof m.content === "string" && m.content.includes(`<page slug="${study.slug}">`));
  const visitorText = verdict.text.replaceAll("<page", "(page"); // only the server writes <page> blocks
  const userContent = studyNew ? `<page slug="${study.slug}">\n${study.text}\n</page>\n${visitorText}` : visitorText;
  const statsKey = `chat:stats:${new Date().toISOString().slice(0, 10)}`;

  const answerKey = turns === 0 ? `chat:answer:${PROMPT_VERSION}:${sha(`${studyNew ? study.text : ""}\n${normalizeQuestion(visitorText)}`)}` : null;
  const cached = answerKey ? await db.get<string>(answerKey) : null;
  if (cached) {
    await db.set(historyKey, [...history, { role: "user", content: userContent }, { role: "assistant", content: cached }], { ex: HISTORY_TTL_S });
    await db.hincrby(statsKey, "cachedAnswers", 1).catch(() => {});
    const links = caseStudyLinks(cached, study?.slug);
    const events: Event[] = [{ t: "text", v: cached }, ...(links.length ? [{ t: "links" as const, v: links }] : []), { t: "done" }];
    return new Response(new Blob(events.map(line)).stream(), {
      headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" },
    });
  }

  // Reserve the worst case before calling the model, then settle to the real cost afterwards.
  // A check-then-record budget lets a burst of parallel requests all pass the check; reserving
  // atomically keeps the daily cap strict. An over-reservation from a crashed request errs safe.
  const spendKey = `chat:spend:${new Date().toISOString().slice(0, 10)}`;
  const reserved = Number(await db.incrbyfloat(spendKey, RESERVE_USD));
  await db.expire(spendKey, 60 * 60 * 48);
  if (reserved > DAILY_BUDGET_USD) {
    await db.incrbyfloat(spendKey, -RESERVE_USD);
    return cannedReply(REPLIES.budget);
  }

  // Append-only: Haiku 5.5 rejects replayed thinking blocks if earlier turns change.
  const messages: Anthropic.MessageParam[] = [...history, { role: "user", content: userContent }];
  const client = new Anthropic();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(line(e));
      let spent = 0;
      const usage = { in: 0, cacheRead: 0, cacheWrite: 0, out: 0, rounds: 0 };
      let reply = "";
      let usedTools = false;
      let finished = false;
      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const stream = client.messages.stream({
            model: MODEL,
            max_tokens: 2000, // room for low-effort thinking plus a short reply
            output_config: { effort: "low" },
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            // Also cache the growing conversation, so each turn re-reads earlier turns at cache price.
            cache_control: { type: "ephemeral" },
            tools: TOOLS,
            messages,
          });
          stream.on("text", (delta) => send({ t: "text", v: delta }));
          const msg = await stream.finalMessage();
          spent += costOf(msg.usage);
          usage.rounds++;
          usage.in += msg.usage.input_tokens;
          usage.cacheRead += msg.usage.cache_read_input_tokens ?? 0;
          usage.cacheWrite += msg.usage.cache_creation_input_tokens ?? 0;
          usage.out += msg.usage.output_tokens;

          const toolUses = msg.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
          reply += msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
          // A refusal or max_tokens can cut a tool call off mid-input: never run it, and don't
          // persist a tool_use with no matching tool_result (the next request would 400).
          if (msg.stop_reason === "refusal" || msg.stop_reason === "max_tokens") {
            if (!toolUses.length) messages.push({ role: "assistant", content: msg.content });
            if (msg.stop_reason === "refusal") send({ t: "text", v: REPLIES.refusal });
            break;
          }
          messages.push({ role: "assistant", content: msg.content });
          if (msg.stop_reason !== "tool_use" || !toolUses.length) {
            finished = msg.stop_reason === "end_turn";
            break;
          }
          usedTools = true;

          const results = await Promise.all(
            toolUses.map(async (tu) => {
              const out = await runTool(tu.name, tu.input, ip);
              if (out.event) send({ t: "event", v: out.event });
              if (out.chips) send({ t: "chips", v: out.chips });
              return { type: "tool_result" as const, tool_use_id: tu.id, content: out.content, is_error: out.isError };
            }),
          );
          messages.push({ role: "user", content: results });
        }
        await db.set(historyKey, messages, { ex: HISTORY_TTL_S });
        const links = caseStudyLinks(reply, study?.slug);
        if (links.length) send({ t: "links", v: links });
        // Only a plain one-round answer is safe to replay; anything that touched a tool is personal.
        if (answerKey && finished && !usedTools && reply.trim()) await db.set(answerKey, reply, { ex: ANSWER_TTL_S });
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) console.error("[chat] anthropic rate limited");
        else if (err instanceof Anthropic.APIError) console.error(`[chat] anthropic ${err.status}:`, err.message);
        else console.error("[chat] failed:", err);
        send({ t: "text", v: REPLIES.error });
      } finally {
        await db.incrbyfloat(spendKey, spent - RESERVE_USD);
        // Token counts only, no message content: lets cost and cache hits be checked in the logs.
        console.log(`[chat] usage ${JSON.stringify(usage)} cost=$${spent.toFixed(5)}`);
        // Hobby logs vanish after an hour; these daily totals stay (Upstash console, key chat:stats:<date>).
        const stats = db.pipeline();
        stats.hincrby(statsKey, "requests", 1);
        stats.hincrby(statsKey, "rounds", usage.rounds);
        stats.hincrby(statsKey, "inputTokens", usage.in);
        stats.hincrby(statsKey, "cacheReadTokens", usage.cacheRead);
        stats.hincrby(statsKey, "cacheWriteTokens", usage.cacheWrite);
        stats.hincrby(statsKey, "outputTokens", usage.out);
        stats.hincrby(statsKey, "costMicroUsd", Math.round(spent * 1e6));
        stats.expire(statsKey, 60 * 60 * 24 * 90);
        await stats.exec().catch((err) => console.error("[chat] stats failed:", err));
        send({ t: "done" });
        controller.close();
      }
    },
  });

  return new Response(body, { headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" } });
}
