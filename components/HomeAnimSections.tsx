"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Clock, Users, Briefcase, Award,
  Factory, Layers, Gauge, ShieldCheck, ChevronRight, LayoutGrid,
  FileText, Phone,
} from "lucide-react";
import { useInView } from "@/lib/useInView";
import { CountUp } from "@/components/CountUp";
import { categories, customers, byCat } from "@/lib/data";
import type { CatalogNode } from "@/lib/catalog";

function toTitleCase(str: string) {
  const LOWER = new Set(['and', 'or', 'for', 'of', 'the', 'a', 'an', 'in', 'at', 'by', 'to']);
  return str.split(/\s+/).map((w, i) => {
    const lc = w.toLowerCase();
    if (i > 0 && LOWER.has(lc)) return lc;
    return lc.charAt(0).toUpperCase() + lc.slice(1);
  }).join(' ');
}

/* ---- About ---- */
export function HomeAboutSection() {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "0px" });
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 48, alignItems: "center" }} className="about-split">
          <div style={inView ? { animation: "slideInLeft 260ms var(--ease-out) both" } : {}}>
            <div className="eyebrow eb">About Sakthi Electricals</div>
            <h2 style={{ marginTop: 12, maxWidth: "16ch" }}>Over 32 years of experience in this business.</h2>
            <p style={{ color: "var(--fg1)", fontWeight: 500, fontSize: "var(--fs-body-lg)", lineHeight: 1.62, marginTop: 20 }}>
              Sakthi Electricals, established in the year 2006, is an ISO 9001 certified company manufacturing a wide range of instrument transformers up to 33 kV, vibratory feeders, electrical control panels and EB HT &amp; LT service panels.
            </p>
            <p style={{ color: "var(--fg2)", fontSize: "var(--fs-body-lg)", lineHeight: 1.62, marginTop: 20 }}>
              Our engineers have built 32 years of core competence in the manufacturing, design and development of test and measuring instrument transformers and industrial control panel products — on strong fundamentals, as per the latest IEC standards.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              {[
                <><b>In-house resin casting</b>, vacuum impregnation and routine testing under one roof.</>,
                <>Every transformer is <b>routine tested in our laboratory</b> before it is dispatched.</>,
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <ShieldCheck size={20} style={{ color: "var(--se-red)", flex: "none", marginTop: 3 }} />
                  <span style={{ fontSize: 15, color: "var(--fg1)", lineHeight: 1.55 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link href="/about" className="btn btn-secondary">More about us <ArrowRight size={18} /></Link>
            </div>
          </div>
          <div style={{ position: "relative", ...(inView ? { animation: "slideInRight 260ms var(--ease-out) 80ms both" } : {}) }}>
            <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", aspectRatio: "4/5", position: "relative", background: "var(--steel-100)" }}>
              <Image src="/assets/banners/about-home.jpg" alt="High-voltage instrument transformers at a substation" fill style={{ objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", left: -20, bottom: -20, background: "var(--se-red)", color: "#fff", borderRadius: "var(--r-lg)", padding: "16px 20px", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, lineHeight: .95, letterSpacing: "-.02em" }}>32<span style={{ opacity: .85 }}>+</span></div>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.85)", marginTop: 6 }}>Years of experience</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:920px){.about-split{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </section>
  );
}

/* ---- Stats — counting numbers ---- */
export function HomeStatsSection() {
  const stats = [
    { icon: <Clock size={32} strokeWidth={1.75} />, to: 32, suffix: "+", k: "Years of experience" },
    { icon: <Users size={32} strokeWidth={1.75} />, to: 50000, suffix: "+", k: "Satisfied customers" },
    { icon: <Briefcase size={32} strokeWidth={1.75} />, to: 500, suffix: "+", k: "Consultants & contractors approvals" },
    { icon: <Award size={32} strokeWidth={1.75} />, to: 100, suffix: "+", k: "Type tested products" },
  ];
  return (
    <section className="band band-ink" style={{ padding: "40px 0", overflow: "hidden", borderTop: "2px solid var(--se-gold)", borderBottom: "2px solid var(--se-gold)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "linear-gradient(180deg,rgba(15,10,33,.93) 0%,rgba(17,11,38,.88) 55%,rgba(15,10,33,.95) 100%),url('/assets/banners/stats-coil.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="wrap-wide" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="stat-icons-grid">
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", padding: "8px 20px", borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,.14)" }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", flex: "none", background: "radial-gradient(circle at 50% 35%,rgba(255,196,0,.22),rgba(255,196,0,.05))", border: "1px solid rgba(255,196,0,.34)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--se-gold)" }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, lineHeight: 1, color: "#fff", letterSpacing: "-.015em" }}>
                  <CountUp to={s.to} duration={1600} delay={i * 80} />
                  <span style={{ color: "var(--se-gold)", marginLeft: 1 }}>{s.suffix}</span>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--fg-on-dark)", marginTop: 5, lineHeight: 1.2, maxWidth: "18ch" }}>{s.k}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "center", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.12)" }}>
          <span className="cert-gold"><Award size={17} style={{ color: "#6E4F00" }} /> ISO <b>9001:2015</b> <span className="cg-sub">GOLD STANDARD</span></span>
          <span className="cert">CPRI Tested</span>
          <span className="cert"><b>IS</b> 2705</span>
          <span className="cert"><b>IS</b> 3156</span>
          <span className="cert">IEC <b>61869</b></span>
        </div>
      </div>
      <style>{`@media(max-width:760px){.stat-icons-grid{grid-template-columns:1fr 1fr!important;gap:20px 0!important}.stat-icons-grid>div:nth-child(odd){border-left:none!important}}`}</style>
    </section>
  );
}

/* ---- Product families (catalog-driven, compact image cards) ---- */
export function HomeProductsSection({ families }: { families: CatalogNode[] }) {
  const { ref, inView } = useInView({ threshold: 0.08 });
  const displayed = families
    .filter(f => f.slug !== 'customer-requirement-designs')
    .slice(0, 6);
  return (
    <section className="band band-alt" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
            <div className="eyebrow eb">What we manufacture</div>
            <h2 style={{ marginTop: 10, maxWidth: "22ch" }}>{displayed.length} product {displayed.length === 1 ? 'family' : 'families'}, one factory floor.</h2>
          </div>
          <Link href="/products" className="btn btn-secondary"
            style={{ flexShrink: 0, ...(inView ? { animation: "slideUp 240ms var(--ease-out) 60ms both" } : {}) }}>
            <LayoutGrid size={17} /> Full catalogue
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 28 }} className="prod-fam-grid">
          {displayed.map((f, i) => {
            const delay = Math.floor(i / 4) * 55 + (i % 4) * 38 + 60;
            return (
              <Link key={f.slug} href={`/products/${f.slugPath.join('/')}`}
                className="prod-fam-cell"
                style={{
                  display: "flex", flexDirection: "column",
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-lg)",
                  overflow: "hidden",
                  transition: "transform 160ms var(--ease), box-shadow 160ms var(--ease), border-color 160ms var(--ease)",
                  ...(inView ? { animation: `scaleSettle 220ms var(--ease-out) ${delay}ms both` } : {}),
                }}>

                {/* Image area */}
                <span style={{
                  display: "block", height: 96,
                  background: "var(--steel-50)",
                  position: "relative", flexShrink: 0,
                }}>
                  {f.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={f.coverImage} alt="" loading="lazy"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "10px 14px" }} />
                  ) : (
                    <span style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "linear-gradient(rgba(0,0,0,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.045) 1px,transparent 1px)",
                      backgroundSize: "14px 14px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "rgba(0,0,0,.07)", letterSpacing: "-.02em" }}>
                        {toTitleCase(f.display).charAt(0)}
                      </span>
                    </span>
                  )}
                  <span style={{
                    position: "absolute", top: 7, left: 8,
                    fontFamily: "var(--font-mono)", fontSize: "9.5px",
                    color: "var(--fg3)", letterSpacing: ".06em",
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>

                {/* Name row */}
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px 11px",
                  borderTop: "1px solid var(--border)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12.5,
                    color: "var(--fg1)", lineHeight: 1.3,
                  }}>
                    {toTitleCase(f.display)}
                  </span>
                  <ChevronRight size={13} style={{ color: "var(--se-red)", flexShrink: 0, marginLeft: 6 }} />
                </span>
              </Link>
            );
          })}
        </div>

      </div>
      <style>{`.prod-fam-cell:hover{transform:translateY(-3px)!important;box-shadow:var(--shadow-md)!important;border-color:var(--se-red)!important}@media(max-width:860px){.prod-fam-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </section>
  );
}

/* ---- Categories ---- */
export function HomeCategoriesSection() {
  const { ref, inView } = useInView({ threshold: 0.08, rootMargin: "0px" });
  return (
    <section className="band band-alt" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">What we manufacture</div>
          <h2>Nine product families, one factory floor.</h2>
          <p className="lead">From PVC tape and resin-cast current transformers to control, auto and potential transformers, 33 kV oil-cooled instrument transformers, vibratory feeders, epoxy insulators and complete LT/HT panels — engineered to your specification and tested to IS &amp; IEC standards.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 40 }} className="cat-home-grid">
          {categories.map((c, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const delay = row * 70 + col * 45 + 60;
            const count = byCat(c.slug).length;
            return (
              <Link key={c.slug} href={`/products#${c.slug}`}
                className="catcard-link"
                style={{
                  position: "relative", display: "flex", flexDirection: "column",
                  background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  overflow: "hidden",
                  transition: "transform 200ms var(--ease),box-shadow 200ms var(--ease),border-color 200ms var(--ease)",
                  ...(inView ? { animation: `scaleSettle 220ms var(--ease-out) ${delay}ms both` } : {}),
                }}>
                <span style={{ position: "absolute", top: 12, right: 12, zIndex: 1, fontFamily: "var(--font-mono)", fontSize: 11, background: "rgba(255,255,255,.92)", border: "1px solid var(--border)", padding: "3px 9px", borderRadius: "var(--r-pill)", color: "var(--fg2)" }}>{count} {count === 1 ? "model" : "models"}</span>
                <span style={{ aspectRatio: "16/10", background: "var(--steel-50)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, borderBottom: "1px solid var(--border)" }}>
                  <Image src={c.cover} alt={c.name} width={200} height={126} style={{ maxWidth: "78%", maxHeight: "80%", objectFit: "contain" }} />
                </span>
                <span style={{ padding: 20, display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--se-red)", letterSpacing: ".06em", textTransform: "uppercase" }}>{c.eyebrow}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--fg1)", letterSpacing: "-.005em", lineHeight: 1.15 }}>{c.name}</span>
                  <span style={{ fontSize: "13.5px", color: "var(--fg2)", lineHeight: 1.55 }}>{c.blurb}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--se-red)", fontWeight: 600, fontSize: "13.5px", marginTop: "auto", paddingTop: 8 }}>View range <ChevronRight size={15} /></span>
                </span>
              </Link>
            );
          })}
        </div>
        <div style={{ marginTop: 32, textAlign: "center", ...(inView ? { animation: "slideUp 240ms var(--ease-out) 380ms both" } : {}) }}>
          <Link href="/products" className="btn btn-secondary btn-lg"><LayoutGrid size={18} /> View the full catalogue</Link>
        </div>
      </div>
      <style>{`.catcard-link:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color:var(--border-strong)!important}@media(max-width:1000px){.cat-home-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:680px){.cat-home-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ---- Capabilities ---- */
export function HomeCapabilitiesSection() {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "0px" });
  const caps = [
    { icon: <Factory size={28} />, title: "In-house manufacturing", desc: "Core building, winding, resin casting and assembly under one roof for full control of quality." },
    { icon: <Layers size={28} />, title: "Vacuum resin casting", desc: "Void-free epoxy encapsulation and vacuum impregnation for reliable dielectric performance." },
    { icon: <Gauge size={28} />, title: "Routine testing", desc: "Ratio, polarity, burden and dielectric tests on every unit in our own laboratory." },
    { icon: <ShieldCheck size={28} />, title: "Certified to standard", desc: "ISO 9001 certified; products tested by CPRI, Bangalore and built to IS & IEC." },
  ];
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div className="section-head" style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">Why Sakthi Electricals</div>
          <h2>Built right, tested before it leaves the floor.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "#fff", marginTop: 32 }} className="cap-home-grid">
          {caps.map((c, i) => (
            <div key={i} className="cap-cell"
              style={{
                padding: 24, borderRight: i < caps.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 200ms var(--ease)",
                ...(inView ? { animation: `slideUp 240ms var(--ease-out) ${60 + i * 60}ms both` } : {}),
              }}>
              <div style={{ width: 40, height: 40, color: "var(--se-red)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{c.icon}</div>
              <h4 style={{ fontSize: 16, marginBottom: 6 }}>{c.title}</h4>
              <p style={{ fontSize: "13.5px", color: "var(--fg2)", lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`.cap-cell:hover{background:var(--steel-50)!important}@media(max-width:880px){.cap-home-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.cap-home-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ---- Customers (logo marquee) ---- */
export function HomeCustomersSection() {
  const items = customers;
  const doubled = [...items, ...items];
  return (
    <section className="band band-alt">
      <div className="wrap-wide">
        <div className="section-head">
          <div className="eyebrow eb">Trusted by</div>
          <h2>Utilities, industry and infrastructure rely on us.</h2>
          <p className="lead">A growing portfolio of customers across power utilities, public-sector undertakings, cement, paper and infrastructure depend on Sakthi Electricals instrument transformers and panels.</p>
        </div>
        <div className="logo-wall">
          <div className="logo-marquee">
            {doubled.map((c, i) => (
              <div key={i} className="logo-cell">
                <Image src={c.logo} alt={c.name} width={160} height={74} style={{ maxWidth: "100%", maxHeight: 74, objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link href="/customers" className="btn btn-secondary"><Users size={18} /> See all customers</Link>
        </div>
      </div>
    </section>
  );
}

/* ---- CTA band ---- */
export function HomeCTASection() {
  return (
    <section className="band cta-band">
      <div className="cta-grid-tex" />
      <div className="wrap-wide">
        <div className="cta-inner">
          <div>
            <div className="eyebrow eb">Start your enquiry</div>
            <h2 style={{ marginTop: 16 }}>Tell us your spec. We&apos;ll build to it.</h2>
            <p>Share your ratings, accuracy class and standard — our engineering team will quote the right instrument transformer or panel for your application.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-ghost btn-lg"><FileText size={18} /> Request a quote</Link>
            <a href="tel:+919715211788" className="btn btn-on-dark btn-lg"><Phone size={18} /> +91 97152 11788</a>
          </div>
        </div>
      </div>
    </section>
  );
}
