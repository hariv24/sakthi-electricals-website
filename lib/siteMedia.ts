export const MEDIA_DEFAULTS: Record<string, string> = {
  hero_video:        '/assets/hero.mp4',
  hero_poster:       '/assets/hero-poster.jpg',
  about_home:        '/assets/banners/about-home.jpg',
  stats_coil:        '/assets/banners/stats-coil.jpg',
  about_banner:      '/assets/banners/about.jpg',
  cpri_image:        '/assets/banners/stats-coil.jpg',
  products_banner:   '/assets/banners/products.jpg',
  facilities_banner: '/assets/banners/facilities.jpg',
  facilities_floor:  '/assets/solution2.png',
  facilities_sol1:   '/assets/solution.jpg',
  facilities_sol2:   '/assets/solution3.png',
  customers_banner:  '/assets/banners/customers.jpg',
  careers_banner:    '/assets/banners/careers.jpg',
  contact_banner:    '/assets/banners/contact.jpg',
};

export const MEDIA_LABELS: Record<string, { label: string; hint: string; isVideo?: boolean }> = {
  hero_video:        { label: 'Homepage Hero Video', hint: 'The background video on the homepage. MP4 format.', isVideo: true },
  hero_poster:       { label: 'Homepage Hero Poster', hint: 'Thumbnail shown before the video loads. JPG/PNG.' },
  about_home:        { label: 'Homepage — About Photo', hint: 'Photo in the "About Sakthi Electricals" section on the homepage.' },
  stats_coil:        { label: 'Homepage — Stats Background', hint: 'Background image behind the numbers strip on the homepage.' },
  about_banner:      { label: 'About Page — Hero Banner', hint: 'The full-width banner at the top of the About page.' },
  cpri_image:        { label: 'About Page — CPRI Photo', hint: 'The photo next to the CPRI quality section on the About page.' },
  products_banner:   { label: 'Products Page — Hero Banner', hint: 'The full-width banner at the top of the Products page.' },
  facilities_banner: { label: 'Facilities Page — Hero Banner', hint: 'The full-width banner at the top of the Facilities page.' },
  facilities_floor:  { label: 'Facilities — Manufacturing Floor Photo', hint: 'The photo of the manufacturing floor in the Facilities page.' },
  facilities_sol1:   { label: 'Facilities — Manufacturing Solutions Photo', hint: 'Left photo in the Manufacturing Solutions section.' },
  facilities_sol2:   { label: 'Facilities — R&D Photo', hint: 'Right photo in the R&D section on the Facilities page.' },
  customers_banner:  { label: 'Customers Page — Hero Banner', hint: 'The full-width banner at the top of the Customers page.' },
  careers_banner:    { label: 'Careers Page — Hero Banner', hint: 'The full-width banner at the top of the Careers page.' },
  contact_banner:    { label: 'Contact Page — Hero Banner', hint: 'The full-width banner at the top of the Contact page.' },
};

// Which public page(s) render each slot, so an admin save can instantly
// refresh exactly those pages instead of waiting for a timed cache expiry.
export const MEDIA_SLOT_PATHS: Record<string, string[]> = {
  hero_video:        ['/'],
  hero_poster:       ['/'],
  about_home:        ['/'],
  stats_coil:        ['/'],
  about_banner:      ['/about'],
  cpri_image:        ['/about'],
  products_banner:   ['/products'],
  facilities_banner: ['/facilities'],
  facilities_floor:  ['/facilities'],
  facilities_sol1:   ['/facilities'],
  facilities_sol2:   ['/facilities'],
  customers_banner:  ['/customers'],
  careers_banner:    ['/careers'],
  contact_banner:    ['/contact'],
};

export async function getSiteMedia(keys: string[]): Promise<Record<string, string>> {
  try {
    const { createSupabaseAdminClient } = await import('./supabase/server');
    const sb = await createSupabaseAdminClient();
    const { data } = await sb.from('site_media').select('key, url').in('key', keys);
    const result: Record<string, string> = {};
    for (const key of keys) {
      const row = (data ?? []).find((r: { key: string; url: string }) => r.key === key);
      result[key] = row?.url ?? MEDIA_DEFAULTS[key] ?? '';
    }
    return result;
  } catch {
    const result: Record<string, string> = {};
    for (const key of keys) result[key] = MEDIA_DEFAULTS[key] ?? '';
    return result;
  }
}
