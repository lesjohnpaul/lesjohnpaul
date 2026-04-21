"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  Terminal,
  Cloud,
  Database,
  Brain,
  Code2,
  Zap,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { personalInfo, heroStats } from "@/data/portfolio-data";
import gsap from "gsap";

// Three.js hero scene — loaded only on the client to keep SSR/hydration safe
// and to defer the WebGL bundle until after the first paint.
const HeroGrid = dynamic(() => import("@/components/three/hero-grid"), {
  ssr: false,
});

const roles = [
  "AI-Native Engineer",
  "Full Stack Developer",
  "Legacy Modernizer",
  "Database Engineer",
  "Cloud Migration Lead",
];

const techStack = [
  { icon: Brain, label: "Claude Code · Cursor · MCP" },
  { icon: Code2, label: "Next.js · TypeScript · React" },
  { icon: Database, label: "MS SQL Server · PostgreSQL" },
  { icon: Cloud, label: "Azure · AWS · Docker" },
];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");

  // Typing effect for roles
  useEffect(() => {
    const role = roles[currentRole];
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting) {
        setDisplayText(role.slice(0, charIndex + 1));
        charIndex++;

        if (charIndex === role.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
      } else {
        setDisplayText(role.slice(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          setCurrentRole((prev) => (prev + 1) % roles.length);
          timeout = setTimeout(type, 500);
          return;
        }
      }

      timeout = setTimeout(type, isDeleting ? 50 : 100);
    };

    timeout = setTimeout(type, 500);
    return () => clearTimeout(timeout);
  }, [currentRole]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      gsap.set("[data-hero-line]", { scaleX: 0 });
      gsap.set("[data-hero-fade]", { opacity: 0, y: 30 });
      gsap.set("[data-hero-slide-left]", { opacity: 0, x: -60 });
      gsap.set("[data-hero-slide-right]", { opacity: 0, x: 60 });
      gsap.set("[data-hero-scale]", { opacity: 0, scale: 0.8 });
      gsap.set("[data-hero-stat]", { opacity: 0, y: 40 });
      gsap.set("[data-tech-item]", { opacity: 0, x: -30 });
      gsap.set(".hero-name-char", { opacity: 0, y: 100, rotateX: -90 });
      gsap.set("[data-hero-image]", { opacity: 0, scale: 0.9, y: 40 });
      gsap.set("[data-hero-image-frame]", { opacity: 0 });

      tl.to("[data-hero-line]", { scaleX: 1, duration: 1.2 }, 0)
        .to(".hero-name-char", {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.05,
        }, 0.3)
        .to("[data-hero-slide-left]", { opacity: 1, x: 0, duration: 0.8 }, 0.6)
        .to("[data-hero-slide-right]", { opacity: 1, x: 0, duration: 0.8 }, 0.6)
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.8)
        .to("[data-hero-image]", { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }, 0.6)
        .to("[data-hero-image-frame]", { opacity: 1, duration: 0.8 }, 0.8)
        .to("[data-hero-scale]", { opacity: 1, scale: 1, duration: 0.6 }, 1)
        .to("[data-tech-item]", { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 }, 1.2)
        .to("[data-hero-stat]", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.4);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Dramatic Background — WebGL grid sits under the gradient veils */}
      <div className="absolute inset-0">
        {/* Immersive Three.js layer (mounted client-side, reduced-motion aware) */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroGrid />
        </div>

        {/* Gradient veils — keep these above the canvas so text stays legible */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                              linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />

        <div className="absolute -right-20 top-1/2 -translate-y-1/2 font-display text-[40rem] font-bold text-foreground/[0.02] select-none pointer-events-none leading-none">
          01
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status Line */}
            <div data-hero-fade className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-emerald-500">
                  {personalInfo.availability}
                </span>
              </div>
              <div data-hero-line className="h-px flex-1 bg-gradient-to-r from-border to-transparent origin-left" />
            </div>

            {/* Name - Clean Professional Typography */}
            <div className="space-y-2">
              <h1
                ref={nameRef}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.85] cursor-default select-none group/name transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                <span className="hero-name-char inline-block transition-all duration-300 group-hover/name:[text-shadow:0_0_20px_rgba(212,175,55,0.3),0_0_40px_rgba(212,175,55,0.2)]">{personalInfo.name.split(" ")[0]}</span>
                <span className="hero-name-char inline-block">&nbsp;</span>
                <span className="hero-name-char inline-block transition-all duration-300 group-hover/name:[text-shadow:0_0_20px_rgba(212,175,55,0.3),0_0_40px_rgba(212,175,55,0.2)]">{personalInfo.name.split(" ")[1]}</span>
                <span className="hero-name-char inline-block">&nbsp;</span>
                <span className="hero-name-char inline-block transition-all duration-300 group-hover/name:[text-shadow:0_0_20px_rgba(212,175,55,0.3),0_0_40px_rgba(212,175,55,0.2)]">{personalInfo.name.split(" ")[2]}</span>
                <span className="hero-name-char inline-block">&nbsp;</span>
                <span className="hero-name-char inline-block text-primary transition-all duration-300 group-hover/name:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]">{personalInfo.name.split(" ")[3]}</span>
              </h1>
            </div>

            {/* Dynamic Role */}
            <div data-hero-slide-left className="flex items-center gap-4">
              <Terminal className="w-6 h-6 text-primary" />
              <div className="font-mono text-xl md:text-2xl">
                <span className="text-muted-foreground">{">"}</span>
                <span className="text-primary ml-2">{displayText}</span>
                <span className="animate-pulse text-primary">|</span>
              </div>
            </div>

            {/* Description */}
            <p data-hero-fade className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              AI-native engineer running — and modernizing — the systems that power{" "}
              <span className="text-foreground font-medium">200,000+ Filipino consumers</span>.
              Claude Code in the toolchain. Legacy codebases turned maintainable.
              10+ years of production discipline.
            </p>

            {/* CTA buttons — "View Work" is the primary action on a
                portfolio (a visitor wants to see the work before hiring).
                "Start a Project" demoted to secondary ghost with underline. */}
            <div data-hero-fade className="flex flex-wrap items-center gap-4 pt-4">
              <MagneticElement strength={0.4}>
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-none bg-primary text-primary-foreground hover:bg-primary px-8 py-6 text-base font-semibold"
                  asChild
                >
                  <Link href="#projects">
                    <span className="relative z-10 flex items-center gap-2">
                      View Work
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-foreground text-background translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                </Button>
              </MagneticElement>

              <MagneticElement strength={0.4}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-none px-8 py-6 text-base font-semibold hover:bg-transparent group"
                  asChild
                >
                  <Link href="#contact">
                    <span className="relative">
                      Start a Project
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </Button>
              </MagneticElement>
            </div>

            {/* Trust strip — above-the-fold proof. Credentials are the
                best credibility signal for an engineer portfolio and they
                live seven sections below; this gives them a second life at
                the top of the funnel without duplicating content. */}
            <div
              data-hero-fade
              className="pt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm"
            >
              <span className="font-mono uppercase tracking-[0.2em] text-muted-foreground/80">
                Trained at
              </span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-foreground/80 font-medium">
                {["AWS", "GoIT", "Mapua", "TESDA", "Everywhere Consulting"].map(
                  (name, i, arr) => (
                    <span key={name} className="flex items-center gap-4">
                      <span className="hover:text-primary transition-colors">
                        {name}
                      </span>
                      {i < arr.length - 1 && (
                        <span
                          aria-hidden
                          className="inline-block h-1 w-1 rounded-full bg-border"
                        />
                      )}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Tech Stack Pills with Hover Effects */}
            <div data-hero-fade className="flex flex-wrap items-center gap-3 pt-6">
              {techStack.map((tech, i) => (
                <MagneticElement key={tech.label} strength={0.3}>
                  <div
                    data-tech-item
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default"
                  >
                    <tech.icon className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{tech.label}</span>
                  </div>
                </MagneticElement>
              ))}
            </div>
          </div>

          {/* Right Column - Profile Image & Stats */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Profile Image with Architectural Frame */}
            <MagneticElement strength={0.15}>
              <div
                data-hero-image
                className="relative group/image max-w-sm w-full"
              >
                {/* Main Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  {/* Gold Corner Frames */}
                  <div data-hero-image-frame className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />
                  <div data-hero-image-frame className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />
                  <div data-hero-image-frame className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />
                  <div data-hero-image-frame className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />

                  {/* Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/LesPaul.jpeg"
                      alt="Les John Paul Oliver - AI-Native Full Stack Engineer"
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover/image:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                    {/* Gold Tint on Hover */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 ease-out" />
                  </div>

                  {/* Decorative Background Frame */}
                  <div className="absolute -z-10 top-4 left-4 right-4 bottom-4 border border-primary/30 transition-[top,left,right,bottom] duration-500 ease-out group-hover/image:top-6 group-hover/image:left-6 group-hover/image:right-6 group-hover/image:bottom-6" />
                </div>

                {/* Stats — editorial inline data, no card wrapper.
                    Varies weight across stats so they don't read as a
                    generic 4-equal-columns metric grid. */}
                <dl className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-4">
                  {heroStats.map((stat, index) => {
                    const emphasized = index < 2;
                    return (
                      <div
                        key={stat.label}
                        data-hero-stat
                        className="group flex items-baseline gap-2"
                      >
                        <dt className="sr-only">{stat.label}</dt>
                        <dd
                          className={`font-display font-bold leading-none tabular-nums transition-colors duration-300 group-hover:text-primary ${
                            emphasized
                              ? "text-3xl md:text-4xl text-primary"
                              : "text-2xl md:text-3xl text-foreground/90"
                          }`}
                        >
                          {stat.value}
                        </dd>
                        <span
                          className="font-mono text-[0.7rem] md:text-xs uppercase tracking-[0.18em] text-muted-foreground"
                          aria-hidden
                        >
                          {stat.label}
                        </span>
                        {index < heroStats.length - 1 && (
                          <span
                            aria-hidden
                            className="ml-4 hidden md:inline-block h-5 w-px bg-border align-middle"
                          />
                        )}
                      </div>
                    );
                  })}
                </dl>
              </div>
            </MagneticElement>

            {/* Floating Badge */}
            <MagneticElement strength={0.5}>
              <div
                data-hero-slide-right
                className="absolute -top-4 -right-4 md:top-4 md:-right-6 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-sm cursor-default shadow-lg z-30"
              >
                <Zap className="w-4 h-4" />
                Powering 200K+ Consumers
              </div>
            </MagneticElement>

            {/* Subtle Glow Effect Behind Image */}
            <div className="absolute -z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-3xl rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Scroll Indicator */}
            <MagneticElement strength={0.3}>
              <button
                onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                <span>Scroll to explore</span>
              </button>
            </MagneticElement>

            {/* Quick Links with Icons */}
            <div className="hidden md:flex items-center gap-4">
              {[
                { icon: Github, label: "GitHub", href: personalInfo.social.github, ariaLabel: "View GitHub Profile" },
                { icon: Linkedin, label: "LinkedIn", href: personalInfo.social.linkedin, ariaLabel: "Connect on LinkedIn" },
                { icon: Mail, label: "Contact", href: `mailto:${personalInfo.email}`, ariaLabel: "Send Email" },
              ].map((link) => (
                <MagneticElement key={link.label} strength={0.3}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    aria-label={link.ariaLabel}
                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 rounded-md group"
                  >
                    <link.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span className="text-sm">{link.label}</span>
                  </a>
                </MagneticElement>
              ))}
            </div>

            {/* Location */}
            <div className="text-sm text-muted-foreground">
              Based in <span className="text-foreground">{personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
