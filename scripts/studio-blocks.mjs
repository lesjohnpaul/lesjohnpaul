// Usage: node scripts/studio-blocks.mjs [rawDir=.superpowers/phase2/raw]  (paths relative to repo root)
// Raw Higgsfield GLBs (picks in studio-blocks.picks.json: { file, job } per block, job = Higgsfield job id) -> public/studio/blocks{,-lite}.glb
import { readFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { mergeDocuments, weld, simplify, prune, dedup, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const rawDir = resolve(root, process.argv[2] ?? '.superpowers/phase2/raw');
const picks = JSON.parse(readFileSync(resolve(root, 'scripts/studio-blocks.picks.json')));
const TIERS = [
  { out: 'public/studio/blocks.glb', tris: 6000 },
  { out: 'public/studio/blocks-lite.glb', tris: 1200 },
];

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({
    'meshopt.encoder': MeshoptEncoder,
    'meshopt.decoder': MeshoptDecoder,
  });

// Bake: uniform scale so max extent = 1, centre X/Z, base at y=0.
function normalise(pos) {
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  const v = [0, 0, 0];
  for (let i = 0; i < pos.getCount(); i++) {
    pos.getElement(i, v);
    for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], v[k]); hi[k] = Math.max(hi[k], v[k]); }
  }
  const s = 1 / Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
  const c = [(lo[0] + hi[0]) / 2, lo[1], (lo[2] + hi[2]) / 2];
  for (let i = 0; i < pos.getCount(); i++) {
    pos.getElement(i, v);
    pos.setElement(i, v.map((x, k) => (x - c[k]) * s));
  }
}

// Crease-aware smooth normals: at each vertex, faces whose normals are within
// CREASE degrees of a cluster's seed face share one (area-weighted) normal;
// other faces get a split vertex. Replaces position/normal/index on the prim.
const COS = Math.cos((40 * Math.PI) / 180);
function creaseNormals(doc, prim) {
  const p = prim.getAttribute('POSITION').getArray();
  const idx = prim.getIndices().getArray();
  const nt = idx.length / 3;
  const fn = new Float32Array(nt * 3); // area-weighted (unnormalised)
  const fu = new Float32Array(nt * 3); // unit
  const inc = Array.from({ length: p.length / 3 }, () => []);
  for (let t = 0; t < nt; t++) {
    const [a, b, c] = [idx[t * 3] * 3, idx[t * 3 + 1] * 3, idx[t * 3 + 2] * 3];
    const e1 = [p[b] - p[a], p[b + 1] - p[a + 1], p[b + 2] - p[a + 2]];
    const e2 = [p[c] - p[a], p[c + 1] - p[a + 1], p[c + 2] - p[a + 2]];
    const f = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const l = Math.hypot(...f) || 1;
    for (let k = 0; k < 3; k++) { fn[t * 3 + k] = f[k]; fu[t * 3 + k] = f[k] / l; }
    for (let k = 0; k < 3; k++) inc[idx[t * 3 + k]].push(t);
  }
  const outP = [], outN = [];
  const outI = new Uint32Array(idx.length);
  for (let v = 0; v < inc.length; v++) {
    const clusters = []; // {seed, sum:[x,y,z], id}
    for (const t of inc[v]) {
      let cl = clusters.find((c) => fu[c.seed] * fu[t * 3] + fu[c.seed + 1] * fu[t * 3 + 1] + fu[c.seed + 2] * fu[t * 3 + 2] >= COS);
      if (!cl) {
        cl = { seed: t * 3, sum: [0, 0, 0], id: outP.length / 3 };
        clusters.push(cl);
        outP.push(p[v * 3], p[v * 3 + 1], p[v * 3 + 2]);
        outN.push(0, 0, 0);
      }
      for (let k = 0; k < 3; k++) cl.sum[k] += fn[t * 3 + k];
      for (let k = 0; k < 3; k++) if (idx[t * 3 + k] === v) outI[t * 3 + k] = cl.id;
    }
    for (const cl of clusters) {
      const l = Math.hypot(...cl.sum) || 1;
      for (let k = 0; k < 3; k++) outN[cl.id * 3 + k] = cl.sum[k] / l;
    }
  }
  prim.getAttribute('POSITION').setArray(Float32Array.from(outP));
  prim.getIndices().setArray(outI);
  prim.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(Float32Array.from(outN)));
}

function triCount(doc) {
  return doc.getRoot().listMeshes()[0].listPrimitives()[0].getIndices().getCount() / 3;
}

mkdirSync(resolve(root, 'public/studio'), { recursive: true });
for (const { out, tris } of TIERS) {
  const final = new Document();
  const buffer = final.createBuffer();
  const scene = final.createScene('studio-blocks');
  for (const [label, { file }] of Object.entries(picks)) {
    // one document per block so simplify gets a per-mesh ratio
    const src = await io.read(resolve(rawDir, file));
    const sprim = src.getRoot().listMeshes()[0].listPrimitives()[0];
    const doc = new Document();
    doc.createBuffer();
    const position = doc.createAccessor().setType('VEC3').setArray(Float32Array.from(sprim.getAttribute('POSITION').getArray()));
    const indices = doc.createAccessor().setType('SCALAR').setArray(Uint32Array.from(sprim.getIndices().getArray()));
    normalise(position);
    const prim = doc.createPrimitive().setAttribute('POSITION', position).setIndices(indices);
    doc.createScene().addChild(doc.createNode(`block_${label}`).setMesh(doc.createMesh(`block_${label}`).addPrimitive(prim)));
    await doc.transform(weld());
    await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: tris / triCount(doc), error: 1 }));
    // ponytail: normals after simplify (deviates from ruling P2): creating split verts first turns creases into
    // borders that block simplification (booking lite stayed at 1638 tris)
    creaseNormals(doc, doc.getRoot().listMeshes()[0].listPrimitives()[0]);
    // merge into the tier doc: one scene, one buffer
    const before = new Set(final.getRoot().listScenes());
    mergeDocuments(final, doc);
    for (const sc of final.getRoot().listScenes()) {
      if (before.has(sc)) continue;
      sc.listChildren().forEach((n) => scene.addChild(n));
      sc.dispose();
    }
  }
  for (const b of final.getRoot().listBuffers()) if (b !== buffer) b.dispose();
  for (const a of final.getRoot().listAccessors()) a.setBuffer(buffer);
  await final.transform(prune(), dedup(), quantize(), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
  await io.write(resolve(root, out), final);
  console.log(out, statSync(resolve(root, out)).size, 'bytes');
}
