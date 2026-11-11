"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefCallback, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, useFBO, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { createPaoModel, disposePaoModel } from "@/components/pao/createPaoModel";
import { BLOCK_TYPES, arrivals } from "@/lib/studio/blocks";
import type { Tier } from "@/lib/studio/quality";
import type { Screen } from "@/lib/studio/schema";

type Phase = "hello" | "building" | "done";
/** `screenTypes`: the arrived screens' types in arrival order; each one flies out of the orbit slot of its block. */
type SceneProps = { tier: Exclude<Tier, "static">; phase: Phase; screensReady: number; screenTypes: Screen["type"][]; onReady?: () => void; onLost?: () => void };

const BG = "#0a0c13"; // obsidian, globals.css dark --background
const GOLD = "#f2c14e"; // brand --primary, oklch(0.78 0.16 85)
const GOLD_HOT = new THREE.Color(GOLD).multiplyScalar(1.5); // over 1.0 so Bloom (threshold 0.8) catches it
const BLOCKS = BLOCK_TYPES.length; // seven instances, one per block model
// Each block is fitted into the footprint the old 1.5 x 0.95 glass slabs used (a little taller for upright blocks).
const FIT_W = 1.5;
const FIT_H = 1.1;
const POP = 0.25; // s: scale-out/in when a slot must morph (only for a repeated screen type)

type Shape = { geometry: THREE.BufferGeometry; scale: THREE.Vector3; position: THREE.Vector3 };
type Shapes = Record<Screen["type"], Shape>;
// [colour, x, y, size] of the light sprites behind the glass; gold leads.
const LIGHTS: [string, number, number, number][] = [
  [GOLD, -1.7, 0.45, 4.2],
  ["#5a46c8", 2.2, -0.35, 3.8],
  ["#b8741f", 0.3, -1.3, 2.6],
  ["#1b7a75", 0.9, 1.45, 2.2],
];

/** Radial white-to-transparent texture shared by every light sprite. */
function makeGlow() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  // Gaussian falloff shifted to hit exactly 0 at the edge, so bloom never finds the quad's corners.
  const tail = Math.exp(-4.5);
  for (let k = 0; k <= 8; k++) {
    const a = (Math.exp(-((k / 8) ** 2) * 4.5) - tail) / (1 - tail);
    r.addColorStop(k / 8, `rgba(255,255,255,${a.toFixed(3)})`);
  }
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const blocksUrl = (tier: SceneProps["tier"]) => (tier === "full" ? "/studio/blocks.glb" : "/studio/blocks-lite.glb");

const SLOTS = Array.from({ length: BLOCKS }, (_, i) => i);
const CAM_Z = 7;
const FOV = 35;
const PAO_Z = 1.2;
const OMEGA = 10.5; // spring stiffness (rad/s): ~600 ms to settle
const ZETA = 0.72; // damping ratio: one soft overshoot
const STEP = 1 / 120; // fixed spring substep, frame-rate independent

/** Frame-rate independent exponential approach. */
const damp = (from: number, to: number, rate: number, dt: number) => from + (to - from) * (1 - Math.exp(-rate * dt));

type Body = { pos: THREE.Vector3; vel: THREE.Vector3; target: THREE.Vector3; rotY: number; rotX: number; scale: number };

function makeBodies(): Body[] {
  return Array.from({ length: BLOCKS }, (_, i) => {
    const a = (i / BLOCKS) * Math.PI * 2;
    return {
      pos: new THREE.Vector3(Math.sin(a) * 3.2, 0, -1.5 + Math.cos(a) * 1.4),
      vel: new THREE.Vector3(),
      target: new THREE.Vector3(),
      rotY: 0,
      rotX: 0,
      scale: 1,
    };
  });
}

type BlockProps = { refs: RefCallback<THREE.Object3D>[]; glass: () => ReactNode };

/**
 * The seven custom blocks, slot i = BLOCK_TYPES[i] for good. Geometry is shared from the GLTF cache. The fitted shapes
 * are handed to the frame loop, which (only for a repeated screen type) morphs a borrowed slot behind a scale pop.
 */
function ModelBlocks({
  refs,
  glass,
  url,
  prepass,
  shapesRef,
  onReady,
}: BlockProps & { url: string; prepass: boolean; shapesRef: RefObject<Shapes | null>; onReady?: () => void }) {
  const { nodes } = useGLTF(url, false, true); // (url, draco off, meshopt on): both files are meshopt + quantized
  // First frame with the real blocks: tell the page, so it fades its backdrop onto the finished scene.
  // (useFrame runs just before this frame's render, which completes before React can commit the fade.)
  const told = useRef(false);
  useFrame(() => {
    if (told.current) return;
    told.current = true;
    onReady?.();
  });
  // Lite glass is alpha-blended: a depth-only pass first hides each block's own inner faces (no see-through mush).
  // Transparent + renderOrder 1 so it runs after the light sprites (order 0) and before the glass (order 2).
  const depthOnly = useMemo(() => (prepass ? new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true }) : null), [prepass]);
  useEffect(() => () => depthOnly?.dispose(), [depthOnly]);
  const fit = useMemo(
    () =>
      Object.fromEntries(
        BLOCK_TYPES.map((t) => {
          const n = nodes[`block_${t}`] as THREE.Mesh;
          // Quantized geometry: the node scale carries the dequantization, so measure in node space.
          const box = (n.geometry.boundingBox ?? (n.geometry.computeBoundingBox(), n.geometry.boundingBox!)).clone();
          box.min.multiply(n.scale);
          box.max.multiply(n.scale);
          const size = box.getSize(new THREE.Vector3());
          const k = Math.min(FIT_W / size.x, FIT_H / size.y);
          const centre = box.getCenter(new THREE.Vector3()).multiplyScalar(-k);
          return [t, { geometry: n.geometry, scale: n.scale.clone().multiplyScalar(k), position: centre }];
        }),
      ) as Shapes,
    [nodes],
  );
  useEffect(() => {
    shapesRef.current = fit;
    return () => void (shapesRef.current = null);
  }, [fit, shapesRef]);
  // GPU buffers only; the cached CPU data re-uploads if the scene mounts again.
  useEffect(() => () => BLOCK_TYPES.forEach((t) => (nodes[`block_${t}`] as THREE.Mesh).geometry.dispose()), [nodes]);
  return SLOTS.map((i) => {
    const f = fit[BLOCK_TYPES[i]];
    return (
      <group key={i} ref={refs[i]}>
        {depthOnly && <mesh geometry={f.geometry} scale={f.scale} position={f.position} material={depthOnly} renderOrder={1} />}
        <mesh geometry={f.geometry} scale={f.scale} position={f.position} renderOrder={2}>
          {glass()}
        </mesh>
      </group>
    );
  });
}

function Rig({ tier, phase, screensReady, screenTypes, onReady, onLost }: SceneProps) {
  const full = tier === "full";
  // A phone under memory pressure can take the GPU context away: hand the page back to its poster/loop backdrop.
  // Removed on unmount, so the context loss R3F forces while disposing never reports as a failure.
  const canvas = useThree((st) => st.gl.domElement);
  useEffect(() => {
    if (!onLost) return;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [canvas, onLost]);
  const meshes = useRef<(THREE.Object3D | null)[]>([]);
  // Stable per-slot refs; the cleanup only clears a slot it still owns, so remounts are order-safe.
  const refs = useMemo(
    () =>
      SLOTS.map((i): RefCallback<THREE.Object3D> => (m) => {
        meshes.current[i] = m;
        return () => {
          if (meshes.current[i] === m) meshes.current[i] = null;
        };
      }),
    [],
  );
  const shapesRef = useRef<Shapes | null>(null);
  // Per slot: arrival rank (-1 = orbiting), the shape it should show, and its morph-pop progress.
  const slots = useRef({ rank: new Int8Array(BLOCKS).fill(-1), shape: [...BLOCK_TYPES], pop: new Float32Array(BLOCKS) });
  const typesKey = screenTypes.slice(0, 3).join(",");
  useEffect(() => {
    const a = arrivals(typesKey ? (typesKey.split(",") as Screen["type"][]) : []);
    slots.current.rank.set(a.rank);
    slots.current.shape = a.shape;
  }, [typesKey]);
  const fbo = useFBO(full ? 512 : 1, full ? 512 : 1); // lite never samples it
  const bodiesRef = useRef<Body[] | null>(null);
  const { group: pao, parts } = useMemo(() => createPaoModel(), []);
  const paoHolder = useRef<THREE.Group>(null);
  const blobs = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const live = useRef({ phase, ready: screensReady, arrivedAt: -10, spin: 0, paoYaw: 0 });
  const restArm = useRef({ l: parts.armL.rotation.z, r: parts.armR.rotation.z });

  const glow = useMemo(() => makeGlow(), []);
  useEffect(() => () => disposePaoModel(pao), [pao]);
  useEffect(() => () => glow.dispose(), [glow]);

  // Full tier: one shared refraction buffer for all seven blocks instead of one scene render per block per frame.
  useFrame((state) => {
    if (!full) return;
    const list = meshes.current;
    for (const m of list) if (m) m.visible = false;
    const tone = state.gl.toneMapping;
    state.gl.toneMapping = THREE.NoToneMapping; // avoid double tone mapping inside the glass
    state.gl.setRenderTarget(fbo);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
    state.gl.toneMapping = tone;
    for (const m of list) if (m) m.visible = true;
  }, -1);

  // Props land in a ref so the frame loop reads them without re-subscribing.
  useEffect(() => {
    const l = live.current;
    if (screensReady > l.ready) l.arrivedAt = -1; // stamped with clock time on the next frame
    l.phase = phase;
    l.ready = Math.max(0, Math.min(3, screensReady));
  }, [phase, screensReady]);

  // Window-level pointer: the HTML prototype panels sit over the canvas and swallow its events.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05); // resuming from a hidden tab must not teleport anything
    const t = state.clock.elapsedTime;
    const l = live.current;
    const bodies = (bodiesRef.current ??= makeBodies());
    if (l.arrivedAt < 0) l.arrivedAt = t;

    // Responsive layout: shrink spreads on narrow (phone) viewports.
    const aspect = state.size.width / Math.max(1, state.size.height);
    const fit = THREE.MathUtils.clamp(aspect / 1.6, 0.42, 1);
    const halfW = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * (CAM_Z - PAO_Z) * aspect;

    // Pointer parallax on the camera.
    const p = pointer.current;
    p.sx = damp(p.sx, p.x, 3, dt);
    p.sy = damp(p.sy, p.y, 3, dt);
    state.camera.position.set(p.sx * 0.45, 0.25 - p.sy * 0.3, CAM_Z);
    state.camera.lookAt(0, 0, 0);

    l.spin += dt * (l.phase === "hello" ? 0.16 : 0.07);
    const ready = l.phase === "hello" ? 0 : l.ready;
    const { rank, shape, pop } = slots.current;
    const sh = shapesRef.current;
    const w = (1 - fit) / 0.58; // 0 on wide screens .. 1 on the narrowest phones
    let newest = -1; // slot of the latest arrival, for Pao's gaze
    let rest = 0; // index among the slots still orbiting (done arc wings)

    for (let i = 0; i < BLOCKS; i++) {
      const b = bodies[i];
      const arrived = rank[i] >= 0 && rank[i] < ready;
      if (arrived && rank[i] === ready - 1) newest = i;
      let s = 1;
      let ry = 0;
      let rx = 0;
      if (arrived && l.phase === "building") {
        // Arrived screens behind the HTML panel: the newest in front, older ones step back to alternating sides
        // (solid blocks, unlike the old slabs, would intersect in a straight stack).
        const d = ready - 1 - rank[i];
        const side = d === 0 ? 0 : d === 1 ? -1 : 1;
        b.target.set(side * 1.7 * fit, 0.05 + d * 0.3, -0.9 - d * 1.3);
        s = (1.5 - d * 0.15) * (0.3 + 0.7 * fit);
        ry = -side * 0.3; // turn toward the centre
      } else if (l.phase === "done") {
        // Soft arc: screens in the middle slots, the rest at the wings, inner pair lifted and outer pair dropped so no
        // two rest on top of each other. Phones: a tighter, taller arc (wings pulled in, lanes spread further).
        const r = arrived ? rank[i] : rest++;
        const slot = arrived ? r - (ready - 1) / 2 : r % 2 === 0 ? -(2 + (r >> 1)) : 2 + (r >> 1);
        const wing = Math.abs(slot) >= 2;
        const a = slot * 0.48 * (wing ? 1 - 0.5 * w : 1 + 0.25 * w);
        const lane = wing ? (Math.abs(slot) === 2 ? 1 : -1) * (0.6 + 0.55 * w) : 0;
        b.target.set(Math.sin(a) * 3.4 * fit, 0.15 + lane + Math.sin(t * 0.6 + i) * 0.06, -1.6 - (1 - Math.cos(a)) * 2.4);
        s = (arrived ? 1.1 : 0.75) * (0.4 + 0.6 * fit);
        ry = -a * 0.85;
      } else {
        // Slow tilted orbit around the centre. Each slot rides its own height lane (neighbours ~150° apart in phase,
        // so blocks crossing at the sides pass above/below each other); lanes spread further on tall phone screens.
        const a = l.spin + (i / BLOCKS) * Math.PI * 2;
        const r = (l.phase === "hello" ? 3.4 : 4.0) * fit;
        const lane = Math.sin(i * ((Math.PI * 6) / BLOCKS)) * (0.55 + 0.7 * w);
        b.target.set(Math.sin(a) * r, lane + Math.cos(a) * 0.3 + Math.sin(t * 0.5 + i) * 0.08, -1.6 + Math.cos(a) * 1.5);
        s = (l.phase === "hello" ? 0.88 : 0.75) * (0.4 + 0.6 * fit);
        ry = Math.sin(a) * 0.35;
        rx = Math.sin(t * 0.4 + i) * 0.06;
      }
      // Damped spring toward the target (fixed substeps keep it stable at any frame rate).
      for (let k = Math.ceil(dt / STEP), h = dt / Math.max(1, k); k > 0; k--) {
        b.vel.x += (OMEGA * OMEGA * (b.target.x - b.pos.x) - 2 * ZETA * OMEGA * b.vel.x) * h;
        b.vel.y += (OMEGA * OMEGA * (b.target.y - b.pos.y) - 2 * ZETA * OMEGA * b.vel.y) * h;
        b.vel.z += (OMEGA * OMEGA * (b.target.z - b.pos.z) - 2 * ZETA * OMEGA * b.vel.z) * h;
        b.pos.addScaledVector(b.vel, h);
      }
      b.rotY = damp(b.rotY, ry, 6, dt);
      b.rotX = damp(b.rotX, rx, 6, dt);
      b.scale = damp(b.scale, s, 7, dt);
      const m = meshes.current[i];
      if (m) {
        // Morph pop (repeated screen type only): shrink, swap the shape at the midpoint, grow back.
        let popScale = 1;
        const inner = m.children as THREE.Mesh[];
        if (sh && inner.length) {
          const want = sh[shape[i]];
          const off = inner[inner.length - 1].geometry !== want.geometry;
          if (off || pop[i] > 0) {
            pop[i] = Math.min(1, pop[i] + dt / POP);
            if (off && pop[i] >= 0.5)
              for (const c of inner) {
                c.geometry = want.geometry;
                c.scale.copy(want.scale);
                c.position.copy(want.position);
              }
            popScale = Math.abs(1 - 2 * pop[i]);
            if (pop[i] >= 1) pop[i] = 0;
          }
        }
        m.position.copy(b.pos);
        m.rotation.set(b.rotX, b.rotY, Math.sin(t * 0.3 + i) * 0.03);
        m.scale.setScalar(Math.max(1e-3, b.scale * (0.5 + 0.5 * fit) * popScale)); // solid blocks need extra room on phones
      }
    }

    // Coloured light drifting behind the glass.
    if (blobs.current) {
      blobs.current.rotation.z = Math.sin(t * 0.15) * 0.25;
      blobs.current.position.y = Math.sin(t * 0.3) * 0.15;
      blobs.current.scale.set(0.55 + 0.45 * fit, 0.8 + 0.2 * fit, 1);
    }

    // Pao: bottom-right of the stage, turning toward the newest block.
    const h = paoHolder.current;
    if (h) {
      const scale = 0.62 + 0.42 * fit;
      h.position.set(Math.min(2.35, halfW - 0.5 * scale), -1.62, PAO_Z);
      h.scale.setScalar(scale);
      let yaw = -p.sx * 0.35 - 0.25; // idle: glance toward the cursor
      if (newest >= 0) {
        const nb = bodies[newest].pos;
        yaw = Math.atan2(nb.x - h.position.x, nb.z - PAO_Z);
      }
      l.paoYaw = damp(l.paoYaw, THREE.MathUtils.clamp(yaw, -1.05, 0.6), 4, dt);
      h.rotation.y = l.paoYaw;

      parts.body.position.y = 0.165 + Math.sin(t * 2) * 0.006;
      parts.neck.rotation.z = Math.sin(t * 0.9) * 0.04;
      parts.neck.rotation.x = l.phase === "building" ? 0.08 : 0;
      const blink = t % 3.6 < 0.12 ? 0.1 : 1;
      parts.eyeL.scale.y = blink;
      parts.eyeR.scale.y = blink;
      // Push gesture for ~0.7 s when a screen arrives; a wave in hello; arms up when done.
      const since = t - l.arrivedAt;
      let armL = restArm.current.l;
      let armR = restArm.current.r;
      if (l.phase === "building" && since < 0.7) armR = restArm.current.r - 1.2 - Math.sin(since * 9) * 0.2;
      else if (l.phase === "hello" && Math.sin(t * 0.8) > 0.4) armR = -1.7 + Math.sin(t * 5) * 0.28; // wave now and then
      else if (l.phase === "done") {
        // Proud little bounce with arms slightly out.
        armL += 0.35 + Math.sin(t * 3) * 0.05;
        armR -= 0.35 + Math.sin(t * 3) * 0.05;
        parts.body.position.y += Math.abs(Math.sin(t * 3)) * 0.012;
      }
      parts.armL.rotation.z = damp(parts.armL.rotation.z, armL, 10, dt);
      parts.armR.rotation.z = damp(parts.armR.rotation.z, armR, 10, dt);
    }
  });

  // One material per block (as before); full refracts the shared buffer, lite fakes frosted glass without transmission.
  // Gold accent: warm attenuation in the full glass, gold sheen on lite; the gold rim light does the rest.
  const glass = () =>
    full ? (
      <MeshTransmissionMaterial
        buffer={fbo.texture}
        samples={6}
        resolution={512}
        roughness={0.35}
        thickness={0.8}
        ior={1.45}
        chromaticAberration={0.04}
        anisotropicBlur={0.15}
        distortion={0.1}
        distortionScale={0.3}
        temporalDistortion={0}
        clearcoat={1}
        clearcoatRoughness={0.15}
        color="#f4f1ea"
        attenuationColor="#f6dfa8"
        attenuationDistance={2.4}
      />
    ) : (
      <meshPhysicalMaterial
        transmission={0}
        transparent
        opacity={0.4}
        roughness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.2}
        color="#8f99c8"
        emissive={GOLD}
        emissiveIntensity={0.05}
        envMapIntensity={2.8}
        sheen={0.5}
        sheenColor={GOLD}
        sheenRoughness={0.45}
        depthWrite={false}
      />
    );

  return (
    <>
      <color attach="background" args={[BG]} />
      <hemisphereLight args={["#e9ecff", "#1a1408", 0.55]} />
      <directionalLight position={[2, 3, 4]} intensity={1.6} color="#fff3e2" />
      {/* Gold rim from behind so edges and Pao's silhouette catch the brand colour. */}
      <directionalLight position={[-3, 2.5, -4]} intensity={3.2} color={GOLD} />
      <pointLight position={[2.6, -0.4, 2.4]} intensity={6} distance={6} color={GOLD} />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 3, 3]} scale={[6, 1.5, 1]} />
        <Lightformer form="rect" intensity={4} color={GOLD} position={[-4, 0.5, -2]} rotation-y={Math.PI / 2.4} scale={[1.2, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#8b7bff" position={[4, -1, -1]} rotation-y={-Math.PI / 2.4} scale={[1, 4, 1]} />
      </Environment>

      {/* Soft coloured light the frosted glass blurs: additive gradient sprites, no hard edges. */}
      <mesh position={[0, -0.4, -9]} scale={[26, 16, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={glow} color="#11162c" transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={blobs} position={[0, 0, -3.4]}>
        {LIGHTS.map(([color, x, y, size], i) => (
          <mesh key={i} position={[x, y, -i * 0.2]} scale={size}>
            <planeGeometry />
            <meshBasicMaterial
              map={glow}
              color={i === 0 && full ? GOLD_HOT : color}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* No fallback: the page's backdrop covers the canvas until ModelBlocks reports its first frame. */}
      <Suspense fallback={null}>
        <ModelBlocks refs={refs} glass={glass} url={blocksUrl(tier)} prepass={!full} shapesRef={shapesRef} onReady={onReady} />
      </Suspense>

      <group ref={paoHolder}>
        <primitive object={pao} />
      </group>

      {full && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.8} intensity={0.6} />
          <Vignette offset={0.28} darkness={0.72} />
        </EffectComposer>
      )}
    </>
  );
}

/** Studio backdrop: frosted glass blocks on obsidian, Pao assembling the build. Load with next/dynamic, ssr:false. */
export default function StudioScene(props: SceneProps) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  const full = props.tier === "full";
  useGLTF.preload(blocksUrl(props.tier), false, true); // start the fetch alongside the WebGL context, not after it
  return (
    <Canvas
      aria-hidden
      frameloop={hidden ? "demand" : "always"}
      dpr={full ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: !full, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 40, position: [0, 0.25, CAM_Z] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Rig {...props} />
    </Canvas>
  );
}
