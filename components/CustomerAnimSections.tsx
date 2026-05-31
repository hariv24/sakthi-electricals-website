"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Building2, Factory, Plane, FileText } from "lucide-react";
import { useInView } from "@/lib/useInView";
import { customers } from "@/lib/data";

/* ---- Logo grid — diagonal roll-call, scaleSettle stagger ---- */
export function CustomerLogoGrid() {
  const { ref, inView } = useInView({ threshold: 0.08, rootMargin: "0px" });
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">Our customers</div>
          <h2>Some of the names we build for.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 16 }} className="cust-page-grid">
          {customers.map((c, i) => (
            <div key={c.name}
              className="cust-card"
              style={inView ? { animation: `scaleSettle 200ms var(--ease-out) ${Math.min(i, 13) * 40}ms both` } : {}}>
              <div className="cc-logo">
                <Image src={c.logo} alt={c.name} width={180} height={84} style={{ maxWidth: "100%", maxHeight: 84, objectFit: "contain" }} />
              </div>
              <div className="cc-meta">
                <div className="cc-nm">{c.name}</div>
                <div className="cc-sec">{c.sector}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:1000px){.cust-page-grid{grid-template-columns:repeat(3,1fr)!important}}@media(max-width:760px){.cust-page-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:460px){.cust-page-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ---- Sector cards — left-to-right slideUp stagger ---- */
export function CustomerSectorSection() {
  const { ref, inView } = useInView({ threshold: 0.15, rootMargin: "0px" });
  const sectors = [
    { icon: <Zap size={24} />, title: "Power utilities", desc: "Generation, transmission and distribution corporations — metering and protection CTs, PTs and MV panels." },
    { icon: <Building2 size={24} />, title: "Public sector", desc: "PSUs and government undertakings across power, oil & gas and infrastructure." },
    { icon: <Factory size={24} />, title: "Cement & process", desc: "Cement, sugar, chemicals and heavy process plants — control transformers, APFC and LT/HT panels." },
    { icon: <Plane size={24} />, title: "Infrastructure", desc: "Airports, institutes and large facilities requiring certified, application-matched equipment." },
  ];
  return (
    <section className="band band-alt" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">Where our products go</div>
          <h2>Built for the sectors that keep the lights on.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 32 }} className="sector-grid">
          {sectors.map((s, i) => (
            <div key={s.title}
              className="sector-card"
              style={{
                background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24,
                transition: "box-shadow 200ms,transform 200ms,border-color 200ms",
                ...(inView ? { animation: `slideUp 240ms var(--ease-out) ${i * 65}ms both` } : {}),
              }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: "rgba(216,24,24,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--se-red)", marginBottom: 16 }}>{s.icon}</div>
              <h4 style={{ fontSize: 16, marginBottom: 6 }}>{s.title}</h4>
              <p style={{ fontSize: 14, color: "var(--fg2)", lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`.sector-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);border-color:var(--border-strong)!important}@media(max-width:880px){.sector-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.sector-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ---- CTA band ---- */
export function CustomerCTASection() {
  return (
    <section className="band cta-band">
      <div className="cta-grid-tex" />
      <div className="wrap-wide">
        <div className="cta-inner">
          <div>
            <h2>Join the utilities and industry that build with us.</h2>
            <p>Tell us your spec and we&apos;ll quote the right instrument transformer or panel for your application.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-ghost btn-lg"><FileText size={18} /> Request a quote</Link>
            <Link href="/contact" className="btn btn-on-dark btn-lg">Talk to engineering</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
