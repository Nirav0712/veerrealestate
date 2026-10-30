export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin, getAuthenticatedAdmin } from '@/lib/auth';
import { validateSocialVideoUrl } from '@/lib/social-videos';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Resolves project public detail URL from projectId.
 */
async function resolveProjectUrl(projectId: number | null | undefined): Promise<{ url: string | null; name: string | null }> {
  if (!projectId) return { url: null, name: null };

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, slug, zone FROM projects WHERE id = ? LIMIT 1',
      [projectId]
    );

    if (rows.length === 0) return { url: null, name: null };

    const p = rows[0];
    const zoneFolder = p.zone === 'West' ? 'west' : 'east';
    return {
      url: `/projects/${zoneFolder}/${p.slug}`,
      name: p.name,
    };
  } catch (err) {
    console.error('[social-videos] Error resolving project URL:', err);
    return { url: null, name: null };
  }
}

// GET /api/social-videos - Public listing (active only) or Admin listing (all)
export async function GET(request: NextRequest) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(request.url);

    const platform = searchParams.get('platform');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const projectId = searchParams.get('projectId');

    let allowInactive = false;
    if (includeInactive) {
      const admin = await getAuthenticatedAdmin(request);
      if (admin && admin.role === 'admin') {
        allowInactive = true;
      }
    }

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (!allowInactive) {
      whereClauses.push('sv.is_active = 1');
    }

    if (platform && ['instagram', 'youtube'].includes(platform)) {
      whereClauses.push('sv.platform = ?');
      params.push(platform);
    }

    if (projectId) {
      whereClauses.push('sv.project_id = ?');
      params.push(projectId);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT 
        sv.*,
        p.name AS projectName,
        p.name AS project_name,
        p.slug AS projectSlug,
        p.slug AS project_slug,
        p.zone AS projectZone,
        p.zone AS project_zone,
        p.displayPrice AS projectDisplayPrice,
        p.status AS projectStatus,
        p.coverImage AS projectCoverImage
      FROM social_videos sv
      LEFT JOIN projects p ON sv.project_id = p.id
      ${whereSql}
      ORDER BY sv.display_order ASC, sv.created_at DESC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);

    const videos = rows.map((row) => ({
      ...row,
      is_active: Boolean(row.is_active),
      project_url: row.project_url || (row.projectSlug ? `/projects/${row.projectZone === 'West' ? 'west' : 'east'}/${row.projectSlug}` : null),
    }));

    return NextResponse.json(videos);
  } catch (error: any) {
    console.error('[social-videos] Error listing social videos:', error);
    return NextResponse.json({ error: 'Failed to fetch social videos' }, { status: 500 });
  }
}

// POST /api/social-videos - Protected: Admin create social video
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const body = await request.json();

    const {
      title,
      platform,
      video_url,
      project_id,
      thumbnail_url,
      description,
      display_order = 0,
      is_active = true,
    } = body;

    // 1. Validation
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

    // 2. Resolve project detail destination URL
    const pid = project_id ? Number(project_id) : null;
    const { url: resolvedUrl } = await resolveProjectUrl(pid);

    // 3. Database insert
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO social_videos (
        title, platform, video_url, project_id, project_url,
        thumbnail_url, description, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        platform,
        urlCheck.normalized,
        pid,
        resolvedUrl || body.project_url || null,
        thumbnail_url || null,
        description ? description.trim() : null,
        Number(display_order) || 0,
        is_active ? 1 : 0,
      ]
    );

    const newId = result.insertId;

    return NextResponse.json(
      {
        id: newId,
        title: title.trim(),
        platform,
        video_url: urlCheck.normalized,
        project_id: pid,
        project_url: resolvedUrl || body.project_url || null,
        thumbnail_url: thumbnail_url || null,
        description: description ? description.trim() : null,
        display_order: Number(display_order) || 0,
        is_active: Boolean(is_active),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[social-videos] Error creating social video:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create social video' }, { status: 500 });
  }
}
