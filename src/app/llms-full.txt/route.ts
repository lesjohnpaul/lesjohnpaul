import { faqs, personalInfo, services } from "@/data/portfolio-data";
import { landingPages } from "@/data/landing-pages";
import { workItems } from "@/lib/work";

// llms-full.txt: everything an AI assistant needs to describe Les accurately in one fetch,
// built from the same data as the pages so it never drifts.
const site = "https://lesjohnpauloliver.dev";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${personalInfo.name}: AI Engineer in the Philippines`,
    "",
    `> ${personalInfo.name} is an AI engineer (AI Solutions Architect & Automation Engineer) based in ${personalInfo.location}. ${personalInfo.pitch} Serves Urdaneta, Pangasinan, the Ilocos Region (Region 1), North Luzon, the rest of the Philippines, and clients worldwide remotely. English and Filipino.`,
    "",
    `- Website: ${site}`,
    `- Email: ${personalInfo.email}`,
    `- GitHub: ${personalInfo.social.github}`,
    `- LinkedIn: ${personalInfo.social.linkedin}`,
    `- Pricing: depends on scope; a free 30-minute call gives cost and timeline (${site}/#contact).`,
    "",
    "## Services",
    ...services.map((s) => `- **${s.title}**: ${s.offer} Proof: ${s.proof}.`),
    "",
    ...landingPages.flatMap((p) => [
      `## ${p.h1}`,
      `URL: ${site}/${p.slug}`,
      "",
      ...p.intro,
      "",
      ...p.sections.flatMap((s) => [`### ${s.heading}`, ...s.body.map((b) => `- ${b}`), ""]),
      "### FAQ",
      ...[...p.faqs, ...p.faqsFil].flatMap((f) => [`**${f.q}** ${f.a}`, ""]),
    ]),
    "## Case studies",
    ...workItems.flatMap((w) => [
      `### ${w.project.title}${w.study.status ? ` (${w.study.status})` : ""}`,
      `URL: ${site}/work/${w.slug}`,
      w.study.summary,
      `Tech: ${w.project.tech.join(", ")}`,
      "",
    ]),
    "## General FAQ",
    ...faqs.flatMap((f) => [`**${f.q}** ${f.a}`, ""]),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
