/**
 * One-time backfill: populates product_specs, product_overview and
 * product_applications for every leaf catalog_node that doesn't already
 * have rows in that table, using the same fallback content the public
 * site renders at request time (lib/productContentDefaults.ts). This is
 * what makes that content show up — and become editable — in the admin
 * product editor instead of being blank.
 *
 * Run with: npx tsx scripts/migrate-product-content.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getSpecRowsDefault,
  getApplicationsDefault,
  getOverviewDefault,
} from '../lib/productContentDefaults';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

type DBNode = {
  id: string; parent_id: string | null; name: string; slug: string; is_leaf: boolean;
};

async function run() {
  const { data: allNodes, error } = await sb
    .from('catalog_nodes')
    .select('id, parent_id, name, slug, is_leaf');
  if (error) {
    console.error('Failed to read catalog_nodes:', error.message);
    process.exit(1);
  }

  const nodes = (allNodes ?? []) as DBNode[];
  const byId = new Map(nodes.map(n => [n.id, n]));
  const leaves = nodes.filter(n => n.is_leaf);

  console.log(`Found ${leaves.length} leaf products. Checking which need content…\n`);

  function slugPathFor(node: DBNode): string[] {
    const path: string[] = [];
    let cur: DBNode | undefined = node;
    while (cur) {
      path.unshift(cur.slug);
      cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
    }
    return path;
  }

  let specsAdded = 0, overviewAdded = 0, appsAdded = 0, skipped = 0;

  for (const leaf of leaves) {
    const slugPath = slugPathFor(leaf);
    const contentNode = { display: leaf.name, slugPath };
    let touched = false;

    const { count: specCount } = await sb
      .from('product_specs').select('id', { count: 'exact', head: true }).eq('node_id', leaf.id);
    if (!specCount) {
      const rows = getSpecRowsDefault(contentNode).map(([label, value], i) => ({
        node_id: leaf.id, label, value, order_index: i,
      }));
      const { error: insErr } = await sb.from('product_specs').insert(rows);
      if (insErr) console.error(`  ✗ specs failed for "${leaf.name}":`, insErr.message);
      else { specsAdded++; touched = true; }
    }

    const { count: overviewCount } = await sb
      .from('product_overview').select('id', { count: 'exact', head: true }).eq('node_id', leaf.id);
    if (!overviewCount) {
      const { heading, paragraphs } = getOverviewDefault(contentNode);
      const { error: insErr } = await sb.from('product_overview').insert({
        node_id: leaf.id, heading, paragraph_1: paragraphs[0] ?? '', paragraph_2: paragraphs[1] ?? null,
      });
      if (insErr) console.error(`  ✗ overview failed for "${leaf.name}":`, insErr.message);
      else { overviewAdded++; touched = true; }
    }

    const { count: appsCount } = await sb
      .from('product_applications').select('id', { count: 'exact', head: true }).eq('node_id', leaf.id);
    if (!appsCount) {
      const rows = getApplicationsDefault(contentNode).map((a, i) => ({
        node_id: leaf.id, title: a.title, body: a.body, icon_name: a.icon_name, order_index: i,
      }));
      const { error: insErr } = await sb.from('product_applications').insert(rows);
      if (insErr) console.error(`  ✗ applications failed for "${leaf.name}":`, insErr.message);
      else { appsAdded++; touched = true; }
    }

    if (touched) console.log(`✓ ${leaf.name}`);
    else skipped++;
  }

  console.log(`\nDone. Specs added: ${specsAdded}, overviews added: ${overviewAdded}, applications added: ${appsAdded}. Fully skipped (already had all content): ${skipped}.`);
}

run().catch(err => {
  console.error('\n✗ Migration failed:', err);
  process.exit(1);
});
