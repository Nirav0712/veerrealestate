export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import { requireAdmin } from '@/lib/auth';

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

    const files: MediaFile[] = [];
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
          if (entry.isFile()) {
            const ext = extname(entry.name).toLowerCase();
            const filePath = join(folder.path, entry.name);
            const fileStat = await stat(filePath);

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
      } catch (err) {
        console.error(`Error reading ${folder.name}:`, err);
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

    const filePath = join(process.cwd(), 'public', folder, safeFilename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: `File ${safeFilename} deleted successfully`,
    });
  } catch (error: any) {
    console.error('[admin/media DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete file' }, { status: 500 });
  }
}

