export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// PUT /api/admin/locations/[id] - Update location
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    const body = await req.json();
    const { name, zone, city, state, pincode, description, active, parentLocationId, featured, sortOrder } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
    }

    let slug = body.slug ? body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    if (!slug) {
      slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Verify slug uniqueness excluding current id
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM locations WHERE slug = ? AND id != ? LIMIT 1',
      [slug, id]
    );
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    await pool.query(
      `UPDATE locations SET
        name = ?, slug = ?, zone = ?, city = ?, state = ?,
        pincode = ?, description = ?, active = ?, parentLocationId = ?, featured = ?, sortOrder = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        name.trim(),
        slug,
        zone || 'East',
        city || 'Ahmedabad',
        state || 'Gujarat',
        pincode || null,
        description || null,
        active !== undefined ? (active ? 1 : 0) : 1,
        parentLocationId ? Number(parentLocationId) : null,
        featured ? 1 : 0,
        Number(sortOrder) || 0,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Location updated successfully' });
  } catch (error: any) {
    console.error('[admin/locations/[id]] Error updating location:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update location' }, { status: 500 });
  }
}

// DELETE /api/admin/locations/[id] - Safe deletion check
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;

    // 1. Check if any property references this location
    const [propCountRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM properties WHERE locationId = ?',
      [id]
    );
    const propCount = propCountRows[0].count;

    // 2. Check if any project references this location
    const [projCountRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM projects WHERE locationId = ?',
      [id]
    );
    const projCount = projCountRows[0].count;

    // 3. Check if any sub-location references this location
    const [childCountRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM locations WHERE parentLocationId = ?',
      [id]
    );
    const childCount = childCountRows[0].count;

    if (propCount > 0 || projCount > 0 || childCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete location because it is currently referenced by ${propCount} properties, ${projCount} projects, and ${childCount} sub-locations. Please reassign those listings or deactivate this location instead.`,
        },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM locations WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Location deleted successfully' });
  } catch (error: any) {
    console.error('[admin/locations/[id]] Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}
