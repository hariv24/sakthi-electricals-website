import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  console.log('[contact] POST received');

  const body = await req.json();
  const { name, company, email, phone, product, requirement } = body;

  if (!name || !email || !requirement) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Save to Supabase
  const sb = await createSupabaseAdminClient();
  const { error: dbError } = await sb.from('contact_submissions').insert({
    name,
    company: company || null,
    email,
    phone: phone || null,
    product: product || null,
    requirement,
  });

  if (dbError) {
    console.error('[contact] DB error:', dbError.message);
    return NextResponse.json({ error: 'Failed to save enquiry.' }, { status: 500 });
  }

  // Fire n8n webhook (best-effort — don't fail the request if it's down)
  try {
    await fetch('https://n8n.thinkgalactic.in/webhook/website-enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, email, phone, product, requirement, source: 'Website' }),
    });
  } catch (err) {
    console.warn('[contact] n8n webhook failed:', err);
  }

  // Send email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: 'Sakthi Electricals Website <onboarding@resend.dev>',
      to: ['sales@sakthielectricals.com'],
      replyTo: email,
      subject: `New Enquiry from ${name}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
          <div style="background:#CC1B1B;padding:24px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">New Website Enquiry</h1>
          </div>
          <div style="background:#f9f9f9;padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;width:140px;color:#555">Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Company</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${company || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5"><a href="mailto:${email}" style="color:#CC1B1B">${email}</a></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${phone || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Product</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${product || '—'}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;color:#555;vertical-align:top">Requirement</td><td style="padding:10px 0;white-space:pre-wrap">${requirement}</td></tr>
            </table>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;font-size:13px;color:#888">
              Hit Reply to respond directly to ${name}.
            </div>
          </div>
        </div>
      `,
    });
  } else {
    console.warn('[contact] RESEND_API_KEY not set — email skipped');
  }

  console.log('[contact] Done — enquiry saved');
  return NextResponse.json({ ok: true });
}
