export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// Rate limiting in-memory map to prevent rapid spam submissions
const ipSubmissionTimestamps = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = req.headers.get('user-agent')?.substring(0, 255) || 'unknown';

    // 1. Basic spam rate limiting (max 1 submission per 10 seconds per IP)
    const now = Date.now();
    const lastTime = ipSubmissionTimestamps.get(ip) || 0;
    if (now - lastTime < 10000) {
      return NextResponse.json(
        { error: 'Please wait a few seconds before submitting another request.' },
        { status: 429 }
      );
    }
    ipSubmissionTimestamps.set(ip, now);

    const body = await req.json();
    const {
      fullName,
      phone,
      companyName,
      email,
      projectLocation,
      projectStage,
      mainChallenge,
      requirements,
      source = 'Builder Consultation Page',
      consent = true,
      honeypot, // Spam honeypot field
    } = body;

    // 2. Honeypot check: Bots fill hidden inputs
    if (honeypot) {
      console.warn('[builder-leads] Honeypot triggered from IP:', ip);
      // Return 200 silently so bots don't adapt
      return NextResponse.json({ success: true, message: 'Consultation request received.' });
    }

    // 3. Server-side validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid full name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || '').replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { error: 'Please provide a valid contact number (10-15 digits).' },
        { status: 400 }
      );
    }

    if (!projectLocation || typeof projectLocation !== 'string' || !projectLocation.trim()) {
      return NextResponse.json(
        { error: 'Please specify your project location.' },
        { status: 400 }
      );
    }

    if (!projectStage || typeof projectStage !== 'string' || !projectStage.trim()) {
      return NextResponse.json(
        { error: 'Please select your current project stage.' },
        { status: 400 }
      );
    }

    if (!mainChallenge || typeof mainChallenge !== 'string' || !mainChallenge.trim()) {
      return NextResponse.json(
        { error: 'Please select your main project challenge.' },
        { status: 400 }
      );
    }

    // 4. Duplicate handling strategy:
    // If the same phone submitted within the last 15 minutes, update the existing lead instead of creating duplicate clutter.
    const [recent] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM builder_leads
       WHERE phone = ? AND created_at >= NOW() - INTERVAL 15 MINUTE
       ORDER BY id DESC LIMIT 1`,
      [cleanPhone]
    );

    if (recent.length > 0) {
      const existingId = recent[0].id;
      await pool.query(
        `UPDATE builder_leads SET
          fullName = ?, companyName = ?, email = ?, projectLocation = ?,
          projectStage = ?, mainChallenge = ?, requirements = ?, updated_at = NOW()
        WHERE id = ?`,
        [
          fullName.trim(),
          (companyName || '').trim(),
          (email || '').trim(),
          projectLocation.trim(),
          projectStage.trim(),
          mainChallenge.trim(),
          (requirements || '').trim(),
          existingId,
        ]
      );

      return NextResponse.json({
        success: true,
        message: 'Your consultation request has been updated. Our team will contact you shortly.',
        leadId: existingId,
      });
    }

    // 5. Insert new lead into MySQL
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO builder_leads (
        fullName, companyName, phone, email, projectLocation,
        projectStage, mainChallenge, requirements, source, status,
        consentGiven, ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, ?)`,
      [
        fullName.trim(),
        (companyName || '').trim(),
        cleanPhone,
        (email || '').trim(),
        projectLocation.trim(),
        projectStage.trim(),
        mainChallenge.trim(),
        (requirements || '').trim(),
        source,
        consent ? 1 : 0,
        ip,
        userAgent,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation request received successfully. Our expert team will connect with you.',
        leadId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[builder-leads] Error persisting lead:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving lead. Please try again or connect via WhatsApp.' },
      { status: 500 }
    );
  }
}
