import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from './db';
import { RowDataPacket } from 'mysql2';

export const JWT_SECRET = process.env.JWT_SECRET || 'veer-realestate-jwt-secret-key-2026';

export interface AdminPayload {
  id: number;
  email: string;
  role: string;
  sessionId?: string;
}

/**
 * Verify JWT token from request cookies or Authorization header.
 * Returns payload if valid, or null if invalid/missing.
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

    // Optional: verify user still exists in database
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, role FROM register WHERE id = ? LIMIT 1',
      [decoded.id]
    );

    if (rows.length === 0) return null;
    return decoded;
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
        { error: 'Unauthorized: Admin access required.' },
        { status: 401 }
      ),
    };
  }
  return { user };
}
