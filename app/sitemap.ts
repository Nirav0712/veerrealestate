import { MetadataRoute } from 'next';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://veerrealestate.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/east`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects/west`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/builder-consultation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // 1. Fetch published properties
    const [properties] = await pool.query<RowDataPacket[]>(
      "SELECT id, slug, updated_at FROM properties WHERE (publishStatus = 'published' OR publishStatus IS NULL)"
    );

    const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
      url: `${baseUrl}/properties/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 2. Fetch published projects
    const [projects] = await pool.query<RowDataPacket[]>(
      "SELECT slug, zone, updated_at FROM projects WHERE (publishStatus = 'published' OR publishStatus IS NULL)"
    );

    const projectRoutes: MetadataRoute.Sitemap = projects.map((pr) => {
      const zoneFolder = pr.zone === 'West' ? 'west' : 'east';
      return {
        url: `${baseUrl}/projects/${zoneFolder}/${pr.slug}`,
        lastModified: pr.updated_at ? new Date(pr.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

    // 3. Fetch published blogs
    const [blogs] = await pool.query<RowDataPacket[]>(
      "SELECT id, slug, updated_at FROM blogs WHERE publishStatus = 'published'"
    );

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug || b.id}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...propertyRoutes, ...projectRoutes, ...blogRoutes];
  } catch (err) {
    console.error('[sitemap] Error generating dynamic sitemap from DB:', err);
    return staticRoutes;
  }
}
