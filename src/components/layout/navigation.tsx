"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MagneticElement } from "@/components/ui/magnetic-element";
import { useTheme } from "./theme-provider";
import { navigationItems, personalInfo } from "@/data/portfolio-data";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3"
          : "bg-transparent py-6"
      )}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <MagneticElement strength={0.3}>
          <Link
            href="/"
            className="group flex items-center gap-3 font-display text-xl font-bold tracking-tight"
          >
            <div className="relative w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden group-hover:border-primary/40 transition-colors">
              <span className="text-gradient-gold font-bold text-lg">L</span>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="hidden sm:block">
              <span className="text-foreground">{personalInfo.name.split(" ")[0]}</span>
              <span className="text-primary">.</span>
            </span>
          </Link>
        </MagneticElement>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item) => (
            <MagneticElement key={item.href} strength={0.25}>
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            </MagneticElement>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <MagneticElement strength={0.4}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg hover:bg-muted/50"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </MagneticElement>

          <MagneticElement strength={0.3}>
            <Button
              asChild
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <a href={personalInfo.resumeUrl} download>
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Button>
          </MagneticElement>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full pt-8">
                <nav className="flex flex-col gap-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300",
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pb-8">
                  <Button
                    asChild
                    className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    <a href={personalInfo.resumeUrl} download>
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
