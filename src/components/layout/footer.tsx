"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import { personalInfo, navigationItems } from "@/data/portfolio-data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: personalInfo.social.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: personalInfo.social.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <footer className="relative border-t border-border bg-card/50">
      {/* Decorative Grid */}
      <div className="absolute inset-0 grid-lines-subtle pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">
                {personalInfo.name.split(" ")[0]}
                <span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              {personalInfo.tagline}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {navigationItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Get in Touch
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <p>{personalInfo.location}</p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="block hover:text-primary transition-colors"
              >
                {personalInfo.email}
              </a>
              <p className="text-primary font-medium">{personalInfo.availability}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using Next.js & GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
