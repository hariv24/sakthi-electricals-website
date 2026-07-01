import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  FileText, ChevronRight,
  Gauge, Shield, Zap, Cpu, BarChart2, Cable,
  Factory, Wrench, Activity, Sun, Wind, Package, Layers, Settings,
} from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import {
  getCatalogTree,
  findBySlugPath,
  getBreadcrumb,
  getAllSlugPaths,
  type CatalogNode,
} from '@/lib/catalog';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSpecRowsDefault, getApplicationsDefault, getOverviewDefault } from '@/lib/productContentDefaults';

/* ── constants ──────────────────────────────────────────────────────────────── */

const MAX_PHOTOS = 8;
const PLACEHOLDER = '/placeholder-product.svg';

const APP_ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap size={26} strokeWidth={1.5}/>, Gauge: <Gauge size={26} strokeWidth={1.5}/>,
  Shield: <Shield size={26} strokeWidth={1.5}/>, BarChart2: <BarChart2 size={26} strokeWidth={1.5}/>,
  Cable: <Cable size={26} strokeWidth={1.5}/>, Factory: <Factory size={26} strokeWidth={1.5}/>,
  Wrench: <Wrench size={26} strokeWidth={1.5}/>, Cpu: <Cpu size={26} strokeWidth={1.5}/>,
  Activity: <Activity size={26} strokeWidth={1.5}/>, Sun: <Sun size={26} strokeWidth={1.5}/>,
  Layers: <Layers size={26} strokeWidth={1.5}/>, Settings: <Settings size={26} strokeWidth={1.5}/>,
  Package: <Package size={26} strokeWidth={1.5}/>, Wind: <Wind size={26} strokeWidth={1.5}/>,
};

/* ── types ──────────────────────────────────────────────────────────────────── */

type AppItem = { icon: React.ReactNode; title: string; body: string };

/* ── static params ──────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const root = await getCatalogTree();
  return getAllSlugPaths(root).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const root = await getCatalogTree();
  const node = findBySlugPath(root, slug);
  if (!node) return {};
  return { title: `${node.display} — Sakthi Electricals` };
}

/* ── helpers ────────────────────────────────────────────────────────────────── */

function imgUrl(relPath: string, img: string) {
  return encodeURI('/' + relPath + '/' + img);
}

function toYouTubeEmbed(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : '';
}

async function fetchDBData(nodeId: string) {
  try {
    const sb = await createSupabaseServerClient();
    const [{ data: specs }, { data: overview }, { data: apps }, { data: videos }, { data: images }] = await Promise.all([
      sb.from('product_specs').select('label,value').eq('node_id', nodeId).order('order_index'),
      sb.from('product_overview').select('heading,paragraph_1,paragraph_2').eq('node_id', nodeId).maybeSingle(),
      sb.from('product_applications').select('title,body,icon_name').eq('node_id', nodeId).order('order_index'),
      sb.from('product_videos').select('youtube_url').eq('node_id', nodeId).order('order_index').limit(1),
      sb.from('product_images').select('url').eq('node_id', nodeId).order('order_index'),
    ]);
    return {
      specs: specs?.length ? (specs as {label:string;value:string}[]).map(r => [r.label, r.value] as [string,string]) : null,
      overview: overview ?? null,
      apps: apps?.length ? (apps as {title:string;body:string;icon_name?:string}[]) : null,
      videoUrl: videos?.[0]?.youtube_url ?? null,
      images: images?.length ? (images as {url:string}[]).map(r => r.url) : null,
    };
  } catch {
    return null;
  }
}

function isUnlimited(slugPath: string[]) {
  return slugPath[0] === 'customer-requirement-designs';
}

/* ── Spec lookup ────────────────────────────────────────────────────────────── */

function getSpecRows(node: CatalogNode, slugPath: string[]): [string, string][] {
  return getSpecRowsDefault({ display: node.display, slugPath });
}

/* ── Applications lookup (4 per product) ───────────────────────────────────── */

function getApplications(node: CatalogNode, slugPath: string[]): AppItem[] {
  return getApplicationsDefault({ display: node.display, slugPath }).map(a => ({
    icon: APP_ICON_MAP[a.icon_name] ?? <Zap size={26} strokeWidth={1.5} />,
    title: a.title,
    body: a.body,
  }));
}

/* ── SubfolderCard ──────────────────────────────────────────────────────────── */

function SubfolderCard({ node }: { node: CatalogNode }) {
  const href = '/products/' + node.slugPath.join('/');
  return (
    <Link
      href={href}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', textDecoration: 'none',
        transition: 'transform 180ms var(--ease), box-shadow 180ms var(--ease), border-color 180ms var(--ease)',
      }}
      className="subfolder-card"
    >
      <span style={{
        display: 'block', aspectRatio: '16 / 10',
        background: 'var(--steel-50)', position: 'relative',
        overflow: 'hidden', borderBottom: '1px solid var(--border)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.coverImage ?? PLACEHOLDER}
          alt={node.display}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
        />
      </span>
      <span style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--fg1)', lineHeight: 1.25 }}>
          {node.display}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)' }}>
            {node.children.length > 0
              ? `${node.children.length} type${node.children.length !== 1 ? 's' : ''}`
              : 'View product'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: 'var(--se-red)' }}>
            View <ChevronRight size={13} />
          </span>
        </span>
      </span>
    </Link>
  );
}

/* ── PhotoGrid ──────────────────────────────────────────────────────────────── */

function PhotoGrid({ node, limit }: { node: CatalogNode; limit?: number }) {
  if (!node.images.length) return null;
  const images = limit ? node.images.slice(0, limit) : node.images;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
      {images.map(img => (
        <div key={img} style={{
          aspectRatio: '4 / 3', background: 'var(--steel-50)',
          border: '1px solid var(--border)', borderRadius: 8,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl(node.relPath, img)} alt="" loading="lazy" decoding="async"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

/* ── Overview content lookup ────────────────────────────────────────────────── */

type OverviewContent = { heading: string; paragraphs: string[] };

function getOverview(node: CatalogNode, slugPath: string[]): OverviewContent {
  return getOverviewDefault({ display: node.display, slugPath });
}

/* ── Shared section components ──────────────────────────────────────────────── */

function OverviewSection({ node, slugPath, dbContent }: { node: CatalogNode; slugPath: string[]; dbContent?: { heading: string; paragraph_1: string; paragraph_2?: string | null } | null }) {
  const { heading, paragraphs } = dbContent
    ? { heading: dbContent.heading, paragraphs: [dbContent.paragraph_1, dbContent.paragraph_2].filter(Boolean) as string[] }
    : getOverview(node, slugPath);
  return (
    <div style={{ background: 'var(--steel-50)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="band">
        <div className="wrap-wide" style={{ maxWidth: 820 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>
            Overview
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
            {heading}
          </h2>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: i === 0 ? 16 : 15.5, color: i === 0 ? 'var(--fg1)' : 'var(--fg2)', lineHeight: 1.75, marginBottom: i < paragraphs.length - 1 ? 16 : 0 }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApplicationsSection({ items }: { items: AppItem[] }) {
  return (
    <div className="band">
      <div className="wrap-wide">
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            Where it&apos;s used
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Typical applications
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {items.map(app => (
            <div key={app.title as string} style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '24px 22px 26px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ color: 'var(--se-red)', lineHeight: 1 }}>{app.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--fg1)', marginBottom: 8 }}>{app.title as string}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg2)', lineHeight: 1.65, margin: 0 }}>{app.body as string}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Dark hero ──────────────────────────────────────────────────────────────── */

function DarkHero({
  node, crumbs, label, separatorStyle,
}: {
  node: CatalogNode;
  crumbs: { display: string; href: string }[];
  label: string;
  separatorStyle: CSSProperties;
}) {
  return (
    <section style={{
      background: 'var(--se-navy-900, #0a0716)', padding: '80px 0 56px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .35,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
      }} />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>Home</Link>
          {crumbs.map((c, i) => (
            <span key={c.href} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={separatorStyle}>/</span>
              {i === crumbs.length - 1 ? (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.9)' }}>{c.display}</span>
              ) : (
                <Link href={c.href} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>{c.display}</Link>
              )}
            </span>
          ))}
        </nav>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--se-gold-300, #ffd466)', textTransform: 'uppercase', marginBottom: 12 }}>
          {label}
        </div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '28ch', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          {node.display}
        </h1>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--se-red) 0%,var(--se-red) 38%,var(--se-gold,#FFC400) 38%,var(--se-gold,#FFC400) 50%,transparent 50%)' }} />
    </section>
  );
}

/* ── CTA band ───────────────────────────────────────────────────────────────── */

function CTABand() {
  return (
    <section className="band-tight band-ink" style={{ marginTop: 40 }}>
      <div className="wrap-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow eb">Need a custom specification?</div>
          <h2 style={{ marginTop: 10 }}>Tell us your spec. We&apos;ll build to it.</h2>
          <p className="muted" style={{ marginTop: 8, maxWidth: '54ch' }}>
            Share your ratio, accuracy class, burden and standard — our engineering team will quote the right unit.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn btn-primary btn-lg"><FileText size={18} /> Request a quote</Link>
          <Link href="/contact" className="btn btn-on-dark btn-lg">Talk to engineering</Link>
        </div>
      </div>
    </section>
  );
}

/* ── Leaf product page ──────────────────────────────────────────────────────── */

function LeafProductPage({
  node, crumbs, separatorStyle, unlimited, slug,
  dbImages, dbSpecs, dbOverview, dbApps, dbVideoUrl,
}: {
  node: CatalogNode;
  crumbs: { display: string; href: string }[];
  separatorStyle: CSSProperties;
  unlimited: boolean;
  slug: string[];
  dbImages?: string[];
  dbSpecs?: [string, string][];
  dbOverview?: { heading: string; paragraph_1: string; paragraph_2?: string | null } | null;
  dbApps?: { title: string; body: string; icon_name?: string }[];
  dbVideoUrl?: string | null;
}) {
  const limit = unlimited ? undefined : MAX_PHOTOS;
  const fsImages = (limit ? node.images.slice(0, limit) : node.images).map(img => imgUrl(node.relPath, img));
  const rawDbImages = dbImages && dbImages.length > 0 ? dbImages : null;
  const galleryImages = (rawDbImages ? (limit ? rawDbImages.slice(0, limit) : rawDbImages) : fsImages.length > 0 ? fsImages : [PLACEHOLDER]);
  const specRows: [string, string][] = dbSpecs && dbSpecs.length > 0 ? dbSpecs : getSpecRows(node, slug);
  const apps: AppItem[] = dbApps && dbApps.length > 0
    ? dbApps.map(a => ({ icon: APP_ICON_MAP[a.icon_name ?? 'Zap'] ?? <Zap size={26} strokeWidth={1.5}/>, title: a.title, body: a.body }))
    : getApplications(node, slug);
  const embedUrl = dbVideoUrl ? toYouTubeEmbed(dbVideoUrl) : null;

  return (
    <>
      <main style={{ flex: 1 }}>

        <DarkHero node={node} crumbs={crumbs} label="Product" separatorStyle={separatorStyle} />

        {/* Block 1: Gallery LEFT | Specs RIGHT */}
        <div className="band">
          <div className="wrap-wide">
            <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 48, alignItems: 'start' }} className="product-detail-grid">

              {/* Left: hero image + optional video + thumbnails */}
              <div>
                <ProductGallery images={galleryImages} productName={node.display} embedUrl={embedUrl ?? undefined} />
              </div>

              {/* Right: specs table + CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', background: 'var(--steel-50)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      Specifications
                    </div>
                  </div>
                  {specRows.map(([label, value]) => (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: '44% 56%', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ padding: '11px 16px', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg2)', borderRight: '1px solid var(--border)' }}>
                        {label}
                      </div>
                      <div style={{ padding: '11px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg1)' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 16px', background: 'rgba(216,24,24,.04)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg3)', margin: 0 }}>
                      Exact specifications depend on the variant and order. Contact us for a detailed datasheet.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Block 2: Overview — full width */}
        <OverviewSection node={node} slugPath={slug} dbContent={dbOverview} />

        {/* Block 3: Applications — full width, 4 items */}
        <ApplicationsSection items={apps} />

        <CTABand />
      </main>
      <style>{`
        @media(max-width: 860px) { .product-detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

/* ── Folder (category) page ─────────────────────────────────────────────────── */

function FolderPageContent({
  node, crumbs, slug, separatorStyle, unlimited, dbApps,
}: {
  node: CatalogNode;
  crumbs: { display: string; href: string }[];
  slug: string[];
  separatorStyle: CSSProperties;
  unlimited: boolean;
  dbApps?: { title: string; body: string; icon_name?: string }[];
}) {
  const depthLabel = slug.length === 1 ? 'Product Family' : slug.length === 2 ? 'Category' : 'Sub-category';
  const apps: AppItem[] = dbApps && dbApps.length > 0
    ? dbApps.map(a => ({ icon: APP_ICON_MAP[a.icon_name ?? 'Zap'] ?? <Zap size={26} strokeWidth={1.5}/>, title: a.title, body: a.body }))
    : getApplications(node, slug);

  return (
    <>
      <main style={{ flex: 1 }}>

        <DarkHero node={node} crumbs={crumbs} label={depthLabel} separatorStyle={separatorStyle} />

        <div className="band" style={{ paddingTop: 40 }}>
          <div className="wrap-wide">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 20 }}>
              Browse by type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }} className="subfolder-grid">
              {node.children.map(child => (
                <SubfolderCard key={child.slugPath.join('/')} node={child} />
              ))}
            </div>

            {node.images.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                  Images in this category
                </div>
                <PhotoGrid node={node} limit={unlimited ? undefined : MAX_PHOTOS} />
              </div>
            )}
          </div>
        </div>

        <ApplicationsSection items={apps} />
        <CTABand />
      </main>
      <style>{`
        .subfolder-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border-strong) !important; }
        @media(max-width: 640px) { .subfolder-grid { grid-template-columns: 1fr 1fr !important; } }
        @media(max-width: 400px) { .subfolder-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

/* ── Page entry point ───────────────────────────────────────────────────────── */

type DBSlice = { id: string; name: string; slug: string; is_leaf: boolean; cover_image_url: string | null };

function makeNode(n: DBSlice, path: string[], kids: CatalogNode[] = []): CatalogNode {
  return {
    name: n.name, display: n.name, slug: n.slug,
    slugPath: path, relPath: path.join('/'),
    images: [], coverImage: n.cover_image_url,
    totalImages: 0, children: kids,
  };
}

export default async function FolderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const sb = await createSupabaseServerClient();

  // Traverse catalog_nodes by slug path — works for both existing and newly created nodes
  let parentId: string | null = null;
  const trail: DBSlice[] = [];
  for (const s of slug) {
    const { data } = (parentId !== null
      ? await sb.from('catalog_nodes').select('id,name,slug,is_leaf,cover_image_url').eq('slug', s).eq('parent_id', parentId).maybeSingle()
      : await sb.from('catalog_nodes').select('id,name,slug,is_leaf,cover_image_url').eq('slug', s).is('parent_id', null).maybeSingle()
    ) as { data: DBSlice | null };
    if (!data) notFound();
    trail.push(data);
    parentId = data.id;
  }

  const dbNode = trail[trail.length - 1];
  const crumbs = trail.map((t, i) => ({
    display: t.name,
    href: '/products/' + slug.slice(0, i + 1).join('/'),
  }));
  const unlimited = isUnlimited(slug);
  const separatorStyle: CSSProperties = { color: 'var(--fg3)', margin: '0 6px', fontSize: 13 };

  if (dbNode.is_leaf) {
    const db = await fetchDBData(dbNode.id);
    return (
      <LeafProductPage
        node={makeNode(dbNode, slug)} crumbs={crumbs} separatorStyle={separatorStyle}
        unlimited={unlimited} slug={slug}
        dbImages={db?.images ?? undefined}
        dbSpecs={db?.specs ?? undefined}
        dbOverview={db?.overview ?? undefined}
        dbApps={db?.apps ?? undefined}
        dbVideoUrl={db?.videoUrl ?? undefined}
      />
    );
  }

  // Folder: load direct children
  const { data: rawChildren } = await sb
    .from('catalog_nodes').select('id,name,slug,is_leaf,cover_image_url')
    .eq('parent_id', dbNode.id).order('order_index');
  const kids = (rawChildren ?? []) as DBSlice[];

  // Load grandchild counts in one query so subfolder cards show "N types"
  const kidIds = kids.map(k => k.id);
  const { data: gcRows } = kidIds.length
    ? await sb.from('catalog_nodes').select('parent_id').in('parent_id', kidIds)
    : { data: [] as { parent_id: string }[] };
  const gcCount = new Map<string, number>();
  for (const g of gcRows ?? []) gcCount.set(g.parent_id, (gcCount.get(g.parent_id) ?? 0) + 1);

  const childNodes: CatalogNode[] = kids.map(k =>
    makeNode(k, [...slug, k.slug], Array.from({ length: gcCount.get(k.id) ?? 0 }) as CatalogNode[])
  );

  const { data: folderApps } = await sb
    .from('product_applications').select('title,body,icon_name').eq('node_id', dbNode.id).order('order_index');

  return (
    <FolderPageContent
      node={makeNode(dbNode, slug, childNodes)}
      crumbs={crumbs} slug={slug} separatorStyle={separatorStyle} unlimited={unlimited}
      dbApps={folderApps ?? undefined}
    />
  );
}
