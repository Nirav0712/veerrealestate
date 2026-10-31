import pool from './db';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_SEO_CONFIG, type SeoSettings } from './seo';

/**
 * Server-only helper to fetch dynamic SEO settings from website_content database table.
 * MUST ONLY be imported in Server Components, API routes, or server-side scripts.
 */
export async function getSeoSettingsServer(): Promise<SeoSettings> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT contentData FROM website_content WHERE sectionKey = 'seo_settings' LIMIT 1"
    );

    if (rows.length > 0 && rows[0].contentData) {
      const data = typeof rows[0].contentData === 'string'
        ? JSON.parse(rows[0].contentData)
        : rows[0].contentData;
      return { ...DEFAULT_SEO_CONFIG, ...data };
    }
  } catch (err) {
    console.error('[seo-server] Error fetching SEO settings from DB:', err);
  }
  return DEFAULT_SEO_CONFIG;
}

