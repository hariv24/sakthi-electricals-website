import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type DBFamily = {
  id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  children: { name: string }[];
};

function FamilyCard({ family }: { family: DBFamily }) {
  const href = '/products/' + family.slug;
  return (
    <Link
      href={href}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', textDecoration: 'none',
        transition: 'transform 180ms var(--ease), box-shadow 180ms var(--ease), border-color 180ms var(--ease)',
      }}
      className="family-card"
    >
      <span style={{
        display: 'block', aspectRatio: '16 / 10',
        background: 'var(--steel-50)', position: 'relative',
        overflow: 'hidden', borderBottom: '1px solid var(--border)',
      }}>
        {family.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={family.cover_image_url}
            alt={family.name}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 20 }}
          />
        )}
      </span>

      <span style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--fg1)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
          {family.name}
        </span>
        {family.children.length > 0 && (
          <span style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.5 }}>
            {family.children.map(c => c.name).slice(0, 3).join(' · ')}
            {family.children.length > 3 && ` +${family.children.length - 3} more`}
          </span>
        )}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: 'var(--se-red)', marginTop: 'auto', paddingTop: 8,
        }}>
          Explore range <ChevronRight size={14} />
        </span>
      </span>
    </Link>
  );
}

export default async function ProductsPage() {
  const sb = await createSupabaseServerClient();

  const { data: rootNodes } = await sb
    .from('catalog_nodes').select('id,name,slug,cover_image_url')
    .is('parent_id', null).order('order_index');

  const parentIds = (rootNodes ?? []).map(n => n.id);
  const { data: allChildren } = parentIds.length
    ? await sb.from('catalog_nodes').select('name,parent_id').in('parent_id', parentIds).order('order_index')
    : { data: [] as { name: string; parent_id: string }[] };

  const childMap = new Map<string, { name: string }[]>();
  for (const c of allChildren ?? []) {
    const list = childMap.get(c.parent_id) ?? [];
    list.push({ name: c.name });
    childMap.set(c.parent_id, list);
  }

  const families: DBFamily[] = (rootNodes ?? []).map(n => ({
    id: n.id, name: n.name, slug: n.slug,
    cover_image_url: n.cover_image_url,
    children: childMap.get(n.id) ?? [],
  }));

  return (
    <>
      <main style={{ flex: 1 }}>

        {/* Hero */}
        <section className="page-hero hero-photo">
          <div
            className="hero-bg"
            style={{ backgroundImage: "url('/assets/banners/products.jpg')", backgroundPosition: 'center 42%' }}
          />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: 'fadeIn 300ms var(--ease-out) 100ms both' }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Products</span>
            </div>
            <div className="eyebrow eb" style={{ animation: 'fadeSlideDown 360ms var(--ease-out) 200ms both' }}>
              The catalogue
            </div>
            <h1 style={{ animation: 'fadeSlideUp 440ms var(--ease-out) 350ms both' }}>
              Instrument transformers &amp; panels, built to your spec.
            </h1>
            <p className="lead" style={{ animation: 'fadeSlideUp 380ms var(--ease-out) 500ms both' }}>
              {families.length} product families manufactured in-house — from current and control transformers
              to electrical panels, epoxy insulators, vibratory feeders and solar metering panels.
            </p>
          </div>
          <div
            className="live-rule"
            style={{ transformOrigin: 'left', animation: 'rulerExtend 700ms var(--ease-out) 650ms both' }}
          />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        {/* Product families grid */}
        <section className="band">
          <div className="wrap-wide">
            <div className="section-head">
              <div className="eyebrow eb">What we manufacture</div>
              <h2>{families.length} product families, one factory floor.</h2>
              <p className="lead">
                Select a product family to explore the full range, then drill into the exact type you need.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}
              className="family-grid"
            >
              {families.map(family => (
                <FamilyCard key={family.id} family={family} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="band-tight band-ink">
          <div className="wrap-wide" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}>
            <div>
              <div className="eyebrow eb">Can&apos;t find your rating?</div>
              <h2 style={{ marginTop: 10 }}>We build to specification.</h2>
              <p className="muted" style={{ marginTop: 8, maxWidth: '54ch' }}>
                Tell us your ratio, accuracy class, burden and standard — we&apos;ll engineer and quote the right unit.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                <FileText size={18} /> Request a quote
              </Link>
              <Link href="/contact" className="btn btn-on-dark btn-lg">Talk to engineering</Link>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        .family-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-strong) !important;
        }
        @media(max-width: 1000px) { .family-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media(max-width: 640px)  { .family-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
