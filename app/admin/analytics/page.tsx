import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Eye, Users, Timer, FileText, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';

type Range = 'week' | 'month' | 'year';

type ViewRow = {
  path: string; visitor_id: string; session_id: string;
  created_at: string; device: string | null; country: string | null; referrer: string | null;
};

function rangeStart(range: Range): Date {
  const d = new Date();
  if (range === 'week') d.setDate(d.getDate() - 7);
  else if (range === 'month') d.setDate(d.getDate() - 30);
  else d.setDate(d.getDate() - 365);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildBuckets(range: Range, rows: ViewRow[]) {
  const buckets: { label: string; count: number }[] = [];
  if (range === 'year') {
    for (let i = 11; i >= 0; i--) {
      const month = new Date(); month.setDate(1); month.setHours(0, 0, 0, 0); month.setMonth(month.getMonth() - i);
      const next = new Date(month); next.setMonth(month.getMonth() + 1);
      const count = new Set(rows.filter(r => { const t = new Date(r.created_at); return t >= month && t < next; }).map(r => r.visitor_id)).size;
      buckets.push({ label: month.toLocaleDateString('en-IN', { month: 'short' }), count });
    }
  } else {
    const days = range === 'week' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - i);
      const next = new Date(day); next.setDate(day.getDate() + 1);
      const count = new Set(rows.filter(r => { const t = new Date(r.created_at); return t >= day && t < next; }).map(r => r.visitor_id)).size;
      buckets.push({ label: day.toLocaleDateString('en-IN', range === 'week' ? { weekday: 'short' } : { day: 'numeric' }), count });
    }
  }
  return buckets;
}

function topCounts(rows: ViewRow[], key: keyof ViewRow, fallback: string, limit: number) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const v = (r[key] as string | null) || fallback;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

const DEVICE_ICON: Record<string, typeof Smartphone> = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range: rawRange } = await searchParams;
  const range: Range = rawRange === 'month' || rawRange === 'year' ? rawRange : 'week';

  const sb = await createSupabaseServerClient();
  const start = rangeStart(range);
  const { data } = await sb
    .from('page_views')
    .select('path, visitor_id, session_id, created_at, device, country, referrer')
    .gte('created_at', start.toISOString())
    .order('created_at');

  const rows = (data ?? []) as ViewRow[];

  const totalViews = rows.length;
  const uniqueVisitors = new Set(rows.map(r => r.visitor_id)).size;

  const sessions = new Map<string, { min: number; max: number }>();
  for (const r of rows) {
    const t = new Date(r.created_at).getTime();
    const s = sessions.get(r.session_id);
    if (!s) sessions.set(r.session_id, { min: t, max: t });
    else { s.min = Math.min(s.min, t); s.max = Math.max(s.max, t); }
  }
  const durations = Array.from(sessions.values()).map(s => (s.max - s.min) / 1000);
  const avgDurationSec = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  const avgDurationLabel = avgDurationSec < 60 ? `${Math.round(avgDurationSec)}s` : `${Math.round(avgDurationSec / 60)}m`;

  const buckets = buildBuckets(range, rows);
  const maxBucket = Math.max(1, ...buckets.map(b => b.count));

  const topPages = topCounts(rows, 'path', '/', 8);
  const topReferrers = topCounts(rows, 'referrer', 'Direct / no referrer', 6);
  const topCountries = topCounts(rows, 'country', 'Unknown', 6);
  const deviceCounts = topCounts(rows, 'device', 'desktop', 3);

  const TABS: { value: Range; label: string }[] = [
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: 'year', label: 'Last 12 months' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.01em' }}>Analytics</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Who&apos;s visiting the site, and what they look at.</p>
        </div>
        <div style={{ display: 'flex', gap: 6, background: '#f1f2f5', borderRadius: 10, padding: 4 }}>
          {TABS.map(t => (
            <Link key={t.value} href={`/admin/analytics?range=${t.value}`} style={{
              padding: '7px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: range === t.value ? '#1a1a2e' : '#6b7280',
              background: range === t.value ? '#fff' : 'transparent',
              boxShadow: range === t.value ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
            }}>
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, padding: 64, textAlign: 'center' }}>
          <Eye size={36} color="#d1d5db" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>No visits recorded in this period</h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Data fills in automatically as people browse the public site.</p>
        </div>
      ) : (
        <>
          {/* ── Top stat row ──────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Unique visitors', value: uniqueVisitors, Icon: Users, color: '#2563eb', bg: '#eff6ff' },
              { label: 'Page views', value: totalViews, Icon: Eye, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Avg. time on site', value: avgDurationLabel, Icon: Timer, color: '#d97706', bg: '#fffbeb' },
              { label: 'Pages viewed', value: topPages.length, Icon: FileText, color: '#7c3aed', bg: '#f5f3ff' },
            ].map(c => (
              <div key={c.label} style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, padding: '20px 22px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <c.Icon size={17} color={c.color} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 12.5, color: '#6b7280', marginTop: 6 }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── Trend chart ───────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Visitors over time</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: range === 'month' ? 3 : 8, height: 120 }}>
              {buckets.map((b, i) => (
                <div key={i} title={`${b.label}: ${b.count} visitor${b.count === 1 ? '' : 's'}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', maxWidth: range === 'month' ? 8 : 28, height: Math.max(3, (b.count / maxBucket) * 96), background: '#2563eb', borderRadius: 3 }} />
                  {(range !== 'month' || i % 5 === 0) && <span style={{ fontSize: 9.5, color: '#9ca3af' }}>{b.label}</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="analytics-grid">

            {/* ── Top pages ───────────────────────────────────────── */}
            <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e5ea', fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Top pages</div>
              <div style={{ padding: '8px 0' }}>
                {topPages.map(([path, count]) => (
                  <div key={path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 20px' }}>
                    <span style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{path}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e', flexShrink: 0 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Top referrers ───────────────────────────────────── */}
            <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e5ea', fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Where visitors come from</div>
              <div style={{ padding: '8px 0' }}>
                {topReferrers.map(([ref, count]) => (
                  <div key={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 20px' }}>
                    <span style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ref}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e', flexShrink: 0 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Countries ────────────────────────────────────────── */}
            <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={14} color="#6b7280" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Countries</span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {topCountries.map(([country, count]) => (
                  <div key={country} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 20px' }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>{country}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Devices ──────────────────────────────────────────── */}
            <div style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e5ea', fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Devices</div>
              <div style={{ padding: '8px 0' }}>
                {deviceCounts.map(([device, count]) => {
                  const Icon = DEVICE_ICON[device] ?? Monitor;
                  const pct = totalViews ? Math.round((count / totalViews) * 100) : 0;
                  return (
                    <div key={device} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px' }}>
                      <Icon size={14} color="#6b7280" />
                      <span style={{ fontSize: 13, color: '#374151', textTransform: 'capitalize', flex: 1 }}>{device}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`@media (max-width: 760px) { .analytics-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
