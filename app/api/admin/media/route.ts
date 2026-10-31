export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
  extension: string;
  folder: 'uploads' | 'images' | 'documents';
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const files: MediaFile[] = [];
    const seenNames = new Set<string>();

    // 1. Fetch uploaded files from MySQL database (guaranteed to work in serverless/Vercel)
    try {
      const [dbRows] = await pool.query<RowDataPacket[]>(`
        SELECT filename, folder, mimeType, size, created_at
        FROM uploaded_files
        ORDER BY created_at DESC
      `);

      for (const row of dbRows) {
        const folder = (row.folder as 'uploads' | 'documents') || 'uploads';
        const ext = (row.filename.split('.').pop() || '').toLowerCase();
        seenNames.add(row.filename);
        files.push({
          name: row.filename,
          url: `/${folder}/${row.filename}`,
          size: row.size || 0,
          updatedAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          extension: ext,
          folder,
        });
      }
    } catch (dbErr) {
      console.warn('[admin/media] DB read error:', dbErr);
    }

    // 2. Also read static files from local disk (for images bundled with the app)
    const rootDir = process.cwd();
    const folders: Array<{ name: 'uploads' | 'images' | 'documents'; path: string; urlPrefix: string }> = [
      { name: 'uploads', path: join(rootDir, 'public', 'uploads'), urlPrefix: '/uploads/' },
      { name: 'images', path: join(rootDir, 'public', 'images'), urlPrefix: '/images/' },
      { name: 'documents', path: join(rootDir, 'public', 'documents'), urlPrefix: '/documents/' },
    ];

    for (const folder of folders) {
      if (!existsSync(folder.path)) continue;

      try {
        const dirEntries = await readdir(folder.path, { withFileTypes: true });
        for (const entry of dirEntries) {
          if (entry.isFile() && !seenNames.has(entry.name)) {
            const ext = extname(entry.name).toLowerCase();
            const filePath = join(folder.path, entry.name);
            const fileStat = await stat(filePath);
            seenNames.add(entry.name);

            files.push({
              name: entry.name,
              url: `${folder.urlPrefix}${entry.name}`,
              size: fileStat.size,
              updatedAt: fileStat.mtime.toISOString(),
              extension: ext.replace('.', ''),
              folder: folder.name,
            });
          }
        }
      } catch {
        // Filesystem read ignored if in read-only container
      }
    }

    // Sort by latest modified
    files.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      total: files.length,
      files,
    });
  } catch (error: any) {
    console.error('[admin/media GET] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to list media' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    const folder = searchParams.get('folder') || 'uploads';

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Prevent directory traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    if (folder !== 'uploads' && folder !== 'documents') {
      return NextResponse.json({ error: 'Only uploads and documents can be deleted' }, { status: 400 });
    }

    // 1. Delete from MySQL uploaded_files table
    try {
      await pool.query(
        'DELETE FROM uploaded_files WHERE filename = ?',
        [safeFilename]
      );
    } catch (dbErr) {
      console.warn('[admin/media DELETE] DB delete error:', dbErr);
    }

    // 2. Also delete from local disk if it exists
    try {
      const filePath = join(process.cwd(), 'public', folder, safeFilename);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch {
      // Ignore if read-only filesystem
    }

    return NextResponse.json({
      success: true,
      message: `File ${safeFilename} deleted successfully`,
    });
  } catch (error: any) {
    console.error('[admin/media DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete file' }, { status: 500 });
  }
}
