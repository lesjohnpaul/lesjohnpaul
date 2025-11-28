"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Folder, ExternalLink, Github, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { projects } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        "[data-project-header]",
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

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll("[data-project-card]");
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, rotateY: -5 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: index * 0.15,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-background" />
      <div className="absolute inset-0 grid-lines opacity-20" />

      {/* Decorative Elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div data-project-header>
              <Badge
                variant="outline"
                className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
              >
                <Folder className="w-4 h-4 mr-2" />
                Featured Work
              </Badge>
            </div>
            <h2 data-project-header className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Projects That <span className="text-gradient-gold">Matter</span>
            </h2>
            <p data-project-header className="text-lg text-muted-foreground leading-relaxed">
              Real solutions to real problems. Each project represents challenges
              overcome and value delivered.
            </p>
          </div>
          <div data-project-header>
            <MagneticElement strength={0.3}>
              <Button
                variant="outline"
                className="rounded-full gap-2 hover:border-primary/50 hover:bg-primary/5"
                asChild
              >
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </MagneticElement>
          </div>
        </div>

        {/* Projects Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Project (Large Card) */}
          {projects.filter((p) => p.featured).slice(0, 1).map((project) => (
            <MagneticElement key={project.title} strength={0.1} className="lg:col-span-2">
              <div
                data-project-card
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500"
              >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Folder className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                  {/* Placeholder for actual image */}
                  {/* <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary/10 text-primary border-0">
                    Featured Project
                  </Badge>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <MagneticElement strength={0.3}>
                      <Button
                        className="rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        asChild
                      >
                        <Link href={project.link}>
                          View Project
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </MagneticElement>
                    <MagneticElement strength={0.4}>
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <Link href="#">
                          <Github className="w-5 h-5" />
                        </Link>
                      </Button>
                    </MagneticElement>
                  </div>
                </div>
              </div>
            </div>
            </MagneticElement>
          ))}

          {/* Other Featured Projects */}
          {projects.filter((p) => p.featured).slice(1).map((project) => (
            <MagneticElement key={project.title} strength={0.15}>
              <div
                data-project-card
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 h-full"
              >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Folder className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2"
                    asChild
                  >
                    <Link href={project.link}>
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </MagneticElement>
          ))}
        </div>
      </div>
    </section>
  );
}
