import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { MEDIA_DEFAULTS } from '@/lib/siteMedia';
import MediaClient from './MediaClient';

export default async function MediaPage() {
  const sb = await createSupabaseAdminClient();
  const { data: mediaRows } = await sb.from('site_media').select('key, url, updated_at');

  const slots = Object.keys(MEDIA_DEFAULTS)
    // Remove slots we don't expose in the UI
    .filter(key => key !== 'hero_poster' && key !== 'stats_coil')
    .map(key => {
      const row = (mediaRows ?? []).find((r: { key: string }) => r.key === key);
      return {
        key,
        url: row?.url ?? MEDIA_DEFAULTS[key],
        isCustom: !!row,
        isVideo: key === 'hero_video',
        defaultUrl: MEDIA_DEFAULTS[key],
      };
    });

  return <MediaClient initialSlots={slots} />;
}
