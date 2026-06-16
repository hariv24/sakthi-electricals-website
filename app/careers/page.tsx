"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { Send, CheckCircle2, Briefcase, Wrench, Users, Award } from "lucide-react";
import { useInView } from "@/lib/useInView";

const API_ROUTE = "/api/careers";

const ROLES = [
  "Winding Operator – Transformer",
  "Electrical Engineer – Design",
  "Quality Control Technician",
  "Production Supervisor",
  "Sales & Application Engineer",
  "Procurement / Stores Executive",
  "CNC / Fabrication Operator",
  "General / Other",
];

const WHY_JOIN = [
  {
    icon: <Wrench size={22} style={{ color: "var(--se-gold)" }} />,
    title: "Hands-on engineering",
    body: "Work directly on instrument transformers and panels from winding to final testing. Every unit that leaves the floor has your name on it.",
  },
  {
    icon: <Award size={22} style={{ color: "var(--se-gold)" }} />,
    title: "ISO 9001 & CPRI standards",
    body: "Build your career inside a certified environment where precision and quality aren't optional — they're the baseline.",
  },
  {
    icon: <Users size={22} style={{ color: "var(--se-gold)" }} />,
    title: "Close-knit team",
    body: "We're a focused manufacturing unit in Pudukkottai. You'll know everyone, your contribution is visible, and growth is direct.",
  },
  {
    icon: <Briefcase size={22} style={{ color: "var(--se-gold)" }} />,
    title: "Stable & growing",
    body: "Serving utilities, PSUs and industry since 2006 — the business is steady and the product line keeps expanding.",
  },
];

function Field({
  label, required, hint, delay, children,
}: {
  label: string; required?: boolean; hint?: string; delay?: number; children: React.ReactNode;
}) {
  return (
    <div className="field-wrap" style={delay ? { animation: `slideUp 220ms var(--ease-out) ${delay}ms both` } : {}}>
      <label>{label}{required && <span style={{ color: "var(--se-red)" }}> *</span>}</label>
      {children}
      {hint && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg3)", marginTop: 4 }}>{hint}</span>}
    </div>
  );
}

export default function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ref: formRef, inView: formInView } = useInView({ threshold: 0.05 });
  const { ref: whyRef, inView: whyInView } = useInView({ threshold: 0.1 });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    setLoading(true);
    setError(false);

    const data = new FormData(form);

    try {
      const res = await fetch(API_ROUTE, {
        method: "POST",
        body: data,
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

  const fieldDelays = [200, 250, 300, 350, 420, 490];

  return (
    <>
      <main style={{ flex: 1 }}>

        {/* Hero */}
        <section className="page-hero hero-photo">
          <div className="hero-bg" style={{ backgroundImage: "url('/assets/banners/careers.jpg')", backgroundPosition: "center 40%" }} />
          <div className="wrap-wide">
            <div className="breadcrumb" style={{ animation: "fadeIn 300ms var(--ease-out) 100ms both" }}>
              <Link href="/">Home</Link><span className="sep">/</span><span className="cur">Careers</span>
            </div>
            <div className="eyebrow eb" style={{ animation: "fadeSlideDown 360ms var(--ease-out) 200ms both" }}>Join our team</div>
            <h1 style={{ animation: "fadeSlideUp 440ms var(--ease-out) 350ms both" }}>Build the infrastructure India runs on.</h1>
            <p className="lead" style={{ animation: "fadeSlideUp 380ms var(--ease-out) 500ms both" }}>
              We manufacture instrument transformers and control panels for power utilities and industry across the country. If you want to do hands-on precision work that matters, we want to hear from you.
            </p>
          </div>
          <div className="live-rule" style={{ transformOrigin: "left", animation: "rulerExtend 700ms var(--ease-out) 650ms both" }} />
          <style>{`@media(prefers-reduced-motion:reduce){.page-hero *{animation:none!important;opacity:1!important;transform:none!important}}`}</style>
        </section>

        {/* Why join us */}
        <section className="band" ref={whyRef as React.Ref<HTMLElement>}>
          <div className="wrap-wide">
            <div style={whyInView ? { animation: "slideUp 280ms var(--ease-out) both" } : {}}>
              <div className="eyebrow eb">Why Sakthi Electricals</div>
              <h2 style={{ marginTop: 10, marginBottom: 40 }}>A factory floor where quality is taken seriously.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {WHY_JOIN.map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-lg)",
                    padding: "24px 22px",
                    ...(whyInView ? { animation: `slideUp 260ms var(--ease-out) ${120 + i * 80}ms both` } : {}),
                  }}
                >
                  <div style={{ marginBottom: 14 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--fg2)", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section className="band" style={{ background: "var(--steel-50)" }} ref={formRef as React.Ref<HTMLElement>}>
          <div className="wrap-wide">
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 56, alignItems: "start" }} className="careers-layout">

              {/* Left — form */}
              <div style={formInView ? { animation: "slideInLeft 280ms var(--ease-out) both" } : {}}>
                <div className="eyebrow eb">Apply now</div>
                <h2 style={{ marginTop: 10, marginBottom: 24 }}>Send us your details.</h2>

                {submitted && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(31,138,91,.08)", border: "1px solid rgba(31,138,91,.3)", color: "#1E8E5A", borderRadius: "var(--r-md)", padding: 20, fontSize: "14.5px", marginBottom: 20, animation: "slideUp 220ms var(--ease-out) both" }}>
                    <CheckCircle2 size={20} /> Application received — we&apos;ll review your details and get back to you shortly.
                  </div>
                )}

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(216,24,24,.06)", border: "1px solid rgba(216,24,24,.25)", color: "var(--se-red)", borderRadius: "var(--r-md)", padding: 20, fontSize: "14.5px", marginBottom: 20 }}>
                    <Send size={18} style={{ flex: "none" }} /> Something went wrong — please try again or email us at{" "}
                    <a href="mailto:sakthi.electricals@yahoo.com" style={{ color: "var(--se-red)", fontWeight: 600 }}>sakthi.electricals@yahoo.com</a>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 32, boxShadow: "var(--shadow-sm)" }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-grid">
                    <Field label="Full name" required delay={formInView ? fieldDelays[0] : 0}>
                      <input type="text" name="name" required placeholder="Your full name" />
                    </Field>
                    <Field label="Phone" required delay={formInView ? fieldDelays[1] : 0}>
                      <input type="tel" name="phone" required placeholder="+91 00000 00000" />
                    </Field>
                  </div>

                  <Field label="Email" required delay={formInView ? fieldDelays[2] : 0}>
                    <input type="email" name="email" required placeholder="you@email.com" />
                  </Field>

                  <Field label="Role you&apos;re interested in" required delay={formInView ? fieldDelays[3] : 0}>
                    <select name="role" required>
                      <option value="">Select a role…</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>

                  <Field label="Years of experience" delay={formInView ? fieldDelays[4] : 0}>
                    <select name="experience">
                      <option value="">Select…</option>
                      <option value="Fresher (0 years)">Fresher (0 years)</option>
                      <option value="1–2 years">1–2 years</option>
                      <option value="3–5 years">3–5 years</option>
                      <option value="6–10 years">6–10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </Field>

                  <Field
                    label="Tell us about yourself"
                    required
                    hint="Your background, what you're looking for, and why Sakthi Electricals."
                    delay={formInView ? fieldDelays[5] : 0}
                  >
                    <textarea name="message" required placeholder="Briefly describe your background and what you're looking for…" style={{ minHeight: 110 }} />
                  </Field>

                  <Field label="Resume / CV" hint="Optional — PDF, DOC, or DOCX. Max 5 MB." delay={formInView ? 530 : 0}>
                    <input type="file" name="resume" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ padding: "9px 12px", cursor: "pointer" }} />
                  </Field>

                  <div style={formInView ? { animation: `slideUp 220ms var(--ease-out) 560ms both` } : {}}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                      <Send size={18} /> {loading ? "Submitting…" : "Submit application"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right — info sidebar */}
              <aside style={formInView ? { animation: "slideInRight 280ms var(--ease-out) 80ms both" } : {}}>

                {/* What we're looking for */}
                <div style={{ marginBottom: 24 }}>
                  <div className="eyebrow eb">What we look for</div>
                  <h3 style={{ marginTop: 10, marginBottom: 14, fontSize: 20 }}>Join the team.</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg2)", lineHeight: 1.7 }}>
                    We recruit for production, engineering, quality, and sales roles on an ongoing basis. Tell us who you are — we&apos;ll reach out when there&apos;s a fit.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                    {[
                      "Based in or willing to relocate to Pudukkottai, Tamil Nadu",
                      "ITI / Diploma / BE / B.Tech depending on the role",
                      "Freshers welcome for production and operator roles",
                    ].map(point => (
                      <div key={point} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--se-red)", marginTop: 7, flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg2)", lineHeight: 1.55 }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Open roles dark card */}
                <div style={{ background: "var(--surface-ink)", borderRadius: "var(--r-lg)", padding: "24px 28px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--se-gold-300)", marginBottom: 16 }}>
                    Roles we hire for
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {ROLES.filter(r => r !== "General / Other").map((role, i) => (
                      <div key={role} style={{
                        fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--fg-on-dark)",
                        padding: "10px 0",
                        borderBottom: i < ROLES.length - 2 ? "1px solid rgba(255,255,255,.1)" : "none",
                        lineHeight: 1.4,
                      }}>
                        {role}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.12)", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-on-dark-2)", lineHeight: 1.55 }}>
                    Don&apos;t see your role? Submit under General — we review all applications.
                  </div>
                </div>

              </aside>

            </div>
          </div>

          <style>{`
            .field-wrap{display:flex;flex-direction:column;gap:7px;margin-bottom:20px}
            .field-wrap label{font-family:var(--font-body);font-weight:600;font-size:13.5px;color:var(--fg1)}
            .field-wrap input,.field-wrap select,.field-wrap textarea{font-family:var(--font-body);font-size:15px;color:var(--fg1);padding:12px 14px;border:1.5px solid var(--border-strong);border-radius:var(--r-md);background:#fff;width:100%;transition:border-color 200ms,box-shadow 200ms}
            .field-wrap input:focus,.field-wrap select:focus,.field-wrap textarea:focus{outline:none;border-color:var(--se-red);box-shadow:var(--focus-ring)}
            .field-wrap textarea{resize:vertical}
            @media(max-width:920px){.careers-layout{grid-template-columns:1fr!important;gap:32px!important}}
            @media(max-width:560px){.form-row-grid{grid-template-columns:1fr!important}}
          `}</style>
        </section>

      </main>
    </>
  );
}
