export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import type { RowDataPacket } from 'mysql2';

// Public GET /api/locations - Fetch active locations for public selectors and navigation
export async function GET(req: NextRequest) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get('zone');

    let sql = 'SELECT id, name, slug, zone, city, state, pincode, description, parentLocationId, featured, sortOrder FROM locations WHERE active = TRUE';
    const params: any[] = [];

    if (zone && zone !== 'all') {
      sql += ' AND zone = ?';
      params.push(zone);
    }

    sql += ' ORDER BY featured DESC, sortOrder ASC, name ASC';

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('[locations] Error fetching public locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
