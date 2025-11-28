"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Mic,
  Briefcase,
  Server,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { photoGallery, personalInfo } from "@/data/portfolio-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  { id: "all", label: "All Photos", icon: Camera },
  { id: "speaking", label: "Speaking", icon: Mic },
  { id: "work", label: "Office & Work", icon: Briefcase },
  { id: "deployment", label: "Deployments", icon: Server },
  { id: "creative", label: "Creative", icon: Camera },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? photoGallery
      : photoGallery.filter((photo) => photo.category === activeCategory);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        "[data-gallery-header]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // Photos animation
      gsap.fromTo(
        "[data-gallery-item]",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handlePrevious = () => {
    if (selectedImage === null) return;
    setSelectedImage(
      selectedImage === 0 ? filteredPhotos.length - 1 : selectedImage - 1
    );
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    setSelectedImage(
      selectedImage === filteredPhotos.length - 1 ? 0 : selectedImage + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredPhotos.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 grid-lines-subtle opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="font-display font-bold">
            {personalInfo.name.split(" ")[0]}
            <span className="text-primary">.</span>
          </span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div data-gallery-header>
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-full border-primary/30 bg-primary/5 text-primary mb-6"
            >
              <Camera className="w-4 h-4 mr-2" />
              Photo Gallery
            </Badge>
          </div>
          <h1 data-gallery-header className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            In the <span className="text-gradient-gold">Field</span>
          </h1>
          <p data-gallery-header className="text-lg text-muted-foreground leading-relaxed">
            Moments captured across speaking engagements, office work, deployments,
            and creative sessions. The journey behind the code.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
          <TabsList className="bg-card/50 border border-border p-1 rounded-xl flex-wrap h-auto gap-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.src}
              data-gallery-item
              onClick={() => setSelectedImage(index)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-card border border-border"
            >
              {/* Placeholder for actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground/30" />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium mb-1">{photo.caption}</p>
                  <Badge variant="secondary" className="text-xs">
                    {categories.find((c) => c.id === photo.category)?.label}
                  </Badge>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground">
              Photos in this category will appear here soon.
            </p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0 bg-black/95 border-0">
          {selectedImage !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Navigation */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Image */}
              <div className="relative w-full h-full max-w-4xl max-h-[80vh] m-8 flex items-center justify-center">
                <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <Camera className="w-24 h-24 text-white/30" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-center font-medium">
                  {filteredPhotos[selectedImage]?.caption}
                </p>
                <p className="text-white/60 text-center text-sm mt-1">
                  {selectedImage + 1} / {filteredPhotos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
