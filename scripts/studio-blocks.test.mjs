import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const NAMES = ['dashboard', 'table', 'form', 'map', 'booking', 'kanban', 'odontogram'].map((n) => `block_${n}`);
const TIERS = [
  { file: 'public/studio/blocks.glb', tris: 6000 },
  { file: 'public/studio/blocks-lite.glb', tris: 1200 },
];

await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder });

for (const { file, tris } of TIERS) {
  test(file, async () => {
    const doc = await io.read(resolve(root, file));
    const nodes = doc.getRoot().listNodes();
    assert.deepEqual(nodes.map((n) => n.getName()).sort(), [...NAMES].sort());
    for (const node of nodes) {
      const mesh = node.getMesh();
      assert.ok(mesh, `${node.getName()} has a mesh`);
      let count = 0;
      let max = 0;
      for (const prim of mesh.listPrimitives()) {
        count += prim.getIndices().getCount() / 3;
        const pos = prim.getAttribute('POSITION');
        const lo = [Infinity, Infinity, Infinity];
        const hi = [-Infinity, -Infinity, -Infinity];
        const v = [0, 0, 0];
        const sc = node.getScale();
        const tr = node.getTranslation();
        for (let i = 0; i < pos.getCount(); i++) {
          pos.getElement(i, v); // quantize() stores a node scale; apply it
          for (let k = 0; k < 3; k++) { const w = v[k] * sc[k] + tr[k]; lo[k] = Math.min(lo[k], w); hi[k] = Math.max(hi[k], w); }
        }
        max = Math.max(max, ...hi.map((h, k) => h - lo[k]));
        assert.ok(Math.abs(lo[1]) <= 0.02, `${node.getName()} min Y ${lo[1]}`);
        for (const k of [0, 2]) assert.ok(Math.abs((lo[k] + hi[k]) / 2) <= 0.02, `${node.getName()} mid ${k} ${(lo[k] + hi[k]) / 2}`);
      }
      assert.ok(Math.abs(count - tris) <= tris * 0.25, `${node.getName()} tris ${count} vs ${tris}`);
      assert.ok(max <= 1.05, `${node.getName()} max dim ${max}`);
    }
    assert.equal(doc.getRoot().listTextures().length, 0);
  });
}

test('size budget', () => {
  const [full, lite] = TIERS.map((t) => statSync(resolve(root, t.file)).size);
  console.log(`sizes: full ${full} B, lite ${lite} B, total ${full + lite} B`);
  assert.ok(full + lite <= 1.5 * 1024 * 1024, 'total <= 1.5 MB');
  assert.ok(lite <= 400 * 1024, 'lite <= 400 KB');
});
