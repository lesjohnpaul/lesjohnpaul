import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowRight } from "lucide-react";
import { redis } from "@/lib/guards";
import { getBuild } from "@/lib/studio/store";
import { PrototypeView } from "@/components/studio/prototype-view";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

// Metadata and page share one Redis read per request.
const load = cache(async (id: string) => (redis ? getBuild(redis, id) : null));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).id);
  return {
    title: { absolute: p ? `${p.business} prototype | Les John Paul Oliver` : "Prototype | Les John Paul Oliver" },
    robots: { index: false, follow: false },
  };
}

export default async function PrototypePage({ params }: Props) {
  const p = await load((await params).id);
  if (!p) notFound();

  return (
    <main className="min-h-dvh overflow-x-clip bg-[oklch(0.1_0.015_260)] text-[oklch(0.96_0.005_260)]">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <Link href="/" className="text-sm text-white/60 transition-colors hover:text-white">
          Les John Paul Oliver
        </Link>

        <header className="mb-8 mt-10 max-w-2xl sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--primary)]">Your prototype</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">{p.business}</h1>
          <p className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg">{p.spec}</p>
        </header>

        <PrototypeView prototype={p} />
        <p className="mt-4 text-xs text-white/50">
          Sample prototype generated from a visitor&apos;s description. All data is fictional.
        </p>

        <section className="mt-10 flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-md">
            <h2 className="font-display text-xl font-medium">Want the real thing?</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              This is a clickable sketch. In a short call we look at how your business runs and what a working version would take.
            </p>
          </div>
          <Link
            href="/studio#book"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-semibold text-[oklch(0.16_0.015_260)] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            Book a discovery call
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>
    </main>
  );
}
