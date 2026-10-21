export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin, getAuthenticatedAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

function parseJsonArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().length > 0) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return [val];
    }
  }
  return [];
}

// GET /api/blogs/[slug] - Single blog post (draft protection)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureSchema();
    const { slug } = await params;

    const isNumeric = /^\d+$/.test(slug);
    const sql = isNumeric
      ? 'SELECT * FROM blogs WHERE id = ? LIMIT 1'
      : 'SELECT * FROM blogs WHERE slug = ? LIMIT 1';

    const [rows] = await pool.query<RowDataPacket[]>(sql, [slug]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const blog = rows[0];

    // If post is a draft, only allow authenticated admins to view it
    if (blog.publishStatus === 'draft') {
      const admin = await getAuthenticatedAdmin(req);
      if (!admin) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
    }

    return NextResponse.json({
      ...blog,
      tags: parseJsonArray(blog.tags),
    });
  } catch (error: any) {
    console.error('[blogs/[slug]] Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT /api/blogs/[slug] - Protected: Admin update blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { slug: identifier } = await params;
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      featuredImage,
      imageAlt,
      readTime,
      publishStatus,
      publishedAt,
      metaTitle,
      metaDescription,
      primaryKeyword,
      canonicalUrl,
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Blog title is required' }, { status: 400 });
    }

    const isNumeric = /^\d+$/.test(identifier);
    const whereColumn = isNumeric ? 'id' : 'slug';

    await pool.query(
      `UPDATE blogs SET
        title = ?, slug = ?, excerpt = ?, content = ?, author = ?,
        category = ?, tags = ?, featuredImage = ?, imageAlt = ?, readTime = ?,
        publishStatus = ?, publishedAt = ?, metaTitle = ?, metaDescription = ?,
        primaryKeyword = ?, canonicalUrl = ?, updated_at = NOW()
      WHERE ${whereColumn} = ?`,
      [
        title.trim(),
        slug || identifier,
        excerpt || null,
        content,
        author || 'Veer Real Estate',
        category || 'Market Trends',
        JSON.stringify(Array.isArray(tags) ? tags : []),
        featuredImage || null,
        imageAlt || title.trim(),
        readTime || '5 min read',
        publishStatus || 'published',
        publishedAt ? new Date(publishedAt) : new Date(),
        metaTitle || null,
        metaDescription || null,
        primaryKeyword || null,
        canonicalUrl || null,
        identifier,
      ]
    );

    return NextResponse.json({ success: true, message: 'Blog post updated successfully' });
  } catch (error: any) {
    console.error('[blogs/[slug]] Error updating blog post:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE /api/blogs/[slug] - Protected: Admin delete blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { slug: identifier } = await params;
    const isNumeric = /^\d+$/.test(identifier);
    const whereColumn = isNumeric ? 'id' : 'slug';

    await pool.query(`DELETE FROM blogs WHERE ${whereColumn} = ?`, [identifier]);
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('[blogs/[slug]] Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
