export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import type { RowDataPacket } from 'mysql2';

// GET /api/content - Public: Get structured website content by sectionKey or all sections
export async function GET(req: NextRequest) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT sectionKey, title, contentData, updated_at FROM website_content WHERE sectionKey = ? LIMIT 1',
        [key]
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      }

      const row = rows[0];
      let data = row.contentData;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          data = {};
        }
      }

      return NextResponse.json({
        sectionKey: row.sectionKey,
        title: row.title,
        contentData: data,
        updated_at: row.updated_at,
      });
    }

    // Return all sections as a mapped dictionary { hero_slides: { ... }, company_info: { ... }, ... }
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT sectionKey, title, contentData, updated_at FROM website_content'
    );

    const sections: Record<string, any> = {};
    for (const r of rows) {
      let data = r.contentData;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          data = {};
        }
      }
      sections[r.sectionKey] = {
        title: r.title,
        content: data,
        updated_at: r.updated_at,
      };
    }

    return NextResponse.json(sections);
  } catch (error: any) {
    console.error('[content] Error fetching website content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
