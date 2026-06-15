"use client";

import Link from "next/link";
import Image from "next/image";
import { Award, FileText, ArrowRight } from "lucide-react";
import { useInView } from "@/lib/useInView";

/* ── Section 1: Manufacturing floor — contained image ── */
export function FacilitiesFloorSection() {
  const { ref, inView } = useInView({ threshold: 0.08 });
  return (
    <section className="band" ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "center" }} className="fac-floor-grid">

          <div style={{
            borderRadius: "var(--r-lg)", overflow: "hidden",
            aspectRatio: "4/3", position: "relative",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
            ...(inView ? { animation: "scaleSettle 280ms var(--ease-out) both" } : {}),
          }}>
            <Image
              src="/assets/solution2.png"
              alt="Sakthi Electricals manufacturing floor"
              fill
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
            />
          </div>

          <div style={inView ? { animation: "slideInRight 280ms var(--ease-out) 80ms both" } : {}}>
            <div className="eyebrow eb">Manufacturing facility</div>
            <h2 style={{ marginTop: 14, maxWidth: "16ch", lineHeight: 1.15 }}>
              Five bays. Everything in-house.
            </h2>
            <p style={{ color: "var(--fg2)", fontSize: "var(--fs-body-lg)", lineHeight: 1.7, marginTop: 20 }}>
              Our Pudukkottai factory runs end-to-end — from raw CRGO lamination to final test certificate — with no external subcontractors at any stage.
            </p>
            <div style={{ marginTop: 28, borderTop: "1px solid var(--border)" }}>
              {[
                { title: "Winding bays",        sub: "LT and HT CTs, PTs, control transformers" },
                { title: "Resin casting plant",  sub: "VPI up to 36 kV insulation class" },
                { title: "Tool room",            sub: "CNC sheet metal — MS, GI, SS 304, SS 316" },
                { title: "HV test bay",          sub: "3000 A source · 33 kV withstand" },
                { title: "Panel assembly",       sub: "IEC 61439 wiring, busbar, FAT" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16,
                  padding: "11px 0", borderBottom: "1px solid var(--border)",
                  ...(inView ? { animation: `slideUp 200ms var(--ease-out) ${100 + i * 45}ms both` } : {}),
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13.5, color: "var(--fg1)", whiteSpace: "nowrap" }}>{item.title}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg3)", textAlign: "right", lineHeight: 1.4 }}>{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.fac-floor-grid{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </section>
  );
}

/* ── Section 2: Process strip — light background, red numbers ── */
export function FacilitiesProcessSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const steps = [
    { n: "01", title: "Core preparation",    body: "CRGO silicon steel laminations cut, stacked, and interleaved to the design cross-section." },
    { n: "02", title: "Precision winding",   body: "Copper and aluminium conductors wound to ratio with insulation layers per accuracy class." },
    { n: "03", title: "Resin encapsulation", body: "Cycloaliphatic epoxy cast under vacuum pressure — void-free encapsulation for HV service." },
    { n: "04", title: "CNC fabrication",     body: "Enclosures punched, bent and finished. Busbar cut, drilled, and silver-plated to rating." },
    { n: "05", title: "High-voltage testing", body: "Every unit: ratio error, phase displacement, burden, insulation, and 33 kV withstand." },
    { n: "06", title: "Certified dispatch",  body: "Individual test certificate with actual measured values issued before leaving the floor." },
  ];
  return (
    <section className="band" style={{ background: "var(--steel-50)" }} ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">
        <div style={inView ? { animation: "slideUp 240ms var(--ease-out) both" } : {}}>
          <div className="eyebrow eb">How it&apos;s made</div>
          <h2 style={{ marginTop: 12 }}>From raw lamination to certified unit.</h2>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(6,1fr)",
          marginTop: 40, borderTop: "2px solid var(--se-red)",
        }} className="process-grid">
          {steps.map((s, i) => (
            <div key={i} style={{
              padding: "20px 18px 0",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
              ...(inView ? { animation: `slideUp 240ms var(--ease-out) ${i * 55}ms both` } : {}),
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32,
                color: "var(--se-red)", lineHeight: 1, letterSpacing: "-.02em",
              }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13.5, color: "var(--fg1)", marginTop: 14, lineHeight: 1.3 }}>{s.title}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg2)", lineHeight: 1.55, marginTop: 7 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:1000px){.process-grid{grid-template-columns:repeat(3,1fr)!important}}
        @media(max-width:560px) {.process-grid{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>
    </section>
  );
}

/* ── Section 3: Manufacturing Solutions + R&D — two editorial panels ── */
export function FacilitiesSolutionsSection() {
  const { ref, inView } = useInView({ threshold: 0.08 });

  const panels = [
    {
      img: "/assets/solution.jpg",
      alt: "Engineering team reviewing transformer design drawings",
      eyebrow: "Manufacturing Solutions",
      heading: "Built to your specification, not ours.",
      body: "Beyond the standard catalogue, our engineering team takes on non-standard ratios, tighter accuracy classes, dual-core and combined CT-PT configurations, turnkey LT and HT metering panels, and export orders to IEC or ANSI. We work from your single-line diagram and return detailed drawings for approval before a single wire is wound.",
      bullets: [
        "Special primary currents and non-standard ratios",
        "Accuracy class 0.1, 0.2S for revenue metering",
        "Combined CT-PT units and dual-core designs",
        "Turnkey HT and LT panels, APFC, solar metering",
      ],
      delay: 0,
    },
    {
      img: "/assets/solution3.png",
      alt: "Engineer inspecting transformer at in-house test bay",
      eyebrow: "Research & Development",
      heading: "32 years of engineering, applied to every unit.",
      body: "Our design process starts at the core cross-section — optimising CRGO grade, winding geometry, and insulation system for the accuracy class and burden demanded by your application. Every design is validated against IS and IEC before production starts, and every finished unit is tested against the standard it was built to.",
      bullets: [
        "Core design from first principles, not templates",
        "In-house HV testing to 33 kV and 3000 A",
        "NABL-traceable calibration on all test equipment",
        "CPRI type-tested across all product families",
      ],
      delay: 80,
    },
  ];

  return (
    <section className="band" style={{ background: "var(--steel-50)" }} ref={ref as React.Ref<HTMLElement>}>
      <div className="wrap-wide">

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="fac-sol-grid">
          {panels.map((p, i) => (
            <div key={i} style={inView ? { animation: `slideUp 260ms var(--ease-out) ${p.delay}ms both` } : {}}>

              {/* Photo */}
              <div style={{
                borderRadius: "var(--r-lg)", overflow: "hidden",
                aspectRatio: "3/2", position: "relative",
                border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
              }}>
                <Image src={p.img} alt={p.alt} fill style={{ objectFit: "cover" }} />
              </div>

              {/* Text below photo */}
              <div style={{ paddingTop: 28 }}>
                <div className="eyebrow eb" style={{ fontSize: 11 }}>{p.eyebrow}</div>
                <h3 style={{ marginTop: 10, fontSize: 20, lineHeight: 1.22, letterSpacing: "-.01em" }}>{p.heading}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--fg2)", lineHeight: 1.72, marginTop: 12 }}>{p.body}</p>
                <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {p.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--se-red)", marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--fg2)", lineHeight: 1.5 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Certs — centred, below both panels */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, flexWrap: "wrap", marginTop: 48, paddingTop: 28,
          borderTop: "1px solid var(--border)",
          ...(inView ? { animation: "slideUp 240ms var(--ease-out) 200ms both" } : {}),
        }}>
          <span className="cert-gold"><Award size={15} style={{ color: "#6E4F00" }} /> ISO <b>9001:2015</b> <span className="cg-sub">CERTIFIED</span></span>
          <span className="cert">CPRI Type Tested</span>
          <span className="cert"><b>IS</b> 2705</span>
          <span className="cert"><b>IS</b> 3156</span>
          <span className="cert">IEC 61869</span>
          <span className="cert">TNEB Approved</span>
        </div>
      </div>
      <style>{`@media(max-width:760px){.fac-sol-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ── CTA ── */
export function FacilitiesCTASection() {
  return (
    <section className="band cta-band">
      <div className="cta-grid-tex" />
      <div className="wrap-wide">
        <div className="cta-inner">
          <div>
            <h2>Tell us your specification.</h2>
            <p>Standard product or custom design — share your ratings, accuracy class, and standard. We&apos;ll quote and build it here.</p>
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
