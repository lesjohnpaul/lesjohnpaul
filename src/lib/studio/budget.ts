// Atomic daily spend reservation. Pure: caller passes a Redis-like counter.
export type Counter = {
  incrbyfloat(key: string, n: number): Promise<number | string>;
  expire(key: string, s: number): Promise<unknown>;
};

export const STUDIO_RESERVE_USD = 0.02;

export function studioBudgetUsd(): number {
  const n = Number(process.env.STUDIO_DAILY_BUDGET_USD);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

export function spendKey(date = new Date()): string {
  return `studio:spend:${date.toISOString().slice(0, 10)}`;
}

export async function reserve(db: Counter, key: string, amount: number, cap: number): Promise<boolean> {
  const total = Number(await db.incrbyfloat(key, amount));
  await db.expire(key, 48 * 3600);
  if (total > cap) {
    await db.incrbyfloat(key, -amount);
    return false;
  }
  return true;
}

export async function settle(db: Counter, key: string, reserved: number, actual: number): Promise<void> {
  await db.incrbyfloat(key, actual - reserved);
}
