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
      marketingConsent = false,
      termsConsent = true,
      recaptchaToken,
      whatsappNumber,
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

    if (termsConsent === false) {
      return NextResponse.json(
        { error: 'Please accept the Terms and Privacy Policy to proceed.' },
        { status: 400 }
      );
    }

    // 4. Anti-spam / ReCAPTCHA verification if token provided and secret key exists
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      try {
        const verifyRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
          { method: 'POST' }
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json(
            { error: 'CAPTCHA verification failed. Please try again.' },
            { status: 400 }
          );
        }
      } catch (recaptchaErr) {
        console.warn('[inquiries] ReCAPTCHA verification check failed:', recaptchaErr);
      }
    }

    // 5. Insert into crm_inquiries
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO crm_inquiries (
        leadType, name, phone, email, subject, message,
        propertyId, propertyTitle, projectId, projectName,
        status, source, ipAddress, userAgent, marketingConsent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, ?, ?)`,
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
        marketingConsent ? 1 : 0,
      ]
    );

    // 6. Generate WhatsApp click-to-chat URL if applicable
    const targetWhatsApp = (whatsappNumber || '919727027052').replace(/[^0-9]/g, '');
    const waText =
      `*New Inquiry - Veer Real Estate*%0A%0A` +
      `*Name:* ${encodeURIComponent(name.trim())}%0A` +
      `*Phone:* ${encodeURIComponent(cleanPhone)}%0A` +
      (email ? `*Email:* ${encodeURIComponent(String(email).trim())}%0A` : '') +
      (subject ? `*Subject:* ${encodeURIComponent(String(subject).trim())}%0A` : '') +
      (message ? `*Message:* ${encodeURIComponent(String(message).trim())}%0A` : '') +
      `*Source:* ${encodeURIComponent(source)}`;

    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${waText}`;

    return NextResponse.json(
      {
        success: true,
        inquiryId: result.insertId,
        whatsappUrl,
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
