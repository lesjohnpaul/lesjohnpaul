// Server-only data for the Studio's Proof act. Relative imports so `npm test` runs it; the client imports ProofItem as a type.
import { caseStudies } from "../../data/case-studies.ts";
import { projects } from "../../data/portfolio-data.ts";
import { slugify } from "../slug.ts";

export const PROOF_SLUGS = [
  "executive-live-collections-dashboard",
  "ai-assisted-refund-automation",
  "acirs-24-7-ai-customer-support",
  "wecare-pharmacy-pos-dispensing-platform",
] as const;

export type ProofItem = { slug: string; title: string; outcome: string; image: string; href: string };

/** Throws (failing `next build`) if a slug lost its published project or case study. Never reads `client`. */
export function proofItems(slugs: readonly string[] = PROOF_SLUGS): ProofItem[] {
  return slugs.map((slug) => {
    const project = projects.find((p) => slugify(p.title) === slug);
    const study = caseStudies[slug];
    if (!project || !study) throw new Error(`[studio/proof] no published project or case study for "${slug}"`);
    return { slug, title: project.title, outcome: project.result ?? study.outcome[0], image: project.image, href: `/work/${slug}` };
  });
}
