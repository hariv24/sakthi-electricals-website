"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, byCat } from "@/lib/data";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const allTabs = [
    { slug: "all", name: "All Products", count: categories.reduce((s, c) => s + byCat(c.slug).length, 0) },
    ...categories.map(c => ({ slug: c.slug, name: c.name, count: byCat(c.slug).length })),
  ];

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Hero — CSS inline animations */}
        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: "url('/assets/banners/products.jpg')", backgroundPosition: "center 42%" }} />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: "fadeIn 300ms var(--ease-out) 100ms both" }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Products</span>
            </div>
            <div className="eyebrow eb" style={{ animation: "fadeSlideDown 360ms var(--ease-out) 200ms both" }}>The catalogue</div>
            <h1 style={{ animation: "fadeSlideUp 440ms var(--ease-out) 350ms both" }}>Instrument transformers &amp; panels, built to your spec.</h1>
            <p className="lead" style={{ animation: "fadeSlideUp 380ms var(--ease-out) 500ms both" }}>Nine product families manufactured in-house — from PVC tape and resin-cast current transformers to control, auto and potential transformers, 33 kV oil-cooled instrument transformers, vibratory feeders, epoxy insulators and complete LT/HT panels.</p>
          </div>
          <div className="live-rule" style={{ transformOrigin: "left", animation: "rulerExtend 700ms var(--ease-out) 650ms both" }} />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        {/* Tab bar */}
        <div style={{ position: "sticky", top: 76, zIndex: 40, background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
              {allTabs.map(t => (
                <button key={t.slug} onClick={() => setActiveTab(t.slug)}
                  style={{
                    position: "relative", display: "inline-flex", alignItems: "center", gap: 8,
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
                    color: activeTab === t.slug ? "var(--se-red)" : "var(--fg2)",
                    padding: "17px 2px", margin: "0 16px", whiteSpace: "nowrap",
                    background: "transparent", border: 0,
                    borderBottom: activeTab === t.slug ? "2px solid var(--se-red)" : "2px solid transparent",
                    cursor: "pointer", transition: "color 200ms var(--ease), border-color 200ms var(--ease)",
                  }}>
                  {t.name}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: activeTab === t.slug ? "var(--se-red)" : "var(--fg3)", background: activeTab === t.slug ? "rgba(216,24,24,.1)" : "var(--steel-100)", padding: "2px 7px", borderRadius: "var(--r-pill)" }}>{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalogue */}
        <main className="band" style={{ paddingTop: 0 }}>
          <div className="wrap-wide">
            {categories.map(c => {
              const items = byCat(c.slug);
              const hidden = activeTab !== "all" && activeTab !== c.slug;
              if (hidden) return null;
              return (
                <section key={c.slug} id={c.slug} style={{ scrollMarginTop: 140, paddingTop: 48 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", paddingBottom: 24, marginBottom: 32, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ maxWidth: 680 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--se-red)", letterSpacing: ".04em" }}>{c.eyebrow}</div>
                      <h2 style={{ marginTop: 8 }}>{c.name}</h2>
                      <p style={{ color: "var(--fg2)", fontSize: "15.5px", lineHeight: 1.55, marginTop: 10 }}>{c.blurb}</p>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg3)", whiteSpace: "nowrap" }}>{items.length} {items.length === 1 ? "model" : "models"}</div>
                  </div>
                  {/* key includes activeTab so grid remounts on tab switch, replaying the stagger animation */}
                  <div className="product-grid" key={`${c.slug}-${activeTab}`}>
                    {items.map((p, i) => (
                      <Link key={p.slug} href={`/products/${p.slug}`}
                        className={`pcard scroll-scale anim-d${Math.min(i, 7)}`}>
                        <span className="pc-img">
                          <span className="pc-cat">{p.categoryName}</span>
                          <Image src={p.image} alt={p.fullName ?? p.name} width={300} height={225} style={{ maxWidth: "88%", maxHeight: "88%", objectFit: "contain" }} />
                        </span>
                        <span className="pc-body">
                          <span className="pc-name">{p.name}</span>
                          <span className="pc-sub">{p.sub} · {p.code}</span>
                          <span className="pc-lead">{p.lead}</span>
                          <span className="pc-tags">{p.tags.map(t => <span key={t} className="pc-tag">{t}</span>)}</span>
                          <span className="pc-foot">
                            <span className="pc-link">View product <ArrowRight size={15} /></span>
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        {/* CTA */}
        <section className="band-tight band-ink">
          <div className="wrap-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow eb">Can&apos;t find your rating?</div>
              <h2 style={{ marginTop: 10 }}>We build to specification.</h2>
              <p className="muted" style={{ marginTop: 8, maxWidth: "54ch" }}>Tell us your ratio, accuracy class, burden and standard — we&apos;ll engineer and quote the right unit.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary btn-lg"><FileText size={18} /> Request a quote</Link>
              <Link href="/contact" className="btn btn-on-dark btn-lg">Talk to engineering</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
