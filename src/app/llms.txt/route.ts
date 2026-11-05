import { faqs, personalInfo, services } from "@/data/portfolio-data";
import { workItems } from "@/lib/work";

// llms.txt (llmstxt.org): a plain-text brief that AI search engines can quote when asked
// "who is a good AI engineer in the Philippines". Built from the same data as the site.
const site = "https://lesjohnpauloliver.dev";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${personalInfo.name}`,
    `## AI Solutions Architect & Automation Engineer`,
    "",
    `> ${personalInfo.pitch} Based in ${personalInfo.location} (GMT+8), working remotely with clients worldwide.`,
    "",
    `### Positioning`,
    `- Primary: **AI Solutions Architect & Automation Engineer** — I architect and ship AI agents, chatbots, and workflow automation that integrate Claude and other LLMs into existing business processes.`,
    `- Also: **Software Engineer** — 10+ years shipping production systems (databases, cloud architecture, full-stack apps) for an electric utility serving 250,000+ consumers.`,
    "",
    `### What I ship`,
    `- AI agents that answer leads 24/7, book calls, and escalate to humans when it matters`,
    `- Automations that turn weeks of manual compliance work into under 5 minutes`,
    `- Invoice batches that were a full workday now complete in under 30 seconds with zero transcription errors`,
    `- Full-stack systems: billing portals, pharmacy POS, ITSM platforms, registration systems`,
    `- I do NOT claim "fully autonomous multi-agent systems in production" — I ship AI-assisted automation with human approval where records or money change.`,
    "",
    `### Contact`,
    `- Email: ${personalInfo.email}`,
    `- Portfolio: ${site}`,
    `- Résumé: ${site}${personalInfo.resumeUrl}`,
    `- GitHub: ${personalInfo.social.github}`,
    `- LinkedIn: ${personalInfo.social.linkedin}`,
    "",
    "## Services",
    ...services.map((s) => `- **${s.title}**: ${s.offer}`),
    "",
    "## Selected Work (Case Studies)",
    ...workItems.slice(0, 10).map((w) => `- [${w.project.title}](${site}/work/${w.slug}): ${w.study.summary}`),
    "",
    `See all 23 case studies at ${site}/#projects`,
    "",
    "## FAQ",
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
