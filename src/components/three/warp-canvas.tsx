"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const COUNT = 900;
const DEPTH = 120;
const PALETTE = ["#f5d476", "#a78bfa", "#ede4ff", "#c4b5fd"];

// Star field lives outside React: it is mutated every frame and only ever rendered client-side.
const stars = Array.from({ length: COUNT }, () => ({
  angle: Math.random() * Math.PI * 2,
  radius: 1.4 + Math.random() * 10,
  z: -Math.random() * DEPTH,
}));

// Streaks fly at the camera: a hard burst on entry that decays into a slow drift behind the content.
function Streaks() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const elapsed = useRef(0);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) mesh.setColorAt(i, c.set(PALETTE[i % PALETTE.length]));
    mesh.instanceColor!.needsUpdate = true;
  }, []);

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    elapsed.current += dt;
    const speed = 1.5 + 110 * Math.exp(-elapsed.current * 1.5);
    for (let i = 0; i < COUNT; i++) {
      const s = stars[i];
      s.z += speed * dt;
      if (s.z > 2) s.z -= DEPTH;
      dummy.position.set(Math.cos(s.angle) * s.radius, Math.sin(s.angle) * s.radius, s.z);
      dummy.scale.set(1, 1, 0.3 + speed * 0.09);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.z += dt * (0.04 + speed * 0.003);
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[0.025, 0.025, 1]} />
      <meshBasicMaterial transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

export default function WarpCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: DEPTH }}
      gl={{ antialias: false, alpha: true }}
    >
      <Streaks />
    </Canvas>
  );
}
