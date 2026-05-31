import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AboutStorySection,
  AboutStatsStrip,
  AboutValuesSection,
  AboutTimelineSection,
  AboutCPRISection,
  AboutCTASection,
} from "@/components/AboutAnimSections";

export const metadata = {
  title: "About Us — Sakthi Electricals",
  description: "Sakthi Electricals — started in 2006 with a vision to establish a name in transformer manufacturing. ISO 9001 certified; products tested by CPRI, Bangalore.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Hero — CSS inline animations, above the fold */}
        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: "url('/assets/banners/about.jpg')", backgroundPosition: "center 60%" }} />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: "fadeIn 300ms var(--ease-out) 100ms both" }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">About Us</span>
            </div>
            <div className="eyebrow eb" style={{ animation: "fadeSlideDown 360ms var(--ease-out) 200ms both" }}>About Sakthi Electricals</div>
            <h1 style={{ animation: "fadeSlideUp 440ms var(--ease-out) 350ms both" }}>Instrument transformer people, since 2006.</h1>
            <p className="lead" style={{ animation: "fadeSlideUp 380ms var(--ease-out) 500ms both" }}>An ISO 9001 certified manufacturer of instrument transformers, control transformers and LT/HT panels — engineered on strong fundamentals and tested before dispatch.</p>
          </div>
          <div className="live-rule" style={{ transformOrigin: "left", animation: "rulerExtend 700ms var(--ease-out) 650ms both" }} />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        <AboutStorySection />
        <AboutStatsStrip />
        <AboutValuesSection />
        <AboutTimelineSection />
        <AboutCPRISection />
        <AboutCTASection />

      </main>
      <Footer />
    </>
  );
}
