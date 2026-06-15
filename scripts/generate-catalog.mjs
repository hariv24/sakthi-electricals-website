/**
 * Prebuild script — runs before `next build`.
 * Reads the CAT-2026 folder tree and writes lib/catalog-static.json.
 * The lambda reads this JSON instead of the filesystem, keeping the
 * function bundle small (images stay in public/ as static CDN assets).
 */

import { readdir } from 'fs/promises';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAT_ABS = path.join(__dirname, '..', 'public', 'assets', 'CAT - 2026');
const CAT_REL = 'assets/CAT - 2026';
const OUTPUT  = path.join(__dirname, '..', 'lib', 'catalog-static.json');

const IMG_EXTS = new Set(['.jpg','.jpeg','.png','.webp','.gif','.avif','.bmp','.tif','.tiff']);
const isImg = name => IMG_EXTS.has(path.extname(name).toLowerCase());

function toSlug(name) {
  return name.trim().toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function findCover(node) {
  for (const img of node.images) return encodeURI('/' + node.relPath + '/' + img);
  for (const child of node.children) { const f = findCover(child); if (f) return f; }
  return null;
}

function countImages(node) {
  return node.images.length + node.children.reduce((s, c) => s + c.totalImages, 0);
}

async function buildNode(absDir, relPath, parentSlugPath) {
  const name = path.basename(absDir);
  const slug = toSlug(name);
  const slugPath = [...parentSlugPath, slug];
  const node = { name, display: name.trim(), slug, slugPath, relPath, images: [], coverImage: null, totalImages: 0, children: [] };

  let entries = [];
  try { entries = await readdir(absDir, { withFileTypes: true }); } catch { return node; }

  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  for (const e of entries) {
    if (e.name.startsWith('.') || e.name.startsWith('~$')) continue;
    const childRel = relPath + '/' + e.name;
    if (e.isDirectory()) {
      node.children.push(await buildNode(path.join(absDir, e.name), childRel, slugPath));
    } else if (isImg(e.name)) {
      node.images.push(e.name);
    }
  }

  node.coverImage  = findCover(node);
  node.totalImages = countImages(node);
  return node;
}

function remapSlugPaths(node) {
  return { ...node, slugPath: node.slugPath.slice(1), children: node.children.map(remapSlugPaths) };
}

const CUSTOM_ORDER = {
  '': ['instrument-transformers','electrical-power-and-control-panels','epoxy-insulators','vibratory-feeder','solar-net-metring-panels','energy-auditing-for-msme-manufacturer','electrical-test-benchses','customer-requirement-designs'],
  'instrument-transformers': ['current-transformers','control-transformers','hea-transformers','auto-transformers','chokes'],
};

function applyCustomOrder(node) {
  const key = node.slugPath.join('/');
  const order = CUSTOM_ORDER[key];
  const sorted = order
    ? [...node.children].sort((a, b) => {
        const ai = order.indexOf(a.slug), bi = order.indexOf(b.slug);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1; if (bi === -1) return -1;
        return ai - bi;
      })
    : node.children;
  return { ...node, children: sorted.map(applyCustomOrder) };
}

const raw     = await buildNode(CAT_ABS, CAT_REL, []);
const remapped = remapSlugPaths(raw);
const ordered  = applyCustomOrder(remapped);

writeFileSync(OUTPUT, JSON.stringify(ordered));
console.log(`✓ catalog-static.json written (${ordered.children.length} families)`);
