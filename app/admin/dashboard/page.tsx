import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Box, FolderTree, Newspaper, Users, ImageOff, Clock,
  Plus, FilePlus2, FolderPlus, ArrowUpRight,
} from 'lucide-react';

const DAY = 24 * 60 * 60 * 1000;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

type ActivityItem = {
  id: string; kind: 'product' | 'folder' | 'news' | 'application';
  label: string; sub: string; created_at: string; href: string;
};

export default async function DashboardPage() {
  const sb = await createSupabaseServerClient();
  const weekAgo = new Date(Date.now() - 7 * DAY).toISOString();

  const [
    { data: nodes },
    { data: newsRows },
    { count: newsCount },
    { data: appRows },
    { count: appCount },
    { count: newAppCount },
  ] = await Promise.all([
    sb.from('catalog_nodes').select('id, name, is_leaf, cover_image_url, created_at').order('created_at', { ascending: false }),
    sb.from('news_items').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
    sb.from('news_items').select('id', { count: 'exact', head: true }),
    sb.from('career_applications').select('id, name, role, created_at').order('created_at', { ascending: false }).limit(5),
    sb.from('career_applications').select('id', { count: 'exact', head: true }),
    sb.from('career_applications').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
  ]);

  const allNodes = nodes ?? [];
  const products = allNodes.filter(n => n.is_leaf);
  const folders = allNodes.filter(n => !n.is_leaf);
  const missingPhotos = products.filter(p => !p.cover_image_url);

  const cards = [
    { label: 'Products', value: products.length, href: '/admin/products', icon: Box, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Categories', value: folders.length, href: '/admin/products', icon: FolderTree, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'News articles', value: newsCount ?? 0, href: '/admin/news', icon: Newspaper, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Applications', value: appCount ?? 0, href: '/admin/careers', icon: Users, color: '#d81818', bg: '#fef2f2', badge: newAppCount ? `+${newAppCount} this week` : undefined },
  ];

  // Merge the three most-recent sources into one activity feed
  const activity: ActivityItem[] = [
    ...allNodes.slice(0, 5).map(n => ({
      id: n.id, kind: (n.is_leaf ? 'product' : 'folder') as 'product' | 'folder',
      label: n.is_leaf ? `Product added: ${n.name}` : `Category added: ${n.name}`,
      sub: n.is_leaf ? 'Product' : 'Category',
      created_at: n.created_at, href: `/admin/products/${n.id}`,
    })),
    ...(newsRows ?? []).map(n => ({
      id: n.id, kind: 'news' as const, label: `News published: ${n.title}`, sub: 'News',
      created_at: n.created_at, href: `/admin/news/${n.id}`,
    })),
    ...(appRows ?? []).map(a => ({
      id: a.id, kind: 'application' as const, label: `Application from ${a.name}`, sub: a.role,
      created_at: a.created_at, href: '/admin/careers',
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

  const ACTIVITY_ICON: Record<ActivityItem['kind'], { Icon: typeof Box; color: string; bg: string }> = {
    product:     { Icon: Box,        color: '#2563eb', bg: '#eff6ff' },
    folder:      { Icon: FolderTree, color: '#7c3aed', bg: '#f5f3ff' },
    news:        { Icon: Newspaper,  color: '#16a34a', bg: '#f0fdf4' },
    application: { Icon: Users,      color: '#d81818', bg: '#fef2f2' },
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.01em' }}>Welcome back, Manikandan.</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{
            display: 'block', background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16,
            padding: '22px 22px', textDecoration: 'none', position: 'relative', overflow: 'hidden',
            transition: 'border-color 150ms, box-shadow 150ms',
          }} className="dash-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={19} color={c.color} strokeWidth={2} />
              </div>
              <ArrowUpRight size={15} color="#d1d5db" />
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              {c.label}
              {c.badge && (
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#d81818', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 99, padding: '1px 7px' }}>
                  {c.badge}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }} className="dash-grid">

        {/* ── Recent activity ──────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={15} color="#6b7280" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Recent activity</span>
          </div>
          {activity.length === 0 ? (
            <p style={{ padding: 24, fontSize: 13.5, color: '#9ca3af', margin: 0 }}>Nothing yet — activity will show up here as you add products, news, or receive applications.</p>
          ) : (
            <div>
              {activity.map(item => {
                const { Icon, color, bg } = ACTIVITY_ICON[item.kind];
                return (
                  <Link key={`${item.kind}-${item.id}`} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px',
                    borderBottom: '1px solid #f3f4f6', textDecoration: 'none', color: 'inherit',
                  }} className="dash-row">
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                      <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 1 }}>{item.sub}</div>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af', flexShrink: 0 }}>{timeAgo(item.created_at)}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right column: needs attention + quick actions ──────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Needs attention</span>
            </div>
            <div style={{ padding: 18 }}>
              {missingPhotos.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>All products have a cover photo. Nice.</p>
              ) : (
                <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ImageOff size={14} color="#d97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{missingPhotos.length} product{missingPhotos.length === 1 ? '' : 's'} missing a cover photo</div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af' }}>These show a placeholder image on the site</div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e5ea' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Quick actions</span>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/admin/news/new" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#1a1a2e', fontSize: 13.5, fontWeight: 600, background: '#f8f9fa' }} className="dash-action">
                <FilePlus2 size={15} color="#16a34a" /> Add news item
              </Link>
              <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#1a1a2e', fontSize: 13.5, fontWeight: 600, background: '#f8f9fa' }} className="dash-action">
                <FolderPlus size={15} color="#7c3aed" /> Manage products
              </Link>
              <Link href="/admin/careers" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#1a1a2e', fontSize: 13.5, fontWeight: 600, background: '#f8f9fa' }} className="dash-action">
                <Plus size={15} color="#d81818" /> Review applications
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dash-card:hover { border-color: #c7d2fe !important; box-shadow: 0 4px 16px rgba(0,0,0,.05); }
        .dash-row:hover { background: #f8f9fa; }
        .dash-action:hover { background: #f0f1f3 !important; }
        @media (max-width: 880px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
