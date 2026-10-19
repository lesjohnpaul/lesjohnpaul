"use client";

import Link from "next/link";
import { Bot, Workflow, Brain, Code, Clapperboard, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services, processSteps } from "@/data/portfolio-data";
import { useScrollReveal } from "@/hooks/useGSAP";

const iconMap = { Bot, Workflow, Brain, Code, Clapperboard };

export function ServicesSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} id="services" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div data-reveal className="max-w-3xl mb-16">
          <Badge
            variant="outline"
            className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
          >
            What I Solve
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            AI That Makes Your <span className="text-gradient-gold">Business Run</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I don&apos;t build language models. I build with them: assistants, automations,
            and tools that remove the slow, manual parts of your operations, shipped in
            weeks, not quarters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Code;
            return (
              <Card
                key={service.title}
                data-reveal
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 hover:border-primary/30 transition-colors duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="text-foreground font-medium">Problem: </span>
                  {service.problem}
                </p>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{service.offer}</p>
                <p className="text-xs font-mono text-primary/90 border-t border-border pt-4">
                  Proof: {service.proof}
                </p>
              </Card>
            );
          })}
        </div>

        {/* How an engagement runs */}
        <div data-reveal className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((s) => (
            <div key={s.step} className="border-t border-primary/30 pt-6">
              <div className="font-mono text-sm text-primary mb-2">{s.step}</div>
              <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12">
          <Button
            size="lg"
            className="rounded-none bg-foreground text-background hover:bg-primary px-8 py-6 text-base font-semibold gap-2"
            asChild
          >
            <Link href="#contact">
              Tell me what&apos;s slowing your business down
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
