import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const sb = await createSupabaseAdminClient();
  const { data: files, error } = await sb.storage.from('site-media').list('uploads', {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) return NextResponse.json({ urls: [] });

  const urls = (files ?? [])
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => {
      const { data } = sb.storage.from('site-media').getPublicUrl(`uploads/${f.name}`);
      return { name: f.name, url: data.publicUrl, createdAt: f.created_at };
    });

  return NextResponse.json({ urls });
}

// Permanently remove an uploaded file from the gallery
export async function DELETE(req: NextRequest) {
  const { name, force } = await req.json();
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

  const sb = await createSupabaseAdminClient();
  const { data: urlData } = sb.storage.from('site-media').getPublicUrl(`uploads/${name}`);

  // Refuse to delete a file still assigned to a live slot unless the
  // caller confirms — deleting it would leave that spot on the site broken.
  const { data: inUse } = await sb.from('site_media').select('key').eq('url', urlData.publicUrl);
  const usedBySlots = (inUse ?? []).map(r => r.key);
  if (usedBySlots.length > 0 && !force) {
    return NextResponse.json({ error: 'in_use', usedBySlots }, { status: 409 });
  }

  const { error } = await sb.storage.from('site-media').remove([`uploads/${name}`]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, usedBySlots });
}
