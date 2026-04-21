"use client";

// Pandora 3D Core — a distorted golden icosahedron at the center with
// 5 orbiting talent nodes connected by glowing lines. Replaces the previous
// CSS-gradient orb and CSS-orbital rings with a single cohesive WebGL scene.
//
// Uses the same prefers-reduced-motion + dynamic import pattern as hero-grid.

import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { hiddenTalents } from "@/data/portfolio-data";
import { useInViewFrameloop } from "@/hooks/useInViewFrameloop";

const GOLD = "#d4af37";

// Map a Tailwind "from-<color>-500" gradient key to a concrete hex value
// so Three.js materials have something numeric to consume.
const TALENT_COLORS: Record<string, string> = {
  purple: "#a855f7",
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  cyan: "#06b6d4",
  pink: "#ec4899",
};

function colorFromGradient(gradient: string): string {
  const match = gradient.match(/from-(\w+)-/);
  if (match && TALENT_COLORS[match[1]]) return TALENT_COLORS[match[1]];
  return GOLD;
}

function Crystal({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * (hovered ? 0.6 : 0.25);
    meshRef.current.rotation.y += delta * (hovered ? 0.4 : 0.18);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.9, 4]} />
      {/* drei's MeshDistortMaterial wraps a shader-based wobble — feels alive */}
      <MeshDistortMaterial
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={hovered ? 1.4 : 0.75}
        roughness={0.18}
        metalness={0.9}
        distort={hovered ? 0.55 : 0.32}
        speed={hovered ? 3.5 : 1.6}
      />
    </mesh>
  );
}

type TalentNodeProps = {
  angle: number;
  radius: number;
  color: string;
  vertical: number;
  speedScale: number;
};

function TalentNode({ angle, radius, color, vertical, speedScale }: TalentNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.25 * speedScale;
    const a = angle + t;
    groupRef.current.position.x = Math.cos(a) * radius;
    groupRef.current.position.y = Math.sin(a * 0.6 + angle) * vertical;
    groupRef.current.position.z = Math.sin(a) * radius;

    if (haloRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + angle) * 0.12;
      haloRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* core dot */}
      <mesh>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* soft halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

type ConstellationLineProps = {
  angle: number;
  radius: number;
  color: string;
  vertical: number;
  speedScale: number;
};

function ConstellationLine({
  angle,
  radius,
  color,
  vertical,
  speedScale,
}: ConstellationLineProps) {
  const lineRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<[THREE.Vector3, THREE.Vector3]>([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]);

  // Recompute the line's second point every frame to track the node.
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.25 * speedScale;
    const a = angle + t;
    pointsRef.current[1].set(
      Math.cos(a) * radius,
      Math.sin(a * 0.6 + angle) * vertical,
      Math.sin(a) * radius
    );

    if (lineRef.current) {
      const line = lineRef.current.children[0] as THREE.Line | undefined;
      if (line && line.geometry) {
        line.geometry.setFromPoints(pointsRef.current);
      }
    }
  });

  const initialPoints = useMemo<[THREE.Vector3, THREE.Vector3]>(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(radius, 0, 0)],
    [radius]
  );

  return (
    <group ref={lineRef}>
      <Line
        points={initialPoints}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.35}
      />
    </group>
  );
}

function TalentsReveal({
  hovered,
  nodes,
}: {
  hovered: boolean;
  nodes: Array<{
    angle: number;
    radius: number;
    color: string;
    vertical: number;
    speedScale: number;
  }>;
}) {
  // One group wraps every talent node + line. Scaling the group from 0 → 1
  // on hover gives us the old "hover to reveal" reveal animation in 3D.
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 1 : 0;
    const next = THREE.MathUtils.damp(ref.current.scale.x, target, 6, delta);
    ref.current.scale.setScalar(next);
    ref.current.visible = next > 0.001; // skip draw when fully collapsed
  });

  return (
    <group ref={ref} scale={0}>
      {nodes.map((node, i) => (
        <ConstellationLine
          key={`line-${i}`}
          angle={node.angle}
          radius={node.radius}
          color={node.color}
          vertical={node.vertical}
          speedScale={node.speedScale}
        />
      ))}
      {nodes.map((node, i) => (
        <TalentNode
          key={`node-${i}`}
          angle={node.angle}
          radius={node.radius}
          color={node.color}
          vertical={node.vertical}
          speedScale={node.speedScale}
        />
      ))}
    </group>
  );
}

function Scene({ hovered }: { hovered: boolean }) {
  const sceneRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return hiddenTalents.slice(0, 5).map((talent, i, arr) => ({
      angle: (i / arr.length) * Math.PI * 2,
      radius: 2.2 + (i % 2 === 0 ? 0.15 : -0.15),
      color: colorFromGradient(talent.color),
      vertical: 0.4 + (i % 3) * 0.1,
      speedScale: 0.85 + (i % 4) * 0.1,
    }));
  }, []);

  useFrame((state) => {
    if (!sceneRef.current) return;
    // gentle parallax so the whole constellation responds to the mouse
    const { x, y } = state.mouse;
    sceneRef.current.rotation.x = THREE.MathUtils.lerp(
      sceneRef.current.rotation.x,
      y * 0.15,
      0.04
    );
    sceneRef.current.rotation.y = THREE.MathUtils.lerp(
      sceneRef.current.rotation.y,
      -x * 0.2 + state.clock.elapsedTime * 0.04,
      0.04
    );
  });

  return (
    <group ref={sceneRef}>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 3]} intensity={2} color={GOLD} />
      <pointLight
        position={[-3, 2, 1]}
        intensity={hovered ? 1.2 : 0.6}
        color="#a855f7"
      />
      <pointLight
        position={[3, -2, -1]}
        intensity={hovered ? 1 : 0.5}
        color="#3b82f6"
      />

      <Crystal hovered={hovered} />

      <TalentsReveal hovered={hovered} nodes={nodes} />
    </group>
  );
}

type PandoraCoreProps = {
  onHoverChange?: (hovered: boolean) => void;
  className?: string;
};

export default function PandoraCore({ onHoverChange, className }: PandoraCoreProps) {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { ref: gateRef, frameloop } = useInViewFrameloop<HTMLDivElement>();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleEnter = () => {
    setHovered(true);
    onHoverChange?.(true);
  };
  const handleLeave = () => {
    setHovered(false);
    onHoverChange?.(false);
  };

  if (!enabled) return null;

  return (
    <div
      ref={gateRef}
      className={className ?? "absolute inset-0"}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Canvas itself is decorative — pointerEvents:none skips R3F's
          per-mousemove raycast entirely; hover still works via the outer
          div above. */}
      <Canvas
        className="!absolute inset-0"
        frameloop={frameloop}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 2]}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <Scene hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
