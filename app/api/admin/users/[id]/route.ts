export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requirePermission } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET /api/admin/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, 'users', 'view');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        r.id,
        r.name,
        r.email,
        r.phone,
        r.role,
        r.role_id,
        r.is_active,
        r.created_at,
        ro.name as roleName,
        ro.permissions as rolePermissions
      FROM register r
      LEFT JOIN roles ro ON r.role_id = ro.id
      WHERE r.id = ? LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch user: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user information, role, or active status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, 'users', 'edit');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, role_id, is_active, password } = body;

    // Check user exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, role FROM register WHERE id = ? LIMIT 1',
      [userId]
    );
    if (existing.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name.trim());
    }

    if (email !== undefined) {
      const cleanEmail = email.trim().toLowerCase();
      // Check for duplicate email across other users
      const [dups] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM register WHERE email = ? AND id != ? LIMIT 1',
        [cleanEmail, userId]
      );
      if (dups.length > 0) {
        return NextResponse.json({ error: 'Email already used by another account.' }, { status: 409 });
      }
      updateFields.push('email = ?');
      updateValues.push(cleanEmail);
    }

    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone.trim());
    }

    if (role_id !== undefined) {
      const assignedRoleId = role_id ? parseInt(role_id, 10) : null;
      updateFields.push('role_id = ?');
      updateValues.push(assignedRoleId);

      // If Super Admin role assigned, update role column to admin
      if (assignedRoleId) {
        const [roleRow] = await pool.query<RowDataPacket[]>(
          'SELECT name FROM roles WHERE id = ?',
          [assignedRoleId]
        );
        if (roleRow.length > 0 && roleRow[0].name === 'Super Admin') {
          updateFields.push("role = 'admin'");
        }
      }
    }

    if (is_active !== undefined) {
      const activeVal = is_active === false || is_active === 0 || is_active === '0' ? 0 : 1;
      updateFields.push('is_active = ?');
      updateValues.push(activeVal);
    }

    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields provided for update.' }, { status: 400 });
    }

    updateValues.push(userId);
    await pool.query(
      `UPDATE register SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Safe deletion of user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, 'users', 'delete');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  // Prevent user from deleting their own account
  if (auth.user.id === userId) {
    return NextResponse.json(
      { error: 'Cannot delete your own active administrator account.' },
      { status: 400 }
    );
  }

  try {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, role FROM register WHERE id = ? LIMIT 1',
      [userId]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await pool.query('DELETE FROM register WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

