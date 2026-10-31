export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// GET /api/admin/content/[key] - Protected: Admin fetch single content section
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { key } = await params;

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT sectionKey, title, contentData, updatedBy, updated_at FROM website_content WHERE sectionKey = ? LIMIT 1',
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
      updatedBy: row.updatedBy,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    console.error('[admin/content/[key]] Error fetching content section:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT /api/admin/content/[key] - Protected: Admin update structured content section
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { key } = await params;
    const body = await req.json();

    const { title, contentData } = body;

    if (!contentData) {
      return NextResponse.json({ error: 'contentData is required' }, { status: 400 });
    }

    const jsonString = typeof contentData === 'string' ? contentData : JSON.stringify(contentData);

    // Upsert section in website_content
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM website_content WHERE sectionKey = ? LIMIT 1',
      [key]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE website_content SET
          title = COALESCE(?, title),
          contentData = ?,
          updatedBy = ?,
          updated_at = NOW()
        WHERE sectionKey = ?`,
        [title || null, jsonString, authResult.user.email, key]
      );
    } else {
      await pool.query(
        `INSERT INTO website_content (sectionKey, title, contentData, updatedBy)
         VALUES (?, ?, ?, ?)`,
        [key, title || key, jsonString, authResult.user.email]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Section "${key}" updated successfully`,
    });
  } catch (error: any) {
    console.error('[admin/content/[key]] Error updating content section:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update content' }, { status: 500 });
  }
}
