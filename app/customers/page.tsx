import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CustomerLogoGrid, CustomerSectorSection, CustomerCTASection } from "@/components/CustomerAnimSections";

export const metadata = {
  title: "Customers — Sakthi Electricals",
  description: "Utilities, public-sector undertakings and industry across India rely on Sakthi Electricals instrument transformers and panels.",
};

export default function CustomersPage() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Hero — CSS inline animations */}
        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: "url('/assets/banners/customers.jpg')", backgroundPosition: "center 42%" }} />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: "fadeIn 300ms var(--ease-out) 100ms both" }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Customers</span>
            </div>
            <div className="eyebrow eb" style={{ animation: "fadeSlideDown 360ms var(--ease-out) 200ms both" }}>Trusted across India</div>
            <h1 style={{ animation: "fadeSlideUp 440ms var(--ease-out) 350ms both" }}>Utilities, PSUs and industry rely on us.</h1>
            <p className="lead" style={{ animation: "fadeSlideUp 380ms var(--ease-out) 500ms both" }}>From national power utilities and public-sector undertakings to cement, sugar and infrastructure majors — an ever-growing portfolio of customers depends on Sakthi Electricals instrument transformers and panels.</p>
          </div>
          <div className="live-rule" style={{ transformOrigin: "left", animation: "rulerExtend 700ms var(--ease-out) 650ms both" }} />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        <CustomerLogoGrid />
        <CustomerSectorSection />
        <CustomerCTASection />

      </main>
      <Footer />
    </>
  );
}
