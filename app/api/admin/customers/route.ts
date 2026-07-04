import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

console.log('[admin/customers] route loaded');

export async function GET() {
  console.log('[admin/customers] GET all');
  const sb = await createSupabaseAdminClient();
  const { data, error } = await sb
    .from('customers')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  console.log('[admin/customers] POST create');
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const short = (formData.get('short') as string) ?? '';
  const sector = formData.get('sector') as string;
  const file = formData.get('logo') as File | null;

  if (!name || !sector) return NextResponse.json({ error: 'Name and sector are required' }, { status: 400 });

  const sb = await createSupabaseAdminClient();
  let logoUrl = '';

  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
    const path = `customers/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { error: upErr } = await sb.storage.from('site-media').upload(path, bytes, { contentType: file.type, upsert: false });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
    const { data: urlData } = sb.storage.from('site-media').getPublicUrl(path);
    logoUrl = urlData.publicUrl;
  }

  // Get max order_index
  const { data: maxRow } = await sb.from('customers').select('order_index').order('order_index', { ascending: false }).limit(1).single();
  const orderIndex = ((maxRow?.order_index as number | null) ?? -1) + 1;

  const { data, error } = await sb.from('customers').insert({ name, short, sector, logo_url: logoUrl, order_index: orderIndex }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
