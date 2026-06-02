"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Menu, X } from "lucide-react";
import { categories, byCat } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(categories[0].slug);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isProductsActive = pathname.startsWith("/products");

  const activeProducts = byCat(hoveredCat);

  const navLink = (label: string, href: string) => (
    <Link
      key={href}
      href={href}
      style={{
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14.5px",
        color: isActive(href) ? "var(--se-red)" : "var(--fg1)",
        padding: "9px 15px", borderRadius: "var(--r-sm)", position: "relative",
        transition: "color 200ms var(--ease)",
      }}
    >
      {label}
      {isActive(href) && (
        <span style={{ position: "absolute", left: 15, right: 15, bottom: 2, height: 2, background: "var(--se-red)", borderRadius: 2 }} />
      )}
    </Link>
  );

  return (
    <>
      <header
        className="site-header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.86)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          transition: "box-shadow 200ms var(--ease), background 200ms var(--ease)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", height: 76, display: "flex", alignItems: "center", gap: 32 }}>
          {/* Brand */}
          <Link href="/" aria-label="Sakthi Electricals home" style={{ display: "flex", alignItems: "center", gap: 12, flex: "none" }}>
            <Image src="/assets/logo.png" alt="Sakthi Electricals" width={44} height={44} style={{ objectFit: "contain" }} />
            <span style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1 }}>
              <Image src="/assets/brand/wordmark.png" alt="SAKTHI ELECTRICALS" width={160} height={19} style={{ objectFit: "contain", height: 19, width: "auto" }} />
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "9.5px", letterSpacing: ".04em", color: "var(--se-red)" }}>(An ISO 9001 Certified Company)</span>
            </span>
          </Link>

          {/* Desktop nav — correct order: Home · About Us · Products · Customers · Contact */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }} className="desktop-nav">

            {navLink("Home", "/")}
            {navLink("About Us", "/about")}

            {/* Products mega-menu */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              {/* The trigger link — no gap below so mouse stays inside the container */}
              <Link
                href="/products"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14.5px",
                  color: isProductsActive ? "var(--se-red)" : "var(--fg1)",
                  padding: "9px 15px 9px", borderRadius: "var(--r-sm)", position: "relative",
                  transition: "color 200ms var(--ease)",
                }}
              >
                Products
                <ChevronDown size={14} style={{
                  transition: "transform 200ms var(--ease)",
                  transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)",
                }} />
                {isProductsActive && (
                  <span style={{ position: "absolute", left: 15, right: 15, bottom: 2, height: 2, background: "var(--se-red)", borderRadius: 2 }} />
                )}
              </Link>

              {/* Invisible bridge — fills the gap so mouse doesn't escape the hover zone */}
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, height: 8, background: "transparent" }} />

              {/* Mega-menu panel */}
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: "50%",
                transform: productsOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-6px)",
                opacity: productsOpen ? 1 : 0,
                pointerEvents: productsOpen ? "auto" : "none",
                transition: "opacity 160ms var(--ease), transform 160ms var(--ease)",
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 14,
                boxShadow: "0 20px 60px rgba(0,0,0,.13), 0 2px 8px rgba(0,0,0,.06)",
                width: 620,
                display: "flex",
                overflow: "hidden",
                zIndex: 200,
              }}>
                {/* Left: category list */}
                <div style={{ width: 230, borderRight: "1px solid var(--border)", padding: "10px 0", flexShrink: 0 }}>
                  <div style={{ padding: "8px 16px 4px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".08em", color: "var(--fg3)", textTransform: "uppercase" }}>
                    Product Families
                  </div>
                  {categories.map(cat => {
                    const active = hoveredCat === cat.slug;
                    return (
                      <div
                        key={cat.slug}
                        onMouseEnter={() => setHoveredCat(cat.slug)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "9px 16px", gap: 8, cursor: "pointer",
                          background: active ? "rgba(216,24,24,.06)" : "transparent",
                          borderLeft: active ? "2px solid var(--se-red)" : "2px solid transparent",
                          transition: "background 120ms, border-color 120ms",
                        }}
                      >
                        <span style={{
                          fontFamily: "var(--font-body)", fontWeight: active ? 600 : 500,
                          fontSize: 13, color: active ? "var(--se-red)" : "var(--fg1)",
                          lineHeight: 1.3,
                        }}>
                          {cat.name}
                        </span>
                        <ChevronRight size={12} style={{ color: active ? "var(--se-red)" : "var(--fg3)", flexShrink: 0 }} />
                      </div>
                    );
                  })}
                  <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0 0" }}>
                    <Link
                      href="/products"
                      onClick={() => setProductsOpen(false)}
                      style={{
                        display: "block", padding: "10px 16px",
                        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5,
                        color: "var(--se-red)",
                      }}
                    >
                      View all products →
                    </Link>
                  </div>
                </div>

                {/* Right: products for hovered category */}
                <div style={{ flex: 1, padding: "10px 0", overflowY: "auto", maxHeight: 420 }}>
                  <div style={{ padding: "8px 16px 4px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".08em", color: "var(--fg3)", textTransform: "uppercase" }}>
                    {categories.find(c => c.slug === hoveredCat)?.name}
                  </div>
                  {activeProducts.map(p => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      onClick={() => setProductsOpen(false)}
                      style={{
                        display: "flex", flexDirection: "column", padding: "9px 16px", gap: 2,
                        transition: "background 120ms",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--steel-50)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: "var(--fg1)", lineHeight: 1.3 }}>
                        {p.name}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--fg3)" }}>
                        {p.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLink("Customers", "/customers")}
            {navLink("Contact", "/contact")}
          </nav>

          {/* CTA button */}
          <Link href="/contact" className="btn btn-primary btn-sm" style={{ marginLeft: 16, flex: "none" }} data-desktop-cta>
            <FileText size={16} /> Request a quote
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
            style={{
              display: "none", marginLeft: "auto", background: "none",
              border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
              width: 42, height: 42, alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
            className="mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div
        className="mobile-nav-drawer"
        style={{
          position: "fixed", top: 76, left: 0, right: 0, zIndex: 99,
          background: "#fff", borderBottom: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
          transform: mobileOpen ? "translateY(0)" : "translateY(-12px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "all 200ms var(--ease)",
          overflowY: "auto", maxHeight: "calc(100vh - 76px)",
        }}
      >
        <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/") ? "var(--se-red)" : "var(--fg1)" }}>Home</Link>
        <Link href="/about" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/about") ? "var(--se-red)" : "var(--fg1)" }}>About Us</Link>

        {/* Mobile Products expandable */}
        <div>
          <button
            onClick={() => setMobileProductsOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "14px 24px",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16,
              color: isProductsActive ? "var(--se-red)" : "var(--fg1)",
              background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer",
            }}
          >
            Products
            <ChevronDown size={18} style={{ transition: "transform 200ms", transform: mobileProductsOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          {mobileProductsOpen && (
            <div style={{ background: "var(--steel-50)", borderBottom: "1px solid var(--border)" }}>
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/products#${cat.slug}`}
                  onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 32px", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14.5,
                    borderBottom: "1px solid var(--border)", color: "var(--fg1)",
                  }}
                >
                  {cat.name}
                  <ChevronRight size={14} style={{ color: "var(--fg3)" }} />
                </Link>
              ))}
              <Link href="/products" onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); }} style={{ display: "block", padding: "12px 32px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14.5, color: "var(--se-red)" }}>
                View all products →
              </Link>
            </div>
          )}
        </div>

        <Link href="/customers" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/customers") ? "var(--se-red)" : "var(--fg1)" }}>Customers</Link>
        <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/contact") ? "var(--se-red)" : "var(--fg1)" }}>Contact</Link>

        <div style={{ padding: "20px 24px" }}>
          <Link href="/contact" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ width: "100%", justifyContent: "center" }}>
            Request a quote
          </Link>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 76 }} />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          [data-desktop-cta] { display: none !important; }
          .mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
