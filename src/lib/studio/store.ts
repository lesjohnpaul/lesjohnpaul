import { randomUUID } from "node:crypto";
import { parsePrototype, type Prototype } from "./schema.ts";

// Structurally compatible with @upstash/redis (auto JSON-serialises objects).
export type KV = {
  set(k: string, v: unknown, o: { ex: number }): Promise<unknown>;
  get<T>(k: string): Promise<T | null>;
  expire(k: string, s: number): Promise<unknown>;
};

export const BUILD_TTL_S = 1800;
export const KEEP_TTL_S = 2_592_000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const key = (id: string) => `studio:build:${id}`;

export async function saveBuild(db: KV, p: Prototype): Promise<string> {
  const id = randomUUID();
  await db.set(key(id), p, { ex: BUILD_TTL_S });
  return id;
}

export async function getBuild(db: KV, id: string): Promise<Prototype | null> {
  if (!UUID.test(id)) return null;
  return parsePrototype(await db.get<unknown>(key(id)));
}

// Fails if the build is gone; expire() alone can't tell, so check first.
export async function keepBuild(db: KV, id: string): Promise<boolean> {
  if (!(await getBuild(db, id))) return false;
  await db.expire(key(id), KEEP_TTL_S);
  return true;
}
