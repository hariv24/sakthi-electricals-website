import Link from "next/link";
import { Box, ArrowRight } from "lucide-react";
import { HeroStats } from "@/components/HeroStats";
import {
  HomeAboutSection,
  HomeStatsSection,
  HomeProductsSection,
  HomeCapabilitiesSection,
  HomeCustomersSection,
  HomeCTASection,
} from "@/components/HomeAnimSections";
import NewsSection from "@/components/NewsSection";
import { getCatalogTreeFromDB } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const [tree, sb] = await Promise.all([getCatalogTreeFromDB(), createSupabaseServerClient()]);
  const { data: news } = await sb
    .from("news_items")
    .select("*")
    .order("published_date", { ascending: false })
    .limit(3);

  return (
    <>
      <main style={{ flex: 1 }}>
        <HeroSection />
        <HomeAboutSection />
        <HomeStatsSection />
        <HomeProductsSection families={tree.children} />
        <HomeCapabilitiesSection />
        {news && news.length > 0 && <NewsSection items={news} />}
        <HomeCustomersSection />
        <HomeCTASection />
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "var(--se-navy-900)" }}>
      <video autoPlay muted loop playsInline poster="/assets/hero-poster.jpg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
        <source src="/assets/hero.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(90deg,rgba(10,7,22,.86) 0%,rgba(10,7,22,.55) 42%,rgba(10,7,22,.12) 72%,rgba(10,7,22,0) 100%),linear-gradient(0deg,rgba(10,7,22,.82) 0%,rgba(10,7,22,.15) 38%,rgba(10,7,22,0) 60%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: .5, backgroundImage: "linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)", backgroundSize: "56px 56px", WebkitMaskImage: "radial-gradient(120% 90% at 18% 90%,#000 0%,transparent 75%)", maskImage: "radial-gradient(120% 90% at 18% 90%,#000 0%,transparent 75%)" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", width: "100%", padding: "0 24px 64px" }}>
        <div className="eyebrow eb" style={{ color: "var(--se-gold-300)", marginBottom: 16, animation: "fadeSlideDown 280ms var(--ease-out) 80ms both" }}>
          Instrument Transformer People · Est. 2006
        </div>
        <h1 style={{ color: "#fff", fontSize: "clamp(38px,5.4vw,68px)", lineHeight: 1.02, maxWidth: "18ch", letterSpacing: "-.02em", paddingBottom: ".08em", animation: "fadeSlideUp 340ms var(--ease-out) 180ms both" }}>
          Transformers engineered for the grid you <span style={{ color: "var(--se-gold)" }}>actually run.</span>
        </h1>
        <p style={{ color: "#DCE0E8", fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.6, maxWidth: "58ch", marginTop: 24, animation: "fadeSlideUp 300ms var(--ease-out) 320ms both" }}>
          Oil-cooled and resin-cast instrument transformers, control transformers and EB HT &amp; LT panels — manufactured up to 33 kV, built to IS standards and tested before they leave the floor.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32, animation: "fadeSlideUp 280ms var(--ease-out) 460ms both" }}>
          <Link href="/products" className="btn btn-primary btn-lg"><Box size={18} /> Explore products</Link>
          <Link href="/contact" className="btn btn-on-dark btn-lg">Request a quote <ArrowRight size={18} /></Link>
        </div>
        <HeroStats />
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: "100%", zIndex: 3, background: "linear-gradient(90deg,var(--se-red) 0%,var(--se-red) 38%,var(--se-gold) 38%,var(--se-gold) 50%,transparent 50%)", transformOrigin: "left", animation: "rulerExtend 600ms var(--ease-out) 900ms both" }} />
      <style>{`@media(prefers-reduced-motion:reduce){.hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
    </section>
  );
}
