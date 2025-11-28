"use client";

import { useRef, useEffect, useState } from "react";
import {
  Send,
  Mail,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { personalInfo } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-reveal]",
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset form
    setFormState({ name: "", email: "", message: "" });
    setIsSubmitting(false);

    // Show success (you'd replace this with actual form handling)
    alert("Message sent! I'll get back to you soon.");
  };

  const socialLinks = [
    { icon: Github, href: personalInfo.social.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: personalInfo.social.twitter, label: "Twitter" },
  ];

  const contactInfo = [
    { icon: Mail, label: "Email", value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: MapPin, label: "Location", value: personalInfo.location },
    { icon: Clock, label: "Status", value: personalInfo.availability },
  ];

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 grid-lines opacity-20" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div data-contact-reveal>
              <Badge
                variant="outline"
                className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
              >
                <Send className="w-4 h-4 mr-2" />
                Get in Touch
              </Badge>
            </div>
            <h2 data-contact-reveal className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let&apos;s Build Something{" "}
              <span className="text-gradient-gold">Great</span>
            </h2>
            <p data-contact-reveal className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? Looking for a technical partner? I&apos;m always open
              to discussing new opportunities and interesting challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info Side */}
            <div data-contact-reveal className="space-y-8">
              {/* Quick Info Cards */}
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <MagneticElement key={info.label} strength={0.15}>
                    <div
                      className="group flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </MagneticElement>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Connect with me
                </h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <MagneticElement key={label} strength={0.4}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-12 h-12 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    </MagneticElement>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <MagneticElement strength={0.1}>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-card border border-primary/20">
                  <h3 className="font-display text-xl font-bold mb-2">
                    Prefer a quick call?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Schedule a 30-minute discovery call to discuss your project.
                  </p>
                  <MagneticElement strength={0.3}>
                    <Button
                      variant="outline"
                      className="rounded-full gap-2 hover:border-primary/50 hover:bg-primary/5"
                      asChild
                    >
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Schedule a Call
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </MagneticElement>
                </div>
              </MagneticElement>
            </div>

            {/* Contact Form */}
            <div data-contact-reveal>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
              >
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <MagneticElement strength={0.2}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-gold-subtle gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </MagneticElement>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
