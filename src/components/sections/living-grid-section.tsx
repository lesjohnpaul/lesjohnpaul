"use client";

import { useEffect, useRef, useState } from "react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { X, ExternalLink, Lock, Zap, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/portfolio-data";
import type { GridNodeDef } from "@/components/three/grid-canvas";

const PandoraDimension = nextDynamic(
  () => import("@/components/sections/pandora-dimension").then((m) => m.PandoraDimension),
  { ssr: false, loading: () => <div className="fixed inset-0 z-[100] bg-[#08060f]" /> }
);

// How long the camera dives into the box before the other dimension takes over.
const DIVE_MS = 1150;

const GridCanvas = nextDynamic(() => import("@/components/three/grid-canvas"), {
  ssr: false,
  loading: () => <GridLoading />,
});

// Each node maps to a real project in portfolio-data by exact title.
const NODE_MAP: (GridNodeDef & { projectTitle: string })[] = [
  {
    id: "core",
    label: "GRID CORE",
    sub: "HCI · 1.17TB SQL · 250K MEMBERS",
    position: [0, 0, 0],
    kind: "hub",
    projectTitle: "HCI Server Infrastructure",
  },
  {
    id: "azure",
    label: "AZURE HYBRID",
    sub: "₱14.95M MIGRATION",
    position: [-5.2, 0, -2.8],
    kind: "substation",
    projectTitle: "Azure Hybrid Cloud Migration",
  },
  {
    id: "agam",
    label: "AGAM",
    sub: "13K ATTENDEES · 5 VENUES",
    position: [4.8, 0, -3.4],
    kind: "substation",
    projectTitle: "AGAM Distributed Registration",
  },
  {
    id: "acirs",
    label: "ACIRS",
    sub: "AI OMNICHANNEL CRM",
    position: [-6.2, 0, 1.8],
    kind: "substation",
    projectTitle: "ACIRS: AI Omnichannel CRM",
  },
  {
    id: "ndr",
    label: "NDR SENTINEL",
    sub: "EAST-WEST DETECTION",
    position: [-2.6, 0, 4.8],
    kind: "substation",
    projectTitle: "Internal NDR-Class Network Detection",
  },
  {
    id: "mrms",
    label: "MRMS",
    sub: "LEGACY → MODERN, LIVE DB",
    position: [2.4, 0, 4.9],
    kind: "substation",
    projectTitle: "MRMS: Meter Reading Management",
  },
  {
    id: "wesm",
    label: "WESM AUTOMATION",
    sub: "1 WORKDAY → 30 SECONDS",
    position: [6.4, 0, 1.6],
    kind: "substation",
    projectTitle: "IEMOP WESM Invoice Automation",
  },
  {
    id: "invoicing",
    label: "BULK INVOICING",
    sub: "183K CONSUMERS · AWS SES",
    position: [-1.6, 0, -5.6],
    kind: "substation",
    projectTitle: "Bulk Email Invoicing System",
  },
  {
    id: "sneaker",
    label: "SNEAKER SYMPHONY",
    sub: "SOLO MARKETPLACE",
    position: [10.8, 0, -0.8],
    kind: "offgrid",
    projectTitle: "Sneaker Symphony Marketplace",
  },
  {
    id: "focuscanvas",
    label: "FOCUSCANVAS",
    sub: "TAURI + RUST DESKTOP",
    position: [11.6, 0, 3.2],
    kind: "offgrid",
    projectTitle: "FocusCanvas: Desktop SaaS",
  },
];

const LINKS: [string, string][] = NODE_MAP.filter(
  (n) => n.kind === "substation"
).map((n) => ["core", n.id]);

function GridLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0e1016]">
      <div className="flex items-center gap-3 font-mono text-sm text-[#8a6d1f]">
        <Zap className="h-4 w-4 animate-pulse" />
        Energizing grid…
      </div>
    </div>
  );
}

export function LivingGridSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [box, setBox] = useState<"sealed" | "diving" | "inside">("sealed");
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (box !== "diving") return;
    const id = setTimeout(() => setBox("inside"), DIVE_MS);
    return () => clearTimeout(id);
  }, [box]);

  const openBox = () => {
    if (box !== "sealed") return;
    void import("@/components/sections/pandora-dimension");
    setSelectedId(null);
    setBox(reducedMotion ? "inside" : "diving");
  };

  const selectedNode = NODE_MAP.find((n) => n.id === selectedId) ?? null;
  const selectedProject = selectedNode
    ? projects.find((p) => p.title === selectedNode.projectTitle) ?? null
    : null;

  return (
    <section
      id="grid"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0e1016] text-white"
    >
      {/* Ease from the themed page background into the fixed dark band */}
      <div className="h-24 w-full bg-gradient-to-b from-background to-transparent" />

      {/* Header */}
      <div className="container mx-auto px-6 pt-4 pb-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.35em] text-[#d4af37]">
            LIVE SYSTEMS MAP
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
        </div>
        <h2 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          The Living Grid
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
          I architect systems for an electric cooperative serving{" "}
          <span className="text-zinc-200">250,000+ members</span>, so here is my
          work, mapped as the grid it powers. Every substation is a real
          production system.{" "}
          <span className="text-[#d4af37]">Click one to inspect it.</span> One
          thing here is not on any map.
        </p>
      </div>

      {/* Canvas */}
      <div className="relative h-[70vh] min-h-[480px] w-full">
        {inView ? (
          <GridCanvas
            nodes={NODE_MAP}
            links={LINKS}
            selectedId={selectedId}
            onSelect={setSelectedId}
            animated={!reducedMotion}
            boxOpen={box !== "sealed"}
            paused={box === "inside"}
            onOpenBox={openBox}
          />
        ) : (
          <GridLoading />
        )}

        {/* Interaction hint */}
        <div className="pointer-events-none absolute bottom-4 left-6 hidden font-mono text-[11px] tracking-widest text-zinc-500 sm:block">
          DRAG TO ORBIT · CLICK A SUBSTATION
        </div>

        {/* Keyboard and touch path into the box (the canvas itself is not focusable) */}
        {box === "sealed" && !selectedNode && (
          <button
            onClick={openBox}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-[#a78bfa]/40 bg-[#120e1f]/80 px-4 py-2 text-sm text-[#ddd2ff] backdrop-blur transition-colors hover:border-[#c4b5fd] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd] sm:right-6"
          >
            <Box className="h-4 w-4" aria-hidden />
            Open Pandora&apos;s box
          </button>
        )}

        {/* Case study panel */}
        {selectedNode && selectedProject && (
          <div className="absolute inset-x-4 bottom-4 max-h-[65%] overflow-y-auto border border-[#d4af37]/25 bg-[#12151d]/95 p-6 backdrop-blur-md md:inset-x-auto md:bottom-auto md:right-6 md:top-6 md:max-h-[calc(100%-3rem)] md:w-96">
            <button
              onClick={() => setSelectedId(null)}
              aria-label="Close details"
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="font-mono text-[10px] tracking-[0.3em] text-[#d4af37]">
              {selectedNode.kind === "hub"
                ? "GRID CORE"
                : selectedNode.kind === "offgrid"
                  ? "OFF-GRID · SOLO VENTURE"
                  : "SUBSTATION"}
            </div>
            <h3 className="font-display mt-2 text-xl font-bold leading-tight">
              {selectedProject.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {selectedProject.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedProject.tech.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="border-[#d4af37]/30 bg-transparent font-mono text-[10px] text-zinc-300"
                >
                  {t}
                </Badge>
              ))}
            </div>

            <div className="mt-5">
              {selectedProject.link !== "#" ? (
                <Link
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#d4af37] transition-colors hover:text-[#f5d476]"
                >
                  VIEW LIVE <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ) : selectedProject.private ? (
                <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500">
                  <Lock className="h-3 w-3" /> PRIVATE EMPLOYER SYSTEM · SHOWN
                  FOR DEMONSTRATION
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {box === "inside" && (
        <PandoraDimension reducedMotion={reducedMotion} onClose={() => setBox("sealed")} />
      )}

      {/* Ease back out into the themed page background */}
      <div className="h-24 w-full bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
