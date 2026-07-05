"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Download,
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { useTheme } from "./theme-provider";
import { navigationItems, personalInfo } from "@/data/portfolio-data";
import { cn } from "@/lib/utils";

type IndicatorRect = { left: number; width: number } | null;

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoverIndicator, setHoverIndicator] = useState<IndicatorRect>(null);
  const [activeIndicator, setActiveIndicator] = useState<IndicatorRect>(null);

  const navListRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const measureItem = useCallback((el: HTMLAnchorElement | null): IndicatorRect => {
    if (!el || !navListRef.current) return null;
    const parentRect = navListRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { left: rect.left - parentRect.left, width: rect.width };
  }, []);

  // Recompute the active indicator when the route changes or on resize
  useEffect(() => {
    const compute = () => {
      const idx = navigationItems.findIndex((it) => it.href === pathname);
      if (idx === -1) {
        setActiveIndicator(null);
        return;
      }
      setActiveIndicator(measureItem(itemRefs.current[idx]));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [pathname, measureItem]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/40 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]"
            : "bg-transparent py-5"
        )}
      >
        {/* Scroll progress bar */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-0 h-px bg-border/30 overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <nav className="container mx-auto px-5 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <MagneticElement strength={0.3}>
            <Link
              href="/"
              className="group flex items-center gap-3 font-display text-xl font-bold tracking-tight"
              aria-label="Home"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/25 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
                <span className="text-gradient-gold font-bold text-lg">L</span>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="text-foreground text-[15px]">
                  {personalInfo.name.split(" ")[0]}
                  <span className="text-primary">.</span>
                </span>
                <span className="hidden md:inline text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/80">
                  Solutions Architect
                </span>
              </span>
            </Link>
          </MagneticElement>

          {/* Desktop Navigation */}
          <div
            ref={navListRef}
            onMouseLeave={() => setHoverIndicator(null)}
            className="relative hidden lg:flex items-center gap-1 rounded-full border border-border/40 bg-card/40 backdrop-blur-md px-1.5 py-1.5"
          >
            {/* Hover pill */}
            <span
              aria-hidden
              className={cn(
                "absolute top-1.5 bottom-1.5 rounded-full bg-muted/60 transition-all duration-300 ease-out pointer-events-none",
                hoverIndicator ? "opacity-100" : "opacity-0"
              )}
              style={{
                left: hoverIndicator?.left ?? 0,
                width: hoverIndicator?.width ?? 0,
              }}
            />
            {/* Active pill */}
            <span
              aria-hidden
              className={cn(
                "absolute top-1.5 bottom-1.5 rounded-full bg-primary/12 ring-1 ring-primary/25 transition-all duration-500 ease-out pointer-events-none",
                activeIndicator ? "opacity-100" : "opacity-0"
              )}
              style={{
                left: activeIndicator?.left ?? 0,
                width: activeIndicator?.width ?? 0,
              }}
            />

            {navigationItems.map((item, i) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onMouseEnter={(e) =>
                    setHoverIndicator(measureItem(e.currentTarget))
                  }
                  className={cn(
                    "relative z-10 px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <MagneticElement strength={0.4}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="rounded-full border border-transparent hover:border-border/60 hover:bg-muted/50"
              >
                <span className="relative block h-5 w-5">
                  <Sun
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-500",
                      mounted && resolvedTheme === "dark"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-50"
                    )}
                  />
                  <Moon
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-500",
                      mounted && resolvedTheme !== "dark"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-50"
                    )}
                  />
                </span>
              </Button>
            </MagneticElement>

            <MagneticElement strength={0.3}>
              <Button
                asChild
                className="group relative rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 pl-4 pr-3 overflow-hidden"
              >
                <a href={personalInfo.resumeUrl} download>
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="font-medium">Resume</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700"
                  />
                </a>
              </Button>
            </MagneticElement>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              <span className="relative block h-5 w-5">
                <Sun
                  className={cn(
                    "absolute inset-0 h-5 w-5 transition-all duration-500",
                    mounted && resolvedTheme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-50"
                  )}
                />
                <Moon
                  className={cn(
                    "absolute inset-0 h-5 w-5 transition-all duration-500",
                    mounted && resolvedTheme !== "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-50"
                  )}
                />
              </span>
            </Button>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className={cn(
                "relative h-11 w-11 rounded-full border border-border/50 bg-card/60 backdrop-blur-md transition-all duration-300",
                "hover:border-primary/50 hover:bg-primary/5 active:scale-95",
                isOpen && "border-primary/60 bg-primary/10"
              )}
            >
              <span className="sr-only">Toggle menu</span>
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block h-4 w-5"
              >
                <span
                  className={cn(
                    "absolute left-0 right-0 block h-[2px] rounded-full bg-foreground transition-all duration-300 ease-out",
                    isOpen
                      ? "top-1/2 -translate-y-1/2 rotate-45 bg-primary"
                      : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 right-0 top-1/2 block h-[2px] -translate-y-1/2 rounded-full bg-foreground transition-all duration-300 ease-out",
                    isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 right-0 block h-[2px] rounded-full bg-foreground transition-all duration-300 ease-out",
                    isOpen
                      ? "top-1/2 -translate-y-1/2 -rotate-45 bg-primary"
                      : "bottom-0"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <MobileMenu
        open={isOpen}
        onClose={() => setIsOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-40 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Panel */}
      <div
        className={cn(
          "absolute inset-x-3 top-20 bottom-3 rounded-3xl border border-border/50 bg-card/95 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-[0.98]"
        )}
      >
        {/* Decorative gradient mesh */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-lines-subtle opacity-40"
        />

        <div className="relative flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Menu
              </p>
              <p className="font-display text-lg font-semibold mt-0.5">
                <span className="text-gradient-gold">Navigate</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available
            </div>
          </div>

          {/* Items */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="flex flex-col">
              {navigationItems.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <li
                    key={item.href}
                    className={cn(
                      "transition-all duration-500",
                      open
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3"
                    )}
                    style={{
                      transitionDelay: open
                        ? `${120 + i * 60}ms`
                        : "0ms",
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300",
                        "hover:bg-muted/50 active:scale-[0.99]",
                        isActive && "bg-primary/8"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-xs tabular-nums",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/70"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-2xl font-semibold tracking-tight transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary"
                        )}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                      <ArrowUpRight
                        className={cn(
                          "ml-auto h-5 w-5 -translate-x-1 opacity-0 transition-all duration-300",
                          "group-hover:translate-x-0 group-hover:opacity-100 text-primary",
                          isActive && "hidden"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div
            className={cn(
              "border-t border-border/40 px-6 py-5 space-y-4 transition-all duration-500",
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              transitionDelay: open
                ? `${120 + navigationItems.length * 60}ms`
                : "0ms",
            }}
          >
            <Button
              asChild
              size="lg"
              className="group relative w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 overflow-hidden"
            >
              <a href={personalInfo.resumeUrl} download onClick={onClose}>
                <Download className="h-4 w-4" />
                <span className="font-semibold">Download Resume</span>
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700"
                />
              </a>
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SocialIcon
                  href={`mailto:${personalInfo.email}`}
                  label="Email"
                >
                  <Mail className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon
                  href={personalInfo.social.github}
                  label="GitHub"
                  external
                >
                  <Github className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon
                  href={personalInfo.social.linkedin}
                  label="LinkedIn"
                  external
                >
                  <Linkedin className="h-4 w-4" />
                </SocialIcon>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {personalInfo.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
  external,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background/40 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
    >
      {children}
    </a>
  );
}
