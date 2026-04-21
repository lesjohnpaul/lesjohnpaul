"use client";

// Immersive WebGL hero background — a golden Tron-style grid floor with
// drifting particles and mouse parallax. Dark theme, thematic to Les's story
// of "powering the grid for 200K+ consumers."
//
// Performance notes:
// - Lazy-imported in hero-section.tsx via next/dynamic (ssr: false).
// - Respects `prefers-reduced-motion` by refusing to mount the canvas.
// - ~250 particles as a single buffer geometry; one drei Grid for the floor.
// - dpr clamped to [1, 2]; high-performance GL context.

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARTICLE_COUNT = 250;
const GOLD = "#d4af37";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = Math.random() * 0.004 + 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions, velocities };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const step = delta * 60;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      arr[ix] += velocities[ix] * step;
      arr[iy] += velocities[iy] * step;
      arr[iz] += velocities[iz] * step;

      // Loop vertically so the column never empties.
      if (arr[iy] > 5) arr[iy] = 0;

      // Soft horizontal wrap to keep the field visually contained.
      if (arr[ix] > 9) arr[ix] = -9;
      if (arr[ix] < -9) arr[ix] = 9;
      if (arr[iz] > 9) arr[iz] = -9;
      if (arr[iz] < -9) arr[iz] = 9;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function PulseRing() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const t = (state.clock.elapsedTime % 4) / 4; // 0 → 1 over 4s
    const scale = 0.5 + t * 8;
    ref.current.scale.set(scale, scale, 1);
    matRef.current.opacity = (1 - t) * 0.4;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 0]}>
      <ringGeometry args={[0.5, 0.55, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color={GOLD}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CameraDolly() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    // As the user scrolls into #skills, pull the camera forward and tilt it
    // downward — the hero grid visibly dives under you.
    const st = ScrollTrigger.create({
      trigger: "#skills",
      start: "top bottom",
      end: "top center",
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        camera.position.z = 5 - p * 2.6;
        camera.position.y = 0.6 + p * 1.6;
        camera.rotation.x = -p * 0.32;
        camera.updateProjectionMatrix();
      },
    });
    return () => st.kill();
  }, [camera]);

  return null;
}

function Scene() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.mouse;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      y * 0.12,
      0.04
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -x * 0.18,
      0.04
    );
  });

  return (
    <group ref={group}>
      <Grid
        args={[40, 40]}
        cellSize={0.4}
        cellThickness={0.4}
        cellColor={GOLD}
        sectionSize={2}
        sectionThickness={0.9}
        sectionColor={GOLD}
        fadeDistance={22}
        fadeStrength={1.8}
        followCamera={false}
        infiniteGrid
        position={[0, -1.5, 0]}
      />
      <PulseRing />
      <ParticleField />
    </group>
  );
}

export default function HeroGrid() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Defer the visible fade-in by one frame so the first GL render lands
    // before opacity kicks up — avoids a visible "pop" on slower devices.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        className="!absolute inset-0"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.6, 5], fov: 55 }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#0a0a0a", 5, 20]} />
        <Suspense fallback={null}>
          <CameraDolly />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
