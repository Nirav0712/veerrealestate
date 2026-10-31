export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

const DEFAULT_SEO_SETTINGS = {
  siteTitle: 'Veer Real Estate | Leading Real Estate Consultant in Ahmedabad',
  metaDescription: 'Discover luxury apartments, commercial showrooms, corporate offices, and premium bungalows across East & West Ahmedabad with Veer Real Estate.',
  canonicalDomain: 'https://veerrealestate.com',
  googleSiteVerification: '',
  googleAnalyticsId: '',
  defaultOgImage: '/images/og-default.jpg',
  robotsDefault: 'index, follow',
  organizationName: 'Veer Real Estate',
  organizationPhone: '+91 98250 00000',
  organizationEmail: 'info@veerrealestate.com',
  organizationAddress: 'Ahmedabad, Gujarat, India',
};

// GET /api/admin/seo-settings
export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT contentData FROM website_content WHERE sectionKey = 'seo_settings' LIMIT 1"
    );

    if (rows.length === 0 || !rows[0].contentData) {
      return NextResponse.json(DEFAULT_SEO_SETTINGS);
    }

    const data = typeof rows[0].contentData === 'string'
      ? JSON.parse(rows[0].contentData)
      : rows[0].contentData;

    return NextResponse.json({ ...DEFAULT_SEO_SETTINGS, ...data });
  } catch (error: any) {
    console.error('Failed to get SEO settings:', error);
    return NextResponse.json(DEFAULT_SEO_SETTINGS);
  }
}

// PUT /api/admin/seo-settings
export async function PUT(req: NextRequest) {
  const auth = await requirePermission(req, 'seo', 'edit');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();

    const cleanSettings = {
      siteTitle: body.siteTitle?.trim() || DEFAULT_SEO_SETTINGS.siteTitle,
      metaDescription: body.metaDescription?.trim() || DEFAULT_SEO_SETTINGS.metaDescription,
      canonicalDomain: body.canonicalDomain?.trim().replace(/\/+$/, '') || DEFAULT_SEO_SETTINGS.canonicalDomain,
      googleSiteVerification: body.googleSiteVerification?.trim() || '',
      googleAnalyticsId: body.googleAnalyticsId?.trim() || '',
      defaultOgImage: body.defaultOgImage?.trim() || DEFAULT_SEO_SETTINGS.defaultOgImage,
      robotsDefault: body.robotsDefault?.trim() || 'index, follow',
      organizationName: body.organizationName?.trim() || DEFAULT_SEO_SETTINGS.organizationName,
      organizationPhone: body.organizationPhone?.trim() || DEFAULT_SEO_SETTINGS.organizationPhone,
      organizationEmail: body.organizationEmail?.trim() || DEFAULT_SEO_SETTINGS.organizationEmail,
      organizationAddress: body.organizationAddress?.trim() || DEFAULT_SEO_SETTINGS.organizationAddress,
    };

    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM website_content WHERE sectionKey = 'seo_settings' LIMIT 1"
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE website_content SET contentData = ? WHERE sectionKey = 'seo_settings'",
        [JSON.stringify(cleanSettings)]
      );
    } else {
      await pool.query(
        "INSERT INTO website_content (sectionKey, contentData) VALUES ('seo_settings', ?)",
        [JSON.stringify(cleanSettings)]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'SEO settings updated successfully',
      settings: cleanSettings,
    });
  } catch (error: any) {
    console.error('Failed to update SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to save SEO settings: ' + (error.message || '') },
      { status: 500 }
    );
  }
}

