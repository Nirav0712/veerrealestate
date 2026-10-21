export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// GET /api/admin/leads - Search, Filter, Paginate leads
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '15')));
    const offset = (page - 1) * limit;

    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereClauses.push(
        '(fullName LIKE ? OR companyName LIKE ? OR phone LIKE ? OR projectLocation LIKE ? OR email LIKE ?)'
      );
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total count for pagination
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM builder_leads ${whereSql}`,
      queryParams
    );
    const total = countRows[0].total;

    // Fetch paginated leads
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM builder_leads ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    // Summary counts by status for quick metric badges
    const [statusStats] = await pool.query<RowDataPacket[]>(
      `SELECT status, COUNT(*) as count FROM builder_leads GROUP BY status`
    );

    const statsMap: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };
    statusStats.forEach((row) => {
      if (row.status in statsMap) statsMap[row.status] = row.count;
    });

    return NextResponse.json({
      leads: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: statsMap,
    });
  } catch (error: any) {
    console.error('[admin/leads] Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
