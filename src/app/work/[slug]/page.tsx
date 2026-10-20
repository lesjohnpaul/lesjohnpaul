import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { personalInfo } from "@/data/portfolio-data";
import { getWork, workItems } from "@/lib/work";
import { CaseStudyView } from "@/components/work/case-study-view";

type Props = { params: Promise<{ slug: string }> };

// Pao rides along on case studies too; the server gives it this page's study as context.
const ChatWidget = dynamic(() => import("@/components/chat/chat-widget").then((m) => m.ChatWidget));

export const dynamicParams = false;

export function generateStaticParams() {
  return workItems.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = getWork((await params).slug);
  if (!work) return {};
  const title = `${work.project.title}: Case Study`;
  return {
    title,
    description: work.study.summary,
    alternates: { canonical: `/work/${work.slug}` },
    openGraph: { title, description: work.study.summary, type: "article", url: `/work/${work.slug}` },
  };
}

export default async function WorkPage({ params }: Props) {
  const work = getWork((await params).slug);
  if (!work) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.project.title,
    description: work.study.summary,
    url: `https://lesjohnpauloliver.dev/work/${work.slug}`,
    keywords: work.project.tech.join(", "),
    creator: { "@type": "Person", name: personalInfo.name, jobTitle: personalInfo.title },
  };

  return (
    <main className="min-h-dvh bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
          <Link href="/" className="font-display text-sm font-bold">
            {personalInfo.name}
            <span className="ml-2 font-sans font-normal text-muted-foreground">{personalInfo.title}</span>
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <CaseStudyView project={work.project} study={work.study} next={work.next} />
      </div>
      <ChatWidget />
    </main>
  );
}
