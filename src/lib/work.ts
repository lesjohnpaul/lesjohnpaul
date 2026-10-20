import { projects } from "@/data/portfolio-data";
import { caseStudies } from "@/data/case-studies";
import { slugify } from "./slug";

/** Projects that have a written case study, in portfolio order. */
export const workItems = projects
  .map((project) => ({ project, slug: slugify(project.title), study: caseStudies[slugify(project.title)] }))
  .filter((w) => w.study);

export function getWork(slug: string) {
  const i = workItems.findIndex((w) => w.slug === slug);
  if (i < 0) return null;
  const n = workItems[(i + 1) % workItems.length];
  return { ...workItems[i], next: { title: n.project.title, slug: n.slug } };
}
