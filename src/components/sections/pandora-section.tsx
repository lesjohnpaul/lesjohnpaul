"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
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

// Particle component for the floating particles
const Particle = ({ index, total }: { index: number; total: number }) => {
  const angle = (index / total) * Math.PI * 2;
  const radius = 180 + Math.random() * 100;
  const size = 2 + Math.random() * 4;
  const delay = Math.random() * 5;

  return (
    <div
      data-particle
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: index % 3 === 0
          ? "rgba(212, 175, 55, 0.8)"
          : index % 3 === 1
          ? "rgba(168, 85, 247, 0.8)"
          : "rgba(255, 255, 255, 0.6)",
        boxShadow: index % 3 === 0
          ? "0 0 10px rgba(212, 175, 55, 0.5)"
          : index % 3 === 1
          ? "0 0 10px rgba(168, 85, 247, 0.5)"
          : "0 0 6px rgba(255, 255, 255, 0.3)",
        transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

export function PandoraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const talentsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const particleAnimRef = useRef<gsap.core.Tween[]>([]);
  const ringAnimRef = useRef<gsap.core.Tween[]>([]);

  // Mouse parallax handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!orbContainerRef.current) return;

    const rect = orbContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    setMousePos({ x, y });

    // Parallax effect on different layers
    gsap.to("[data-parallax-slow]", {
      x: x * 20,
      y: y * 20,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.to("[data-parallax-medium]", {
      x: x * 35,
      y: y * 35,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to("[data-parallax-fast]", {
      x: x * 50,
      y: y * 50,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to("[data-parallax-slow], [data-parallax-medium], [data-parallax-fast]", {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  // Initialize animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance animations
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

      // Orb container entrance - dramatic reveal
      gsap.fromTo(
        "[data-orb-container]",
        {
          opacity: 0,
          scale: 0.3,
          rotateY: -180,
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          delay: 0.3,
        }
      );

      // Core pulse animation
      gsap.to("[data-core]", {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Core inner energy rotation
      gsap.to("[data-core-energy]", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      // Orbital rings animations - different speeds and directions
      const rings = document.querySelectorAll("[data-ring]");
      rings.forEach((ring, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const duration = 15 + i * 5;
        const tween = gsap.to(ring, {
          rotation: 360 * direction,
          duration: duration,
          repeat: -1,
          ease: "none",
        });
        ringAnimRef.current.push(tween);
      });

      // Floating particles animation
      const particles = document.querySelectorAll("[data-particle]");
      particles.forEach((particle, i) => {
        const tween = gsap.to(particle, {
          y: `+=${Math.sin(i) * 30}`,
          x: `+=${Math.cos(i) * 20}`,
          opacity: Math.random() * 0.5 + 0.3,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
        particleAnimRef.current.push(tween);
      });

      // Ambient glow pulse
      gsap.to("[data-ambient-glow]", {
        opacity: 0.6,
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Sparkle animations
      gsap.to("[data-sparkle]", {
        scale: "random(0.5, 1.8)",
        opacity: "random(0.2, 1)",
        rotation: "random(-30, 30)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.1,
          from: "random",
        },
        ease: "sine.inOut",
      });

      // Energy waves
      gsap.to("[data-energy-wave]", {
        scale: 2.5,
        opacity: 0,
        duration: 3,
        repeat: -1,
        stagger: {
          each: 1,
          repeat: -1,
        },
        ease: "power2.out",
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      particleAnimRef.current.forEach(tween => tween.kill());
      ringAnimRef.current.forEach(tween => tween.kill());
    };
  }, []);

  // Hover activation - the magic happens here
  const handleHoverEnter = () => {
    setIsHovered(true);

    // Kill existing animation if any
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Create master timeline for hover effect
    const tl = gsap.timeline();
    animationRef.current = tl;

    // Core intensifies
    tl.to("[data-core]", {
      scale: 1.3,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    // Core glow expands
    tl.to("[data-core-glow]", {
      scale: 1.8,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    }, 0);

    // Rings speed up
    ringAnimRef.current.forEach((tween, i) => {
      gsap.to(tween, {
        timeScale: 3,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    // Rings expand outward
    tl.to("[data-ring]", {
      scale: 1.15,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
    }, 0);

    // Outer glow burst
    tl.to(glowRef.current, {
      opacity: 1,
      scale: 1.5,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    // Talent icons emerge from center and orbit
    const talents = talentsRef.current?.children;
    if (talents) {
      Array.from(talents).forEach((talent, i) => {
        const angle = (i / talents.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 160;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        tl.fromTo(talent,
          {
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          },
          {
            opacity: 1,
            scale: 1,
            x: x,
            y: y,
            duration: 0.8,
            ease: "back.out(2)",
          },
          0.1 + i * 0.08
        );
      });

      // Add continuous orbital animation to talents
      gsap.to(talentsRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }

    // Particles burst outward
    tl.to("[data-particle]", {
      scale: 1.5,
      duration: 0.5,
      stagger: {
        each: 0.02,
        from: "random",
      },
      ease: "power2.out",
    }, 0);

    // Energy waves burst
    tl.fromTo("[data-burst-wave]",
      { scale: 0.5, opacity: 0.8 },
      { scale: 3, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out" },
      0
    );
  };

  const handleHoverLeave = () => {
    setIsHovered(false);

    if (animationRef.current) {
      animationRef.current.kill();
    }

    const tl = gsap.timeline();
    animationRef.current = tl;

    // Core returns to normal
    tl.to("[data-core]", {
      scale: 1,
      duration: 0.6,
      ease: "power2.inOut",
    }, 0);

    // Core glow shrinks
    tl.to("[data-core-glow]", {
      scale: 1,
      opacity: 0.6,
      duration: 0.6,
      ease: "power2.inOut",
    }, 0);

    // Rings slow down
    ringAnimRef.current.forEach((tween) => {
      gsap.to(tween, {
        timeScale: 1,
        duration: 1,
        ease: "power2.inOut",
      });
    });

    // Rings return to normal scale
    tl.to("[data-ring]", {
      scale: 1,
      duration: 0.6,
      ease: "power2.inOut",
    }, 0);

    // Hide outer glow
    tl.to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.inOut",
    }, 0);

    // Talent icons return to center and fade
    const talents = talentsRef.current?.children;
    if (talents) {
      // Stop rotation
      gsap.killTweensOf(talentsRef.current);
      gsap.set(talentsRef.current, { rotation: 0 });

      Array.from(talents).forEach((talent, i) => {
        tl.to(talent, {
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.in",
        }, 0.05 * i);
      });
    }

    // Particles return
    tl.to("[data-particle]", {
      scale: 1,
      duration: 0.6,
      ease: "power2.inOut",
    }, 0);
  };

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

      {/* Animated stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
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
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

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
            There&apos;s more to me than algorithms and architecture. Discover the
            other dimensions of who I am.
          </p>
        </div>

        {/* Mystical Orb System */}
        <div
          ref={orbContainerRef}
          className="flex justify-center items-center min-h-[500px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Link href="/pandora">
            <div
              data-orb-container
              className="relative cursor-pointer"
              style={{
                width: 400,
                height: 400,
                perspective: "1000px",
              }}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
              {/* Outer ambient glow */}
              <div
                ref={glowRef}
                className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />

              {/* Energy waves container */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    data-energy-wave
                    className="absolute w-32 h-32 rounded-full border border-primary/30"
                    style={{ animationDelay: `${i * 1}s` }}
                  />
                ))}
              </div>

              {/* Burst waves (on hover) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    data-burst-wave
                    className="absolute w-20 h-20 rounded-full border-2 border-primary/50 opacity-0"
                  />
                ))}
              </div>

              {/* Floating particles */}
              <div
                className="absolute inset-0 pointer-events-none"
                data-parallax-slow
              >
                {[...Array(30)].map((_, i) => (
                  <Particle key={i} index={i} total={30} />
                ))}
              </div>

              {/* Orbital rings system */}
              <div
                ref={ringsRef}
                className="absolute inset-0 flex items-center justify-center"
                data-parallax-medium
              >
                {/* Ring 1 - Outer */}
                <div
                  data-ring
                  className="absolute w-80 h-80 rounded-full border border-primary/20"
                  style={{
                    transform: "rotateX(75deg)",
                    boxShadow: "0 0 20px rgba(212, 175, 55, 0.1)",
                  }}
                >
                  {/* Ring particles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-primary/60 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `rotate(${i * 30}deg) translateX(160px) translateY(-50%)`,
                        boxShadow: "0 0 8px rgba(212, 175, 55, 0.6)",
                      }}
                    />
                  ))}
                </div>

                {/* Ring 2 - Middle */}
                <div
                  data-ring
                  className="absolute w-64 h-64 rounded-full border border-purple-500/30"
                  style={{
                    transform: "rotateX(75deg) rotateY(20deg)",
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.1)",
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2.5 h-2.5 bg-purple-400/70 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `rotate(${i * 45}deg) translateX(128px) translateY(-50%)`,
                        boxShadow: "0 0 10px rgba(168, 85, 247, 0.7)",
                      }}
                    />
                  ))}
                </div>

                {/* Ring 3 - Inner */}
                <div
                  data-ring
                  className="absolute w-48 h-48 rounded-full border border-blue-400/20"
                  style={{
                    transform: "rotateX(75deg) rotateY(-30deg)",
                    boxShadow: "0 0 10px rgba(96, 165, 250, 0.1)",
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-blue-400/60 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `rotate(${i * 60}deg) translateX(96px) translateY(-50%)`,
                        boxShadow: "0 0 6px rgba(96, 165, 250, 0.6)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Central Core */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                data-parallax-fast
              >
                {/* Core glow */}
                <div
                  data-core-glow
                  className="absolute w-40 h-40 rounded-full opacity-60"
                  style={{
                    background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(168,85,247,0.3) 50%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />

                {/* Core outer shell */}
                <div
                  ref={coreRef}
                  data-core
                  className="relative w-28 h-28 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(212,175,55,0.4) 30%, rgba(168,85,247,0.3) 60%, rgba(30,30,40,0.9) 100%)",
                    boxShadow: `
                      0 0 60px rgba(212, 175, 55, 0.4),
                      0 0 100px rgba(168, 85, 247, 0.2),
                      inset 0 0 40px rgba(212, 175, 55, 0.3),
                      inset 0 0 80px rgba(0, 0, 0, 0.5)
                    `,
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                  }}
                >
                  {/* Inner energy pattern */}
                  <div
                    data-core-energy
                    className="absolute inset-2 rounded-full overflow-hidden"
                    style={{
                      background: `
                        conic-gradient(
                          from 0deg,
                          rgba(212, 175, 55, 0.4),
                          rgba(168, 85, 247, 0.4),
                          rgba(96, 165, 250, 0.3),
                          rgba(212, 175, 55, 0.4)
                        )
                      `,
                      filter: "blur(8px)",
                    }}
                  />

                  {/* Core center icon */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                    <Sparkles className={`w-7 h-7 text-primary transition-all duration-500 ${isHovered ? "scale-125 rotate-180" : ""}`} />
                  </div>

                  {/* Ambient shine */}
                  <div className="absolute top-2 left-3 w-6 h-6 bg-white/20 rounded-full blur-md" />
                </div>
              </div>

              {/* Talent icons container - positioned in center, will orbit on hover */}
              <div
                ref={talentsRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                {hiddenTalents.slice(0, 5).map((talent, index) => {
                  const Icon = iconMap[talent.icon as keyof typeof iconMap] || Sparkles;
                  return (
                    <div
                      key={talent.category}
                      className={`absolute w-14 h-14 rounded-xl bg-gradient-to-br ${talent.color} p-0.5 opacity-0`}
                      style={{
                        boxShadow: `0 0 30px ${
                          talent.color.includes("purple") ? "rgba(168,85,247,0.5)" :
                          talent.color.includes("blue") ? "rgba(59,130,246,0.5)" :
                          talent.color.includes("green") ? "rgba(34,197,94,0.5)" :
                          talent.color.includes("orange") ? "rgba(249,115,22,0.5)" :
                          "rgba(239,68,68,0.5)"
                        }`,
                      }}
                    >
                      <div className="w-full h-full rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ambient glow layer */}
              <div
                data-ambient-glow
                className="absolute inset-0 rounded-full pointer-events-none opacity-40"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 60%)",
                }}
              />

              {/* CTA Text */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                <h3 className={`font-display text-xl font-bold mb-1 transition-colors duration-300 ${isHovered ? "text-primary" : ""}`}>
                  Pandora&apos;s Vault
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {isHovered ? "✨ Secrets unlocked" : "Hover to reveal"}
                </p>
                <div className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${isHovered ? "text-primary" : "text-muted-foreground"}`}>
                  <span>Explore my talents</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Fun Fact */}
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
