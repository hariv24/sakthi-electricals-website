import { NextResponse } from 'next/server';
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
