import type { MetadataRoute } from "next";
import { workItems } from "@/lib/work";

const siteUrl = "https://lesjohnpauloliver.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/pandora`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    ...workItems.map((w) => ({
      url: `${siteUrl}/work/${w.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
