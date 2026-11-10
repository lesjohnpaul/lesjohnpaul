import type { MetadataRoute } from "next";
import { workItems } from "@/lib/work";
import { landingPages } from "@/data/landing-pages";

const siteUrl = "https://lesjohnpauloliver.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  // ponytail: no lastModified; a build-time date on every URL teaches Google to ignore it
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/les-john-paul-oliver-resume.pdf`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/pandora`, changeFrequency: "yearly", priority: 0.3 },
    ...landingPages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: p.kind === "service" ? 0.9 : 0.8,
    })),
    { url: `${siteUrl}/llms-full.txt`, changeFrequency: "monthly", priority: 0.4 },
    ...workItems.map((w) => ({
      url: `${siteUrl}/work/${w.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
