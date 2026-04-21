"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Award,
  BadgeCheck,
  Database,
  Code,
  Cloud,
  ShieldCheck,
  Activity,
  Cpu,
  Zap,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { certifications, awards } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Scroll-pinned 3D "LES" extrusion replaces the old CRED CSS watermark.
const CredentialsText = dynamic(
  () => import("@/components/three/credentials-text"),
  { ssr: false }
);

// Lightweight mapping from cert name → icon. Keeps the section self-contained.
function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("sql")) return Database;
  if (n.includes("full stack") || n.includes("web development")) return Code;
  if (n.includes("aws") || n.includes("cloud")) return Cloud;
  if (n.includes("hacking") || n.includes("privacy") || n.includes("security"))
    return ShieldCheck;
  if (n.includes("scada") || n.includes("fiber")) return Activity;
  if (n.includes("hardware")) return Cpu;
  if (n.includes("magic")) return Zap;
  return BadgeCheck;
}

export function CredentialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-creds-header]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        "[data-award]",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-award]",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        "[data-cert-card]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-cert-grid]",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="credentials"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 grid-lines-subtle opacity-40" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* 3D "LES" signature — scroll-pinned extrusion replaces the old CRED watermark */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <CredentialsText />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div data-creds-header>
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
            >
              <BadgeCheck className="w-4 h-4 mr-2" />
              Verified
            </Badge>
          </div>
          <h2
            data-creds-header
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Credentials &{" "}
            <span className="text-gradient-gold">Recognition</span>
          </h2>
          <p
            data-creds-header
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Training from AWS, GoIT Philippines, Mapua, and the National
            Electric Administration — paired with a Best Employee award for
            cost-saving in-house modernization.
          </p>
        </div>

        {/* Award callout */}
        {awards.length > 0 && (
          <div className="mb-14">
            {awards.map((award) => (
              <MagneticElement key={award.title} strength={0.05}>
                <div
                  data-award
                  className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-card/30 backdrop-blur-sm p-8 md:p-10"
                >
                  {/* Decorative glow */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-60" />

                  <div className="relative flex flex-col md:flex-row items-start gap-8">
                    {/* Trophy */}
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-2xl bg-primary/15 border border-primary/40 flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-primary" />
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-60 -z-10" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase tracking-widest text-primary font-mono">
                          Award · {award.year}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 leading-tight">
                        {award.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {award.issuer}
                      </p>
                      <p className="text-foreground/80 leading-relaxed max-w-2xl">
                        {award.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </MagneticElement>
            ))}
          </div>
        )}

        {/* Certifications grid */}
        <div
          data-cert-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {certifications.map((cert) => {
            const Icon = iconFor(cert.name);
            return (
              <MagneticElement key={cert.name} strength={0.1}>
                <div
                  data-cert-card
                  className={`group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-500 backdrop-blur-sm ${
                    cert.highlight
                      ? "border-primary/30 bg-gradient-to-br from-primary/5 to-card"
                      : "border-border bg-card/50 hover:border-primary/30"
                  }`}
                >
                  {/* Glow on hover */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cert.highlight
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>

                    <h3 className="font-display text-base md:text-lg font-semibold mb-2 leading-snug">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {cert.issuer}
                    </p>
                    {cert.detail && (
                      <p className="text-xs text-foreground/70 leading-relaxed mb-3">
                        {cert.detail}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono ${
                          cert.highlight
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cert.year}
                      </span>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                      cert.highlight ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                </div>
              </MagneticElement>
            );
          })}
        </div>
      </div>
    </section>
  );
}
