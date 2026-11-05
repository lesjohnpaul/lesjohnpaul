import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // Explicitly allow AI/search crawlers for better discoverability
      // Sources: OpenAI, Anthropic, Perplexity bot documentation
      {
        userAgent: [
          "OAI-SearchBot",     // OpenAI SearchGPT
          "GPTBot",            // OpenAI ChatGPT
          "ChatGPT-User",      // OpenAI ChatGPT user requests
          "Claude-SearchBot",  // Anthropic Claude search
          "ClaudeBot",         // Anthropic Claude
          "PerplexityBot",     // Perplexity AI
          "Google-Extended",   // Google Gemini & Bard
          "anthropic-ai",      // Anthropic crawlers
          "cohere-ai",         // Cohere AI
        ],
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://lesjohnpauloliver.dev/sitemap.xml",
  };
}
