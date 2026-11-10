export type Tier = "full" | "lite" | "static";

export type TierEnv = { webgl2: boolean; reducedMotion: boolean; isMobile: boolean; cores: number; memoryGB?: number };

export function pickTier(e: TierEnv): Tier {
  if (!e.webgl2 || e.reducedMotion) return "static";
  if (e.isMobile || e.cores <= 4 || (e.memoryGB !== undefined && e.memoryGB <= 4)) return "lite";
  return "full";
}

/** Browser probe. Call from an effect, never at import time (SSR has no window). */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "static";
  let webgl2 = false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    webgl2 = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // free the throwaway context
  } catch {
    webgl2 = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return pickTier({
    webgl2,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    isMobile: coarse || /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent),
    cores: nav.hardwareConcurrency || 4, // ponytail: unknown core count treated as weak
    memoryGB: nav.deviceMemory,
  });
}
