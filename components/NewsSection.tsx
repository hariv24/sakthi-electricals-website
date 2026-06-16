'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type NewsItem = { id: string; title: string; published_date: string; content: string; image_url?: string | null };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsSection({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<NewsItem | null>(null);

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  if (!items.length) return null;

  return (
    <>
      <section style={{ background: 'var(--steel-50)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="band">
          <div className="wrap-wide">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Latest news</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 32 }}>
              What&apos;s new at Sakthi Electricals
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {items.map(item => (
                <article
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActive(item)}
                  onKeyDown={e => e.key === 'Enter' && setActive(item)}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow 180ms, transform 180ms', outline: 'none' }}
                  className="news-card"
                >
                  {item.image_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image_url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      {formatDate(item.published_date)}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg1)', lineHeight: 1.25, margin: 0 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--fg2)', lineHeight: 1.65, flex: 1, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.content}
                    </p>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--se-red)', marginTop: 4 }}>Read more →</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-page article overlay ─────────────────────────────── */}
      {active && (
        <div
          onClick={() => setActive(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(10,7,22,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 680, width: '100%', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,.4)', position: 'relative' }}
          >
            {/* Close button */}
            <button
              onClick={() => setActive(null)}
              style={{ position: 'sticky', top: 16, float: 'right', marginRight: 16, zIndex: 10, background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151', flexShrink: 0 }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Optional image */}
            {active.image_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={active.image_url} alt="" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block', borderRadius: '16px 16px 0 0' }} />
            )}

            {/* Article body */}
            <div style={{ padding: active.image_url ? '28px 32px 40px' : '60px 32px 40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                {formatDate(active.published_date)}
              </div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em', color: 'var(--fg1)', marginBottom: 20 }}>
                {active.title}
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fg2)', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>
                {active.content}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .news-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.1); transform: translateY(-2px); }
      `}</style>
    </>
  );
}
