"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FileText, Phone, ArrowRight, Check, ChevronRight, CheckCircle2, Target, LayoutGrid } from "lucide-react";
import { Product, byCat } from "@/lib/data";
import { useInView } from "@/lib/useInView";

export default function ProductDetail({ product: p }: { product: Product }) {
  const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image];
  const related = byCat(p.cat).filter(x => x.slug !== p.slug).slice(0, 4);

  return (
    <>
      {/* Breadcrumb band */}
      <div className="band-ink" style={{ padding: "32px 0" }}>
        <div className="wrap-wide">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/products">Products</Link><span className="sep">/</span>
            <Link href={`/products#${p.cat}`}>{p.categoryName}</Link><span className="sep">/</span>
            <span className="cur">{p.name}</span>
          </div>
        </div>
      </div>

      {/* Product detail */}
      <section style={{ padding: "40px 0 64px" }}>
        <div className="wrap-wide">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="pd-layout">
            <GalleryCol gallery={gallery} name={p.fullName ?? p.name} />
            {/* Info column — sequential spec-sheet loading */}
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12.5px", color: "var(--se-red)", letterSpacing: ".04em", animation: "fadeIn 300ms var(--ease-out) 80ms both" }}>{p.categoryEyebrow}</div>
              <h1 style={{ fontSize: "clamp(30px,3.4vw,42px)", lineHeight: 1.05, letterSpacing: "-.02em", marginTop: 12, animation: "fadeSlideUp 400ms var(--ease-out) 160ms both" }}>{p.name}</h1>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 17, color: "var(--fg2)", marginTop: 8, animation: "fadeIn 300ms var(--ease-out) 280ms both" }}>{p.sub}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg3)", marginTop: 10, animation: "fadeIn 300ms var(--ease-out) 280ms both" }}>Part reference · {p.code}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, animation: "fadeIn 300ms var(--ease-out) 360ms both" }}>
                {p.tags.map(t => <span key={t} className="tagchip">{t}</span>)}
              </div>
              <p style={{ fontSize: "var(--fs-body-lg)", lineHeight: 1.6, color: "var(--fg1)", marginTop: 24, fontWeight: 500, animation: "fadeSlideUp 360ms var(--ease-out) 440ms both" }}>{p.lead}</p>
              <div style={{ animation: "fadeSlideUp 360ms var(--ease-out) 520ms both" }}>
                {p.desc.map((d, i) => <p key={i} style={{ fontSize: "15.5px", lineHeight: 1.68, color: "var(--fg2)", marginTop: 16 }}>{d}</p>)}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32, animation: "fadeSlideUp 360ms var(--ease-out) 640ms both" }}>
                <Link href={`/contact?product=${encodeURIComponent(p.fullName ?? p.name)}`} className="btn btn-primary btn-lg"><FileText size={18} /> Request a quote</Link>
                <Link href="/contact" className="btn btn-ghost btn-lg"><Phone size={18} /> Talk to engineering</Link>
              </div>
            </div>
          </div>

          {/* Spec table — rows stagger in on scroll */}
          <SpecTableSection specs={p.specs} />

          {/* Features + Applications — slide in from opposite sides */}
          <FeaturesSection features={p.features} applications={p.applications} />
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <RelatedSection related={related} categoryName={p.categoryName ?? ""} catSlug={p.cat} />
      )}

      {/* CTA */}
      <section className="band-tight cta-band">
        <div className="cta-grid-tex" />
        <div className="wrap-wide cta-inner">
          <div>
            <h2>Need this built to your spec?</h2>
            <p>Send us your ratings and standard — we&apos;ll engineer and quote {p.name.toLowerCase()} for your application.</p>
          </div>
          <Link href={`/contact?product=${encodeURIComponent(p.fullName ?? p.name)}`} className="btn btn-ghost btn-lg"><FileText size={18} /> Request a quote</Link>
        </div>
      </section>

      <style>{`@media(max-width:920px){.pd-layout{grid-template-columns:1fr!important;gap:32px!important}.pd-cols-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}

/* Gallery — scaleIn on mount, opacity crossfade on image switch */
function GalleryCol({ gallery, name }: { gallery: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  function switchImage(i: number) {
    if (i === active) return;
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 150);
  }

  return (
    <div style={{ position: "sticky", top: 100, animation: "scaleIn 440ms var(--ease-out) both" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxShadow: "var(--shadow-sm)" }}>
        <Image src={gallery[active]} alt={name} width={400} height={300}
          style={{ maxWidth: "88%", maxHeight: "88%", objectFit: "contain", transition: "opacity 150ms var(--ease)", opacity: fading ? 0 : 1 }} />
      </div>
      {gallery.length > 1 && (
        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", animation: "fadeIn 300ms var(--ease-out) 300ms both" }}>
          {gallery.map((g, i) => (
            <button key={i} onClick={() => switchImage(i)} style={{ width: 84, height: 84, border: `${i === active ? "2" : "1"}px solid ${i === active ? "var(--se-red)" : "var(--border)"}`, borderRadius: "var(--r-md)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 8, cursor: "pointer", transition: "border-color 200ms var(--ease)" }}>
              <Image src={g} alt="" width={70} height={70} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Spec table — rows stagger in as table scrolls into view */
function SpecTableSection({ specs }: { specs: { k: string; v: string }[] }) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <div style={{ marginTop: 64 }}>
      <h2 style={{ fontSize: 26 }}>Technical specification</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "#fff" }}>
        <tbody ref={ref as React.Ref<HTMLTableSectionElement>}>
          {specs.map((s, i) => (
            <tr key={i}
              className={inView ? "spec-row-in" : ""}
              style={{ borderBottom: i < specs.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 1 ? "var(--steel-50)" : "#fff", ...(inView ? { animationDelay: `${Math.min(i, 12) * 40}ms` } : {}) }}>
              <th style={{ textAlign: "left", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14.5px", color: "var(--fg2)", padding: "14px 24px", width: "42%", verticalAlign: "top" }}>{s.k}</th>
              <td style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg1)", padding: "14px 24px" }}>{s.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg3)", marginTop: 16 }}>Ratings shown are indicative. All units are built to order — share your ratio, accuracy class, burden and standard for an exact specification.</p>
    </div>
  );
}

/* Features + Applications — slide in from opposite sides, no opacity pre-hiding */
function FeaturesSection({ features, applications }: { features: string[]; applications: string[] }) {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "0px" });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 20 }} className="pd-cols-grid"
      ref={ref as React.Ref<HTMLDivElement>}>
      <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24, ...(inView ? { animation: "slideInLeft 260ms var(--ease-out) both" } : {}) }}>
        <h4 style={{ fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 9 }}><CheckCircle2 size={20} style={{ color: "var(--se-red)" }} /> Features</h4>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((f, i) => (
            <li key={f} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 15, color: "var(--fg1)", lineHeight: 1.5, ...(inView ? { animation: `slideUp 220ms var(--ease-out) ${i * 40 + 60}ms both` } : {}) }}>
              <Check size={18} style={{ color: "var(--se-red)", flex: "none", marginTop: 3 }} /><span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24, ...(inView ? { animation: "slideInRight 260ms var(--ease-out) 60ms both" } : {}) }}>
        <h4 style={{ fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 9 }}><Target size={20} style={{ color: "var(--se-red)" }} /> Applications</h4>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {applications.map((a, i) => (
            <li key={a} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 15, color: "var(--fg1)", lineHeight: 1.5, ...(inView ? { animation: `slideUp 220ms var(--ease-out) ${i * 40 + 100}ms both` } : {}) }}>
              <ChevronRight size={18} style={{ color: "var(--se-red)", flex: "none", marginTop: 3 }} /><span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Related products — scaleSettle stagger, no pre-hiding */
function RelatedSection({ related, categoryName, catSlug }: { related: Product[]; categoryName: string; catSlug: string }) {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "0px" });
  return (
    <section className="band band-alt" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">More in {categoryName}</div>
          <h2 style={{ fontSize: 28 }}>Related products</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 32 }} className="related-grid">
          {related.map((r, i) => (
            <Link key={r.slug} href={`/products/${r.slug}`}
              className="pcard"
              style={inView ? { animation: `scaleSettle 220ms var(--ease-out) ${i * 55}ms both` } : {}}>
              <span className="pc-img"><Image src={r.image} alt={r.fullName ?? r.name} width={240} height={180} style={{ maxWidth: "88%", maxHeight: "88%", objectFit: "contain" }} /></span>
              <span className="pc-body">
                <span className="pc-name" style={{ fontSize: 16 }}>{r.name}</span>
                <span className="pc-sub">{r.sub}</span>
                <span className="pc-foot"><span className="pc-link">View <ArrowRight size={14} /></span></span>
              </span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href={`/products#${catSlug}`} className="btn btn-secondary"><LayoutGrid size={18} /> View all {categoryName}</Link>
        </div>
      </div>
      <style>{`@media(max-width:1000px){.related-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:560px){.related-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
