"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 3D core replaces the old CSS-gradient orb + CSS orbital rings.
const PandoraCore = dynamic(() => import("@/components/three/pandora-core"), {
  ssr: false,
});

export function PandoraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-pandora-intro]",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        "[data-pandora-stage]",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          delay: 0.3,
        }
      );

      // Ambient starfield twinkle — trimmed from 50 → 24 elements (below);
      // also paused when the section is off-screen via IntersectionObserver
      // so it's not eating frames while the user is up in the hero.
      const twinkle = gsap.to("[data-sparkle]", {
        scale: "random(0.5, 1.8)",
        opacity: "random(0.2, 1)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.15, from: "random" },
        ease: "sine.inOut",
        paused: true,
      });

      const node = sectionRef.current;
      if (node) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) twinkle.play();
              else twinkle.pause();
            }
          },
          { threshold: 0.05 }
        );
        io.observe(node);
        // Teardown observer via gsap.context revert side-effect: attach to ctx data.
        return () => io.disconnect();
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pandora"
      className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-card/30 to-background"
    >
      {/* Deep space background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Animated stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            data-sparkle
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Ambient corner glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
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
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            There&apos;s more to me than algorithms and architecture. Discover
            the other dimensions of who I am.
          </p>
        </div>

        {/* 3D Core Stage */}
        <div
          data-pandora-stage
          className="flex justify-center items-center min-h-[500px]"
        >
          <Link
            href="/pandora"
            className="relative block"
            style={{ width: 460, height: 460 }}
            aria-label="Open Pandora's Vault"
          >
            {/* Outer ambient glow reacts to hover */}
            <div
              className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-60"
              }`}
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(168,85,247,0.15) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* 3D core (WebGL) */}
            <PandoraCore onHoverChange={setIsHovered} />

            {/* CTA below the stage */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <h3
                className={`font-display text-xl font-bold mb-1 transition-colors duration-300 ${
                  isHovered ? "text-primary" : ""
                }`}
              >
                Pandora&apos;s Vault
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {isHovered ? "✨ Secrets unlocked" : "Hover to reveal"}
              </p>
              <div
                className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
                  isHovered ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span>Explore my talents</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isHovered ? "translate-x-2" : ""
                  }`}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer fact */}
        <div data-pandora-intro className="mt-28 text-center">
          <p className="text-muted-foreground max-w-xl mx-auto">
            <span className="text-primary font-semibold">5 hidden talents</span>{" "}
            waiting to be discovered. Each one shapes how I approach problems.
          </p>
        </div>
      </div>
    </section>
  );
}
