import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { MEDIA_DEFAULTS, MEDIA_LABELS } from '@/lib/siteMedia';
import MediaClient from './MediaClient';

export default async function MediaPage() {
  const sb = await createSupabaseAdminClient();

  const [{ data: mediaRows }, { data: customerRows }] = await Promise.all([
    sb.from('site_media').select('key, url, updated_at'),
    sb.from('customers').select('*').order('order_index', { ascending: true }),
  ]);

  const slots = Object.keys(MEDIA_DEFAULTS).map(key => {
    const row = (mediaRows ?? []).find((r: { key: string }) => r.key === key);
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

  return <MediaClient initialSlots={slots} initialCustomers={customerRows ?? []} />;
}
