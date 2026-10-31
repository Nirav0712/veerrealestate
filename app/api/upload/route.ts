export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';

// 20 MB strict limit in bytes for images
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
// 30 MB for documents (PDF brochures / plans)
const MAX_DOC_SIZE = 30 * 1024 * 1024;

/**
 * Validates the file buffer magic bytes against supported MIME types.
 */
function validateMagicBytes(buffer: Buffer): { valid: boolean; detectedMime?: string } {
  if (buffer.length < 12) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedMime: 'image/png' };
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, detectedMime: 'image/webp' };
  }

  // PDF: %PDF (25 50 44 46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { valid: true, detectedMime: 'application/pdf' };
  }

  return { valid: false };
}

/**
 * Upload to Cloudinary if environment variables are configured.
 */
async function uploadToCloudinary(buffer: Buffer, filename: string, isDocument: boolean): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  try {
    const crypto = await import('crypto');
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = isDocument ? 'veer_documents' : 'veer_uploads';
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const form = new FormData();
    const blob = new Blob([new Uint8Array(buffer)]);
    form.append('file', blob, filename);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    form.append('folder', folder);

    const resourceType = isDocument ? 'raw' : 'image';
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      const data = await res.json();
      return data.secure_url || data.url || null;
    } else {
      console.warn('[upload] Cloudinary upload returned non-200:', await res.text());
      return null;
    }
  } catch (err) {
    console.warn('[upload] Cloudinary upload failed, falling back to database:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authorization
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await ensureSchema();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileTypeCategory = (formData.get('type') as string) || 'image'; // 'image' | 'document'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const isDocument = fileTypeCategory === 'document' || file.type === 'application/pdf';
    const maxSize = isDocument ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;

    // 2. Strict size check (must be strictly smaller than limit)
    if (file.size >= maxSize) {
      const limitMb = isDocument ? 30 : 20;
      return NextResponse.json(
        {
          success: false,
          message: `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). File must be strictly smaller than ${limitMb} MB.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Magic bytes / File signature verification
    const magicCheck = validateMagicBytes(buffer);
    if (!magicCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid file format or corrupted file signature. Only valid JPG, PNG, WEBP, and PDF files are allowed.',
        },
        { status: 400 }
      );
    }

    // 4. Check allowed MIME types
    if (!isDocument && !['image/jpeg', 'image/png', 'image/webp'].includes(magicCheck.detectedMime!)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid image type. Only JPG, PNG, and WEBP images are supported for gallery and covers.',
        },
        { status: 400 }
      );
    }

    // 5. Sanitize filename to prevent directory traversal
    const rawName = basename(file.name || 'upload');
    const safeName = rawName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 80);
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const uniqueFilename = `${uniquePrefix}-${safeName}`;
    const subfolder = isDocument ? 'documents' : 'uploads';

    // 6. Check Cloudinary first if configured
    const cloudinaryUrl = await uploadToCloudinary(buffer, uniqueFilename, isDocument);
    if (cloudinaryUrl) {
      // Also register metadata in uploaded_files for Media Library listing
      try {
        await pool.query(
          `INSERT INTO uploaded_files (filename, folder, mimeType, size, data)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE mimeType = VALUES(mimeType), size = VALUES(size)`,
          [uniqueFilename, subfolder, magicCheck.detectedMime, file.size, Buffer.from(cloudinaryUrl, 'utf8')]
        );
      } catch (dbErr) {
        console.warn('[upload] Error saving cloudinary reference in DB:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully to cloud storage',
        url: cloudinaryUrl,
        fileName: safeName,
        size: file.size,
        mimeType: magicCheck.detectedMime,
      });
    }

    // 7. Store in Hostinger MySQL uploaded_files table (guaranteed persistent across serverless instances)
    await pool.query(
      `INSERT INTO uploaded_files (filename, folder, mimeType, size, data)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE mimeType = VALUES(mimeType), size = VALUES(size), data = VALUES(data)`,
      [uniqueFilename, subfolder, magicCheck.detectedMime, file.size, buffer]
    );

    // 8. Try local disk write (works on local development / persistent VPS, safely catches and ignores on Vercel)
    try {
      const uploadDir = join(process.cwd(), 'public', subfolder);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const filePath = join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);
    } catch (fsErr: any) {
      // Expected on Vercel / AWS Lambda read-only container: /var/task is read-only.
      // File is already securely stored in MySQL and served by app/uploads/[filename]/route.ts!
      console.log('[upload] Serverless environment detected; file stored in MySQL database.');
    }

    const publicUrl = `/${subfolder}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      fileName: safeName,
      size: file.size,
      mimeType: magicCheck.detectedMime,
    });
  } catch (error: any) {
    console.error('[upload] Upload error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error uploading file' },
      { status: 500 }
    );
  }
}
