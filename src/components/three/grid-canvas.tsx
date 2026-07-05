"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type GridNodeDef = {
  id: string;
  label: string;
  sub: string;
  position: [number, number, number];
  kind: "hub" | "substation" | "offgrid";
};

const BG = "#0e1016";
const GOLD = "#d4af37";
const EMBER = "#f5d476";
const COLUMN = "#1c2130";
const LINE_DIM = "#2c3242";

const HOME_CAM = new THREE.Vector3(9, 7.5, 11);
const HOME_TARGET = new THREE.Vector3(1.4, 0.4, 0);
const FOCUS_OFFSET = new THREE.Vector3(4.4, 3.2, 5.0);

function nodeHeight(kind: GridNodeDef["kind"]) {
  return kind === "hub" ? 1.7 : 0.95;
}

function GridNodeMesh({
  node,
  selected,
  animated,
  onSelect,
}: {
  node: GridNodeDef;
  selected: boolean;
  animated: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const headRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const h = nodeHeight(node.kind);
  const headSize = node.kind === "hub" ? 0.34 : 0.2;
  const active = hovered || selected;

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = t * (active ? 1.6 : 0.4);
      headRef.current.position.y = h + 0.3 + Math.sin(t * 1.5 + node.position[0]) * 0.05;
    }
    if (ringRef.current) ringRef.current.rotation.z = t * 0.3;
  });

  return (
    <group
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* pylon column */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[0.1, h, 0.1]} />
        <meshStandardMaterial
          color={COLUMN}
          emissive={GOLD}
          emissiveIntensity={active ? 0.5 : 0.08}
        />
      </mesh>

      {/* energized head */}
      <mesh ref={headRef} position={[0, h + 0.3, 0]}>
        <octahedronGeometry args={[headSize, 0]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={active ? 2.4 : 0.9}
        />
      </mesh>

      {/* fake glow shell */}
      <mesh position={[0, h + 0.3, 0]}>
        <sphereGeometry args={[headSize * 2.1, 12, 12]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={active ? 0.22 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.34, 0.4, 32]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={active ? 0.9 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* hub halo ring */}
      {node.kind === "hub" && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, h + 0.3, 0]}>
          <torusGeometry args={[0.62, 0.02, 8, 48]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.55} />
        </mesh>
      )}

      {/* larger invisible hit target */}
      <mesh position={[0, h / 2 + 0.2, 0]} visible={false}>
        <cylinderGeometry args={[0.55, 0.55, h + 1.2, 8]} />
      </mesh>

      <Html
        center
        position={[0, h + 0.95, 0]}
        distanceFactor={13}
        zIndexRange={[30, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="flex flex-col items-center whitespace-nowrap font-mono transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0.65 }}
        >
          <span
            className="text-[11px] tracking-[0.2em] font-semibold"
            style={{ color: active ? EMBER : "#9aa1b4" }}
          >
            {node.label}
          </span>
          <span className="text-[8px] tracking-widest" style={{ color: "#5c6478" }}>
            {node.sub}
          </span>
        </div>
      </Html>
    </group>
  );
}

function Pulse({
  from,
  to,
  offset,
  speed,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  offset: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1;
    ref.current.position.lerpVectors(from, to, t);
    ref.current.scale.setScalar(0.5 + Math.sin(t * Math.PI) * 0.9);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshBasicMaterial color={EMBER} />
    </mesh>
  );
}

function CameraRig({
  focus,
  controlsRef,
}: {
  focus: THREE.Vector3 | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const remaining = useRef(0);

  const key = focus ? focus.toArray().join(",") : "home";
  useEffect(() => {
    remaining.current = 1.6; // seconds of eased travel, then user regains full control
  }, [key]);

  useFrame((_, dt) => {
    const controls = controlsRef.current;
    if (remaining.current <= 0 || !controls) return;
    remaining.current -= dt;
    const target = focus ?? HOME_TARGET;
    const camPos = focus ? focus.clone().add(FOCUS_OFFSET) : HOME_CAM;
    const a = 1 - Math.exp(-4.5 * dt);
    controls.target.lerp(target, a);
    camera.position.lerp(camPos, a);
    controls.update();
  });
  return null;
}

export default function GridCanvas({
  nodes,
  links,
  selectedId,
  onSelect,
  animated,
}: {
  nodes: GridNodeDef[];
  links: [string, string][];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  animated: boolean;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const positions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    for (const n of nodes) map.set(n.id, new THREE.Vector3(...n.position));
    return map;
  }, [nodes]);

  const focus = selectedId ? positions.get(selectedId) ?? null : null;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: HOME_CAM.toArray(), fov: 42 }}
      frameloop={animated ? "always" : "demand"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 16, 36]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} />
      <pointLight position={[0, 3, 0]} intensity={10} distance={14} color={GOLD} />

      <gridHelper args={[46, 46, "#242a3a", "#171b26"]} raycast={() => null} />

      {links.map(([a, b]) => {
        const from = positions.get(a)!;
        const to = positions.get(b)!;
        const lifted = [from.clone().setY(0.05), to.clone().setY(0.05)] as const;
        return (
          <group key={`${a}-${b}`}>
            <Line
              points={[lifted[0], lifted[1]]}
              color={LINE_DIM}
              lineWidth={1}
              transparent
              opacity={0.8}
              raycast={() => null}
            />
            {animated && (
              <>
                <Pulse from={lifted[0]} to={lifted[1]} offset={(a + b).length * 0.137} speed={0.22} />
                <Pulse from={lifted[0]} to={lifted[1]} offset={(a + b).length * 0.137 + 0.5} speed={0.22} />
              </>
            )}
          </group>
        );
      })}

      {/* off-grid island: dashed tie between solo ventures, deliberately unconnected to the hub */}
      {(() => {
        const offgrid = nodes.filter((n) => n.kind === "offgrid");
        if (offgrid.length < 2) return null;
        const pts = offgrid.map((n) => new THREE.Vector3(...n.position).setY(0.05));
        const mid = pts[0].clone().add(pts[1]).multiplyScalar(0.5);
        return (
          <group>
            <Line points={[pts[0], pts[1]]} color={GOLD} lineWidth={1} dashed dashSize={0.25} gapSize={0.18} transparent opacity={0.5} raycast={() => null} />
            <Html center position={[mid.x, 3.4, mid.z]} distanceFactor={13} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
              <div className="whitespace-nowrap font-mono text-[9px] tracking-[0.3em] text-[#8a6d1f]">
                OFF-GRID · SOLO VENTURES
              </div>
            </Html>
          </group>
        );
      })()}

      {nodes.map((n) => (
        <GridNodeMesh
          key={n.id}
          node={n}
          selected={selectedId === n.id}
          animated={animated}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={0.35}
        autoRotate={animated && !selectedId}
        autoRotateSpeed={0.45}
        target={HOME_TARGET.toArray()}
      />
      <CameraRig focus={focus ?? null} controlsRef={controlsRef} />
    </Canvas>
  );
}
