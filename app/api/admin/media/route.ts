import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { MEDIA_DEFAULTS } from '@/lib/siteMedia';

console.log('[admin/media] route loaded');

export async function GET() {
  console.log('[admin/media] GET');
  const sb = await createSupabaseAdminClient();
  const { data } = await sb.from('site_media').select('key, url, updated_at');
  return NextResponse.json(data ?? []);
}

// Upload a new file
export async function POST(req: NextRequest) {
  console.log('[admin/media] POST upload');
  const formData = await req.formData();
  const key = formData.get('key') as string;
  const file = formData.get('file') as File | null;

  if (!key || !file) return NextResponse.json({ error: 'Missing key or file' }, { status: 400 });
  if (!MEDIA_DEFAULTS[key]) return NextResponse.json({ error: 'Unknown media key' }, { status: 400 });

  const sb = await createSupabaseAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `uploads/${Date.now()}_${safeName}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await sb.storage
    .from('site-media')
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (upErr) {
    console.error('[admin/media] upload error', upErr);
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: urlData } = sb.storage.from('site-media').getPublicUrl(path);
  const url = urlData.publicUrl;

  const { error: dbErr } = await sb.from('site_media').upsert(
    { key, url, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  );
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  console.log('[admin/media] uploaded', key, url);
  return NextResponse.json({ ok: true, url });
}

// Select an existing uploaded image for a slot (no file upload)
export async function PATCH(req: NextRequest) {
  console.log('[admin/media] PATCH select existing');
  const { key, url } = await req.json();
  if (!key || !url) return NextResponse.json({ error: 'Missing key or url' }, { status: 400 });

  const sb = await createSupabaseAdminClient();
  const { error } = await sb.from('site_media').upsert(
    { key, url, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, url });
}

// Reset a slot to its original default
export async function DELETE(req: NextRequest) {
  console.log('[admin/media] DELETE reset to default');
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  const sb = await createSupabaseAdminClient();
  await sb.from('site_media').delete().eq('key', key);
  return NextResponse.json({ ok: true, url: MEDIA_DEFAULTS[key] });
}
