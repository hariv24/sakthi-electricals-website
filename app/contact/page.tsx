"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { MapPin, Phone, Mail, ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, byCat } from "@/lib/data";
import { useInView } from "@/lib/useInView";

const WEBHOOK = "https://n8n-production-b18ce.up.railway.app/webhook/website-enquiry";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1 });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    setLoading(true);
    setError(false);

    const data = new FormData(form);
    const body = {
      name:        data.get("name") as string,
      company:     data.get("company") as string,
      email:       data.get("email") as string,
      phone:       data.get("phone") as string,
      product:     data.get("product") as string,
      requirement: data.get("message") as string,
      source:      "Website",
    };

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
      form.reset();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  /* Field-level stagger delays — 50ms apart */
  const fieldDelays = [200, 250, 300, 350, 400, 450, 520];

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>

        {/* Hero — CSS inline animations */}
        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: "url('/assets/banners/contact.jpg')", backgroundPosition: "center 30%" }} />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: "fadeIn 300ms var(--ease-out) 100ms both" }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Contact</span>
            </div>
            <div className="eyebrow eb" style={{ animation: "fadeSlideDown 360ms var(--ease-out) 200ms both" }}>Get in touch</div>
            <h1 style={{ animation: "fadeSlideUp 440ms var(--ease-out) 350ms both" }}>Tell us your spec. We&apos;ll build to it.</h1>
            <p className="lead" style={{ animation: "fadeSlideUp 380ms var(--ease-out) 500ms both" }}>Share your ratings, accuracy class, burden and standard — our engineering team will quote the right instrument transformer or panel for your application.</p>
          </div>
          <div className="live-rule" style={{ transformOrigin: "left", animation: "rulerExtend 700ms var(--ease-out) 650ms both" }} />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        {/* Contact form + info */}
        <section className="band" ref={sectionRef as React.Ref<HTMLElement>}>
          <div className="wrap-wide">
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 48, alignItems: "start" }} className="contact-layout">

              {/* Form — slides in from left */}
              <div style={inView ? { animation: "slideInLeft 280ms var(--ease-out) both" } : {}}>
                <div className="eyebrow eb">Request a quote</div>
                <h2 style={{ marginTop: 10, marginBottom: 24 }}>Send us your enquiry.</h2>

                {submitted && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(31,138,91,.08)", border: "1px solid rgba(31,138,91,.3)", color: "#1E8E5A", borderRadius: "var(--r-md)", padding: 20, fontSize: "14.5px", marginBottom: 24, animation: "slideUp 220ms var(--ease-out) both" }}>
                    <CheckCircle2 size={20} /> Thanks — your enquiry has been sent. Our team will get back to you shortly.
                  </div>
                )}

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(216,24,24,.06)", border: "1px solid rgba(216,24,24,.25)", color: "var(--se-red)", borderRadius: "var(--r-md)", padding: 20, fontSize: "14.5px", marginBottom: 24, animation: "slideUp 220ms var(--ease-out) both" }}>
                    <Send size={18} style={{ flex: "none" }} /> Something went wrong — please try again or email us at <a href="mailto:sakthi.electricals@yahoo.com" style={{ color: "var(--se-red)", fontWeight: 600 }}>sakthi.electricals@yahoo.com</a>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-grid">
                    <Field label="Name" required delay={inView ? fieldDelays[0] : 0}><input type="text" name="name" required placeholder="Your full name" /></Field>
                    <Field label="Company" required delay={inView ? fieldDelays[1] : 0}><input type="text" name="company" required placeholder="Organisation" /></Field>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-grid">
                    <Field label="Email" required delay={inView ? fieldDelays[2] : 0}><input type="email" name="email" required placeholder="you@company.com" /></Field>
                    <Field label="Phone" delay={inView ? fieldDelays[3] : 0}><input type="tel" name="phone" placeholder="+91 00000 00000" /></Field>
                  </div>
                  <Field label="Product of interest" delay={inView ? fieldDelays[4] : 0}>
                    <select name="product">
                      <option value="">Select a product family…</option>
                      {categories.map(c => (
                        <optgroup key={c.slug} label={c.name}>
                          {byCat(c.slug).map(p => <option key={p.slug} value={p.fullName}>{p.fullName}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </Field>
                  <Field label="Your requirement" required hint="The more detail you give, the more accurate our quote." delay={inView ? fieldDelays[5] : 0}>
                    <textarea name="message" required placeholder="Ratings, ratio, accuracy class, burden, quantity, standard, application…" style={{ minHeight: 120 }} />
                  </Field>
                  <div style={inView ? { animation: `slideUp 220ms var(--ease-out) ${fieldDelays[6]}ms both` } : {}}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      <Send size={18} /> {loading ? "Sending…" : "Send enquiry"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Info card — slides in from right */}
              <aside style={inView ? { animation: "slideInRight 280ms var(--ease-out) 80ms both" } : {}}>
                <div style={{ background: "var(--surface-ink)", color: "var(--fg-on-dark)", borderRadius: "var(--r-lg)", padding: 32 }}>
                  <h3 style={{ color: "#fff", fontSize: 19, letterSpacing: "-.01em", margin: 0 }}>Sakthi Electricals</h3>
                  <p style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 0", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".04em", color: "var(--se-gold-300)" }}>
                    <ShieldCheck size={16} style={{ color: "var(--se-gold)", flex: "none" }} /> ISO 9001:2015 Certified Company
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
                    {[
                      {
                        icon: <MapPin size={18} style={{ color: "var(--se-gold)", marginTop: 2 }} />,
                        label: "Address",
                        value: <>Plot No. 16, SIDCO Industrial Estate,<br />Mathur New, Mathur,<br />Pudukkottai&nbsp;–&nbsp;622515, Tamil Nadu, India</>,
                        delay: 300,
                      },
                      {
                        icon: <Phone size={18} style={{ color: "var(--se-gold)", marginTop: 2 }} />,
                        label: "Phone",
                        value: <><a href="tel:+919715211788" style={{ color: "#fff" }}>+91 97152 11788</a><br /><a href="tel:+917010170008" style={{ color: "var(--fg-on-dark-2)" }}>+91 70101 70008</a><br /><a href="tel:+917373711788" style={{ color: "var(--fg-on-dark-2)" }}>+91 73737 11788</a></>,
                        delay: 380,
                      },
                      {
                        icon: <Mail size={18} style={{ color: "var(--se-gold)", marginTop: 2 }} />,
                        label: "Email",
                        value: <a href="mailto:sakthi.electricals@yahoo.com" style={{ color: "var(--fg-on-dark-2)" }}>sakthi.electricals@yahoo.com</a>,
                        delay: 460,
                      },
                    ].map((item, i) => (
                      <div key={i}
                        style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 14, alignItems: "start", padding: "16px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,.12)" : "none", ...(inView ? { animation: `slideUp 220ms var(--ease-out) ${item.delay}ms both` } : {}) }}>
                        {item.icon}
                        <div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-on-dark-2)" }}>{item.label}</div>
                          <div style={{ fontSize: 15, color: "#fff", marginTop: 5, lineHeight: 1.55 }}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.12)", ...(inView ? { animation: "slideUp 220ms var(--ease-out) 540ms both" } : {}) }}>
                    {[["Monday – Saturday", "9:30 – 18:00"], ["Sunday", "Closed"]].map(([day, hours]) => (
                      <div key={day} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0", color: "var(--fg-on-dark)" }}>
                        <span>{day}</span>
                        <span style={{ color: "var(--se-gold-300)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

            </div>
          </div>
          <style>{`
            @media(max-width:920px){.contact-layout{grid-template-columns:1fr!important;gap:32px!important}}
            @media(max-width:560px){.form-row-grid{grid-template-columns:1fr!important}}
            .field-wrap{display:flex;flex-direction:column;gap:7px;margin-bottom:20px}
            .field-wrap label{font-family:var(--font-body);font-weight:600;font-size:13.5px;color:var(--fg1)}
            .field-wrap input,.field-wrap select,.field-wrap textarea{font-family:var(--font-body);font-size:15px;color:var(--fg1);padding:12px 14px;border:1.5px solid var(--border-strong);border-radius:var(--r-md);background:#fff;width:100%;transition:border-color 200ms,box-shadow 200ms}
            .field-wrap input:focus,.field-wrap select:focus,.field-wrap textarea:focus{outline:none;border-color:var(--se-red);box-shadow:var(--focus-ring)}
            .field-wrap textarea{resize:vertical}
          `}</style>
        </section>

      </main>
      <Footer />
    </>
  );
}

function Field({ label, required, hint, delay, children }: { label: string; required?: boolean; hint?: string; delay?: number; children: React.ReactNode }) {
  return (
    <div className="field-wrap"
      style={delay ? { animation: `slideUp 220ms var(--ease-out) ${delay}ms both` } : {}}>
      <label>{label}{required && <span style={{ color: "var(--se-red)" }}> *</span>}</label>
      {children}
      {hint && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg3)", marginTop: 4 }}>{hint}</span>}
    </div>
  );
}
