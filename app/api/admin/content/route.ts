export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// GET /api/admin/content - Protected: Admin list all content sections
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT sectionKey, title, contentData, updatedBy, updated_at FROM website_content ORDER BY sectionKey ASC'
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
        updatedBy: r.updatedBy,
        updated_at: r.updated_at,
      };
    }

    return NextResponse.json(sections);
  } catch (error: any) {
    console.error('[admin/content] Error fetching all content:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch content' }, { status: 500 });
  }
}
