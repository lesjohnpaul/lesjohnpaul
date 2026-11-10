import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { personalInfo } from "@/data/portfolio-data";
import { getLandingPage, landingPages } from "@/data/landing-pages";
import { workItems } from "@/lib/work";

type Props = { params: Promise<{ landing: string }> };

const site = "https://lesjohnpauloliver.dev";
const personId = `${site}/#person`;
const ChatWidget = dynamic(() => import("@/components/chat/chat-widget").then((m) => m.ChatWidget));

// Only the pages in landing-pages.ts exist; anything else at the root is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => landingPages.map((p) => ({ landing: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getLandingPage((await params).landing);
  if (!page) return {};
  const url = `/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    // Setting openGraph here replaces the root one, so the share image must be repeated.
    openGraph: { title: page.title, description: page.description, url, type: "website", locale: "en_PH", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default async function LandingPage({ params }: Props) {
  const page = getLandingPage((await params).landing);
  if (!page) notFound();

  const url = `${site}/${page.slug}`;
  const proof = page.proof.map((slug) => workItems.find((w) => w.slug === slug)).filter((w) => w !== undefined);
  const services = landingPages.filter((p) => p.kind === "service" && p.slug !== page.slug);
  const places = landingPages.filter((p) => p.kind === "location" && p.slug !== page.slug);
  const allFaqs = [...page.faqs, ...page.faqsFil];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.h1,
        description: page.description,
        url,
        serviceType: page.keywords[0],
        provider: { "@id": personId },
        areaServed: page.areaServed.map((name) => ({ "@type": "Place", name })),
        availableChannel: { "@type": "ServiceChannel", serviceUrl: `${site}/#contact`, availableLanguage: ["English", "Filipino"] },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: allFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Les John Paul Oliver, AI Engineer", item: site },
          { "@type": "ListItem", position: 2, name: page.h1, item: url },
        ],
      },
    ],
  };

  return (
    <main className="min-h-dvh bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-3 font-display text-sm font-bold">
            <LogoMark size={32} id="landing-logo" />
            <span>
              {personalInfo.name}
              <span className="ml-2 hidden font-sans font-normal text-muted-foreground sm:inline">AI Engineer</span>
            </span>
          </Link>
          <Link href="/#contact" className="text-sm font-semibold text-primary hover:underline">
            Book a call
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {page.kind === "location" && <MapPin className="h-3.5 w-3.5" />}
          {page.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{page.h1}</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {personalInfo.name} · Urdaneta City, Pangasinan, Philippines · Remote worldwide
        </p>

        <div className="mt-8 space-y-4 text-lg leading-relaxed text-foreground/90">
          {page.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {page.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="font-display text-2xl font-semibold">{s.heading}</h2>
            {s.body.length > 1 ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/85">
                {s.body.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-relaxed text-foreground/85">{s.body[0]}</p>
            )}
          </section>
        ))}

        {proof.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Proof: work I shipped</h2>
            <div className="mt-6 grid gap-4">
              {proof.map((w) => (
                <Link
                  key={w.slug}
                  href={`/work/${w.slug}`}
                  className="group block border border-border bg-card p-5 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold">{w.project.title}</h3>
                    {w.study.status && (
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {w.study.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.study.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read the case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">Questions people ask</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {page.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          {page.faqsFil.length > 0 && (
            <div lang="fil" className="mt-8">
              <h3 className="font-display text-lg font-semibold">Sa Filipino</h3>
              <div className="mt-3 divide-y divide-border border-y border-border">
                {page.faqsFil.map((f) => (
                  <details key={f.q} className="py-4">
                    <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-14 border border-primary/30 bg-primary/5 p-6">
          <h2 className="font-display text-2xl font-semibold">Pricing depends on scope</h2>
          <p className="mt-2 text-muted-foreground">Book a free 30-minute call. You get a straight answer on cost and timeline.</p>
          <Link
            href="/#contact"
            className="mt-5 inline-flex items-center gap-2 bg-foreground px-6 py-3 font-semibold text-background transition-colors hover:bg-primary"
          >
            Book a free 30-minute call <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>

        <nav aria-label="Related" className="mt-14 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Services</h2>
            <ul className="mt-3 space-y-2">
              {services.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="hover:text-primary">{p.h1}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Areas served</h2>
            <ul className="mt-3 space-y-2">
              {places.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="hover:text-primary">{p.h1}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </article>
      <ChatWidget />
    </main>
  );
}
