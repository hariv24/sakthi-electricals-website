import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { MEDIA_DEFAULTS, MEDIA_LABELS } from '@/lib/siteMedia';

console.log('[admin/media] route loaded');

export async function GET() {
  console.log('[admin/media] GET all media slots');
  const sb = await createSupabaseAdminClient();
  const { data } = await sb.from('site_media').select('key, url, updated_at');

  const slots = Object.keys(MEDIA_DEFAULTS).map(key => {
    const row = (data ?? []).find((r: { key: string }) => r.key === key);
    return {
      key,
      url: row?.url ?? MEDIA_DEFAULTS[key],
      updatedAt: row?.updated_at ?? null,
      isCustom: !!row,
      label: MEDIA_LABELS[key]?.label ?? key,
      hint: MEDIA_LABELS[key]?.hint ?? '',
      isVideo: MEDIA_LABELS[key]?.isVideo ?? false,
      defaultUrl: MEDIA_DEFAULTS[key],
    };
  });

  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  console.log('[admin/media] POST upload media');
  const formData = await req.formData();
  const key = formData.get('key') as string;
  const file = formData.get('file') as File | null;

  if (!key || !file) {
    return NextResponse.json({ error: 'Missing key or file' }, { status: 400 });
  }
  if (!MEDIA_DEFAULTS[key]) {
    return NextResponse.json({ error: 'Unknown media key' }, { status: 400 });
  }

  const sb = await createSupabaseAdminClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = `${key}/current.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await sb.storage
    .from('site-media')
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (upErr) {
    console.error('[admin/media] upload error', upErr);
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: urlData } = sb.storage.from('site-media').getPublicUrl(path);
  const url = `${urlData.publicUrl}?t=${Date.now()}`;

  const { error: dbErr } = await sb.from('site_media').upsert({ key, url, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (dbErr) {
    console.error('[admin/media] db error', dbErr);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  console.log('[admin/media] uploaded', key, url);
  return NextResponse.json({ ok: true, url });
}

export async function DELETE(req: NextRequest) {
  console.log('[admin/media] DELETE (reset to default)');
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  const sb = await createSupabaseAdminClient();
  await sb.from('site_media').delete().eq('key', key);

  return NextResponse.json({ ok: true, url: MEDIA_DEFAULTS[key] });
}
