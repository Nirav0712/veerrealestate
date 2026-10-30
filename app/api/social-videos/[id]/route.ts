export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
import { validateSocialVideoUrl } from '@/lib/social-videos';
import type { RowDataPacket } from 'mysql2';

async function resolveProjectUrl(projectId: number | null | undefined): Promise<string | null> {
  if (!projectId) return null;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, slug, zone FROM projects WHERE id = ? LIMIT 1',
      [projectId]
    );
    if (rows.length === 0) return null;
    const p = rows[0];
    const zoneFolder = p.zone === 'West' ? 'west' : 'east';
    return `/projects/${zoneFolder}/${p.slug}`;
  } catch {
    return null;
  }
}

// GET /api/social-videos/[id] - Fetch single video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const { id } = await params;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        sv.*,
        p.name AS projectName,
        p.slug AS projectSlug,
        p.zone AS projectZone
      FROM social_videos sv
      LEFT JOIN projects p ON sv.project_id = p.id
      WHERE sv.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Social video not found' }, { status: 404 });
    }

    const row = rows[0];
    return NextResponse.json({
      ...row,
      is_active: Boolean(row.is_active),
      project_url: row.project_url || (row.projectSlug ? `/projects/${row.projectZone === 'West' ? 'west' : 'east'}/${row.projectSlug}` : null),
    });
  } catch (error: any) {
    console.error('[social-videos/[id]] Error fetching video:', error);
    return NextResponse.json({ error: 'Failed to fetch social video' }, { status: 500 });
  }
}

// PUT /api/social-videos/[id] - Protected: Admin update video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { id } = await params;
    const body = await request.json();

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM social_videos WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Social video not found' }, { status: 404 });
    }

    const current = existing[0];

    const title = body.title !== undefined ? body.title : current.title;
    const platform = body.platform !== undefined ? body.platform : current.platform;
    const video_url = body.video_url !== undefined ? body.video_url : current.video_url;
    const project_id = body.project_id !== undefined ? (body.project_id ? Number(body.project_id) : null) : current.project_id;
    const thumbnail_url = body.thumbnail_url !== undefined ? body.thumbnail_url : current.thumbnail_url;
    const description = body.description !== undefined ? body.description : current.description;
    const display_order = body.display_order !== undefined ? Number(body.display_order) : current.display_order;
    const is_active = body.is_active !== undefined ? Boolean(body.is_active) : Boolean(current.is_active);

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Video title is required.' }, { status: 400 });
    }

    if (!['instagram', 'youtube'].includes(platform)) {
      return NextResponse.json({ error: "Platform must be either 'instagram' or 'youtube'." }, { status: 400 });
    }

    const urlCheck = validateSocialVideoUrl(platform, video_url);
    if (!urlCheck.valid) {
      return NextResponse.json({ error: urlCheck.error }, { status: 400 });
    }

    // Resolve project destination URL if project_id changed or was provided
    let finalProjectUrl = body.project_url || current.project_url;
    if (project_id) {
      const resolved = await resolveProjectUrl(project_id);
      if (resolved) finalProjectUrl = resolved;
    } else if (project_id === null) {
      finalProjectUrl = null;
    }

    await pool.query(
      `UPDATE social_videos SET
        title = ?,
        platform = ?,
        video_url = ?,
        project_id = ?,
        project_url = ?,
        thumbnail_url = ?,
        description = ?,
        display_order = ?,
        is_active = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title.trim(),
        platform,
        urlCheck.normalized,
        project_id,
        finalProjectUrl,
        thumbnail_url || null,
        description ? description.trim() : null,
        display_order,
        is_active ? 1 : 0,
        id,
      ]
    );

    return NextResponse.json({
      id: Number(id),
      title: title.trim(),
      platform,
      video_url: urlCheck.normalized,
      project_id,
      project_url: finalProjectUrl,
      thumbnail_url: thumbnail_url || null,
      description: description ? description.trim() : null,
      display_order,
      is_active,
    });
  } catch (error: any) {
    console.error('[social-videos/[id]] Error updating video:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update social video' }, { status: 500 });
  }
}

// DELETE /api/social-videos/[id] - Protected: Admin delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;

    // Verify video exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, project_id FROM social_videos WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Social video not found' }, { status: 404 });
    }

    // Safely delete only the social video record; does NOT touch any associated project
    await pool.query('DELETE FROM social_videos WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Social video deleted successfully' });
  } catch (error: any) {
    console.error('[social-videos/[id]] Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete social video' }, { status: 500 });
  }
}
