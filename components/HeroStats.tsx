"use client";

import { CountUp } from "./CountUp";

export function HeroStats() {
  return (
    <div style={{
      display: "flex", gap: 32, flexWrap: "wrap", marginTop: 40,
      paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.14)",
      animation: "fadeIn 400ms var(--ease-out) 700ms both",
    }}>
      {/* Count starts at 820ms — after text appears at ~520ms, row fades in at 700ms */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "#fff", lineHeight: 1 }}>
          <CountUp to={22} duration={1200} delay={820} triggerOnMount />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--se-gold)", fontWeight: 500 }}>+ yrs</span>
        </span>
        <span style={{ fontSize: "12.5px", color: "var(--fg-on-dark-2)", letterSpacing: ".02em" }}>Engineering experience</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "#fff", lineHeight: 1 }}>
          <CountUp to={33} duration={900} delay={920} triggerOnMount />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--se-gold)", fontWeight: 500 }}> kV</span>
        </span>
        <span style={{ fontSize: "12.5px", color: "var(--fg-on-dark-2)", letterSpacing: ".02em" }}>Up to rated voltage</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "#fff", lineHeight: 1 }}>
          ISO<span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--se-gold)", fontWeight: 500 }}> 9001</span>
        </span>
        <span style={{ fontSize: "12.5px", color: "var(--fg-on-dark-2)", letterSpacing: ".02em" }}>Certified company</span>
      </div>
    </div>
  );
}
