export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET /api/admin/roles/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, 'roles', 'view');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const roleId = parseInt(id, 10);
  if (isNaN(roleId)) {
    return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, description, permissions, is_system, created_at, updated_at FROM roles WHERE id = ? LIMIT 1',
      [roleId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    const role = rows[0];
    return NextResponse.json({
      ...role,
      permissions: typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch role: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// PUT /api/admin/roles/[id] - Update custom role
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, 'roles', 'edit');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const roleId = parseInt(id, 10);
  if (isNaN(roleId)) {
    return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, is_system FROM roles WHERE id = ? LIMIT 1',
      [roleId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    const currentRole = rows[0];

    // Protect Super Admin from being altered
    if (currentRole.name === 'Super Admin') {
      return NextResponse.json(
        { error: 'The Super Admin role cannot be modified.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, permissions } = body;

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined && name.trim()) {
      // Check duplicate name
      const [dups] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM roles WHERE name = ? AND id != ? LIMIT 1',
        [name.trim(), roleId]
      );
      if (dups.length > 0) {
        return NextResponse.json({ error: 'Another role with this name already exists.' }, { status: 409 });
      }
      updateFields.push('name = ?');
      updateValues.push(name.trim());
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description?.trim() || null);
    }

    if (permissions !== undefined && typeof permissions === 'object') {
      updateFields.push('permissions = ?');
      updateValues.push(JSON.stringify(permissions));
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields provided to update.' }, { status: 400 });
    }

    updateValues.push(roleId);
    await pool.query(
      `UPDATE roles SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
    });
  } catch (error: any) {
    console.error('Failed to update role:', error);
    return NextResponse.json(
      { error: 'Failed to update role: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/roles/[id] - Safe deletion of custom role
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, 'roles', 'delete');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const roleId = parseInt(id, 10);
  if (isNaN(roleId)) {
    return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, is_system FROM roles WHERE id = ? LIMIT 1',
      [roleId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (rows[0].is_system === 1 || rows[0].is_system === true) {
      return NextResponse.json(
        { error: 'System roles cannot be deleted.' },
        { status: 403 }
      );
    }

    // Check if any users currently have this role
    const [usersWithRole] = await pool.query<RowDataPacket[]>(
      'SELECT id, name FROM register WHERE role_id = ? LIMIT 1',
      [roleId]
    );

    if (usersWithRole.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete this role because users are currently assigned to it. Please reassign those users first.' },
        { status: 409 }
      );
    }

    await pool.query('DELETE FROM roles WHERE id = ?', [roleId]);

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

