export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET /api/admin/roles - List all roles
export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, 'roles', 'view');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const [roles] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, description, permissions, is_system, created_at, updated_at
      FROM roles
      ORDER BY id ASC
    `);

    // Parse permissions JSON if returned as string
    const formatted = roles.map((r) => ({
      ...r,
      permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : r.permissions,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles - Create custom role
export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, 'roles', 'create');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const { name, description, permissions } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Role name is required.' }, { status: 400 });
    }

    if (!permissions || typeof permissions !== 'object') {
      return NextResponse.json({ error: 'Valid permissions object is required.' }, { status: 400 });
    }

    const cleanName = name.trim();

    // Check duplicate
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM roles WHERE name = ? LIMIT 1',
      [cleanName]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'A role with this name already exists.' }, { status: 409 });
    }

    const permissionsJson = JSON.stringify(permissions);

    const [result]: any = await pool.query(
      `INSERT INTO roles (name, description, permissions, is_system) VALUES (?, ?, ?, 0)`,
      [cleanName, description?.trim() || null, permissionsJson]
    );

    return NextResponse.json({
      success: true,
      message: 'Role created successfully',
      id: result.insertId,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create role:', error);
    return NextResponse.json(
      { error: 'Failed to create role: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

