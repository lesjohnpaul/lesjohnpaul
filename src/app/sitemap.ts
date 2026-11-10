import type { MetadataRoute } from "next";
import { workItems } from "@/lib/work";
import { landingPages } from "@/data/landing-pages";

const siteUrl = "https://lesjohnpauloliver.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/les-john-paul-oliver-resume.pdf`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/pandora`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    ...landingPages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.kind === "service" ? 0.9 : 0.8,
    })),
    { url: `${siteUrl}/llms-full.txt`, lastModified, changeFrequency: "monthly", priority: 0.4 },
    ...workItems.map((w) => ({
      url: `${siteUrl}/work/${w.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
