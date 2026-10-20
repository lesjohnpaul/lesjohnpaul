import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { faqs } from "@/data/portfolio-data";

// Server-rendered and native <details>, so the answers are in the HTML search engines read.
export function FaqSection() {
  return (
    <section id="faq" className="relative py-24 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <Badge variant="outline" className="mb-6 rounded-full border-primary/30 bg-primary/5 px-4 py-2 text-primary">
          <HelpCircle className="mr-2 h-4 w-4" />
          FAQ
        </Badge>
        <h2 className="mb-8 font-display text-4xl font-bold md:text-5xl">
          Hiring an AI engineer in the <span className="text-primary">Philippines</span>
        </h2>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
