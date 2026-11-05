import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // Explicitly allow AI crawlers for better discoverability
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "Google-Extended", "anthropic-ai", "cohere-ai"],
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://lesjohnpauloliver.dev/sitemap.xml",
  };
}
