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

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, displayTitle, address, city, state, postalCode, country,
             phones, email, whatsapp, mapUrl, mapEmbedUrl,
             facebook, instagram, youtube, googleReview, linkedin,
             isActive, displayOrder, created_at, updated_at
      FROM branches
      ORDER BY displayOrder ASC, id ASC
    `);

    const branches = rows.map((r) => {
      let phones = r.phones;
      if (typeof phones === 'string') {
        try {
          phones = JSON.parse(phones);
        } catch {
          phones = [];
        }
      }
      return {
        ...r,
        phones: Array.isArray(phones) ? phones : [],
        isActive: Boolean(r.isActive),
      };
    });

    return NextResponse.json({ success: true, branches });
  } catch (error: any) {
    console.error('[admin/branches] GET error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();

    const body = await req.json();
    let {
      id,
      name,
      displayTitle,
      address,
      city = 'Ahmedabad',
      state = 'Gujarat',
      postalCode = '380052',
      country = 'India',
      phones = [],
      email,
      whatsapp,
      mapUrl,
      mapEmbedUrl,
      facebook,
      instagram,
      youtube,
      googleReview,
      linkedin,
      isActive = 1,
      displayOrder = 0,
    } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Branch name is required (min 2 characters).' }, { status: 400 });
    }
    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return NextResponse.json({ error: 'Complete address is required (min 5 characters).' }, { status: 400 });
    }

    if (!id || typeof id !== 'string') {
      id = 'branch_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30) + '_' + Date.now().toString(36);
    } else {
      id = id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    }

    // Check unique ID
    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM branches WHERE id = ? LIMIT 1', [id]);
    if (existing && existing.length > 0) {
      id = id + '_' + Math.random().toString(36).slice(2, 6);
    }

    // Normalize phones array: [{ number: string, label?: string }]
    let cleanPhones: Array<{ number: string; label?: string }> = [];
    if (Array.isArray(phones)) {
      cleanPhones = phones
        .map((p: any) => {
          if (typeof p === 'string') {
            return { number: p.trim(), label: 'Office' };
          }
          if (p && typeof p === 'object' && p.number) {
            return { number: String(p.number).trim(), label: p.label ? String(p.label).trim() : 'Office' };
          }
          return null;
        })
        .filter(Boolean) as Array<{ number: string; label?: string }>;
    }

    // Security validation on mapEmbedUrl
    let cleanMapEmbed = sanitizeUrl(mapEmbedUrl);
    if (cleanMapEmbed && !cleanMapEmbed.includes('google.com/maps')) {
      cleanMapEmbed = '';
    }

    await pool.query(
      `INSERT INTO branches (
        id, name, displayTitle, address, city, state, postalCode, country,
        phones, email, whatsapp, mapUrl, mapEmbedUrl,
        facebook, instagram, youtube, googleReview, linkedin,
        isActive, displayOrder
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name.trim(),
        (displayTitle || name).trim(),
        address.trim(),
        city.trim(),
        state.trim(),
        postalCode.trim(),
        country.trim(),
        JSON.stringify(cleanPhones),
        email ? String(email).trim().toLowerCase() : null,
        whatsapp ? String(whatsapp).replace(/[^0-9]/g, '') : null,
        sanitizeUrl(mapUrl),
        cleanMapEmbed,
        sanitizeUrl(facebook),
        sanitizeUrl(instagram),
        sanitizeUrl(youtube),
        sanitizeUrl(googleReview),
        sanitizeUrl(linkedin),
        isActive ? 1 : 0,
        Number(displayOrder) || 0,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Branch created successfully',
      branch: {
        id,
        name: name.trim(),
        displayTitle: (displayTitle || name).trim(),
        address: address.trim(),
        city,
        state,
        postalCode,
        country,
        phones: cleanPhones,
        email,
        whatsapp,
        mapUrl: sanitizeUrl(mapUrl),
        mapEmbedUrl: cleanMapEmbed,
        facebook: sanitizeUrl(facebook),
        instagram: sanitizeUrl(instagram),
        youtube: sanitizeUrl(youtube),
        googleReview: sanitizeUrl(googleReview),
        linkedin: sanitizeUrl(linkedin),
        isActive: Boolean(isActive),
        displayOrder: Number(displayOrder) || 0,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('[admin/branches] POST error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create branch' }, { status: 500 });
  }
}

