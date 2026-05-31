"use client";

import Link from "next/link";
import Image from "next/image";
import { Award, Ruler, Gauge, Factory, Handshake, Layers, FileText, ArrowRight } from "lucide-react";
import { useInView } from "@/lib/useInView";
import { CountUp } from "@/components/CountUp";

/* ---- Story + sidebar ---- */
export function AboutStorySection() {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "0px" });
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 48, alignItems: "start" }} className="story-grid">
          <div style={inView ? { animation: "slideInLeft 260ms var(--ease-out) both" } : {}}>
            <div className="eyebrow eb">Our story</div>
            <h2 style={{ marginTop: 12, maxWidth: "18ch" }}>Over 22 years of experience in this business.</h2>
            <p style={{ color: "var(--fg1)", fontWeight: 500, fontSize: "var(--fs-body-lg)", lineHeight: 1.65, marginTop: 20 }}>
              &quot;Sakthi Electricals&quot; started in the year 2006 with the vision to establish a name for itself in the field of manufacturing transformers. Our engineers have 22 years&apos; built-in core competence in the manufacturing, design and development of test and measuring instruments and industrial control products on strong fundamentals.
            </p>
            <p style={{ color: "var(--fg2)", fontSize: "var(--fs-body-lg)", lineHeight: 1.65, marginTop: 20 }}>We know the business of transformers, and our state-of-the-art technology guarantees unique products for an ever-growing portfolio of customers.</p>
            <p style={{ color: "var(--fg2)", fontSize: "var(--fs-body-lg)", lineHeight: 1.65, marginTop: 20 }}>We, the Sakthi Electricals, benchmark qualitative products and produce transformers of various technical applications, geared to meet specific customer requirements.</p>
            <p style={{ color: "var(--fg2)", fontSize: "var(--fs-body-lg)", lineHeight: 1.65, marginTop: 20 }}>Our manufactured transformers are tested by the Central Power Research Institute (CPRI) – Bangalore.</p>
          </div>
          <aside style={{
            background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 32,
            ...(inView ? { animation: "slideInRight 260ms var(--ease-out) 80ms both" } : {}),
          }}>
            <h4 style={{ fontSize: 17, marginBottom: 16 }}>Company at a glance</h4>
            <div>
              {[
                { k: "Established", v: "2006" },
                { k: "Certification", v: "ISO 9001:2015" },
                { k: "Tested by", v: "CPRI, Bangalore" },
                { k: "Voltage range", v: "Up to 33 kV" },
                { k: "Standards", v: "IS 2705 / IS 3156 / IEC" },
                { k: "Product families", v: "9" },
              ].map(row => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 14, color: "var(--fg2)" }}>{row.k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "13.5px", color: "var(--fg1)", textAlign: "right" }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/products" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>View our products</Link>
            </div>
          </aside>
        </div>
      </div>
      <style>{`@media(max-width:920px){.story-grid{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </section>
  );
}

/* ---- Stats strip — counting numbers ---- */
export function AboutStatsStrip() {
  return (
    <section className="band-tight band-ink" style={{ borderTop: "2px solid var(--se-gold)", borderBottom: "2px solid var(--se-gold)", position: "relative" }}>
      <div className="wrap-wide">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="about-stat-strip">
          {/* 2006 — fixed, can't count meaningfully */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 46, lineHeight: 1, color: "#fff", letterSpacing: "-.02em" }}>2006</div>
            <div style={{ fontSize: 12, color: "var(--se-gold-300)", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginTop: 10 }}>Year established</div>
          </div>
          {/* 22+ years */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px", borderLeft: "1px solid rgba(255,255,255,.14)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 46, lineHeight: 1, color: "#fff", letterSpacing: "-.02em" }}>
              <CountUp to={22} duration={1400} delay={80} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--se-gold)", fontWeight: 500, marginLeft: 3 }}>+ yrs</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--se-gold-300)", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginTop: 10 }}>Engineering experience</div>
          </div>
          {/* 33 kV */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px", borderLeft: "1px solid rgba(255,255,255,.14)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 46, lineHeight: 1, color: "#fff", letterSpacing: "-.02em" }}>
              <CountUp to={33} duration={1000} delay={160} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--se-gold)", fontWeight: 500, marginLeft: 3 }}> kV</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--se-gold-300)", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginTop: 10 }}>Up to rated voltage</div>
          </div>
          {/* CPRI — text, no counting */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px", borderLeft: "1px solid rgba(255,255,255,.14)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 46, lineHeight: 1, color: "#fff", letterSpacing: "-.02em" }}>CPRI</div>
            <div style={{ fontSize: 12, color: "var(--se-gold-300)", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginTop: 10 }}>Tested at CPRI, Bangalore</div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.about-stat-strip{grid-template-columns:1fr 1fr!important}.about-stat-strip>div:nth-child(odd){border-left:none!important}.about-stat-strip>div:nth-child(n+3){border-top:1px solid rgba(255,255,255,.12);padding-top:20px}}`}</style>
    </section>
  );
}

/* ---- Values grid ---- */
export function AboutValuesSection() {
  const { ref, inView } = useInView({ threshold: 0.08, rootMargin: "0px" });
  const values = [
    { icon: <Ruler size={24} />, title: "Engineered to spec", desc: "Every unit is designed to the customer's ratio, accuracy class, burden and standard — not off the shelf." },
    { icon: <Gauge size={24} />, title: "Tested before dispatch", desc: "Routine ratio, polarity, burden and dielectric tests in our own laboratory; type tested at CPRI, Bangalore." },
    { icon: <Award size={24} />, title: "Certified quality", desc: "An ISO 9001 certified quality system underpins design, manufacturing and testing across all product families." },
    { icon: <Factory size={24} />, title: "In-house manufacturing", desc: "Core building, winding, resin casting and assembly under one roof for full control of quality." },
    { icon: <Handshake size={24} />, title: "Customer-specific", desc: "An ever-growing portfolio of utilities and industry relies on us for application-matched products." },
    { icon: <Layers size={24} />, title: "Latest technology", desc: "Vacuum resin casting and modern test facilities ensure reliable, high quality-assured products." },
  ];
  /* Row-stagger: row 1 → 0,45,90ms; row 2 → 60,105,150ms */
  const delays = [0, 45, 90, 60, 105, 150];
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">What guides us</div>
          <h2>Built on fundamentals, proven by test.</h2>
          <p className="lead">We benchmark qualitative products and engineer transformers for a wide range of technical applications — to your exact requirement.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 40 }} className="value-grid">
          {values.map((v, i) => (
            <div key={i} className="feat"
              style={inView ? { animation: `scaleSettle 220ms var(--ease-out) ${delays[i]}ms both` } : {}}>
              <div className="fi"><span className="ic">{v.icon}</span></div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:880px){.value-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ---- Timeline ---- */
export function AboutTimelineSection() {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "0px" });
  const items = [
    { yr: "2006", tx: "Sakthi Electricals founded with a vision to make a name in transformer manufacturing." },
    { yr: "2010s", tx: "Range expanded to instrument transformers up to 33 kV, control transformers and panels." },
    { yr: "ISO", tx: "Quality system certified to ISO 9001; products type tested at CPRI, Bangalore." },
    { yr: "Today", tx: "Serving utilities, PSUs and industry across India with nine product families." },
  ];
  return (
    <section className="band band-alt" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">Our journey</div>
          <h2>From a workshop to a trusted manufacturer.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "2px solid var(--border)", marginTop: 40 }} className="tl-grid">
          {items.map((t, i) => (
            <div key={i}
              style={{ padding: "24px 20px 0", position: "relative", ...(inView ? { animation: `slideUp 240ms var(--ease-out) ${i * 80}ms both` } : {}) }}>
              <div style={{
                position: "absolute", top: -7, left: 20, width: 12, height: 12,
                borderRadius: "50%", background: "var(--se-red)",
                ...(inView ? { animation: `scaleSettle 200ms var(--ease-out) ${i * 80 + 40}ms both` } : {}),
              }} />
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--se-navy)" }}>{t.yr}</div>
              <div style={{ fontSize: 14, color: "var(--fg2)", lineHeight: 1.5, marginTop: 8 }}>{t.tx}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:760px){.tl-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </section>
  );
}

/* ---- CPRI section ---- */
export function AboutCPRISection() {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "0px" });
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="cpri-grid">
          <div style={inView ? { animation: "slideInLeft 260ms var(--ease-out) both" } : {}}>
            <div className="eyebrow eb">Quality assurance</div>
            <h2>Tested by CPRI, Bangalore.</h2>
            <p className="lead" style={{ color: "var(--fg2)", marginTop: 20 }}>
              Our manufactured transformers are tested by the Central Power Research Institute (CPRI), Bangalore — India&apos;s premier authority for testing and certification of power equipment. Every product is also routine tested for quality assurance at our own sophisticated laboratory before final dispatch.
            </p>
            <div className="cert-row" style={{ marginTop: 24 }}>
              <span className="cert-gold"><Award size={17} style={{ color: "#6E4F00" }} /> ISO <b>9001:2015</b> <span className="cg-sub">GOLD STANDARD</span></span>
              <span className="cert">CPRI Tested</span>
              <span className="cert"><b>IS</b> 2705</span>
              <span className="cert"><b>IS</b> 3156</span>
            </div>
          </div>
          <div style={{
            borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "16/11", position: "relative",
            ...(inView ? { animation: "scaleSettle 220ms var(--ease-out) 100ms both" } : {}),
          }}>
            <Image src="/assets/banners/stats-coil.jpg" alt="Copper-wound transformer coils" fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      </div>
      <style>{`@media(max-width:880px){.cpri-grid{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </section>
  );
}

/* ---- CTA band ---- */
export function AboutCTASection() {
  return (
    <section className="band cta-band">
      <div className="cta-grid-tex" />
      <div className="wrap-wide">
        <div className="cta-inner">
          <div>
            <h2>Let&apos;s build the right transformer for your application.</h2>
            <p>Tell us your spec — our engineering team will take it from there.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-ghost btn-lg"><FileText size={18} /> Request a quote</Link>
            <Link href="/products" className="btn btn-on-dark btn-lg">Explore products <ArrowRight size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
