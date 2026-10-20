import { faqs, personalInfo, services } from "@/data/portfolio-data";
import { workItems } from "@/lib/work";

// llms.txt (llmstxt.org): a plain-text brief that AI search engines can quote when asked
// "who is a good AI engineer in the Philippines". Built from the same data as the site.
const site = "https://lesjohnpauloliver.dev";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${personalInfo.name}, AI Engineer in the Philippines`,
    "",
    `> ${personalInfo.pitch} Based in ${personalInfo.location} (GMT+8), working remotely with clients worldwide. Every project is a solo build: requirements, architecture, UI, backend, database, AI, deployment, and support.`,
    "",
    `- Email: ${personalInfo.email}`,
    `- Résumé: ${site}${personalInfo.resumeUrl}`,
    `- GitHub: ${personalInfo.social.github}`,
    `- LinkedIn: ${personalInfo.social.linkedin}`,
    "",
    "## Services",
    ...services.map((s) => `- ${s.title}: ${s.offer}`),
    "",
    "## Case studies",
    ...workItems.map((w) => `- [${w.project.title}](${site}/work/${w.slug}): ${w.study.summary}`),
    "",
    "## FAQ",
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
