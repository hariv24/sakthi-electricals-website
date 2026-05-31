"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";

const NAV = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "products", label: "Products", href: "/products" },
  { key: "customers", label: "Customers", href: "/customers" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
        <div className="header-inner" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", height: 76, display: "flex", alignItems: "center", gap: 32 }}>
          {/* Brand */}
          <Link href="/" aria-label="Sakthi Electricals home" style={{ display: "flex", alignItems: "center", gap: 12, flex: "none" }}>
            <Image src="/assets/logo.png" alt="Sakthi Electricals" width={44} height={44} style={{ objectFit: "contain" }} />
            <span style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1 }}>
              <Image src="/assets/brand/wordmark.png" alt="SAKTHI ELECTRICALS" width={160} height={19} style={{ objectFit: "contain", height: 19, width: "auto" }} />
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "9.5px", letterSpacing: ".04em", color: "var(--se-red)" }}>(An ISO 9001 Certified Company)</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }} className="desktop-nav">
            {NAV.map(n => (
              <Link
                key={n.key}
                href={n.href}
                style={{
                  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14.5px",
                  color: isActive(n.href) ? "var(--se-red)" : "var(--fg1)",
                  padding: "9px 15px", borderRadius: "var(--r-sm)", position: "relative",
                  transition: "color 200ms var(--ease)",
                }}
              >
                {n.label}
                {isActive(n.href) && (
                  <span style={{ position: "absolute", left: 15, right: 15, bottom: 2, height: 2, background: "var(--se-red)", borderRadius: 2 }} />
                )}
              </Link>
            ))}
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
        }}
      >
        {NAV.map(n => (
          <Link
            key={n.key}
            href={n.href}
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block", padding: "14px 24px",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16,
              borderBottom: "1px solid var(--border)",
              color: isActive(n.href) ? "var(--se-red)" : "var(--fg1)",
            }}
          >
            {n.label}
          </Link>
        ))}
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
