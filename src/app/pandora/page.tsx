"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Music,
  Palette,
  TrendingUp,
  Rocket,
  Workflow,
  Sparkles,
  Play,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hiddenTalents, personalInfo } from "@/data/portfolio-data";
import { MagneticElement } from "@/components/ui/magnetic-element";
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

// Extended data for each talent
const talentDetails = {
  "Music Production": {
    headline: "Where Code Meets Composition",
    description:
      "Music production taught me the art of layering complexity into something beautiful. Every track I produce follows the same principles I use in software architecture—modular components, clean structure, and attention to the smallest details.",
    showcase: [
      { type: "stat", label: "Tracks Produced", value: "50+" },
      { type: "stat", label: "Genres Explored", value: "8" },
      { type: "stat", label: "Years Active", value: "10+" },
    ],
    tools: ["Ableton Live", "FL Studio", "Logic Pro", "Native Instruments", "Serum"],
    quote: "Music is the space between the notes. In code, it's the whitespace that matters.",
    gradient: "from-purple-600 via-pink-600 to-rose-600",
    bgGradient: "from-purple-950/50 via-background to-background",
  },
  "Visual Art": {
    headline: "Designing What Words Can't Express",
    description:
      "Visual art sharpened my eye for hierarchy, balance, and user experience. The same principles that make a composition compelling make an interface intuitive.",
    showcase: [
      { type: "stat", label: "Design Projects", value: "100+" },
      { type: "stat", label: "Brand Identities", value: "15" },
      { type: "stat", label: "UI Concepts", value: "50+" },
    ],
    tools: ["Figma", "Adobe Creative Suite", "Blender", "Procreate", "After Effects"],
    quote: "Design is not just what it looks like. Design is how it works.",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    bgGradient: "from-blue-950/50 via-background to-background",
  },
  "Digital Marketing": {
    headline: "Engineering Growth Through Data",
    description:
      "Digital marketing is software engineering for attention. I apply the same analytical mindset—test, measure, iterate—to drive real business outcomes.",
    showcase: [
      { type: "stat", label: "Campaigns Run", value: "200+" },
      { type: "stat", label: "Avg ROI Increase", value: "340%" },
      { type: "stat", label: "Leads Generated", value: "50K+" },
    ],
    tools: ["Google Analytics", "Meta Ads", "HubSpot", "Mixpanel", "A/B Testing"],
    quote: "Growth isn't a department. It's a mindset embedded in every decision.",
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    bgGradient: "from-green-950/50 via-background to-background",
  },
  "Entrepreneurship": {
    headline: "Building Ventures From Zero",
    description:
      "Entrepreneurship taught me to ship fast, fail faster, and always focus on value. These lessons make me a better engineer—I build with business impact in mind.",
    showcase: [
      { type: "stat", label: "Ventures Started", value: "4" },
      { type: "stat", label: "Products Launched", value: "12" },
      { type: "stat", label: "Teams Built", value: "6" },
    ],
    tools: ["Business Strategy", "Product Development", "Team Leadership", "Fundraising", "Market Analysis"],
    quote: "Ideas are worth nothing without execution. Execution is worth nothing without the right team.",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    bgGradient: "from-orange-950/50 via-background to-background",
  },
  "Workflow Automation": {
    headline: "Making Systems Talk to Each Other",
    description:
      "I connect the dots between applications, automate repetitive tasks, and build workflows that run themselves. If it can be automated, I've probably automated it.",
    showcase: [
      { type: "stat", label: "Automations Built", value: "500+" },
      { type: "stat", label: "Hours Saved/Month", value: "1000+" },
      { type: "stat", label: "Integrations", value: "100+" },
    ],
    tools: ["n8n", "Zapier", "Make.com", "Python Scripts", "Custom APIs"],
    quote: "The best code is the code you never have to write because a workflow handles it.",
    gradient: "from-red-600 via-rose-600 to-pink-600",
    bgGradient: "from-red-950/50 via-background to-background",
  },
};

export default function PandoraPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTalent, setActiveTalent] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const ctx = gsap.context(() => {
      // Initial page animation
      gsap.fromTo(
        "[data-pandora-reveal]",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Talent cards scroll animation
      gsap.utils.toArray("[data-talent-section]").forEach((section: any, i) => {
        gsap.fromTo(
          section,
          { opacity: 0, x: i % 2 === 0 ? -100 : 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const activeTalentData = activeTalent
    ? hiddenTalents.find((t) => t.category === activeTalent)
    : null;
  const activeDetails = activeTalent
    ? talentDetails[activeTalent as keyof typeof talentDetails]
    : null;

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 grid-lines opacity-20" />

          {/* Floating Particles */}
          {isLoaded && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/30 animate-pulse"
                  style={{
                    left: `${(i * 5) % 100}%`,
                    top: `${(i * 7) % 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${3 + (i % 3)}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Hero Content */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <div data-pandora-reveal>
            <Badge
              variant="outline"
              className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-8 text-base"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Pandora&apos;s Box Unlocked
            </Badge>
          </div>

          <h1
            data-pandora-reveal
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            The Hidden
            <br />
            <span className="text-gradient-gold">Dimensions</span>
          </h1>

          <p
            data-pandora-reveal
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Beyond the code, beyond the cloud, beyond the databases—discover the
            diverse skills that make me a more complete engineer and creative.
          </p>

          {/* Talent Navigation */}
          <div data-pandora-reveal className="flex flex-wrap justify-center gap-4">
            {hiddenTalents.map((talent) => {
              const Icon = iconMap[talent.icon as keyof typeof iconMap] || Sparkles;
              return (
                <MagneticElement key={talent.category} strength={0.3}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(
                        talent.category.toLowerCase().replace(/\s+/g, "-")
                      );
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                      activeTalent === talent.category
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{talent.category}</span>
                  </button>
                </MagneticElement>
              );
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Talent Sections */}
      {hiddenTalents.map((talent, index) => {
        const Icon = iconMap[talent.icon as keyof typeof iconMap] || Sparkles;
        const details = talentDetails[talent.category as keyof typeof talentDetails];

        return (
          <section
            key={talent.category}
            id={talent.category.toLowerCase().replace(/\s+/g, "-")}
            data-talent-section
            className={`relative min-h-screen py-32 overflow-hidden`}
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${details?.bgGradient || "from-background to-background"}`}
            />

            <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content Side */}
                <div className={index % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                  {/* Category Badge */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${talent.color} p-0.5`}
                    >
                      <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground uppercase tracking-wider">
                        Hidden Talent #{index + 1}
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-bold">
                        {talent.category}
                      </h2>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="font-display text-2xl md:text-3xl font-semibold mb-6 text-gradient-gold">
                    {details?.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {details?.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Tools */}
                  <div className="mb-8">
                    <h4 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">
                      Tools & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {details?.tools.map((tool) => (
                        <span
                          key={tool}
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${talent.color} text-white text-xs font-medium`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground">
                    &ldquo;{details?.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Stats Side */}
                <div className={index % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
                  <div className="relative p-8 md:p-12 border border-border bg-card/50 backdrop-blur-sm rounded-3xl">
                    {/* Decorative gradient */}
                    <div
                      className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${talent.color} opacity-20`}
                    />

                    {/* Stats Grid */}
                    <div className="relative grid grid-cols-1 gap-8">
                      {details?.showcase.map((item, i) => (
                        <div
                          key={item.label}
                          className="text-center p-6 rounded-2xl bg-background/50 border border-border/50"
                        >
                          <div className="font-display text-5xl md:text-6xl font-bold mb-2">
                            {item.value}
                          </div>
                          <div className="text-muted-foreground uppercase tracking-wider text-sm">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Corner Accents */}
                    <div
                      className={`absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 rounded-tl-3xl bg-gradient-to-br ${talent.color} opacity-50`}
                      style={{ borderColor: "transparent" }}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 rounded-br-3xl bg-gradient-to-tl ${talent.color} opacity-50`}
                      style={{ borderColor: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Number */}
            <div className="absolute top-20 right-10 font-display text-[20rem] font-bold text-foreground/[0.02] select-none pointer-events-none leading-none">
              0{index + 1}
            </div>
          </section>
        );
      })}

      {/* Call to Action */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Impressed Yet?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            These diverse skills make me a more complete problem solver. Let&apos;s discuss
            how I can bring this unique perspective to your project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticElement strength={0.3}>
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/#contact">
                  Start a Conversation
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </MagneticElement>
            <MagneticElement strength={0.3}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6"
                asChild
              >
                <Link href="/">
                  Back to Portfolio
                </Link>
              </Button>
            </MagneticElement>
          </div>
        </div>
      </section>
    </div>
  );
}
