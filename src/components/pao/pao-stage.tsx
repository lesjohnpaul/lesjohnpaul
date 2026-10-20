"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { createPaoModel, disposePaoModel } from "./createPaoModel";

const BODY_Y = 0.165; // resting torso height from the generated sculpt
const WAVE_S = 2.4; // wave hello on mount, then settle into idle

function Pao({ still }: { still: boolean }) {
  const { group, parts } = useMemo(() => createPaoModel(), []);
  const start = useRef<number | null>(null);
  const restArm = useRef(parts.armR.rotation.z);

  useEffect(() => () => disposePaoModel(group), [group]);

  useFrame(({ clock }) => {
    if (still) return;
    const now = clock.getElapsedTime();
    start.current ??= now;
    const t = now - start.current;

    parts.body.position.y = BODY_Y + Math.sin(t * 2) * 0.006;
    parts.neck.rotation.z = Math.sin(t * 0.9) * 0.05;

    // Wave hello, then ease the arm back down.
    if (t < WAVE_S) {
      parts.armR.rotation.z = -1.9 + Math.sin(t * 7) * 0.3;
    } else {
      const k = Math.min(1, (t - WAVE_S) / 0.5);
      parts.armR.rotation.z += (restArm.current - parts.armR.rotation.z) * k * 0.2;
    }

    // Blink for ~120ms every 3.6s.
    const blink = t % 3.6 < 0.12 ? 0.1 : 1;
    parts.eyeL.scale.y = blink;
    parts.eyeR.scale.y = blink;
  });

  return <primitive object={group} />;
}

/** 3D Pao (img2threejs procedural model, ~35 KB). Waves once, then idles. Static under reduced motion. */
export function PaoStage({ className }: { className?: string }) {
  const still = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        frameloop={still ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ fov: 30, near: 0.05, far: 20, position: [0.35, 0.55, 2.35] }}
        onCreated={({ camera }) => camera.lookAt(0, 0.5, 0)}
      >
        <hemisphereLight args={["#ffffff", "#b8b8c0", 1.25]} />
        <directionalLight position={[-0.8, 1.6, 2]} intensity={2.2} color="#fff6ec" />
        <directionalLight position={[-1.2, 1.2, -1.6]} intensity={0.8} />
        <Pao still={still} />
      </Canvas>
    </div>
  );
}
