export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

function sanitizeUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed)) return '';
  return trimmed;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { id } = await params;

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM branches WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const branch = rows[0];
    let phones = branch.phones;
    if (typeof phones === 'string') {
      try {
        phones = JSON.parse(phones);
      } catch {
        phones = [];
      }
    }

    return NextResponse.json({
      success: true,
      branch: {
        ...branch,
        phones: Array.isArray(phones) ? phones : [],
        isActive: Boolean(branch.isActive),
      },
    });
  } catch (error: any) {
    console.error('[admin/branches/[id]] GET error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch branch' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { id } = await params;

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM branches WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      displayTitle,
      address,
      city,
      state,
      postalCode,
      country,
      phones,
      email,
      whatsapp,
      mapUrl,
      mapEmbedUrl,
      facebook,
      instagram,
      youtube,
      googleReview,
      linkedin,
      isActive,
      displayOrder,
    } = body;

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
      return NextResponse.json({ error: 'Branch name must be at least 2 characters.' }, { status: 400 });
    }
    if (address !== undefined && (typeof address !== 'string' || address.trim().length < 5)) {
      return NextResponse.json({ error: 'Address must be at least 5 characters.' }, { status: 400 });
    }

    let cleanPhones = phones;
    if (phones !== undefined) {
      if (Array.isArray(phones)) {
        cleanPhones = phones
          .map((p: any) => {
            if (typeof p === 'string') return { number: p.trim(), label: 'Office' };
            if (p && typeof p === 'object' && p.number) {
              return { number: String(p.number).trim(), label: p.label ? String(p.label).trim() : 'Office' };
            }
            return null;
          })
          .filter(Boolean);
      } else {
        cleanPhones = [];
      }
    }

    let cleanMapEmbed = mapEmbedUrl !== undefined ? sanitizeUrl(mapEmbedUrl) : undefined;
    if (cleanMapEmbed && !cleanMapEmbed.includes('google.com/maps')) {
      cleanMapEmbed = '';
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name.trim()); }
    if (displayTitle !== undefined) { updates.push('displayTitle = ?'); values.push(displayTitle.trim()); }
    if (address !== undefined) { updates.push('address = ?'); values.push(address.trim()); }
    if (city !== undefined) { updates.push('city = ?'); values.push(city.trim()); }
    if (state !== undefined) { updates.push('state = ?'); values.push(state.trim()); }
    if (postalCode !== undefined) { updates.push('postalCode = ?'); values.push(postalCode.trim()); }
    if (country !== undefined) { updates.push('country = ?'); values.push(country.trim()); }
    if (phones !== undefined) { updates.push('phones = ?'); values.push(JSON.stringify(cleanPhones)); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email ? email.trim().toLowerCase() : null); }
    if (whatsapp !== undefined) { updates.push('whatsapp = ?'); values.push(whatsapp ? String(whatsapp).replace(/[^0-9]/g, '') : null); }
    if (mapUrl !== undefined) { updates.push('mapUrl = ?'); values.push(sanitizeUrl(mapUrl)); }
    if (cleanMapEmbed !== undefined) { updates.push('mapEmbedUrl = ?'); values.push(cleanMapEmbed); }
    if (facebook !== undefined) { updates.push('facebook = ?'); values.push(sanitizeUrl(facebook)); }
    if (instagram !== undefined) { updates.push('instagram = ?'); values.push(sanitizeUrl(instagram)); }
    if (youtube !== undefined) { updates.push('youtube = ?'); values.push(sanitizeUrl(youtube)); }
    if (googleReview !== undefined) { updates.push('googleReview = ?'); values.push(sanitizeUrl(googleReview)); }
    if (linkedin !== undefined) { updates.push('linkedin = ?'); values.push(sanitizeUrl(linkedin)); }
    if (isActive !== undefined) { updates.push('isActive = ?'); values.push(isActive ? 1 : 0); }
    if (displayOrder !== undefined) { updates.push('displayOrder = ?'); values.push(Number(displayOrder) || 0); }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'No fields to update.' });
    }

    values.push(id);
    await pool.query(`UPDATE branches SET ${updates.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({
      success: true,
      message: 'Branch updated successfully.',
    });
  } catch (error: any) {
    console.error('[admin/branches/[id]] PUT error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update branch' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { id } = await params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM branches WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Branch ${id} deleted successfully.`,
    });
  } catch (error: any) {
    console.error('[admin/branches/[id]] DELETE error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete branch' }, { status: 500 });
  }
}
