import * as THREE from 'three';
import { createPaoModel as createPaoSculpt } from './paoSculpt.generated';

/**
 * Pao: the site's chibi mascot, rebuilt procedurally from public/images/pao/pao-reference.png
 * via the img2threejs pipeline (spec: pao-3d/object-sculpt-spec.json, generated geometry:
 * ./paoSculpt.generated.ts). This wrapper only exposes animation pivots; reconstruction data
 * lives in the spec, not here.
 *
 * Frame: height 1.0, feet at y = 0, faces +Z, character's left = +X.
 * Every pivot sits at its joint, so animate by rotating/scaling these groups:
 *   body   idle bob (position.y) / sway (rotation.z)
 *   neck   nod (rotation.x), head tilt (rotation.z)   -- pivot at the neck base
 *   armL/R wave (rotation.z, +armL / -armR raises)  -- pivot at the shoulder
 *   eyeL/R blink (scale.y -> 0.1)
 */
export type PaoParts = {
  root: THREE.Group;
  body: THREE.Object3D;
  neck: THREE.Object3D;
  head: THREE.Object3D;
  hair: THREE.Object3D;
  armL: THREE.Object3D;
  armR: THREE.Object3D;
  handL: THREE.Object3D;
  handR: THREE.Object3D;
  legL: THREE.Object3D;
  legR: THREE.Object3D;
  eyeL: THREE.Object3D;
  eyeR: THREE.Object3D;
};

const PART_IDS = {
  body: 'torso',
  neck: 'neck',
  head: 'head',
  hair: 'hair',
  armL: 'arm-l',
  armR: 'arm-r',
  handL: 'hand-l',
  handR: 'hand-r',
  legL: 'leg-l',
  legR: 'leg-r',
  eyeL: 'eye-l',
  eyeR: 'eye-r',
} as const;

export function createPaoModel(): { group: THREE.Group; parts: PaoParts } {
  const root = createPaoSculpt({ castShadow: true, receiveShadow: false });
  const nodes = (root.userData.sculptRuntime as { nodes: Record<string, THREE.Object3D> }).nodes;
  const parts = { root } as PaoParts;
  for (const [key, id] of Object.entries(PART_IDS)) {
    const node = nodes[id];
    if (!node) throw new Error(`Pao model is missing pivot "${id}"`);
    node.name = key; // stable, readable names for getObjectByName()
    (parts as Record<string, THREE.Object3D>)[key] = node;
  }
  // ponytail: the generated root carries a hidden 1mm marker box; drop it from rendering.
  nodes.root?.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && o.parent === nodes.root) o.visible = false;
  });
  root.userData.parts = parts;
  return { group: root, parts };
}

export function disposePaoModel(group: THREE.Object3D): void {
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => m.dispose());
  });
}
