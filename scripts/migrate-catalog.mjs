/**
 * One-time migration: reads lib/catalog-static.json and inserts
 * every node + image into Supabase catalog_nodes + product_images tables.
 *
 * Run with: node scripts/migrate-catalog.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, '..', 'lib', 'catalog-static.json');

// Load env vars from .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const idx = l.indexOf('='); return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]; })
);

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

let inserted = 0;
let imagesInserted = 0;

async function migrateNode(node, parentId, orderIndex) {
  // Skip the root wrapper node — its children are the real families
  const { data, error } = await sb.from('catalog_nodes').insert({
    parent_id: parentId,
    name: node.display ?? node.name,
    slug: node.slug,
    order_index: orderIndex,
    is_leaf: !node.children || node.children.length === 0,
    cover_image_url: node.coverImage ?? null,
  }).select('id').single();

  if (error) {
    console.error(`  ✗ Failed to insert "${node.name}":`, error.message);
    return;
  }

  const nodeId = data.id;
  inserted++;
  const prefix = '  '.repeat((node.slugPath?.length ?? 0));
  console.log(`${prefix}✓ ${node.display ?? node.name} (${node.slug})`);

  // Insert images
  if (node.relPath && node.images?.length) {
    const imageRows = node.images.map((img, i) => ({
      node_id: nodeId,
      url: encodeURI('/' + node.relPath + '/' + img),
      order_index: i,
    }));
    const { error: imgErr } = await sb.from('product_images').insert(imageRows);
    if (imgErr) {
      console.error(`  ✗ Image insert failed for "${node.name}":`, imgErr.message);
    } else {
      imagesInserted += imageRows.length;
      console.log(`${prefix}  → ${imageRows.length} images`);
    }
  }

  // Recurse into children
  if (node.children?.length) {
    for (let i = 0; i < node.children.length; i++) {
      await migrateNode(node.children[i], nodeId, i);
    }
  }
}

async function run() {
  console.log('Checking if migration already ran…');
  const { count } = await sb.from('catalog_nodes').select('id', { count: 'exact', head: true });
  if (count > 0) {
    console.error(`\n✗ catalog_nodes already has ${count} rows. Migration aborted to avoid duplicates.`);
    console.error('  If you want to re-run, delete all rows first in the Supabase SQL editor:');
    console.error('  DELETE FROM catalog_nodes;');
    process.exit(1);
  }

  console.log('\nStarting migration…\n');

  // The root node is a wrapper — migrate its children (the 8 families)
  const families = catalog.children ?? [];
  for (let i = 0; i < families.length; i++) {
    await migrateNode(families[i], null, i);
  }

  console.log(`\n✓ Done! Inserted ${inserted} nodes and ${imagesInserted} images.`);
}

run().catch(err => {
  console.error('\n✗ Migration failed:', err);
  process.exit(1);
});
