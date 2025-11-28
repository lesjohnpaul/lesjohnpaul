"use client";

import { useRef, useEffect } from "react";
import { Briefcase, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { experience } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        "[data-exp-header]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Timeline line animation
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Timeline items animation
      const items = timelineRef.current?.querySelectorAll("[data-exp-item]");
      items?.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: index % 2 === 0 ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Dot animation
        const dot = item.querySelector(".timeline-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: 0.3,
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 grid-lines-subtle opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div data-exp-header>
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Career Journey
            </Badge>
          </div>
          <h2 data-exp-header className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Where I&apos;ve <span className="text-gradient-gold">Built</span>
          </h2>
          <p data-exp-header className="text-lg text-muted-foreground leading-relaxed">
            A track record of delivering impact across startups and enterprises,
            scaling systems, and leading technical initiatives.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2">
            <div className="timeline-line absolute inset-0 bg-gradient-to-b from-primary via-primary/50 to-transparent origin-top" />
          </div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div
                key={exp.role}
                data-exp-item
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="timeline-dot absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-8 md:pl-0`}>
                  <MagneticElement strength={0.12}>
                    <Card className="group relative overflow-hidden p-6 md:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      {/* Period */}
                      <span className="text-sm text-primary font-medium mb-2 block">
                        {exp.period}
                      </span>

                      {/* Role */}
                      <h3 className="font-display text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>

                      {/* Company */}
                      <p className="text-muted-foreground font-medium mb-4 flex items-center gap-2 justify-start md:justify-inherit">
                        {exp.company}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <ul className={`space-y-3 ${index % 2 === 0 ? "md:items-end" : ""}`}>
                        {exp.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className={`flex items-start gap-3 text-sm ${
                              index % 2 === 0 ? "md:flex-row-reverse md:text-right" : ""
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                      </div>
                    </Card>
                  </MagneticElement>
                </div>

                {/* Spacer for layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
