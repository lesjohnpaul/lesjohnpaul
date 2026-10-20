"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { createPaoModel, disposePaoModel } from "./createPaoModel";

const BODY_Y = 0.165; // resting torso height from the generated sculpt
const CLICK_SLOP = 0.03; // world units of movement before a press counts as a drag
const BOUNDS = { x: 0.62, yMax: 0.55 };

type Phase = "pop" | "idle" | "excited" | "drag" | "drop";

const easeOutBack = (k: number) => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2);

function PaoActor({ reduced, onPopped, onFirstTouch }: { reduced: boolean; onPopped: () => void; onFirstTouch: () => void }) {
  const { group, parts } = useMemo(() => createPaoModel(), []);
  const holder = useRef<THREE.Group>(null);
  const phase = useRef<Phase>(reduced ? "idle" : "pop");
  const since = useRef<number | null>(null);
  const popped = useRef(false);
  const restArm = useRef({ l: parts.armL.rotation.z, r: parts.armR.rotation.z });
  const drag = useRef({ active: false, moved: 0, start: new THREE.Vector3(), offset: new THREE.Vector3(), dropFrom: 0 });
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const lookX = useRef(0);

  useEffect(() => () => disposePaoModel(group), [group]);
  useEffect(() => {
    if (reduced && !popped.current) {
      popped.current = true;
      onPopped();
    }
  }, [reduced, onPopped]);

  const go = (p: Phase, now: number) => {
    phase.current = p;
    since.current = now;
  };

  useFrame(({ clock, pointer }) => {
    const h = holder.current;
    if (!h) return;
    const now = clock.getElapsedTime();
    since.current ??= now;
    const t = now - since.current;
    lookX.current += (pointer.x - lookX.current) * 0.08;

    // Defaults each frame; phases override what they animate.
    let armL = restArm.current.l;
    let armR = restArm.current.r;
    parts.body.position.y = BODY_Y + Math.sin(now * 2) * 0.006;
    parts.neck.rotation.y = lookX.current * 0.35; // head follows the cursor
    parts.neck.rotation.z = Math.sin(now * 0.9) * 0.04;
    const blink = now % 3.6 < 0.12 ? 0.1 : 1;
    parts.eyeL.scale.y = blink;
    parts.eyeR.scale.y = blink;

    switch (phase.current) {
      case "pop": {
        // Burst out of the photo: scale up with overshoot, hop, spin into place, then wave.
        const k = Math.min(1, t / 0.75);
        h.scale.setScalar(Math.max(0.001, easeOutBack(k)));
        h.position.y = Math.sin(Math.min(1, t / 0.75) * Math.PI) * 0.18;
        h.rotation.y = (1 - k) * -Math.PI * 1.5;
        if (t > 0.35) armR = -1.9 + Math.sin(t * 7) * 0.3;
        if (t > 0.8 && !popped.current) {
          popped.current = true;
          onPopped();
        }
        if (t > 2.6) go("idle", now);
        break;
      }
      case "excited": {
        // Two happy hops with a full spin and both arms up.
        const k = Math.min(1, t / 1.1);
        h.position.y = Math.abs(Math.sin(k * Math.PI * 2)) * 0.16;
        h.rotation.y = k * Math.PI * 2;
        const squash = 1 + Math.sin(k * Math.PI * 4) * 0.05;
        h.scale.set(1 / squash, squash, 1 / squash);
        armL = 2.0 + Math.sin(t * 14) * 0.25;
        armR = -2.0 - Math.sin(t * 14) * 0.25;
        if (k >= 1) {
          h.rotation.y = 0;
          h.scale.setScalar(1);
          go("idle", now);
        }
        break;
      }
      case "drag": {
        h.rotation.z = THREE.MathUtils.clamp(-(h.position.x - drag.current.start.x) * 0.8, -0.35, 0.35);
        armL = 1.2 + Math.sin(now * 10) * 0.2; // flailing a little while carried
        armR = -1.2 - Math.sin(now * 10) * 0.2;
        break;
      }
      case "drop": {
        // Fall back to the floor, then squash-and-stretch on landing.
        const fall = Math.min(1, t / 0.35);
        h.position.y = drag.current.dropFrom * (1 - fall * fall);
        h.rotation.z *= 0.8;
        if (fall >= 1) {
          const b = t - 0.35;
          const squash = 1 - Math.exp(-b * 6) * Math.cos(b * 22) * 0.18;
          h.scale.set(1 / squash, squash, 1 / squash);
          if (b > 0.6) {
            h.scale.setScalar(1);
            h.rotation.z = 0;
            go("idle", now);
          }
        }
        break;
      }
      case "idle":
      default: {
        h.position.y += (0 - h.position.y) * 0.15;
        if (reduced) h.scale.setScalar(1);
      }
    }
    // Ease the arms toward this frame's targets so phase changes never snap.
    parts.armL.rotation.z += (armL - parts.armL.rotation.z) * 0.35;
    parts.armR.rotation.z += (armR - parts.armR.rotation.z) * 0.35;
  });

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    onFirstTouch();
    if (!e.ray.intersectPlane(plane, hit) || !holder.current) return;
    drag.current.active = true;
    drag.current.moved = 0;
    drag.current.start.copy(holder.current.position);
    drag.current.offset.copy(hit).sub(holder.current.position);
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d.active || !holder.current || !e.ray.intersectPlane(plane, hit)) return;
    const x = THREE.MathUtils.clamp(hit.x - d.offset.x, -BOUNDS.x, BOUNDS.x);
    const y = THREE.MathUtils.clamp(hit.y - d.offset.y, 0, BOUNDS.yMax);
    d.moved = Math.max(d.moved, Math.hypot(x - d.start.x, y - d.start.y));
    if (d.moved > CLICK_SLOP && phase.current !== "drag") {
      phase.current = "drag";
      since.current = null;
    }
    if (phase.current === "drag") holder.current.position.set(x, y, 0);
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d.active || !holder.current) return;
    d.active = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (phase.current === "drag") {
      d.dropFrom = holder.current.position.y;
      phase.current = "drop";
    } else if (!reduced) {
      phase.current = "excited";
    }
    since.current = null;
  };

  return (
    <group
      ref={holder}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerOver={() => (document.body.style.cursor = "grab")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <primitive object={group} />
    </group>
  );
}

/** Hero Pao: pops out of the photo, reveals the name, then can be clicked (excited) or dragged and dropped. */
export function PaoHero({ onPopped, onFirstTouch, className }: { onPopped: () => void; onFirstTouch: () => void; className?: string }) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  useEffect(() => () => void (document.body.style.cursor = ""), []);
  return (
    <div className={className} style={{ touchAction: "pan-y" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ fov: 30, near: 0.05, far: 20, position: [0, 0.6, 2.9] }}
        onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)}
      >
        <hemisphereLight args={["#ffffff", "#b8b8c0", 1.25]} />
        <directionalLight position={[-0.8, 1.6, 2]} intensity={2.2} color="#fff6ec" />
        <directionalLight position={[-1.2, 1.2, -1.6]} intensity={0.8} />
        <PaoActor reduced={reduced} onPopped={onPopped} onFirstTouch={onFirstTouch} />
      </Canvas>
    </div>
  );
}
