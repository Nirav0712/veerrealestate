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

    // 1. Check local disk first (if running on a server with local storage)
    try {
      const localPath = join(process.cwd(), 'public', 'uploads', safeFilename);
      if (existsSync(localPath)) {
        const fileBuffer = await readFile(localPath);
        const ext = safeFilename.split('.').pop()?.toLowerCase() || '';
        const mimeMap: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          gif: 'image/gif',
          svg: 'image/svg+xml',
          pdf: 'application/pdf',
        };
        const mimeType = mimeMap[ext] || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': String(fileBuffer.length),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch {
      // Local read failed or filesystem is read-only / serverless, continue to database
    }

    // 2. Query MySQL uploaded_files database (for Vercel / serverless deployments)
    await ensureSchema();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT mimeType, size, data FROM uploaded_files WHERE filename = ? AND folder = ? LIMIT 1',
      [safeFilename, 'uploads']
    );

    if (rows.length === 0) {
      // Also check by filename alone without folder constraint
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
          'Content-Type': file.mimeType || 'image/jpeg',
          'Content-Length': String(file.size || file.data.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const file = rows[0];
    return new NextResponse(file.data, {
      status: 200,
      headers: {
        'Content-Type': file.mimeType || 'image/jpeg',
        'Content-Length': String(file.size || file.data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[uploads/[filename]] Error serving file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
