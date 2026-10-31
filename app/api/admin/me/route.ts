export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/me - Returns current admin profile, role, and permissions
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { user } = auth;

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleName: user.roleName,
    role_id: user.role_id,
    permissions: user.permissions || {},
  });
}

