"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Terminal,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { personalInfo, heroStats } from "@/data/portfolio-data";
import { HeroOutcomes } from "./hero-outcomes";

// 3D Pao is code-split: prefetched when the browser is idle, mounted only when the visitor meets him.
const loadPaoHero = () => import("@/components/pao/pao-hero").then((m) => m.PaoHero);
const PaoHero = dynamic(loadPaoHero, { ssr: false });
const AUTO_MEET_MS = 9000; // if nobody clicks, Pao introduces Les anyway
const MET_KEY = "pao-met";
import gsap from "gsap";
import { track } from "@vercel/analytics";

const roles = [
  "AI Agents & Chatbots",
  "Business Automation",
  "LLM Integrations",
  "Full-Stack Systems",
  "AI Motion Graphics",
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

  // "closed": photo first, name held back. "meeting": Pao is popping out. "open": name revealed.
  const [gate, setGate] = useState<"closed" | "meeting" | "open">("closed");
  const photoRef = useRef<HTMLButtonElement>(null);
  const revealed = useRef(false);

  // Dock-style "maximize": the name sweeps out of the photo/Pao position and grows into place.
  const revealName = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    setGate("open");
    try { sessionStorage.setItem(MET_KEY, "1"); } catch {}
    const h1 = nameRef.current;
    const photo = photoRef.current;
    if (!h1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = h1.querySelectorAll<HTMLElement>(".hero-name-char");
    const from = photo?.getBoundingClientRect();
    chars.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = from ? from.left + from.width / 2 - (r.left + r.width / 2) : 300;
      const dy = from ? from.top + from.height * 0.35 - (r.top + r.height / 2) : 0;
      gsap.fromTo(
        el,
        { x: dx, y: dy, scaleX: 0.06, scaleY: 0.35, skewX: -28, opacity: 0, filter: "blur(10px)", transformOrigin: "100% 50%" },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, skewX: 0, opacity: 1, filter: "blur(0px)", duration: 1.05, delay: i * 0.07, ease: "expo.out", clearProps: "filter" },
      );
    });
  }, []);

  const meetPao = useCallback(() => {
    setGate((g) => (g === "closed" ? "meeting" : g));
  }, []);

  useEffect(() => {
    let met = false;
    try { met = sessionStorage.getItem(MET_KEY) === "1"; } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Returning in the same session, or reduced motion: show the name straight away.
    if (met || reduced) {
      revealed.current = true;
      const id = window.setTimeout(() => setGate("open"), 0);
      return () => window.clearTimeout(id);
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => void loadPaoHero());
    const auto = window.setTimeout(meetPao, AUTO_MEET_MS);
    return () => window.clearTimeout(auto);
  }, [meetPao]);

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
      gsap.set("[data-hero-image]", { opacity: 0, scale: 0.9, y: 40 });
      gsap.set("[data-hero-image-frame]", { opacity: 0 });

      tl.to("[data-hero-line]", { scaleX: 1, duration: 1.2 }, 0)
        .to("[data-hero-slide-left]", { opacity: 1, x: 0, duration: 0.8 }, 0.6)
        .to("[data-hero-slide-right]", { opacity: 1, x: 0, duration: 0.8 }, 0.6)
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.8)
        .to("[data-hero-image]", { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }, 0.6)
        .to("[data-hero-image-frame]", { opacity: 1, duration: 0.8 }, 0.8)
        .to("[data-hero-scale]", { opacity: 1, scale: 1, duration: 0.6 }, 1)
        .to("[data-hero-stat]", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.4);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Dramatic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary/10 via-transparent to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.03]"
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

            {/* Name: held back until Pao reveals it. Space is reserved, so the reveal never shifts layout. */}
            <div className="relative space-y-2" data-name-gate={gate === "open" ? "open" : "closed"}>
              {gate !== "open" && (
                <button
                  type="button"
                  onClick={meetPao}
                  className="absolute inset-x-0 top-0 z-10 flex h-[2em] cursor-pointer items-center gap-3 text-left font-display text-2xl font-semibold text-foreground/90 md:text-3xl lg:text-4xl"
                >
                  <span aria-hidden className="text-primary">👋</span>
                  <span>
                    Who builds these results?{" "}
                    <span className="text-primary underline decoration-primary/40 underline-offset-8">Click my photo</span>
                    <span className="hidden lg:inline"> to meet Pao</span>.
                  </span>
                </button>
              )}
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
                {/* Rendered on the server so search engines index the title next to the name */}
                <span data-hero-fade className="block mt-5 font-sans text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground/90">
                  {personalInfo.title}
                </span>
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

            {/* Business outcomes: what a buyer gets, in their numbers, within the first seconds.
                CSS-animated on its own (not GSAP), so it plays even before hydration. */}
            <HeroOutcomes />

            {/* CTA Buttons with Magnetic Effect */}
            <div data-hero-fade className="flex flex-wrap items-center gap-4 pt-4">
              <MagneticElement strength={0.4}>
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-none bg-foreground text-background hover:bg-foreground px-8 py-6 text-base font-semibold"
                  asChild
                >
                  <Link href="#contact" onClick={() => track("cta_click", { location: "hero" })}>
                    <span className="relative z-10 flex items-center gap-2">
                      Start a Project
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
                  <Link href="#projects">
                    <span className="relative">
                      View Work
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </Button>
              </MagneticElement>
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
                {/* Clickable cue while Pao is waiting to be met */}
                {gate === "closed" && (
                  <>
                    <span aria-hidden className="pointer-events-none absolute -inset-2 z-30 border-2 border-primary/70 motion-safe:animate-[pao-pulse_2.4s_ease-out_infinite]" />
                    <span className="pointer-events-none absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary py-1 pl-1 pr-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 motion-safe:animate-bounce [animation-duration:2s]">
                      <Image src="/images/pao/pao-avatar.webp" alt="" width={56} height={56} className="h-7 w-7 rounded-full bg-[#dcdcdc]" />
                      Click to meet Pao
                    </span>
                  </>
                )}

                {/* 3D Pao pops out of the photo; drag him around or click him */}
                {gate !== "closed" && (
                  <PaoHero
                    onPopped={revealName}
                    onFirstTouch={revealName}
                    className="absolute -inset-x-16 -top-36 z-40 aspect-[4/5] sm:-inset-x-24"
                  />
                )}

                {/* Main Image Container: the photo is the button that summons Pao */}
                <button
                  ref={photoRef}
                  type="button"
                  onClick={meetPao}
                  disabled={gate !== "closed"}
                  aria-label="Meet Pao, my AI assistant"
                  className="relative block aspect-square w-full cursor-pointer overflow-hidden transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default group-hover/image:[transform:perspective(900px)_rotateY(-7deg)_rotateX(3deg)]"
                  style={
                    gate === "closed"
                      ? undefined
                      : { transform: "perspective(900px) rotateY(-26deg) translateX(18%) scale(0.84)", opacity: 0.5, filter: "saturate(0.6)" }
                  }
                >
                  {/* Gold Corner Frames */}
                  <div data-hero-image-frame className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />
                  <div data-hero-image-frame className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />
                  <div data-hero-image-frame className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />
                  <div data-hero-image-frame className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary z-20 transition-[width,height] duration-500 ease-out group-hover/image:w-20 group-hover/image:h-20" />

                  {/* Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/lesjohnpaul.jpg"
                      alt="Les John Paul Oliver, AI Engineer"
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
                </button>

                {/* Stats Bar Below Image */}
                <div className="mt-6 p-6 border border-border bg-card/80 backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-4">
                    {heroStats.map((stat, index) => (
                      <div key={stat.label} data-hero-stat className="text-center group cursor-default">
                        <div className="font-display text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MagneticElement>

            {/* Floating Badge */}
            <MagneticElement strength={0.5}>
              <div
                data-hero-slide-right
                className="absolute -top-4 -right-4 md:top-4 md:-right-6 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-sm cursor-default shadow-lg z-30"
              >
                Ships fast / Solves problems
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
