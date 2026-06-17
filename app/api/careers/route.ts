import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const WEBHOOK = 'https://n8n-production-b18ce.up.railway.app/webhook/website-enquiry';

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

  // Forward to n8n webhook (best-effort, JSON only — no file)
  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, role, experience, requirement, source: 'Careers' }),
    });
  } catch (e) {
    console.error('[POST /api/careers] webhook forward failed:', e);
  }

  console.log('[POST /api/careers] done, resumeUrl:', resumeUrl);
  return NextResponse.json({ ok: true });
}
