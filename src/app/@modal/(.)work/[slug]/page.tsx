import { notFound } from "next/navigation";
import { getWork } from "@/lib/work";
import { CaseStudyView } from "@/components/work/case-study-view";
import { CaseStudySheet } from "@/components/work/case-study-sheet";

type Props = { params: Promise<{ slug: string }> };

// Intercepts /work/[slug] during in-app navigation and renders it as a panel over the current page.
// A direct visit or refresh renders src/app/work/[slug]/page.tsx instead (that one is prerendered).
// No generateStaticParams/dynamicParams here: on an intercepted route they throw NoFallbackError.
export default async function WorkModal({ params }: Props) {
  const work = getWork((await params).slug);
  if (!work) notFound();
  return (
    <CaseStudySheet title={work.project.title} summary={work.study.summary}>
      <CaseStudyView project={work.project} study={work.study} next={work.next} />
    </CaseStudySheet>
  );
}
