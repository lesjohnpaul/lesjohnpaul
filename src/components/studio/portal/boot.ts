import type { MouseEvent } from "react";

export const STUDIO_BOOT = "studio:boot";

/** Click handler for any link to /studio: plays the boot sequence instead of a hard cut.
 *  Modified clicks (new tab etc.) and reduced-motion users get the plain link. */
export function onStudioClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  e.preventDefault();
  window.dispatchEvent(new Event(STUDIO_BOOT));
}
