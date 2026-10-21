export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// Rate limiting in-memory map
const ipInquiryTimestamps = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = req.headers.get('user-agent')?.substring(0, 255) || 'unknown';

    // 1. Spam rate limiting (1 request per 8 seconds per IP)
    const now = Date.now();
    const lastTime = ipInquiryTimestamps.get(ip) || 0;
    if (now - lastTime < 8000) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }
    ipInquiryTimestamps.set(ip, now);

    const body = await req.json();
    const {
      name,
      phone,
      email,
      subject,
      message,
      leadType = 'contact', // 'property' | 'project' | 'contact' | 'builder'
      propertyId,
      propertyTitle,
      projectId,
      projectName,
      source = 'Website Inquiry',
      honeypot,
    } = body;

    // 2. Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    // 3. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || '').replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json(
        { error: 'Please provide a valid contact phone number (at least 8 digits).' },
        { status: 400 }
      );
    }

    // 4. Insert into crm_inquiries
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO crm_inquiries (
        leadType, name, phone, email, subject, message,
        propertyId, propertyTitle, projectId, projectName,
        status, source, ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, ?)`,
      [
        leadType,
        name.trim(),
        cleanPhone,
        email ? String(email).trim().toLowerCase() : null,
        subject ? String(subject).trim() : null,
        message ? String(message).trim() : null,
        propertyId ? Number(propertyId) : null,
        propertyTitle ? String(propertyTitle).trim() : null,
        projectId ? Number(projectId) : null,
        projectName ? String(projectName).trim() : null,
        source,
        ip,
        userAgent,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        inquiryId: result.insertId,
        message: 'Thank you! Your inquiry has been submitted. Our property consultant will contact you shortly.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[inquiries] Submission error:', err);
    return NextResponse.json(
      { error: 'Unable to submit inquiry. Please try again or reach out on WhatsApp.' },
      { status: 500 }
    );
  }
}
