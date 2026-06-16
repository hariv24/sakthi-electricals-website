/**
 * lib/catalog.ts  –  server-only utility
 * Reads the public/assets/CAT - 2026 folder tree and exposes:
 *   getCatalogTree()     – full tree (React-cached per request)
 *   findBySlugPath()     – look up a node by URL slug array
 *   getAllSlugPaths()    – all folder slug paths (for generateStaticParams)
 *   extractMenuData()   – top-2 levels for the Header mega-menu
 */

import { readdir } from 'fs/promises';
import path from 'path';
import { cache } from 'react';

/* ── paths ─────────────────────────────────────────────────────────────────── */

export const CAT_ABS = path.join(process.cwd(), 'public', 'assets', 'CAT - 2026');
export const CAT_REL = 'assets/CAT - 2026'; // relative to public/

/* ── types ─────────────────────────────────────────────────────────────────── */

export interface CatalogNode {
  name: string;        // raw folder name
  display: string;     // human-readable display name
  slug: string;        // this segment's URL slug
  slugPath: string[];  // full slug path from CAT-2026 root (not including root itself)
  relPath: string;     // path relative to public/
  images: string[];    // filenames of images directly in this folder
  coverImage: string | null; // encoded URL of first image found recursively
  totalImages: number; // total image count recursively
  children: CatalogNode[];
}

export type MenuSubSection = {
  display: string;
  slug: string;
  slugPath: string[];
};

export type MenuSection = {
  display: string;
  slug: string;
  slugPath: string[];
  hasChildren: boolean;
  children: MenuSubSection[];
};

export type MenuFamily = {
  display: string;
  slug: string;
  slugPath: string[];
  children: MenuSection[];
};

/* ── helpers ────────────────────────────────────────────────────────────────── */

const IMG_EXTS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp', '.tif', '.tiff',
]);

function isImg(name: string) {
  return IMG_EXTS.has(path.extname(name).toLowerCase());
}

export function formatName(raw: string): string {
  return raw.trim();
}

export function toSlug(name: string): string {
  return name.trim()
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function findCoverRel(node: CatalogNode): string | null {
  for (const img of node.images) {
    return encodeURI('/' + node.relPath + '/' + img);
  }
  for (const child of node.children) {
    const found = findCoverRel(child);
    if (found) return found;
  }
  return null;
}

function countImages(node: CatalogNode): number {
  return node.images.length + node.children.reduce((s, c) => s + c.totalImages, 0);
}

/* ── tree builder ───────────────────────────────────────────────────────────── */

async function buildNode(
  absDir: string,
  relPath: string,
  parentSlugPath: string[],
): Promise<CatalogNode> {
  const name = path.basename(absDir);
  const slug = toSlug(name);
  const slugPath = [...parentSlugPath, slug];

  const node: CatalogNode = {
    name,
    display: formatName(name),
    slug,
    slugPath,
    relPath,
    images: [],
    coverImage: null,
    totalImages: 0,
    children: [],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let entries: any[] = [];
  try {
    entries = await readdir(absDir, { withFileTypes: true });
  } catch {
    return node;
  }

  entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  );

  for (const e of entries) {
    if (e.name.startsWith('.') || e.name.startsWith('~$')) continue;
    const childRel = relPath + '/' + e.name;
    if (e.isDirectory()) {
      const child = await buildNode(path.join(absDir, e.name), childRel, slugPath);
      node.children.push(child);
    } else if (isImg(e.name)) {
      node.images.push(e.name);
    }
  }

  node.coverImage = findCoverRel(node);
  node.totalImages = countImages(node);
  return node;
}

/* ── public API ─────────────────────────────────────────────────────────────── */

/**
 * Strip the root folder's slug ("cat-2026") from all slugPaths so that
 * the 8 product families start the URL path directly, e.g.
 *   /products/instrument-transformers   (not /products/cat-2026/instrument-transformers)
 */
function remapSlugPaths(node: CatalogNode): CatalogNode {
  const newSlugPath = node.slugPath.length > 0 ? node.slugPath.slice(1) : [];
  return {
    ...node,
    slugPath: newSlugPath,
    children: node.children.map(remapSlugPaths),
  };
}

const CUSTOM_ORDER: Record<string, string[]> = {
  // root-level product families
  '': [
    'instrument-transformers',
    'electrical-power-and-control-panels',
    'epoxy-insulators',
    'vibratory-feeder',
    'solar-net-metring-panels',
    'energy-auditing-for-msme-manufacturer',
    'electrical-test-benchses',
    'customer-requirement-designs',
  ],
  // inside Instrument Transformers
  'instrument-transformers': [
    'current-transformers',
    'control-transformers',
    'hea-transformers',
    'auto-transformers',
    'chokes',
  ],
};

function applyCustomOrder(node: CatalogNode): CatalogNode {
  const key = node.slugPath.join('/');
  const order = CUSTOM_ORDER[key];
  const sortedChildren = order
    ? [...node.children].sort((a, b) => {
        const ai = order.indexOf(a.slug);
        const bi = order.indexOf(b.slug);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
    : node.children;
  return { ...node, children: sortedChildren.map(applyCustomOrder) };
}

// React cache ensures we only build the tree once per request.
// In production, reads from pre-generated JSON (created by scripts/generate-catalog.mjs
// during prebuild) so the lambda doesn't need the image files in its bundle.
export const getCatalogTree = cache(async (): Promise<CatalogNode> => {
  if (process.env.NODE_ENV === 'production') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const data = require('./catalog-static.json');
      return data as CatalogNode;
    } catch {
      // fall through to filesystem read if JSON not available
    }
  }
  const tree = await buildNode(CAT_ABS, CAT_REL, []);
  const remapped = remapSlugPaths(tree);
  return applyCustomOrder(remapped);
});

/**
 * Reads the catalog tree from Supabase instead of the filesystem.
 * Use this in the public layout and home page so newly added products appear immediately.
 */
export const getCatalogTreeFromDB = cache(async (): Promise<CatalogNode> => {
  const { createSupabaseAdminClient } = await import('./supabase/server');
  const admin = await createSupabaseAdminClient();

  type Row = {
    id: string; parent_id: string | null; name: string;
    slug: string; is_leaf: boolean; order_index: number; cover_image_url: string | null;
  };
  const { data } = await admin
    .from('catalog_nodes')
    .select('id, parent_id, name, slug, is_leaf, order_index, cover_image_url')
    .order('order_index');
  const rows: Row[] = (data as Row[]) ?? [];

  // Build a node for each DB row
  const nodeMap = new Map<string, CatalogNode>();
  const rowMap = new Map<string, Row>();
  for (const r of rows) {
    nodeMap.set(r.id, {
      name: r.name, display: r.name, slug: r.slug,
      slugPath: [], relPath: '', images: [],
      coverImage: r.cover_image_url ?? null,
      totalImages: 0, children: [],
    });
    rowMap.set(r.id, r);
  }

  // Link children to parents; top-level nodes go under root
  const root: CatalogNode = {
    name: 'root', display: 'Products', slug: '', slugPath: [],
    relPath: '', images: [], coverImage: null, totalImages: 0, children: [],
  };
  for (const r of rows) {
    const node = nodeMap.get(r.id)!;
    if (r.parent_id === null) {
      root.children.push(node);
    } else {
      const parent = nodeMap.get(r.parent_id);
      if (parent) parent.children.push(node);
    }
  }

  // Fill slugPath recursively now that the tree is assembled
  function fillSlugPaths(node: CatalogNode, parentPath: string[]) {
    node.slugPath = [...parentPath, node.slug];
    for (const child of node.children) fillSlugPaths(child, node.slugPath);
  }
  for (const child of root.children) fillSlugPaths(child, []);

  return root;
});

/** Find a node by its full slug path array (e.g. ["instrument-transformers", "current-transformers"]) */
export function findBySlugPath(
  root: CatalogNode,
  slugPath: string[],
): CatalogNode | null {
  if (!slugPath.length) return root;
  const [first, ...rest] = slugPath;
  const child = root.children.find(c => c.slug === first);
  if (!child) return null;
  if (!rest.length) return child;
  return findBySlugPath(child, rest);
}

/** Breadcrumb items from root to the node at slugPath */
export function getBreadcrumb(
  root: CatalogNode,
  slugPath: string[],
): { display: string; href: string }[] {
  const crumbs: { display: string; href: string }[] = [
    { display: 'Products', href: '/products' },
  ];
  let cur = root;
  for (let i = 0; i < slugPath.length; i++) {
    const child = cur.children.find(c => c.slug === slugPath[i]);
    if (!child) break;
    crumbs.push({
      display: child.display,
      href: '/products/' + slugPath.slice(0, i + 1).join('/'),
    });
    cur = child;
  }
  return crumbs;
}

/** All folder slug paths (for generateStaticParams) */
export function getAllSlugPaths(root: CatalogNode): string[][] {
  const result: string[][] = [];
  function walk(node: CatalogNode) {
    if (node.slugPath.length) result.push(node.slugPath);
    node.children.forEach(walk);
  }
  root.children.forEach(walk);
  return result;
}

/** Extract top-3 levels for the Header mega-menu (serialisable plain objects) */
export function extractMenuData(root: CatalogNode): MenuFamily[] {
  return root.children.map(family => ({
    display: family.display,
    slug: family.slug,
    slugPath: family.slugPath,
    children: family.children.map(section => ({
      display: section.display,
      slug: section.slug,
      slugPath: section.slugPath,
      hasChildren: section.children.length > 0,
      children: section.children.map(sub => ({
        display: sub.display,
        slug: sub.slug,
        slugPath: sub.slugPath,
      })),
    })),
  }));
}
