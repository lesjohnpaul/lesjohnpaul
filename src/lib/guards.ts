import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { checkBotId } from "botid/server";

// Upstash via the Vercel Marketplace sets KV_REST_API_*; a direct Upstash account sets UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

const limiters = new Map<string, Ratelimit>();

/**
 * Sliding-window limit keyed by `id`. Returns null when Redis isn't configured,
 * so each caller decides whether to fail open (contact form) or closed (chat).
 */
export async function rateLimit(
  name: string,
  id: string,
  max: number,
  window: Duration,
): Promise<boolean | null> {
  if (!redis) return null;
  const prefix = `rl:${name}:${max}:${window}`;
  let limiter = limiters.get(prefix);
  if (!limiter) {
    limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, window), prefix });
    limiters.set(prefix, limiter);
  }
  return (await limiter.limit(id)).success;
}

// Vercel overwrites these headers at the edge, so they can't be spoofed by the client in production.
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// BotID needs Vercel's OIDC token, so it only runs on Vercel deployments (local runs aren't exposed).
export async function isBot(): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  return (await checkBotId()).isBot;
}
