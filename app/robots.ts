import { MetadataRoute } from 'next';
import { getSeoSettingsServer } from '@/lib/seo-server';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoConfig = await getSeoSettingsServer();
  const baseUrl = seoConfig.canonicalDomain || process.env.NEXT_PUBLIC_SITE_URL || 'https://veerrealestate.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/login',
          '/api/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
