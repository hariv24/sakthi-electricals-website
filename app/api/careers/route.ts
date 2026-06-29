import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  console.log('[POST /api/careers] received');

  const formData = await req.formData();
  const name        = formData.get('name') as string;
  const email       = formData.get('email') as string;
  const phone       = formData.get('phone') as string;
  const role        = formData.get('role') as string;
  const experience  = formData.get('experience') as string | null;
  const requirement = formData.get('message') as string | null;
  const file        = formData.get('resume') as File | null;

  if (!name || !email || !phone || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (file && file.size > 0) {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return NextResponse.json({ error: 'Resumes must be a PDF file.' }, { status: 400 });
    }
  }

  const admin = await createSupabaseAdminClient();

  // Upload resume if provided
  let resumeUrl: string | null = null;
  if (file && file.size > 0) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from('resumes')
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (uploadError) {
      console.error('[POST /api/careers] resume upload error:', uploadError.message);
    } else {
      const { data: { publicUrl } } = admin.storage.from('resumes').getPublicUrl(path);
      resumeUrl = publicUrl;
    }
  }

  const { error } = await admin.from('career_applications').insert({
    name, email, phone, role,
    experience: experience || null,
    message:    requirement || null,
    resume_url: resumeUrl,
  });

  if (error) console.error('[POST /api/careers] Supabase error:', error.message);

  // Forward to n8n webhook (best-effort)
  try {
    await fetch('https://n8n.thinkgalactic.in/webhook/website-enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, role, experience, requirement, source: 'Careers' }),
    });
  } catch (e) {
    console.error('[POST /api/careers] webhook forward failed:', e);
  }

  // Send email notification
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Sakthi Electricals Website <website@sakthielectricals.com>',
        to: ['admin@sakthielectricals.com'],
        replyTo: email,
        subject: `New Job Application — ${role} from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
            <div style="background:#CC1B1B;padding:24px 32px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">New Job Application</h1>
            </div>
            <div style="background:#f9f9f9;padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;width:140px;color:#555">Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${name}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5"><a href="mailto:${email}" style="color:#CC1B1B">${email}</a></td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${phone}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Role</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${role}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;color:#555">Experience</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5">${experience || '—'}</td></tr>
                <tr><td style="padding:10px 0;font-weight:600;color:#555;vertical-align:top">Message</td><td style="padding:10px 0;white-space:pre-wrap">${requirement || '—'}</td></tr>
              </table>
              ${resumeUrl ? `<div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5"><a href="${resumeUrl}" style="background:#CC1B1B;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">Download Resume</a></div>` : ''}
              <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;font-size:13px;color:#888">
                Hit Reply to respond directly to ${name}.
              </div>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error('[POST /api/careers] email failed:', e);
    }
  }

  console.log('[POST /api/careers] done, resumeUrl:', resumeUrl);
  return NextResponse.json({ ok: true });
}
