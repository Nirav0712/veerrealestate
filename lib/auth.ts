import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from './db';
import { RowDataPacket } from 'mysql2';

export const JWT_SECRET = process.env.JWT_SECRET || 'veer-realestate-jwt-secret-key-2026';

export interface AdminPayload {
  id: number;
  email: string;
  name?: string;
  role: string;
  role_id?: number | null;
  roleName?: string;
  permissions?: Record<string, string[]>;
  is_active?: boolean | number;
  sessionId?: string;
}

/**
 * Verify JWT token from request cookies or Authorization header.
 * Returns payload if valid and user is active, or null if invalid/inactive.
 */
export async function getAuthenticatedAdmin(
  req: Request | NextRequest
): Promise<AdminPayload | null> {
  try {
    let token: string | undefined;

    // 1. Try reading from NextRequest cookies
    if ('cookies' in req && typeof (req as any).cookies?.get === 'function') {
      token = (req as NextRequest).cookies.get('token')?.value;
    }

    // 2. Fallback to Cookie header
    if (!token) {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
      if (match) token = match[1];
    }

    // 3. Fallback to Authorization: Bearer
    if (!token) {
      const authHeader = req.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    if (!decoded || !decoded.id) return null;

    // Verify user exists, is active, and fetch their custom role and permissions
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT r.id, r.name, r.email, r.role, r.role_id, r.is_active,
             ro.name as roleName, ro.permissions
      FROM register r
      LEFT JOIN roles ro ON r.role_id = ro.id
      WHERE r.id = ? LIMIT 1
    `, [decoded.id]);

    if (rows.length === 0) return null;
    const userRow = rows[0];

    // Block deactivated users
    if (userRow.is_active === 0 || userRow.is_active === false) {
      return null;
    }

    let parsedPermissions: Record<string, string[]> = {};
    if (userRow.permissions) {
      try {
        parsedPermissions = typeof userRow.permissions === 'string'
          ? JSON.parse(userRow.permissions)
          : userRow.permissions;
      } catch (e) {
        parsedPermissions = {};
      }
    }

    // Default Super Admin full permissions if user has role === 'admin' and no explicit restricted role
    const isSuperAdmin = userRow.role === 'admin' || userRow.roleName === 'Super Admin';
    if (isSuperAdmin && Object.keys(parsedPermissions).length === 0) {
      parsedPermissions = {
        dashboard: ['view'],
        properties: ['view', 'create', 'edit', 'delete'],
        projects: ['view', 'create', 'edit', 'delete'],
        locations: ['view', 'create', 'edit', 'delete'],
        blogs: ['view', 'create', 'edit', 'delete'],
        crm: ['view', 'create', 'edit', 'delete', 'export'],
        seo: ['view', 'edit'],
        social_videos: ['view', 'create', 'edit', 'delete'],
        users: ['view', 'create', 'edit', 'delete'],
        roles: ['view', 'create', 'edit', 'delete'],
      };
    }

    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      role: userRow.role || 'admin',
      role_id: userRow.role_id,
      roleName: userRow.roleName || (isSuperAdmin ? 'Super Admin' : userRow.role),
      permissions: parsedPermissions,
      is_active: userRow.is_active,
      sessionId: decoded.sessionId,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Guard for protected admin API route handlers.
 * If unauthorized, returns a 401 NextResponse.
 */
export async function requireAdmin(
  req: Request | NextRequest
): Promise<{ user: AdminPayload } | { errorResponse: NextResponse }> {
  const user = await getAuthenticatedAdmin(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Guard for granular role-based permissions.
 * Checks if user's role grants permission for a specific module and action.
 */
export async function requirePermission(
  req: Request | NextRequest,
  moduleName: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'export'
): Promise<{ user: AdminPayload } | { errorResponse: NextResponse }> {
  const authResult = await requireAdmin(req);
  if ('errorResponse' in authResult) {
    return authResult;
  }

  const { user } = authResult;

  // Super Admin bypass
  if (user.roleName === 'Super Admin' || user.role === 'admin') {
    return { user };
  }

  const modulePerms = user.permissions?.[moduleName] || [];
  if (!modulePerms.includes(action)) {
    return {
      errorResponse: NextResponse.json(
        { error: `Forbidden: You do not have '${action}' permission for '${moduleName}'.` },
        { status: 403 }
      ),
    };
  }

  return { user };
}
