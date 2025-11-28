"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  Music,
  Palette,
  TrendingUp,
  Rocket,
  Workflow,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { hiddenTalents } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  Music,
  Palette,
  TrendingUp,
  Rocket,
  Workflow,
};

// Pre-defined particle colors to avoid hydration mismatch from Math.random()
const particleColors = [
  "hsl(35, 70%, 60%)",
  "hsl(42, 70%, 60%)",
  "hsl(48, 70%, 60%)",
  "hsl(55, 70%, 60%)",
  "hsl(62, 70%, 60%)",
  "hsl(38, 70%, 60%)",
  "hsl(45, 70%, 60%)",
  "hsl(52, 70%, 60%)",
  "hsl(58, 70%, 60%)",
  "hsl(65, 70%, 60%)",
  "hsl(40, 70%, 60%)",
  "hsl(47, 70%, 60%)",
  "hsl(54, 70%, 60%)",
  "hsl(60, 70%, 60%)",
  "hsl(67, 70%, 60%)",
  "hsl(36, 70%, 60%)",
  "hsl(43, 70%, 60%)",
  "hsl(50, 70%, 60%)",
  "hsl(57, 70%, 60%)",
  "hsl(64, 70%, 60%)",
];

export function PandoraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Initial reveal animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-pandora-intro]",
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

      // Floating animation for the box
      gsap.to("[data-pandora-box]", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Ambient particle animation
      gsap.to("[data-ambient-particle]", {
        y: -20,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.2,
          from: "random",
        },
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Hover animation for the box
  const handleBoxHover = () => {
    if (!boxRef.current || !particlesRef.current) return;

    const particles = particlesRef.current.children;

    gsap.to(boxRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });

    // Gentle particle pulse on hover
    gsap.to(particles, {
      scale: 1.2,
      opacity: 0.8,
      duration: 0.4,
      stagger: {
        each: 0.02,
        from: "random",
      },
      ease: "power2.out",
    });
  };

  const handleBoxLeave = () => {
    if (!boxRef.current || !particlesRef.current) return;

    const particles = particlesRef.current.children;

    gsap.to(boxRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(particles, {
      scale: 1,
      opacity: 0.4,
      duration: 0.4,
      stagger: {
        each: 0.02,
        from: "random",
      },
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="pandora"
      className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-card/20 to-background"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-lines opacity-20" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particleColors.slice(0, 10).map((color, i) => (
          <div
            key={i}
            data-ambient-particle
            className="absolute w-2 h-2 rounded-full opacity-30"
            style={{
              background: color,
              left: `${10 + i * 8}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div data-pandora-intro>
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-full border-purple-500/30 bg-purple-500/5 text-purple-400 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Hidden Depths
            </Badge>
          </div>
          <h2
            data-pandora-intro
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Beyond the <span className="text-gradient-gold">Code</span>
          </h2>
          <p
            data-pandora-intro
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            There&apos;s more to me than algorithms and architecture. Discover the
            other dimensions of who I am — the skills that make me unique.
          </p>
        </div>

        {/* Pandora's Box Container */}
        <div className="max-w-4xl mx-auto">
          <MagneticElement strength={0.15}>
            <Link href="/pandora">
              <div
                ref={boxRef}
                data-pandora-intro
                data-pandora-box
                className="relative cursor-pointer group"
                onMouseEnter={handleBoxHover}
                onMouseLeave={handleBoxLeave}
              >
                {/* Particle Container */}
                <div
                  ref={particlesRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                >
                  {particleColors.map((color, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-40"
                      style={{
                        background: color,
                        transform: `rotate(${i * 18}deg) translateX(${80 + (i % 3) * 20}px)`,
                      }}
                    />
                  ))}
                </div>

                {/* Box Body */}
                <div className="relative bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl border border-border overflow-hidden transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/10">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Lid */}
                  <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-12 border-b border-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

                    {/* Icon & Title */}
                    <div className="relative flex flex-col items-center justify-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 glow-gold">
                        <Sparkles className="w-12 h-12 text-primary group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-display text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                          Pandora&apos;s Box
                        </h3>
                        <p className="text-muted-foreground">
                          Discover my hidden talents
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Box Base - Talent Preview */}
                  <div className="p-8 bg-gradient-to-b from-transparent to-obsidian/20">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {hiddenTalents.slice(0, 5).map((talent, index) => {
                        const Icon =
                          iconMap[talent.icon as keyof typeof iconMap] || Sparkles;
                        return (
                          <MagneticElement key={talent.category} strength={0.3}>
                            <div
                              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${talent.color} p-0.5 opacity-60 group-hover:opacity-100 transition-all duration-500`}
                              style={{
                                transitionDelay: `${index * 50}ms`,
                              }}
                            >
                              <div className="w-full h-full rounded-xl bg-card flex items-center justify-center group-hover:bg-card/80 transition-colors">
                                <Icon className="w-6 h-6" />
                              </div>
                            </div>
                          </MagneticElement>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <span className="font-medium">Explore my other talents</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>
          </MagneticElement>

          {/* Fun Fact */}
          <div data-pandora-intro className="mt-16 text-center">
            <p className="text-muted-foreground max-w-xl mx-auto">
              <span className="text-primary font-semibold">5 hidden talents</span> waiting to be discovered.
              Each one shapes how I approach problems and create solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
