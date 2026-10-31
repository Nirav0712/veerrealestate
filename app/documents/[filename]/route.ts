export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import type { RowDataPacket } from 'mysql2';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse('File not found', { status: 404 });
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');

    // 1. Check local disk first
    try {
      const localPath = join(process.cwd(), 'public', 'documents', safeFilename);
      if (existsSync(localPath)) {
        const fileBuffer = await readFile(localPath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Length': String(fileBuffer.length),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch {
      // Continue to DB
    }

    // 2. Query MySQL uploaded_files database
    await ensureSchema();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT mimeType, size, data FROM uploaded_files WHERE filename = ? AND folder = ? LIMIT 1',
      [safeFilename, 'documents']
    );

    if (rows.length === 0) {
      const [fallbackRows] = await pool.query<RowDataPacket[]>(
        'SELECT mimeType, size, data FROM uploaded_files WHERE filename = ? LIMIT 1',
        [safeFilename]
      );
      if (fallbackRows.length === 0) {
        return new NextResponse('File not found', { status: 404 });
      }
      const file = fallbackRows[0];
      return new NextResponse(file.data, {
        status: 200,
        headers: {
          'Content-Type': file.mimeType || 'application/pdf',
          'Content-Length': String(file.size || file.data.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const file = rows[0];
    return new NextResponse(file.data, {
      status: 200,
      headers: {
        'Content-Type': file.mimeType || 'application/pdf',
        'Content-Length': String(file.size || file.data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[documents/[filename]] Error serving file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
