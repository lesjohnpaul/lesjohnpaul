"use client";

import { useRef, useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  MapPin,
  Calendar,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { experience } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Career metrics for the journey
const careerMetrics = [
  { label: "Years Experience", value: "8+", icon: Calendar },
  { label: "Projects Delivered", value: "50+", icon: TrendingUp },
  { label: "Companies", value: "3", icon: Briefcase },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Header stagger animation
      gsap.fromTo(
        "[data-exp-header]",
        { opacity: 0, y: 60, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Metrics animation
      gsap.fromTo(
        "[data-metric]",
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-metrics]",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Main timeline progress line
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
            onUpdate: (self) => setScrollProgress(self.progress),
          },
        }
      );

      // Timeline items with 3D effect
      const items = timelineRef.current?.querySelectorAll("[data-exp-item]");
      items?.forEach((item, index) => {
        const direction = index % 2 === 0 ? -1 : 1;

        // Card entrance
        gsap.fromTo(
          item.querySelector("[data-card]"),
          {
            opacity: 0,
            x: 100 * direction,
            rotateY: 15 * direction,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Year badge pop
        gsap.fromTo(
          item.querySelector("[data-year]"),
          { scale: 0, rotate: -180 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            delay: 0.3,
          }
        );

        // Node pulse animation
        const node = item.querySelector("[data-node]");
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.6,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              delay: 0.2,
            }
          );
        }

        // Achievement items stagger
        const achievements = item.querySelectorAll("[data-achievement]");
        gsap.fromTo(
          achievements,
          { opacity: 0, x: 20 * direction, y: 10 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            delay: 0.5,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-32 overflow-hidden"
    >
      {/* Layered Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Large background text */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-bold text-foreground/[0.02] select-none pointer-events-none leading-none tracking-tighter">
        EXP
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div data-exp-header>
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6 backdrop-blur-sm"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Career Journey
            </Badge>
          </div>
          <h2
            data-exp-header
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Where I&apos;ve{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">Built & Grown</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M1 5.5C47.6667 2.16667 141.4 -2.3 199 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/40"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p
            data-exp-header
            className="text-lg text-muted-foreground leading-relaxed"
          >
            A track record of delivering impact across startups and enterprises,
            scaling systems from thousands to millions of users.
          </p>
        </div>

        {/* Career Metrics */}
        <div
          data-metrics
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mb-20"
        >
          {careerMetrics.map((metric, index) => (
            <MagneticElement key={metric.label} strength={0.2}>
              <div
                data-metric
                className="group relative p-4 md:p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 cursor-default"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <metric.icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {metric.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {metric.label}
                </div>
              </div>
            </MagneticElement>
          ))}
        </div>

        {/* Interactive Timeline */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          {/* Central Timeline Track */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-1">
            {/* Background track */}
            <div className="absolute inset-0 bg-border/50 rounded-full" />
            {/* Progress fill */}
            <div
              ref={progressRef}
              className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary/50 rounded-full origin-top"
              style={{ boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
            />
            {/* Glowing orb that follows progress */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full transition-all duration-300"
              style={{
                top: `${scrollProgress * 100}%`,
                boxShadow:
                  "0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.4)",
              }}
            >
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50" />
            </div>
          </div>

          {/* Experience Items */}
          <div className="space-y-16 md:space-y-24">
            {experience.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const isActive = activeIndex === index;

              return (
                <div
                  key={exp.role}
                  data-exp-item
                  className="relative"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {/* Timeline Node */}
                  <div
                    data-node
                    className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
                  >
                    {/* Outer ring */}
                    <div
                      className={`absolute w-11 h-11 rounded-full border-2 transition-all duration-500 ease-out ${
                        isActive
                          ? "border-primary/60 scale-100 opacity-100"
                          : "border-transparent scale-75 opacity-0"
                      }`}
                    />
                    {/* Inner node */}
                    <div
                      className={`relative w-5 h-5 rounded-full border-4 border-background transition-all duration-500 ease-out flex items-center justify-center ${
                        isActive ? "bg-primary scale-110" : "bg-card scale-100"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? "0 0 20px rgba(212, 175, 55, 0.6)"
                          : "none",
                      }}
                    >
                      <Sparkles
                        className={`w-2.5 h-2.5 text-primary-foreground transition-all duration-300 ${
                          isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content Layout */}
                  <div
                    className={`flex flex-col md:flex-row items-start gap-8 ${
                      isLeft ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Year Badge - Positioned on opposite side */}
                    <div
                      className={`hidden md:flex flex-1 ${
                        isLeft ? "justify-start pl-12" : "justify-end pr-12"
                      }`}
                    >
                      <div
                        data-year
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card/80 backdrop-blur-sm transition-all duration-500 ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono text-sm font-medium">
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {/* Main Card */}
                    <div
                      className={`flex-1 pl-20 md:pl-0 ${
                        isLeft ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <MagneticElement strength={0.08}>
                        <div
                          data-card
                          className="group relative"
                          style={{ perspective: "1000px" }}
                        >
                          {/* Card Container */}
                          <div
                            className={`relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur-sm transition-all duration-500 ${
                              isActive
                                ? "border-primary/50 shadow-2xl shadow-primary/10"
                                : "border-border hover:border-primary/30"
                            }`}
                            style={{
                              transform: isActive
                                ? "translateZ(20px)"
                                : "translateZ(0)",
                              transformStyle: "preserve-3d",
                            }}
                          >
                            {/* Gradient overlay on hover */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${
                                isLeft
                                  ? "from-transparent via-transparent to-primary/10"
                                  : "from-primary/10 via-transparent to-transparent"
                              } ${isActive ? "opacity-100" : "opacity-0"}`}
                            />

                            {/* Top accent line */}
                            <div
                              className={`absolute top-0 ${
                                isLeft ? "right-0" : "left-0"
                              } h-1 bg-gradient-to-r from-primary to-primary/50 transition-all duration-500 ${
                                isActive ? "w-full" : "w-0"
                              }`}
                            />

                            <div className="relative p-6 md:p-8">
                              {/* Mobile Period */}
                              <div className="md:hidden flex items-center gap-2 text-primary text-sm font-medium mb-3">
                                <Calendar className="w-4 h-4" />
                                {exp.period}
                              </div>

                              {/* Role Title */}
                              <h3
                                className={`font-display text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 flex items-center gap-3 ${
                                  isLeft
                                    ? "md:flex-row-reverse md:justify-start"
                                    : ""
                                } ${isActive ? "text-primary" : ""}`}
                              >
                                {exp.role}
                                <ChevronRight
                                  className={`w-5 h-5 transition-all duration-300 ${
                                    isActive
                                      ? "opacity-100 translate-x-0"
                                      : "opacity-0 -translate-x-2"
                                  } ${isLeft ? "md:rotate-180" : ""}`}
                                />
                              </h3>

                              {/* Company */}
                              <div
                                className={`flex items-center gap-2 mb-4 ${
                                  isLeft ? "md:justify-end" : ""
                                }`}
                              >
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground font-medium">
                                  {exp.company}
                                </span>
                                <ArrowUpRight
                                  className={`w-4 h-4 text-primary transition-all duration-300 ${
                                    isActive
                                      ? "opacity-100 translate-x-0 translate-y-0"
                                      : "opacity-0 -translate-x-1 translate-y-1"
                                  }`}
                                />
                              </div>

                              {/* Description */}
                              <p
                                className={`text-muted-foreground text-sm mb-6 leading-relaxed ${
                                  isLeft ? "md:text-right" : ""
                                }`}
                              >
                                {exp.description}
                              </p>

                              {/* Achievements */}
                              <div className="space-y-3">
                                {exp.achievements.map((achievement, achIndex) => (
                                  <div
                                    key={achievement}
                                    data-achievement
                                    className={`flex items-start gap-3 group/item ${
                                      isLeft ? "md:flex-row-reverse" : ""
                                    }`}
                                  >
                                    <div
                                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                          ? "bg-primary/20"
                                          : "bg-muted/50"
                                      }`}
                                    >
                                      <CheckCircle2
                                        className={`w-4 h-4 transition-colors duration-300 ${
                                          isActive
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    </div>
                                    <span
                                      className={`text-sm leading-relaxed transition-colors duration-300 ${
                                        isLeft ? "md:text-right" : ""
                                      } ${
                                        isActive
                                          ? "text-foreground"
                                          : "text-foreground/70"
                                      }`}
                                    >
                                      {achievement}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Bottom decorative element */}
                              <div
                                className={`absolute bottom-0 ${
                                  isLeft ? "left-0" : "right-0"
                                } w-24 h-24 opacity-5 pointer-events-none`}
                              >
                                <div className="absolute inset-0 border-2 border-current rounded-full" />
                                <div className="absolute inset-4 border border-current rounded-full" />
                              </div>
                            </div>
                          </div>

                          {/* Floating index number */}
                          <div
                            className={`absolute -top-3 ${
                              isLeft ? "-left-3 md:-right-3 md:left-auto" : "-left-3"
                            } w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                              isActive
                                ? "border-primary text-primary scale-110"
                                : "border-border text-muted-foreground"
                            }`}
                            style={{
                              boxShadow: isActive
                                ? "0 4px 20px rgba(212, 175, 55, 0.3)"
                                : "none",
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>
                        </div>
                      </MagneticElement>
                    </div>
                  </div>

                  {/* Connection line to node (mobile) */}
                  <div
                    className={`absolute left-8 top-2 w-12 h-0.5 bg-gradient-to-r md:hidden ${
                      isActive
                        ? "from-primary to-transparent"
                        : "from-border to-transparent"
                    } transition-colors duration-300`}
                    style={{ transform: "translateX(-50%)" }}
                  />
                </div>
              );
            })}
          </div>

          {/* End node */}
          <div className="absolute left-8 md:left-1/2 -translate-x-1/2 -bottom-4">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-primary/30 animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/20 animate-ping" />
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <p className="text-muted-foreground mb-4">
            Interested in working together?
          </p>
          <MagneticElement strength={0.3}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all duration-300 group"
            >
              Let&apos;s connect
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </a>
          </MagneticElement>
        </div>
      </div>
    </section>
  );
}
