import Link from "next/link";
import { Metadata } from "next";
import {
  FacilitiesFloorSection,
  FacilitiesProcessSection,
  FacilitiesSolutionsSection,
  FacilitiesCTASection,
} from "@/components/FacilitiesAnimSections";

export const metadata: Metadata = {
  title: "Facilities & Solutions — Sakthi Electricals",
  description:
    "Manufacturing, engineering, and testing facilities at Sakthi Electricals — resin casting, in-house HV test lab, tool room, and custom solutions for instrument transformers and panels up to 33 kV.",
};

export default function FacilitiesPage() {
  return (
    <>
      <main style={{ flex: 1 }}>

        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: "url('/assets/banners/facilities.jpg')", backgroundPosition: "center 55%" }} />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: "fadeIn 300ms var(--ease-out) 100ms both" }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Facilities &amp; Solutions</span>
            </div>
            <div className="eyebrow eb" style={{ animation: "fadeSlideDown 360ms var(--ease-out) 200ms both" }}>Pudukkottai, Tamil Nadu</div>
            <h1 style={{ animation: "fadeSlideUp 440ms var(--ease-out) 350ms both" }}>Built here. Tested here. Certified before dispatch.</h1>
            <p className="lead" style={{ animation: "fadeSlideUp 380ms var(--ease-out) 500ms both" }}>
              Six production bays. In-house high-voltage testing up to 33 kV. No subcontracting. Every instrument transformer and panel leaves with a test certificate against the standard it was built to.
            </p>
          </div>
          <div className="live-rule" style={{ transformOrigin: "left", animation: "rulerExtend 700ms var(--ease-out) 650ms both" }} />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        <FacilitiesFloorSection />
        <FacilitiesProcessSection />
        <FacilitiesSolutionsSection />
        <FacilitiesCTASection />

      </main>
    </>
  );
}
