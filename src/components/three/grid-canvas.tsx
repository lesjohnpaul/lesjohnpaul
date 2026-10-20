"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles } from "@react-three/drei";
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
const VIOLET = "#a78bfa";
const COLUMN = "#1c2130";

const HOME_CAM = new THREE.Vector3(9, 7.5, 11);
const HOME_TARGET = new THREE.Vector3(1.4, 0.9, -1);
const FOCUS_OFFSET = new THREE.Vector3(4.4, 3.2, 5.0);
export const PANDORA_POS = new THREE.Vector3(1.2, 3.3, -7.8);

// One shared clock uniform for every shader in the scene, ticked by <ShaderClock />.
const TIME = { value: 0 };
// Brightness of the light shafts leaking from Pandora's box, driven by its open/hover state.
const RAY_OPACITY = { value: 0.2 };

function nodeHeight(kind: GridNodeDef["kind"]) {
  return kind === "hub" ? 1.7 : 0.95;
}

function headPosition(node: GridNodeDef) {
  return new THREE.Vector3(node.position[0], nodeHeight(node.kind) + 0.3, node.position[2]);
}

let glowTexture: THREE.Texture | null = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.22, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

// Gold engraving for the box faces, drawn once to a canvas and used as an emissive map.
function makeEngravingTexture() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, s, s);
  g.strokeStyle = "#fff";
  g.fillStyle = "#fff";
  g.lineWidth = 4;
  g.strokeRect(12, 12, s - 24, s - 24);
  g.lineWidth = 1.5;
  g.strokeRect(28, 28, s - 56, s - 56);
  g.beginPath();
  g.moveTo(128, 42);
  g.lineTo(214, 128);
  g.lineTo(128, 214);
  g.lineTo(42, 128);
  g.closePath();
  g.stroke();
  for (const r of [46, 20]) {
    g.beginPath();
    g.arc(128, 128, r, 0, Math.PI * 2);
    g.stroke();
  }
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r2 = i % 2 ? 60 : 70;
    g.beginPath();
    g.moveTo(128 + Math.cos(a) * 52, 128 + Math.sin(a) * 52);
    g.lineTo(128 + Math.cos(a) * r2, 128 + Math.sin(a) * r2);
    g.stroke();
  }
  for (const [x, y] of [[28, 28], [s - 28, 28], [28, s - 28], [s - 28, s - 28]]) {
    g.fillRect(x - 5, y - 5, 10, 10);
  }
  g.beginPath();
  g.arc(128, 128, 6, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function ShaderClock({ animated }: { animated: boolean }) {
  useFrame((_, dt) => {
    if (animated) TIME.value += dt;
  });
  return null;
}

/* ---------- Ground: holographic dot grid with a scan ring from the core ---------- */

const groundVert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const groundFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uGold;
  uniform vec3 uViolet;
  uniform vec2 uBox;
  varying vec3 vWorld;
  void main() {
    vec2 p = vWorld.xz;
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float dotv = 1.0 - smoothstep(0.035, 0.07, length(abs(fract(p + 0.5) - 0.5)));
    float r = length(p);
    float fade = 1.0 - smoothstep(5.0, 22.0, r);
    float phase = fract(uTime * 0.11);
    float scan = exp(-pow((r - phase * 22.0) * 1.4, 2.0)) * (1.0 - phase);
    float bleed = exp(-length(p - uBox) * 0.32);
    vec3 col = vec3(0.09, 0.11, 0.16) * line
             + uGold * dotv * 0.32
             + uGold * scan * (line * 1.3 + dotv + 0.08)
             + uViolet * bleed * (line * 0.7 + dotv * 0.8 + 0.05);
    gl_FragColor = vec4(col * fade, 1.0);
  }
`;

function Ground() {
  const uniforms = useMemo(
    () => ({
      uTime: TIME,
      uGold: { value: new THREE.Color(GOLD) },
      uViolet: { value: new THREE.Color(VIOLET) },
      uBox: { value: new THREE.Vector2(PANDORA_POS.x, PANDORA_POS.z) },
    }),
    []
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <planeGeometry args={[48, 48]} />
      <shaderMaterial
        vertexShader={groundVert}
        fragmentShader={groundFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ---------- Power lines: arched tubes with energy flowing core -> substation ---------- */

const flowVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flowFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  uniform float uBoost;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float d = fract(vUv.x * 3.0 - uTime * 0.6 + uOffset);
    float pulse = smoothstep(0.0, 0.06, d) * (1.0 - smoothstep(0.06, 0.3, d));
    vec3 col = uColor * (0.16 + pulse * 1.8 * uBoost);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function PowerLine({
  from,
  to,
  offset,
  boosted,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  offset: number;
  boosted: boolean;
}) {
  const geometry = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5);
    mid.y += 0.9 + from.distanceTo(to) * 0.08;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return new THREE.TubeGeometry(curve, 64, 0.022, 6, false);
  }, [from, to]);
  const uniforms = useMemo(
    () => ({
      uTime: TIME,
      uOffset: { value: offset },
      uBoost: { value: 1 },
      uColor: { value: new THREE.Color(EMBER) },
    }),
    [offset]
  );
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useEffect(() => {
    if (matRef.current) matRef.current.uniforms.uBoost.value = boosted ? 2.2 : 1;
  }, [boosted]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} raycast={() => null}>
      <shaderMaterial
        ref={matRef}
        vertexShader={flowVert}
        fragmentShader={flowFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Glow({
  color,
  scale,
  opacity,
  position,
}: {
  color: string;
  scale: number;
  opacity: number;
  position?: [number, number, number];
}) {
  return (
    <sprite scale={scale} position={position} raycast={() => null}>
      <spriteMaterial
        map={getGlowTexture()}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </sprite>
  );
}

/* ---------- Nodes ---------- */

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
  const headRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const gyroRef = useRef<THREE.Group>(null);
  const h = nodeHeight(node.kind);
  const isHub = node.kind === "hub";
  const headSize = isHub ? 0.32 : 0.19;
  const active = hovered || selected;
  const tint = node.kind === "offgrid" ? EMBER : GOLD;

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.position.y = h + 0.3 + Math.sin(t * 1.5 + node.position[0]) * 0.05;
      headRef.current.rotation.y = t * (active ? 1.6 : 0.45);
    }
    if (shellRef.current) {
      shellRef.current.rotation.x = -t * 0.35;
      shellRef.current.rotation.z = t * 0.25;
    }
    if (gyroRef.current) {
      gyroRef.current.children.forEach((ring, i) => {
        ring.rotation.x = t * (0.3 + i * 0.22) + i;
        ring.rotation.y = t * (0.2 + i * 0.15);
      });
    }
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
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      {/* hex plinth */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[isHub ? 0.62 : 0.4, isHub ? 0.72 : 0.48, 0.12, 6]} />
        <meshStandardMaterial
          color={COLUMN}
          metalness={0.7}
          roughness={0.35}
          emissive={tint}
          emissiveIntensity={active ? 0.35 : 0.06}
        />
      </mesh>

      {/* column */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[isHub ? 0.12 : 0.07, h, isHub ? 0.12 : 0.07]} />
        <meshStandardMaterial color={COLUMN} emissive={tint} emissiveIntensity={active ? 0.6 : 0.12} />
      </mesh>

      {/* energized head with a wire shell */}
      <group ref={headRef} position={[0, h + 0.3, 0]}>
        <mesh>
          <octahedronGeometry args={[headSize, 0]} />
          <meshStandardMaterial
            color={tint}
            emissive={tint}
            emissiveIntensity={active ? 2.6 : 1}
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[headSize * 1.75, 0]} />
          <meshBasicMaterial color={tint} wireframe transparent opacity={active ? 0.55 : 0.18} />
        </mesh>
      </group>
      <Glow color={tint} scale={active ? 2.4 : 1.4} opacity={active ? 0.75 : 0.4} position={[0, h + 0.3, 0]} />

      {/* ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[isHub ? 0.8 : 0.55, isHub ? 0.86 : 0.6, 48]} />
        <meshBasicMaterial color={tint} transparent opacity={active ? 0.9 : 0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* hub gyroscope */}
      {isHub && (
        <group ref={gyroRef} position={[0, h + 0.3, 0]}>
          {[0.62, 0.8, 0.98].map((r) => (
            <mesh key={r}>
              <torusGeometry args={[r, 0.012, 8, 72]} />
              <meshBasicMaterial color={GOLD} transparent opacity={0.6} toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}

      {/* larger invisible hit target */}
      <mesh position={[0, h / 2 + 0.2, 0]} visible={false}>
        <cylinderGeometry args={[0.55, 0.55, h + 1.2, 8]} />
      </mesh>

      <Html
        center
        position={[0, h + (isHub ? 1.45 : 0.95), 0]}
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

/* ---------- Pandora's box ---------- */

const FACES: { n: [number, number, number]; r: [number, number, number]; tumble: [number, number, number] }[] = [
  { n: [0, 0, 1], r: [0, 0, 0], tumble: [1.1, 0.4, 0.7] },
  { n: [0, 0, -1], r: [0, Math.PI, 0], tumble: [-0.9, 0.6, -0.5] },
  { n: [1, 0, 0], r: [0, Math.PI / 2, 0], tumble: [0.5, -1.2, 0.8] },
  { n: [-1, 0, 0], r: [0, -Math.PI / 2, 0], tumble: [-0.6, 1.0, -0.9] },
  { n: [0, 1, 0], r: [-Math.PI / 2, 0, 0], tumble: [1.3, 0.2, 1.0] },
  { n: [0, -1, 0], r: [Math.PI / 2, 0, 0], tumble: [-1.0, -0.5, 0.6] },
];

// Directions of the light shafts that burst out of the box (Fibonacci sphere, stable across renders).
const RAYS = Array.from({ length: 14 }, (_, i) => {
  const y = 1 - (i / 13) * 2;
  const r = Math.sqrt(1 - y * y);
  const a = i * 2.39996;
  const dir = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
});

const rayFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(uColor * pow(1.0 - vUv.y, 1.8) * uOpacity, 1.0);
  }
`;

const beamFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float a = pow(vUv.y, 1.6) * (0.55 + 0.15 * sin(uTime * 3.0 + vUv.y * 12.0));
    gl_FragColor = vec4(uColor * a, 1.0);
  }
`;

function PandoraBox({
  open,
  animated,
  onOpen,
}: {
  open: boolean;
  animated: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const faceRefs = useRef<(THREE.Group | null)[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const burstRef = useRef<THREE.Sprite>(null);
  const raysRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const glyphRef = useRef<THREE.Mesh>(null);
  const faceMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const progress = useRef(0);
  const hover = useRef(0);

  const engraving = useMemo(() => makeEngravingTexture(), []);
  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#171226",
        metalness: 0.85,
        roughness: 0.3,
        emissive: new THREE.Color(GOLD),
        emissiveMap: engraving,
        emissiveIntensity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [engraving]
  );
  const edgeMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: EMBER, transparent: true, toneMapped: false }),
    []
  );
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.92, 0.92)), []);
  const beamUniforms = useMemo(() => ({ uColor: { value: new THREE.Color(VIOLET) }, uTime: TIME }), []);
  const rayUniforms = useMemo(
    () => [EMBER, VIOLET].map((c) => ({ uColor: { value: new THREE.Color(c) }, uOpacity: RAY_OPACITY })),
    []
  );

  useEffect(() => {
    faceMatRef.current = faceMat;
    edgeMatRef.current = edgeMat;
  }, [faceMat, edgeMat]);
  useEffect(
    () => () => {
      engraving.dispose();
      faceMat.dispose();
      edgeMat.dispose();
      edgeGeo.dispose();
    },
    [engraving, faceMat, edgeMat, edgeGeo]
  );

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    // Opening snaps forward fast; resealing settles slowly so the reassembly reads.
    progress.current = THREE.MathUtils.damp(progress.current, open ? 1 : 0, open ? 2.4 : 1.6, dt);
    hover.current = THREE.MathUtils.damp(hover.current, hovered && !open ? 1 : 0, 6, dt);
    const p = animated ? progress.current : open ? 1 : 0;
    const h = hover.current;
    const burst = p * p;

    if (rootRef.current && animated) {
      rootRef.current.position.y = PANDORA_POS.y + Math.sin(t * 0.9) * 0.12;
    }
    if (spinRef.current && animated) {
      spinRef.current.rotation.y += dt * (0.3 + h * 1.2 + p * 2.5);
      spinRef.current.rotation.x = Math.sin(t * 0.5) * 0.25 + 0.35;
    }

    const breathe = animated ? Math.sin(t * 2.2) * 0.008 : 0;
    faceRefs.current.forEach((face, i) => {
      if (!face) return;
      const { n, r, tumble } = FACES[i];
      const d = 0.5 + h * 0.06 + breathe + p * 2.6;
      face.position.set(n[0] * d, n[1] * d, n[2] * d);
      face.rotation.set(r[0] + tumble[0] * p * 2, r[1] + tumble[1] * p * 2, r[2] + tumble[2] * p * 2);
    });
    const fm = faceMatRef.current;
    if (fm && edgeMatRef.current) {
      fm.opacity = 1 - THREE.MathUtils.smoothstep(p, 0.35, 0.9);
      fm.emissiveIntensity = 0.9 + h * 1.4 + p * 2;
      edgeMatRef.current.opacity = fm.opacity;
    }

    if (coreRef.current) coreRef.current.scale.setScalar(1 + h * 0.08 + p * 0.5);
    if (burstRef.current) {
      burstRef.current.scale.setScalar(2.2 + h * 1.2 + burst * 34);
      (burstRef.current.material as THREE.SpriteMaterial).opacity = 0.55 + h * 0.3 + p * 0.45;
    }
    if (raysRef.current) {
      raysRef.current.rotation.y = -t * 0.2;
      raysRef.current.children.forEach((ray, i) => {
        const len = 0.9 + h * 0.9 + burst * 9 + (animated ? Math.sin(t * 2 + i) * 0.15 : 0);
        ray.scale.set(1 + p * 1.5, len, 1 + p * 1.5);
      });
    }
    RAY_OPACITY.value = 0.22 + h * 0.3 + p * 0.6;
    if (lightRef.current) lightRef.current.intensity = 6 + h * 10 + p * 60;
    if (glyphRef.current) glyphRef.current.rotation.z = t * 0.15;
  });

  return (
    <group>
      {/* light column tethering the box to the floor */}
      <mesh position={[PANDORA_POS.x, PANDORA_POS.y / 2, PANDORA_POS.z]} raycast={() => null}>
        <cylinderGeometry args={[0.05, 0.22, PANDORA_POS.y, 16, 1, true]} />
        <shaderMaterial
          vertexShader={flowVert}
          fragmentShader={beamFrag}
          uniforms={beamUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={glyphRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[PANDORA_POS.x, 0.02, PANDORA_POS.z]}
        raycast={() => null}
      >
        <ringGeometry args={[0.9, 1.0, 6]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      <group ref={rootRef} position={PANDORA_POS.toArray()}>
        <pointLight ref={lightRef} color={VIOLET} distance={12} decay={1.6} />

        <group
          ref={spinRef}
          scale={1.3}
          onClick={(e) => {
            e.stopPropagation();
            if (!open) onOpen();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
        >
          {FACES.map((f, i) => (
            <group key={i} ref={(el) => { faceRefs.current[i] = el; }}>
              <mesh material={faceMat}>
                <planeGeometry args={[0.92, 0.92]} />
              </mesh>
              <lineSegments geometry={edgeGeo} material={edgeMat} />
            </group>
          ))}

          {/* inner light, visible through the seams between faces */}
          <mesh ref={coreRef}>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            <meshBasicMaterial color="#e9ddff" toneMapped={false} />
          </mesh>

          <group ref={raysRef}>
            {RAYS.map((q, i) => (
              <group key={i} quaternion={q}>
                <mesh position={[0, 0.5, 0]} raycast={() => null}>
                  <cylinderGeometry args={[0.16, 0.0, 1, 10, 1, true]} />
                  <shaderMaterial
                    vertexShader={flowVert}
                    fragmentShader={rayFrag}
                    uniforms={rayUniforms[i % 3 === 0 ? 0 : 1]}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            ))}
          </group>

          {/* generous invisible hit target */}
          <mesh visible={false}>
            <sphereGeometry args={[1.1, 12, 12]} />
          </mesh>
        </group>

        <sprite ref={burstRef} raycast={() => null}>
          <spriteMaterial
            map={getGlowTexture()}
            color={VIOLET}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            fog={false}
          />
        </sprite>

        {!open && (
          <Html center position={[0, -1.55, 0]} distanceFactor={13} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
            <div className="flex flex-col items-center whitespace-nowrap transition-opacity duration-300" style={{ opacity: hovered ? 1 : 0.8 }}>
              <span className="font-display text-[15px] font-semibold" style={{ color: hovered ? "#ede4ff" : "#c4b5fd" }}>
                Pandora&apos;s box
              </span>
              <span className="font-mono text-[9px] tracking-wider" style={{ color: "#7c6ca8" }}>
                not on any map. click to open
              </span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

/* ---------- Camera ---------- */

function CameraRig({
  focus,
  diving,
  controlsRef,
}: {
  focus: THREE.Vector3 | null;
  diving: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const get = useThree((s) => s.get);
  const remaining = useRef(0);
  const diveDir = useRef(new THREE.Vector3());
  const goal = useMemo(() => new THREE.Vector3(), []);

  const key = diving ? "dive" : focus ? focus.toArray().join(",") : "home";
  useEffect(() => {
    // Eased travel for a fixed window, then the user regains full control. A dive runs until it ends.
    remaining.current = diving ? Infinity : 1.8;
    if (diving) diveDir.current.copy(get().camera.position).sub(PANDORA_POS).normalize();
  }, [key, diving, get]);

  useFrame((state, dt) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const controls = controlsRef.current;
    if (remaining.current <= 0 || !controls) return;
    remaining.current -= dt;
    let target: THREE.Vector3;
    let fov = 42;
    let rate = 4.5;
    if (diving) {
      target = PANDORA_POS;
      goal.copy(PANDORA_POS).addScaledVector(diveDir.current, 0.4);
      fov = 105;
      rate = 2.8;
    } else {
      target = focus ?? HOME_TARGET;
      goal.copy(focus ? focus.clone().add(FOCUS_OFFSET) : HOME_CAM);
    }
    const a = 1 - Math.exp(-rate * dt);
    controls.target.lerp(target, a);
    camera.position.lerp(goal, a);
    camera.fov += (fov - camera.fov) * a;
    camera.updateProjectionMatrix();
    camera.lookAt(controls.target);
    controls.update();
  });
  return null;
}

/* ---------- Scene ---------- */

export default function GridCanvas({
  nodes,
  links,
  selectedId,
  onSelect,
  animated,
  boxOpen,
  paused,
  onOpenBox,
}: {
  nodes: GridNodeDef[];
  links: [string, string][];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  animated: boolean;
  boxOpen: boolean;
  paused: boolean;
  onOpenBox: () => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const heads = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    for (const n of nodes) map.set(n.id, headPosition(n));
    return map;
  }, [nodes]);

  const focus = useMemo(() => {
    const n = nodes.find((x) => x.id === selectedId);
    return n ? new THREE.Vector3(...n.position) : null;
  }, [nodes, selectedId]);

  const offgrid = nodes.filter((n) => n.kind === "offgrid");

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: HOME_CAM.toArray(), fov: 42 }}
      frameloop={animated && !paused ? "always" : "demand"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 18, 42]} />
      <ShaderClock animated={animated} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 4]} intensity={1} />
      <pointLight position={[0, 3, 0]} intensity={12} distance={14} color={GOLD} />

      <Ground />
      <Sparkles
        count={70}
        scale={[26, 6, 22]}
        position={[1, 3, -1]}
        size={2.2}
        speed={animated ? 0.3 : 0}
        color={EMBER}
        opacity={0.55}
      />

      {links.map(([a, b]) => (
        <PowerLine
          key={`${a}-${b}`}
          from={heads.get(a)!}
          to={heads.get(b)!}
          offset={(a + b).length * 0.137}
          boosted={selectedId === b}
        />
      ))}

      {/* off-grid island: dashed tie between solo ventures, deliberately unconnected to the hub */}
      {offgrid.length >= 2 && (() => {
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

      <PandoraBox open={boxOpen} animated={animated} onOpen={onOpenBox} />

      <OrbitControls
        ref={controlsRef}
        enabled={!boxOpen}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={0.35}
        autoRotate={animated && !selectedId && !boxOpen}
        autoRotateSpeed={0.45}
        target={HOME_TARGET.toArray()}
      />
      <CameraRig focus={focus} diving={boxOpen && animated} controlsRef={controlsRef} />
    </Canvas>
  );
}
