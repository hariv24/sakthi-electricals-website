// Width-to-height ratio each image slot is actually displayed at on the live
// site. Used to drive the crop tool in the admin so the framing chosen there
// is exactly what visitors will see (see the components rendering each key
// for the source CSS: HomeAnimSections, AboutAnimSections,
// FacilitiesAnimSections, and the .page-hero.hero-photo banners in
// globals.css). Kept in its own client-safe file, separate from
// lib/siteMedia.ts, since that file pulls in server-only Supabase code.
export const MEDIA_ASPECTS: Record<string, number> = {
  about_home:        4 / 5,
  about_banner:      21 / 9,
  cpri_image:        16 / 11,
  products_banner:   21 / 9,
  facilities_banner: 21 / 9,
  facilities_floor:  4 / 3,
  facilities_sol1:   3 / 2,
  facilities_sol2:   3 / 2,
  customers_banner:  21 / 9,
  careers_banner:    21 / 9,
  contact_banner:    21 / 9,
};
