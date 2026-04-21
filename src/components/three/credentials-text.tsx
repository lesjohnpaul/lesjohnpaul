"use client";

// Credentials 3D text — an extruded "LES" in gold that scroll-pins and rotates
// as you move through the Credentials section. Replaces the flat CSS watermark
// with something that reads as signature, not decoration.

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInViewFrameloop } from "@/hooks/useInViewFrameloop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GOLD = "#d4af37";
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

function ExtrudedMark() {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotation = useRef({ base: 0, scroll: 0 });

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#credentials",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        // Map scroll progress through the section to a -0.6 → 0.6 yaw sweep.
        rotation.current.scroll = (self.progress - 0.5) * 1.2;
      },
    });
    return () => st.kill();
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Slow constant rotation + scroll-driven yaw.
    rotation.current.base += delta * 0.18;
    meshRef.current.rotation.y =
      rotation.current.base + rotation.current.scroll;
    meshRef.current.rotation.x = Math.sin(rotation.current.base * 0.7) * 0.1;
  });

  return (
    <Center>
      <Text3D
        ref={meshRef}
        font={FONT_URL}
        size={2.2}
        height={0.55}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.06}
        bevelSize={0.035}
        bevelSegments={5}
      >
        LES
        <meshStandardMaterial
          color={GOLD}
          metalness={0.85}
          roughness={0.25}
          emissive={GOLD}
          emissiveIntensity={0.35}
        />
      </Text3D>
    </Center>
  );
}

export default function CredentialsText() {
  const [enabled, setEnabled] = useState(false);
  const { ref: gateRef, frameloop } = useInViewFrameloop<HTMLDivElement>();

  useEffect(() => {
    // Three conditions must all pass to mount a third WebGL context on this
    // page: motion is allowed, the viewport is wide enough to show the text
    // at a flattering size, and the device isn't low-power touch-only.
    const motionOk = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideOk = window.matchMedia("(min-width: 768px)");
    const fineOk = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => {
      setEnabled(!motionOk.matches && wideOk.matches && fineOk.matches);
    };
    update();

    motionOk.addEventListener("change", update);
    wideOk.addEventListener("change", update);
    fineOk.addEventListener("change", update);
    return () => {
      motionOk.removeEventListener("change", update);
      wideOk.removeEventListener("change", update);
      fineOk.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={gateRef} className="absolute inset-0 pointer-events-none">
      <Canvas
        className="!absolute inset-0"
        frameloop={frameloop}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 2]}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 3]} intensity={1.2} color={GOLD} />
        <pointLight position={[-4, -3, 2]} intensity={0.8} color="#a855f7" />
        <Suspense fallback={null}>
          <ExtrudedMark />
        </Suspense>
      </Canvas>
    </div>
  );
}
