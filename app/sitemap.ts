import type { MetadataRoute } from 'next';
import { getCatalogTreeFromDB, getAllSlugPaths } from '@/lib/catalog';

const BASE_URL = 'https://www.sakthielectricals.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tree = await getCatalogTreeFromDB();
  const productPaths = getAllSlugPaths(tree).map(slugPath => ({
    url: `${BASE_URL}/products/${slugPath.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/products`, priority: 0.9 },
    { url: `${BASE_URL}/about`, priority: 0.6 },
    { url: `${BASE_URL}/facilities`, priority: 0.6 },
    { url: `${BASE_URL}/customers`, priority: 0.6 },
    { url: `${BASE_URL}/careers`, priority: 0.5 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
  ].map(p => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPages, ...productPaths];
}
