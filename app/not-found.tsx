import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export const metadata = { title: 'Page not found — Sakthi Electricals' };

export default function NotFound() {
  return (
    <main style={{ flex: 1 }}>
      <section style={{
        background: 'var(--se-navy-900, #0a0716)', padding: '120px 0 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .35,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
        }} />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--se-gold-300, #ffd466)', textTransform: 'uppercase', marginBottom: 16 }}>
            Error 404
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18 }}>
            This page doesn&apos;t exist.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,.65)', lineHeight: 1.65, maxWidth: '46ch', margin: '0 auto 36px' }}>
            The link you followed may be broken, or the page may have moved. Try going back to the homepage or browsing our products.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-primary btn-lg"><Home size={18} /> Back to home</Link>
            <Link href="/products" className="btn btn-on-dark btn-lg"><Search size={18} /> Browse products</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--se-red) 0%,var(--se-red) 38%,var(--se-gold,#FFC400) 38%,var(--se-gold,#FFC400) 50%,transparent 50%)' }} />
      </section>
    </main>
  );
}
