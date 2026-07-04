export const revalidate = 60;

import Link from "next/link";
import { CustomerLogoGrid, CustomerSectorSection, CustomerCTASection } from "@/components/CustomerAnimSections";
import { getSiteMedia } from "@/lib/siteMedia";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { customers as staticCustomers } from "@/lib/data";

export const metadata = {
  title: "Customers — Sakthi Electricals",
  description: "Utilities, public-sector undertakings and industry across India rely on Sakthi Electricals instrument transformers and panels.",
};

export default async function CustomersPage() {
  const [media, sb] = await Promise.all([getSiteMedia(['customers_banner']), createSupabaseAdminClient()]);
  const { data: dbCustomers } = await sb.from('customers').select('name, short, logo_url, sector').order('order_index', { ascending: true });
  // Use DB customers if any exist; otherwise fall back to the static list
  const customerList = dbCustomers && dbCustomers.length > 0
    ? dbCustomers.map((c: { name: string; short: string; logo_url: string; sector: string }) => ({ name: c.name, short: c.short, logo: c.logo_url, sector: c.sector }))
    : staticCustomers;

  return (
    <>
      <main style={{ flex: 1 }}>

        {/* Hero — CSS inline animations */}
        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: `url('${media.customers_banner}')`, backgroundPosition: "center 42%" }} />
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

        <CustomerLogoGrid customers={customerList} />
        <CustomerSectorSection />
        <CustomerCTASection />

      </main>
    </>
  );
}
