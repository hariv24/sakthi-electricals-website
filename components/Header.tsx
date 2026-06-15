"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Menu, X } from "lucide-react";
import type { MenuFamily } from "@/lib/catalog";

interface HeaderProps {
  menuData: MenuFamily[];
}

export default function Header({ menuData }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(menuData[0]?.slug ?? null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(
    menuData[0]?.children[0]?.slug ?? null
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingRef = useRef(false);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (scrollingRef.current) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setProductsOpen(false), 240);
  };
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileSectionExpanded, setMobileSectionExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      scrollingRef.current = true;
      setProductsOpen(false);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(() => { scrollingRef.current = false; }, 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isProductsActive = pathname.startsWith("/products");

  const activeFamily = menuData.find(f => f.slug === hoveredFamily) ?? menuData[0];
  const activeSection = activeFamily?.children.find(s => s.slug === hoveredSection)
    ?? activeFamily?.children[0];

  const handleFamilyHover = (family: MenuFamily) => {
    setHoveredFamily(family.slug);
    setHoveredSection(family.children[0]?.slug ?? null);
  };

  const navLink = (label: string, href: string) => (
    <Link
      key={href}
      href={href}
      style={{
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13.5px",
        color: isActive(href) ? "var(--se-red)" : "var(--fg1)",
        padding: "8px 12px", borderRadius: "var(--r-sm)", position: "relative",
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
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "9.5px", letterSpacing: ".04em", color: "var(--se-red)" }}>
                (An ISO 9001 Certified Company)
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 0, marginLeft: "auto" }} className="desktop-nav">

            {navLink("Home", "/")}
            {navLink("About", "/about")}

            {/* Products mega-menu trigger */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={openMenu}
              onMouseLeave={scheduleClose}
            >
              <Link
                href="/products"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13.5px",
                  color: isProductsActive ? "var(--se-red)" : "var(--fg1)",
                  padding: "8px 12px", borderRadius: "var(--r-sm)", position: "relative",
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

              {/* Hover bridge */}
              <div style={{ position: "absolute", top: "100%", left: -260, right: -260, height: 14, background: "transparent" }} />

              {/* Mega-menu — fixed 760px, always 3 columns so width never jumps */}
              <div
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
                style={{
                  position: "absolute", top: "calc(100% + 14px)", left: "50%",
                  transform: productsOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-6px)",
                  opacity: productsOpen ? 1 : 0,
                  pointerEvents: productsOpen ? "auto" : "none",
                  transition: "opacity 180ms var(--ease), transform 180ms var(--ease)",
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  boxShadow: "0 24px 72px rgba(0,0,0,.15), 0 4px 16px rgba(0,0,0,.07)",
                  width: 760,
                  display: "flex", flexDirection: "column",
                  overflow: "hidden",
                  zIndex: 200,
                }}
              >
                <div style={{ display: "flex", minHeight: 0 }}>

                  {/* Col 1 — families (tinted sidebar) */}
                  <div style={{
                    width: 210, flexShrink: 0,
                    borderRight: "1px solid var(--border)",
                    background: "var(--steel-50)",
                    padding: "14px 0 10px",
                  }}>
                    <div style={{ padding: "0 16px 8px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--fg3)", textTransform: "uppercase" }}>
                      Product Families
                    </div>

                    {menuData.map(family => {
                      const active = hoveredFamily === family.slug;
                      return (
                        <div
                          key={family.slug}
                          onMouseEnter={() => handleFamilyHover(family)}
                          style={{
                            padding: "0 16px 0 14px",
                            background: active ? "#fff" : "transparent",
                            borderLeft: active ? "2px solid var(--se-red)" : "2px solid transparent",
                            transition: "background 120ms, border-color 120ms",
                          }}
                        >
                          <Link
                            href={`/products/${family.slugPath.join("/")}`}
                            onClick={() => setProductsOpen(false)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "8px 0", gap: 8,
                              fontFamily: "var(--font-body)", fontWeight: active ? 600 : 500,
                              fontSize: 13, color: active ? "var(--fg0)" : "var(--fg1)",
                              lineHeight: 1.35, textDecoration: "none",
                            }}
                          >
                            {family.display}
                            <ChevronRight size={11} style={{ color: active ? "var(--se-red)" : "var(--fg3)", flexShrink: 0, opacity: active ? 1 : 0.4 }} />
                          </Link>
                        </div>
                      );
                    })}

                    <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0 0" }}>
                      <Link
                        href="/products"
                        onClick={() => setProductsOpen(false)}
                        style={{ display: "block", padding: "8px 16px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, color: "var(--se-red)", textDecoration: "none" }}
                      >
                        View all →
                      </Link>
                    </div>
                  </div>

                  {/* Col 2 — sub-categories of active family */}
                  <div style={{
                    width: 210, flexShrink: 0,
                    borderRight: "1px solid var(--border)",
                    padding: "14px 0 10px",
                    overflowY: "auto", maxHeight: 420,
                  }}>
                    {activeFamily && (
                      <>
                        <div style={{ padding: "0 16px 8px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--fg3)", textTransform: "uppercase" }}>
                          {activeFamily.display}
                        </div>

                        {activeFamily.children.length > 0 ? activeFamily.children.map(section => {
                          const sActive = hoveredSection === section.slug;
                          return (
                            <div
                              key={section.slug}
                              onMouseEnter={() => setHoveredSection(section.slug)}
                              style={{
                                padding: "0 16px 0 14px",
                                background: sActive ? "rgba(216,24,24,.05)" : "transparent",
                                borderLeft: sActive ? "2px solid var(--se-red)" : "2px solid transparent",
                                transition: "background 120ms, border-color 120ms",
                              }}
                            >
                              <Link
                                href={`/products/${section.slugPath.join("/")}`}
                                onClick={() => setProductsOpen(false)}
                                style={{
                                  display: "flex", alignItems: "center", justifyContent: "space-between",
                                  padding: "8px 0", gap: 8,
                                  fontFamily: "var(--font-body)", fontWeight: sActive ? 600 : 500,
                                  fontSize: 13, color: sActive ? "var(--fg0)" : "var(--fg1)",
                                  lineHeight: 1.35, textDecoration: "none",
                                }}
                              >
                                {section.display}
                                {section.hasChildren && (
                                  <ChevronRight size={11} style={{ color: sActive ? "var(--se-red)" : "var(--fg3)", flexShrink: 0, opacity: sActive ? 1 : 0.4 }} />
                                )}
                              </Link>
                            </div>
                          );
                        }) : (
                          <Link
                            href={`/products/${activeFamily.slugPath.join("/")}`}
                            onClick={() => setProductsOpen(false)}
                            style={{ display: "block", padding: "8px 16px", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg2)", textDecoration: "none" }}
                          >
                            View products →
                          </Link>
                        )}
                      </>
                    )}
                  </div>

                  {/* Col 3 — products inside active section (always rendered, may be empty) */}
                  <div style={{
                    flex: 1,
                    padding: "14px 0 10px",
                    overflowY: "auto", maxHeight: 420,
                  }}>
                    {activeSection && activeSection.children.length > 0 ? (
                      <>
                        <div style={{ padding: "0 16px 8px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--fg3)", textTransform: "uppercase" }}>
                          {activeSection.display}
                        </div>
                        {activeSection.children.map(sub => (
                          <Link
                            key={sub.slug}
                            href={`/products/${sub.slugPath.join("/")}`}
                            onClick={() => setProductsOpen(false)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "8px 16px", gap: 8, textDecoration: "none",
                              borderRadius: 8, margin: "0 6px",
                              transition: "background 120ms",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--steel-50)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <span style={{ fontFamily: "var(--font-body)", fontWeight: 450, fontSize: 13, color: "var(--fg1)", lineHeight: 1.35 }}>
                              {sub.display}
                            </span>
                            <ChevronRight size={11} style={{ color: "var(--fg3)", flexShrink: 0, opacity: 0.35 }} />
                          </Link>
                        ))}
                      </>
                    ) : (
                      /* Empty state keeps column at full width so panel never resizes */
                      <div />
                    )}
                  </div>
                </div>

                {/* Footer strip */}
                <div style={{
                  borderTop: "1px solid var(--border)",
                  padding: "10px 18px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  background: "var(--steel-50)",
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--fg2)", lineHeight: 1.4 }}>
                    Need a custom spec? Our engineering team will size it for you.
                  </span>
                  <Link
                    href="/contact"
                    onClick={() => setProductsOpen(false)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                      padding: "6px 14px",
                      fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12.5,
                      color: "#fff", background: "var(--se-red)",
                      borderRadius: 8, textDecoration: "none",
                    }}
                  >
                    <FileText size={13} /> Request a quote
                  </Link>
                </div>
              </div>
            </div>

            {navLink("Facilities", "/facilities")}
            {navLink("Customers", "/customers")}
            {navLink("Careers", "/careers")}
            {navLink("Contact", "/contact")}
          </nav>

          {/* Desktop CTA */}
          <Link href="/contact" className="btn btn-primary btn-sm" style={{ marginLeft: 8, flex: "none" }} data-desktop-cta>
            <FileText size={15} /> Request a quote
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
        <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/") ? "var(--se-red)" : "var(--fg1)" }}>
          Home
        </Link>
        <Link href="/about" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/about") ? "var(--se-red)" : "var(--fg1)" }}>
          About Us
        </Link>

        {/* Mobile Products accordion */}
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
              <Link
                href="/products"
                onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); }}
                style={{
                  display: "block", padding: "12px 28px",
                  fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13.5,
                  color: "var(--se-red)", borderBottom: "1px solid var(--border)",
                }}
              >
                View all products
              </Link>

              {menuData.map(family => (
                <div key={family.slug}>
                  {/* Family row */}
                  <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                    <Link
                      href={`/products/${family.slugPath.join("/")}`}
                      onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); }}
                      style={{ flex: 1, padding: "11px 28px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--fg1)", textDecoration: "none" }}
                    >
                      {family.display}
                    </Link>
                    {family.children.length > 0 && (
                      <button
                        onClick={() => setMobileExpanded(e => e === family.slug ? null : family.slug)}
                        style={{ padding: "11px 20px 11px 8px", background: "none", border: "none", cursor: "pointer" }}
                      >
                        <ChevronRight size={16} style={{ color: "var(--fg3)", transition: "transform 200ms", transform: mobileExpanded === family.slug ? "rotate(90deg)" : "rotate(0deg)" }} />
                      </button>
                    )}
                  </div>

                  {/* Expanded sections */}
                  {mobileExpanded === family.slug && family.children.map(section => (
                    <div key={section.slug} style={{ background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                        <Link
                          href={`/products/${section.slugPath.join("/")}`}
                          onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); setMobileExpanded(null); }}
                          style={{ flex: 1, padding: "10px 40px", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13.5, color: "var(--fg1)", textDecoration: "none" }}
                        >
                          {section.display}
                        </Link>
                        {section.hasChildren && (
                          <button
                            onClick={() => setMobileSectionExpanded(e => e === section.slug ? null : section.slug)}
                            style={{ padding: "10px 20px 10px 8px", background: "none", border: "none", cursor: "pointer" }}
                          >
                            <ChevronRight size={14} style={{ color: "var(--fg3)", transition: "transform 200ms", transform: mobileSectionExpanded === section.slug ? "rotate(90deg)" : "rotate(0deg)" }} />
                          </button>
                        )}
                      </div>

                      {/* Expanded sub-sections */}
                      {mobileSectionExpanded === section.slug && section.children.map(sub => (
                        <Link
                          key={sub.slug}
                          href={`/products/${sub.slugPath.join("/")}`}
                          onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); setMobileExpanded(null); setMobileSectionExpanded(null); }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 52px",
                            fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 13,
                            color: "var(--fg2)", borderBottom: "1px solid var(--border)",
                            textDecoration: "none", background: "var(--steel-50)",
                          }}
                        >
                          {sub.display}
                          <ChevronRight size={12} style={{ color: "var(--fg3)" }} />
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href="/facilities" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/facilities") ? "var(--se-red)" : "var(--fg1)" }}>
          Facilities &amp; Solutions
        </Link>
        <Link href="/customers" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/customers") ? "var(--se-red)" : "var(--fg1)" }}>
          Customers
        </Link>
        <Link href="/careers" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/careers") ? "var(--se-red)" : "var(--fg1)" }}>
          Careers
        </Link>
        <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, borderBottom: "1px solid var(--border)", color: isActive("/contact") ? "var(--se-red)" : "var(--fg1)" }}>
          Contact
        </Link>

        <div style={{ padding: "20px 24px" }}>
          <Link href="/contact" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ width: "100%", justifyContent: "center" }}>
            Request a quote
          </Link>
        </div>
      </div>

      {/* Spacer so page content clears the fixed header */}
      <div style={{ height: 76 }} />

      <style>{`
        @media (max-width: 1020px) {
          .desktop-nav { display: none !important; }
          [data-desktop-cta] { display: none !important; }
          .mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
