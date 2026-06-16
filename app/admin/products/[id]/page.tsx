import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductEditor from './ProductEditor';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createSupabaseServerClient();

  const [
    { data: node },
    { data: images },
    { data: specs },
    { data: overview },
    { data: applications },
    { data: videos },
  ] = await Promise.all([
    sb.from('catalog_nodes').select('*').eq('id', id).single(),
    sb.from('product_images').select('*').eq('node_id', id).order('order_index'),
    sb.from('product_specs').select('*').eq('node_id', id).order('order_index'),
    sb.from('product_overview').select('*').eq('node_id', id).single(),
    sb.from('product_applications').select('*').eq('node_id', id).order('order_index'),
    sb.from('product_videos').select('*').eq('node_id', id).order('order_index'),
  ]);

  if (!node) notFound();

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/admin/products" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14 }}>← Products</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>{node.name}</h1>
        <span style={{ fontSize: 11, padding: '3px 8px', background: node.is_leaf ? '#f0fdf4' : '#eff6ff', color: node.is_leaf ? '#16a34a' : '#2563eb', borderRadius: 99, border: `1px solid ${node.is_leaf ? '#bbf7d0' : '#bfdbfe'}` }}>
          {node.is_leaf ? 'Product' : 'Folder'}
        </span>
      </div>

      <ProductEditor
        node={node}
        images={images ?? []}
        specs={specs ?? []}
        overview={overview}
        applications={applications ?? []}
        video={videos?.[0] ?? null}
      />
    </div>
  );
}
