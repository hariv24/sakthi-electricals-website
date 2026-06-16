import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createNode } from '../_actions/products';
import SortableGrid from './SortableGrid';
import Link from 'next/link';
import { Plus, ChevronRight, Home, Box } from 'lucide-react';

type DBNode = {
  id: string; parent_id: string | null; name: string; slug: string;
  is_leaf: boolean; order_index: number; cover_image_url: string | null;
};

const PLACEHOLDER = '/placeholder-product.svg';

async function getBreadcrumb(sb: Awaited<ReturnType<typeof createSupabaseServerClient>>, leafId: string) {
  const crumbs: { id: string; name: string }[] = [];
  let id: string | null = leafId;
  while (id) {
    const { data } = await sb.from('catalog_nodes').select('id, name, parent_id').eq('id', id).single() as { data: { id: string; name: string; parent_id: string | null } | null };
    if (!data) break;
    crumbs.unshift({ id: data.id, name: data.name });
    id = data.parent_id;
  }
  return crumbs;
}

export default async function ProductsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const { parent } = await searchParams;
  const sb = await createSupabaseServerClient();

  // Fetch current node (if drilling into a folder)
  let currentNode: DBNode | null = null;
  if (parent) {
    const { data } = await sb.from('catalog_nodes').select('*').eq('id', parent).single();
    currentNode = data;
  }

  // Fetch children at this level
  const query = parent
    ? sb.from('catalog_nodes').select('*').eq('parent_id', parent).order('order_index')
    : sb.from('catalog_nodes').select('*').is('parent_id', null).order('order_index');
  const { data: nodes } = await query;
  const rawChildren = (nodes ?? []) as DBNode[];

  // For leaf nodes with no cover image, fall back to their first uploaded image
  const missingCoverIds = rawChildren.filter(n => n.is_leaf && !n.cover_image_url).map(n => n.id);
  const fallbackMap = new Map<string, string>();
  if (missingCoverIds.length > 0) {
    const { data: imgs } = await sb.from('product_images').select('node_id, url').in('node_id', missingCoverIds).order('order_index');
    for (const img of imgs ?? []) {
      if (!fallbackMap.has(img.node_id)) fallbackMap.set(img.node_id, img.url);
    }
  }
  const children: DBNode[] = rawChildren.map(n => ({
    ...n,
    cover_image_url: n.cover_image_url ?? fallbackMap.get(n.id) ?? null,
  }));

  // Breadcrumb (only when inside a folder)
  const crumbs = parent ? await getBreadcrumb(sb, parent) : [];

  // Total count for empty state
  const { count: totalCount } = await sb.from('catalog_nodes').select('id', { count: 'exact', head: true });

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>
              <Home size={13} /> Products
            </Link>
            {crumbs.map((c, i) => (
              <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ChevronRight size={12} color="#d1d5db" />
                {i === crumbs.length - 1 ? (
                  <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>{c.name}</span>
                ) : (
                  <Link href={`/admin/products?parent=${c.id}`} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>{c.name}</Link>
                )}
              </span>
            ))}
          </nav>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            {currentNode ? currentNode.name : 'All Products'}
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>
            {children.length} {children.length === 1 ? 'item' : 'items'} in this folder
          </p>
        </div>

        {/* Add buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {!currentNode?.is_leaf && (
            <>
              <form action={async () => { 'use server'; await createNode(parent ?? null, false); }}>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>
                  <Plus size={13} /> Add folder
                </button>
              </form>
              <form action={async () => { 'use server'; await createNode(parent ?? null, true); }}>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#d81818', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  <Plus size={13} /> Add product
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {children.length === 0 && (totalCount ?? 0) === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, padding: 64, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>No products yet</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Start by adding a product family using the button above.</p>
        </div>
      )}

      {children.length === 0 && (totalCount ?? 0) > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6b7280' }}>This folder is empty. Add a subfolder or product above.</p>
        </div>
      )}

      {/* ── Cards grid ──────────────────────────────────────────── */}
      {children.length > 0 && <SortableGrid nodes={children} />}
    </div>
  );
}
