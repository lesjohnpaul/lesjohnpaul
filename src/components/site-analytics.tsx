"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// /studio#q=... carries the visitor's chat text in the hash; never let it reach analytics.
const stripHash = <T extends { url: string }>(e: T): T => ({ ...e, url: e.url.split("#")[0] });

export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={stripHash} />
      <SpeedInsights beforeSend={stripHash} />
    </>
  );
}
