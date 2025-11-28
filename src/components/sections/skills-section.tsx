"use client";

import { useRef, useEffect } from "react";
import {
  Cloud,
  Database,
  Code,
  Layers,
  Brain,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { coreSkills } from "@/data/portfolio-data";
import { useScrollReveal } from "@/hooks/useGSAP";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  Cloud,
  Database,
  Code,
  Layers,
  Brain,
};

export function SkillsSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll("[data-skill-card]");

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          rotateX: -10,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: index * 0.1,
        }
      );

      // Hover effect
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.02,
          y: -8,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 grid-lines-subtle" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-20">
          <Badge
            variant="outline"
            className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
          >
            Core Expertise
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            What I <span className="text-gradient-gold">Bring</span> to the Table
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Years of hands-on experience across the full technology stack, from
            cloud infrastructure to AI-powered solutions. I don&apos;t just write code
            - I architect systems that scale.
          </p>
        </div>

        {/* Skills Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {coreSkills.map((skill, index) => {
            const Icon = iconMap[skill.icon as keyof typeof iconMap] || Code;

            return (
              <MagneticElement key={skill.category} strength={0.15}>
                <Card
                  data-skill-card
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 h-full ${
                    skill.highlight
                      ? "border-primary/30 bg-gradient-to-br from-primary/5 to-card md:col-span-1 lg:row-span-1"
                      : "border-border bg-card/50 backdrop-blur-sm"
                  }`}
                >
                {/* Highlight Glow */}
                {skill.highlight && (
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon & Arrow */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        skill.highlight
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-xl font-semibold mb-3">
                    {skill.category}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-2">
                    {skill.skills.slice(0, 6).map((s) => (
                      <span
                        key={s}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          skill.highlight
                            ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                    {skill.skills.length > 6 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        +{skill.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Accent Line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                      skill.highlight ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                </Card>
              </MagneticElement>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <MagneticElement strength={0.1}>
          <div
            data-reveal
            className="mt-20 p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Technologies Mastered", value: "40+" },
                { label: "Certifications", value: "8" },
                { label: "Open Source Contributions", value: "100+" },
                { label: "Articles Written", value: "25+" },
              ].map((stat) => (
                <MagneticElement key={stat.label} strength={0.2}>
                  <div className="text-center cursor-default group">
                    <div className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
                  </div>
                </MagneticElement>
              ))}
            </div>
          </div>
        </MagneticElement>
      </div>
    </section>
  );
}
