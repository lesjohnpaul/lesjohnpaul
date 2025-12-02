"use client";

import { useRef, useEffect, useState } from "react";
import {
  Send,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Zap,
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo(
        "[data-contact-badge]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        "[data-contact-title]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          delay: 0.1,
        }
      );

      gsap.fromTo(
        "[data-contact-subtitle]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          delay: 0.2,
        }
      );

      // Left side content
      gsap.fromTo(
        "[data-info-item]",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          delay: 0.3,
        }
      );

      gsap.fromTo(
        "[data-social-icon]",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          delay: 0.5,
        }
      );

      // Form animations
      gsap.fromTo(
        "[data-form-container]",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          delay: 0.2,
        }
      );

      gsap.fromTo(
        "[data-form-field]",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          delay: 0.4,
        }
      );

      // Floating line animation
      gsap.to("[data-float-line]", {
        scaleX: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        delay: 0.6,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Subtle form feedback
    gsap.to(formRef.current, {
      scale: 0.995,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFormState({ name: "", email: "", message: "" });
    setIsSubmitting(false);
    alert("Message sent! I'll get back to you soon.");
  };

  const socialLinks = [
    { icon: Github, href: personalInfo.social.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: personalInfo.social.twitter, label: "Twitter" },
  ];

  const highlights = [
    { icon: Clock, text: "Quick Response" },
    { icon: MessageSquare, text: "Clear Communication" },
    { icon: Zap, text: "Fast Delivery" },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 overflow-hidden"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      {/* Minimal grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div data-contact-badge>
              <Badge
                variant="outline"
                className="px-4 py-2 rounded-full border-primary/20 bg-primary/5 text-primary mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Let&apos;s Connect
              </Badge>
            </div>
            <h2
              data-contact-title
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Start a{" "}
              <span className="text-gradient-gold">Conversation</span>
            </h2>
            <p
              data-contact-subtitle
              className="text-muted-foreground max-w-lg mx-auto"
            >
              Have a project in mind? I&apos;d love to hear about it.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Direct Contact */}
              <div data-info-item className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Get in Touch</h3>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="group flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {personalInfo.email}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                    <p className="font-medium">{personalInfo.location}</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div data-info-item className="space-y-3">
                <h3 className="font-display text-lg font-semibold">What to Expect</h3>
                <div className="space-y-2">
                  {highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card/30"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div data-info-item className="space-y-3">
                <h3 className="font-display text-lg font-semibold">Connect</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <MagneticElement key={label} strength={0.3}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-social-icon
                        className="group w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      </a>
                    </MagneticElement>
                  ))}
                </div>
              </div>

              {/* Decorative line */}
              <div
                data-float-line
                className="hidden lg:block h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent origin-left scale-x-0"
              />
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-3" data-form-container>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-8 rounded-3xl bg-card/40 border border-border backdrop-blur-sm"
              >
                <div className="space-y-5">
                  {/* Name Field */}
                  <div data-form-field>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        focusedField === "name" ? "text-primary" : ""
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div data-form-field>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        focusedField === "email" ? "text-primary" : ""
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Message Field */}
                  <div data-form-field>
                    <label
                      htmlFor="message"
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        focusedField === "message" ? "text-primary" : ""
                      }`}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-300 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div data-form-field className="pt-2">
                    <MagneticElement strength={0.15}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl py-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
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

                  {/* Simple trust indicator */}
                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    I typically respond within 24 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
