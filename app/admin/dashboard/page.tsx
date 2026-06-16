import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const sb = await createSupabaseServerClient();
  const [{ count: newsCount }, { count: nodeCount }] = await Promise.all([
    sb.from('news_items').select('*', { count: 'exact', head: true }),
    sb.from('catalog_nodes').select('*', { count: 'exact', head: true }),
  ]);

  const cards = [
    { label: 'Product nodes', value: nodeCount ?? 0, href: '/admin/products', color: '#2563eb' },
    { label: 'News items',    value: newsCount ?? 0, href: '/admin/news',     color: '#16a34a' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>Welcome back, Manikandan.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {cards.map(c => (
          <a key={c.label} href={c.href} style={{ display: 'block', background: '#fff', border: '1px solid #e2e5ea', borderRadius: 12, padding: '20px 24px', textDecoration: 'none' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{c.label}</div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <a href="/admin/news/new" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', border: '2px dashed #d1d5db', borderRadius: 12, padding: 24, textDecoration: 'none', color: '#374151', fontSize: 14, fontWeight: 600 }}>
          + Add news item
        </a>
        <a href="/admin/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', border: '2px dashed #d1d5db', borderRadius: 12, padding: 24, textDecoration: 'none', color: '#374151', fontSize: 14, fontWeight: 600 }}>
          + Manage products
        </a>
      </div>
    </div>
  );
}
