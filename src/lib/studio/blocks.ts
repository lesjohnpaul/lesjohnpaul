import type { Screen } from "./schema";

/** Node order in public/studio/blocks*.glb (`block_<type>`). Scene slot i is home to BLOCK_TYPES[i]. */
export const BLOCK_TYPES: Screen["type"][] = ["dashboard", "table", "form", "map", "booking", "kanban", "odontogram"];

/**
 * Which slot each arrived screen (max 3) flies out of. `rank[i]` is the arrival index of slot i (-1 = still orbiting);
 * a screen uses its type's home slot, so blocks never change shape. Only when that slot is already taken (a repeated
 * type, or a slot borrowed earlier) does the screen borrow the first free slot; `shape[i]` then names the type that
 * slot must morph into. No lookahead: screens stream in, so the result for a prefix never changes when more arrive.
 */
export function arrivals(screenTypes: readonly Screen["type"][]): { rank: number[]; shape: Screen["type"][] } {
  const used = screenTypes.slice(0, 3);
  const rank = BLOCK_TYPES.map(() => -1);
  const shape = [...BLOCK_TYPES];
  used.forEach((t, r) => {
    let j = BLOCK_TYPES.indexOf(t);
    if (rank[j] >= 0) {
      j = rank.indexOf(-1);
      shape[j] = t;
    }
    rank[j] = r;
  });
  return { rank, shape };
}
