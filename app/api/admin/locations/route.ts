export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { ensureSchema } from '@/lib/migrate';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// GET /api/admin/locations - List all locations with stats
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const zone = searchParams.get('zone')?.trim() || '';

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (zone && zone !== 'all') {
      whereClauses.push('l.zone = ?');
      params.push(zone);
    }

    if (search) {
      whereClauses.push('(l.name LIKE ? OR l.slug LIKE ? OR l.city LIKE ?)');
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT
        l.*,
        (SELECT COUNT(*) FROM properties p WHERE p.locationId = l.id) as propertyCount,
        (SELECT COUNT(*) FROM projects pr WHERE pr.locationId = l.id) as projectCount
      FROM locations l
      ${whereSql}
      ORDER BY l.name ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('[admin/locations] Error listing locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

// POST /api/admin/locations - Create a new location
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const body = await req.json();
    const {
      name,
      zone = 'East',
      city = 'Ahmedabad',
      state = 'Gujarat',
      pincode,
      description,
      active = true,
      parentLocationId,
      featured = false,
      sortOrder = 0,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
    }

    let slug = body.slug ? body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    if (!slug) {
      slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Check slug uniqueness
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM locations WHERE slug = ? LIMIT 1',
      [slug]
    );
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO locations (name, slug, zone, city, state, pincode, description, active, parentLocationId, featured, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        slug,
        zone,
        city,
        state,
        pincode || null,
        description || null,
        active ? 1 : 0,
        parentLocationId ? Number(parentLocationId) : null,
        featured ? 1 : 0,
        Number(sortOrder) || 0,
      ]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        name: name.trim(),
        slug,
        zone,
        city,
        state,
        pincode,
        description,
        active: Boolean(active),
        parentLocationId: parentLocationId || null,
        featured: Boolean(featured),
        sortOrder: Number(sortOrder) || 0,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[admin/locations] Error creating location:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create location' }, { status: 500 });
  }
}
