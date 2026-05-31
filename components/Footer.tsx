"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Warehouse, Phone, Mail, Award } from "lucide-react";
import { categories } from "@/lib/data";

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface-ink)", color: "var(--fg-on-dark)", padding: "80px 0 32px", borderTop: "3px solid var(--se-gold)" }}>
      <div className="wrap-wide">
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr .85fr .85fr 1.8fr", gap: 40 }} className="footer-grid">
          {/* Brand */}
          <div>
            <Image src="/assets/logo.png" alt="Sakthi Electricals" width={52} height={52} style={{ objectFit: "contain", marginBottom: 16 }} />
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: "-.01em" }}>Sakthi Electricals</div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, color: "var(--se-gold-300)", marginTop: 4 }}>Sprit of Innovation · (An ISO 9001 Certified Company)</div>
            <p style={{ color: "var(--fg-on-dark-2)", fontSize: 14, lineHeight: 1.6, marginTop: 16, maxWidth: 320 }}>
              Instrument transformer people. Manufacturers of LT & HT instrument transformers — cast-resin and oil-cooled up to 33 kV — control & service panels, electrical test benches, epoxy-cast resin bushings and vibratory feeders.
            </p>
            <div style={{ marginTop: 20 }}>
              <span className="cert-gold">
                <Award size={17} style={{ color: "#6E4F00" }} /> ISO <b>9001:2015</b>
                <span className="cg-sub">GOLD STANDARD</span>
              </span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h5 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--se-gold-300)", margin: "0 0 16px" }}>Products</h5>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
              {categories.map(c => (
                <li key={c.slug}>
                  <Link href={`/products#${c.slug}`} style={{ fontSize: "14.5px", color: "var(--fg-on-dark)", transition: "color 200ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--se-gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-on-dark)")}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--se-gold-300)", margin: "0 0 16px" }}>Company</h5>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { label: "About us", href: "/about" },
                { label: "All products", href: "/products" },
                { label: "Customers", href: "/customers" },
                { label: "Contact", href: "/contact" },
                { label: "Request a quote", href: "/contact" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} style={{ fontSize: "14.5px", color: "var(--fg-on-dark)", transition: "color 200ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--se-gold)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-on-dark)")}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--se-gold-300)", margin: "0 0 16px" }}>Get in touch</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14, color: "var(--fg-on-dark-2)" }}>
                <MapPin size={17} style={{ color: "var(--se-gold)", flex: "none", marginTop: 2 }} />
                <span><b style={{ color: "#fff", fontWeight: 600 }}>Regd. Office cum Factory</b><br />Plot No. 16, SIDCO Industrial Estate, Mathur New, Mathur,<br />Pudukkottai&nbsp;–&nbsp;622515, Tamil Nadu, India</span>
              </div>
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14, color: "var(--fg-on-dark-2)" }}>
                <Warehouse size={17} style={{ color: "var(--se-gold)", flex: "none", marginTop: 2 }} />
                <span><b style={{ color: "#fff", fontWeight: 600 }}>Godown</b><br />No. S5, SIDCO Industrial Estate (Near Post Office),<br />Ariyamangalam, Trichy&nbsp;–&nbsp;620010, Tamil Nadu, India</span>
              </div>
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14, color: "var(--fg-on-dark-2)" }}>
                <Phone size={17} style={{ color: "var(--se-gold)", flex: "none", marginTop: 2 }} />
                <span>
                  <b style={{ color: "#fff" }}><a href="tel:+919715211788" style={{ color: "#fff" }}>+91 97152 11788</a></b>
                  {" · "}<a href="tel:+917010170008" style={{ color: "var(--fg-on-dark-2)" }}>+91 70101 70008</a>
                  {" · "}<a href="tel:+917373711788" style={{ color: "var(--fg-on-dark-2)" }}>+91 73737 11788</a>
                </span>
              </div>
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14, color: "var(--fg-on-dark-2)" }}>
                <Mail size={17} style={{ color: "var(--se-gold)", flex: "none", marginTop: 2 }} />
                <a href="mailto:sakthi.electricals@yahoo.com" style={{ color: "var(--fg-on-dark-2)" }}>sakthi.electricals@yahoo.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          marginTop: 64, paddingTop: 24, borderTop: "1px solid var(--border-ink)",
          fontSize: 13, color: "var(--fg-on-dark-2)", flexWrap: "wrap",
        }}>
          <span>© {new Date().getFullYear()} Sakthi Electricals. All rights reserved.</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>SPRIT OF INNOVATION · ISO 9001 · IS 2705 · IS 3156</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
          .footer-grid > div:last-child { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
