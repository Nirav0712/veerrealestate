export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin, getAuthenticatedAdmin } from '@/lib/auth';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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

// GET /api/blogs - List blogs with search, category filter, and drafts handling
export async function GET(req: NextRequest) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    let allowDrafts = false;
    if (includeDrafts) {
      const admin = await getAuthenticatedAdmin(req);
      if (admin) allowDrafts = true;
    }

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (!allowDrafts) {
      whereClauses.push("publishStatus = 'published'");
    }

    if (category && category !== 'all') {
      whereClauses.push('category = ?');
      params.push(category);
    }

    if (search) {
      whereClauses.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)');
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total count
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM blogs ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    // Fetch paginated blogs
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, slug, excerpt, author, category, tags, featuredImage, imageAlt,
              readTime, publishStatus, publishedAt, metaTitle, metaDescription, created_at
       FROM blogs ${whereSql}
       ORDER BY publishedAt DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const blogs = rows.map((b) => ({
      ...b,
      tags: parseJsonArray(b.tags),
    }));

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('[blogs] Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/blogs - Protected: Admin create blog post
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const body = await req.json();

    const {
      title,
      slug,
      excerpt = '',
      content = '',
      author = 'Veer Real Estate',
      category = 'Market Trends',
      tags = [],
      featuredImage = '',
      imageAlt = '',
      readTime = '5 min read',
      publishStatus = 'published',
      publishedAt,
      metaTitle,
      metaDescription,
      primaryKeyword,
      canonicalUrl,
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Blog title is required' }, { status: 400 });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Blog content is required' }, { status: 400 });
    }

    // Generate unique slug
    let cleanSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    cleanSlug = cleanSlug.replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM blogs WHERE slug = ? LIMIT 1',
      [cleanSlug]
    );
    if (existing.length > 0) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const effectiveDate = publishedAt ? new Date(publishedAt) : new Date();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO blogs (
        title, slug, excerpt, content, author, category, tags,
        featuredImage, imageAlt, readTime, publishStatus, publishedAt,
        metaTitle, metaDescription, primaryKeyword, canonicalUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        cleanSlug,
        excerpt.trim() || null,
        content,
        author.trim(),
        category.trim(),
        JSON.stringify(Array.isArray(tags) ? tags : []),
        featuredImage || null,
        imageAlt || title.trim(),
        readTime || '5 min read',
        publishStatus,
        effectiveDate,
        metaTitle || `${title.trim()} | Veer Real Estate Blog`,
        metaDescription || excerpt.substring(0, 160) || null,
        primaryKeyword || null,
        canonicalUrl || null,
      ]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        title: title.trim(),
        slug: cleanSlug,
        ...body,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[blogs] Error creating blog post:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create blog post' }, { status: 500 });
  }
}
