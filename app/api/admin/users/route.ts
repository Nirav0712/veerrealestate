export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requirePermission } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET /api/admin/users - List all users with role details
export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, 'users', 'view');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const [users] = await pool.query<RowDataPacket[]>(`
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
        ro.description as roleDescription,
        ro.permissions as rolePermissions
      FROM register r
      LEFT JOIN roles ro ON r.role_id = ro.id
      ORDER BY r.id ASC
    `);

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Failed to fetch admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Admin-only user creation
export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, 'users', 'create');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const { name, email, phone, password, role_id, is_active } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, email, phone, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check email uniqueness
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM register WHERE email = ? LIMIT 1',
      [cleanEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A user with this email address already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedRoleId = role_id ? parseInt(role_id, 10) : null;
    let baseRole = 'user';

    if (assignedRoleId) {
      const [roleRow] = await pool.query<RowDataPacket[]>(
        'SELECT id, name FROM roles WHERE id = ? LIMIT 1',
        [assignedRoleId]
      );
      if (roleRow.length > 0 && roleRow[0].name === 'Super Admin') {
        baseRole = 'admin';
      }
    }

    const activeStatus = is_active === false || is_active === 0 ? 0 : 1;

    const [result]: any = await pool.query(
      `INSERT INTO register (name, email, phone, password, role, role_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), cleanEmail, phone.trim(), hashedPassword, baseRole, assignedRoleId, activeStatus]
    );

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      id: result.insertId,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

