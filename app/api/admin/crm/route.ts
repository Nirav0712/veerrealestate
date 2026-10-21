export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// GET /api/admin/crm - Protected: List and filter CRM inquiries
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || 'all';
    const leadType = searchParams.get('leadType') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get('limit') || '25')));
    const offset = (page - 1) * limit;

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (leadType && leadType !== 'all') {
      whereClauses.push('leadType = ?');
      params.push(leadType);
    }

    if (search) {
      whereClauses.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR propertyTitle LIKE ? OR projectName LIKE ? OR message LIKE ?)');
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total matching
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM crm_inquiries ${whereSql}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Fetch paginated inquiries
    const [inquiries] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM crm_inquiries ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Aggregate summary metrics across all inquiries
    const [metricsRows] = await pool.query<RowDataPacket[]>(`
      SELECT
        COUNT(*) as totalCount,
        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) as newCount,
        SUM(CASE WHEN status = 'Contacted' THEN 1 ELSE 0 END) as contactedCount,
        SUM(CASE WHEN status = 'Qualified' THEN 1 ELSE 0 END) as qualifiedCount,
        SUM(CASE WHEN status = 'Site Visit Scheduled' THEN 1 ELSE 0 END) as siteVisitCount,
        SUM(CASE WHEN status = 'Converted' THEN 1 ELSE 0 END) as convertedCount,
        SUM(CASE WHEN leadType = 'property' THEN 1 ELSE 0 END) as propertyInquiriesCount,
        SUM(CASE WHEN leadType = 'project' THEN 1 ELSE 0 END) as projectInquiriesCount,
        SUM(CASE WHEN leadType = 'contact' THEN 1 ELSE 0 END) as contactInquiriesCount
      FROM crm_inquiries
    `);

    const metrics = metricsRows[0] || {
      totalCount: 0,
      newCount: 0,
      contactedCount: 0,
      qualifiedCount: 0,
      siteVisitCount: 0,
      convertedCount: 0,
      propertyInquiriesCount: 0,
      projectInquiriesCount: 0,
      contactInquiriesCount: 0,
    };

    return NextResponse.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      metrics,
    });
  } catch (error: any) {
    console.error('[admin/crm] Error fetching CRM inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CRM inquiries' },
      { status: 500 }
    );
  }
}
