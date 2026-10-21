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

// GET /api/properties - Public & Admin with filters
export async function GET(request: NextRequest) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const locationId = searchParams.get('locationId');
    const transaction = searchParams.get('transaction');
    const bedrooms = searchParams.get('bedrooms');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    // If requesting drafts, check if caller is authenticated admin
    let allowDrafts = false;
    if (includeDrafts) {
      const admin = await getAuthenticatedAdmin(request);
      if (admin) allowDrafts = true;
    }

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (!allowDrafts) {
      whereClauses.push("(publishStatus = 'published' OR publishStatus IS NULL)");
    }

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (type && type !== 'all') {
      whereClauses.push('type = ?');
      params.push(type);
    }

    if (locationId) {
      whereClauses.push('locationId = ?');
      params.push(locationId);
    } else if (location && location !== 'all') {
      whereClauses.push('(location LIKE ? OR locality LIKE ?)');
      const pattern = `%${location}%`;
      params.push(pattern, pattern);
    }

    if (transaction && transaction !== 'all') {
      whereClauses.push('transaction = ?');
      params.push(transaction);
    }

    if (bedrooms && bedrooms !== 'all') {
      const bhkNum = parseInt(bedrooms);
      if (!isNaN(bhkNum)) {
        whereClauses.push('bedrooms = ?');
        params.push(bhkNum);
      }
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        whereClauses.push('price >= ?');
        params.push(min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        whereClauses.push('price <= ?');
        params.push(max);
      }
    }

    if (featured === 'true' || featured === '1') {
      whereClauses.push('featured = 1');
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `SELECT * FROM properties ${whereSql} ORDER BY featured DESC, created_at DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);

    const properties = rows.map((row) => ({
      ...row,
      images: parseJsonArray(row.images).length > 0 ? parseJsonArray(row.images) : (row.image ? [row.image] : []),
      featured: Boolean(row.featured),
      priceOnRequest: Boolean(row.priceOnRequest),
      isNegotiable: Boolean(row.isNegotiable),
      amenities: parseJsonArray(row.amenities),
      approvals: parseJsonArray(row.approvals),
      imageAlts: typeof row.imageAlts === 'string' ? (() => { try { return JSON.parse(row.imageAlts); } catch { return {}; } })() : (row.imageAlts || {}),
    }));

    return NextResponse.json(properties);
  } catch (error: any) {
    console.error('[properties] Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST /api/properties - Protected: Admin create property
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const body = await request.json();

    const {
      title,
      price = 0,
      location = '',
      type = 'House',
      status = 'For Sale',
      bedrooms = 0,
      bathrooms = 0,
      area = 0,
      areaUnit = 'sqft',
      featured = false,
      images = [],
      description = '',
      yearBuilt = new Date().getFullYear(),
      parking = 0,
      transaction = 'resale',
      // Phase 3 Enhanced Fields
      slug,
      propertyCode,
      locationId,
      locality,
      address,
      pincode,
      latitude,
      longitude,
      priceOnRequest = false,
      isNegotiable = true,
      maintenanceCharges,
      carpetArea,
      builtUpArea,
      superBuiltUpArea,
      plotArea,
      balconies = 0,
      furnishing = 'Semi-Furnished',
      floorNumber,
      totalFloors,
      facing,
      propertyAge,
      possessionDate,
      amenities = [],
      reraNumber,
      ownershipType = 'Freehold',
      approvals = [],
      coverImage,
      imageAlts = {},
      availability = 'Available',
      publishStatus = 'published',
      metaTitle,
      metaDescription,
      primaryKeyword,
      canonicalUrl,
      // Dynamic Category & Purpose
      listingPurpose = 'Sell',
      propertyCategory = 'Residential',
      propertySubtype,
      // Rental
      monthlyRent,
      securityDeposit,
      leaseDuration,
      lockInPeriod,
      preferredTenant,
      // Plot
      plotFrontage,
      plotDepth,
      roadWidth,
      zoning,
      landUse,
      naNocStatus,
      isCornerPlot = false,
      boundaryWall = false,
      // Commercial
      washrooms,
      powerLoad,
      fitOutStatus,
      permittedUse,
      // Agricultural
      irrigationType,
      waterAccess = false,
      electricityConnection = false,
      landRecordDetails,
      // Contact & Misc
      contactPerson,
      contactPhone,
      contactEmail,
      societyName,
      highlights,
      pricePerUnit,
    } = body;

    // 1. Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Property title is required' }, { status: 400 });
    }

    // 2. Strict 6-image limit enforcement
    const imageList = Array.isArray(images) ? images : [];
    if (imageList.length > 6) {
      return NextResponse.json(
        { error: 'Maximum 6 images allowed per property. Please remove excess images.' },
        { status: 400 }
      );
    }

    // 3. Auto-generate slug and property code
    let cleanSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const effectiveCoverImage = coverImage || (imageList.length > 0 ? imageList[0] : null);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO properties (
        title, slug, propertyCode, price, location, locationId, locality, address, pincode,
        latitude, longitude, type, status, transaction, availability, publishStatus,
        priceOnRequest, isNegotiable, maintenanceCharges,
        area, areaUnit, carpetArea, builtUpArea, superBuiltUpArea, plotArea,
        bedrooms, bathrooms, balconies, furnishing, floorNumber, totalFloors,
        facing, propertyAge, possessionDate, parking, amenities,
        reraNumber, ownershipType, approvals,
        featured, coverImage, image, images, imageAlts, description, yearBuilt,
        metaTitle, metaDescription, primaryKeyword, canonicalUrl,
        listingPurpose, propertyCategory, propertySubtype,
        monthlyRent, securityDeposit, leaseDuration, lockInPeriod, preferredTenant,
        plotFrontage, plotDepth, roadWidth, zoning, landUse, naNocStatus, isCornerPlot, boundaryWall,
        washrooms, powerLoad, fitOutStatus, permittedUse,
        irrigationType, waterAccess, electricityConnection, landRecordDetails,
        contactPerson, contactPhone, contactEmail, societyName, highlights, pricePerUnit
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )`,
      [
        title.trim(),
        cleanSlug,
        propertyCode || null,
        priceOnRequest ? 0 : Number(price) || 0,
        location.trim(),
        locationId || null,
        locality || null,
        address || null,
        pincode || null,
        latitude || null,
        longitude || null,
        type,
        status,
        transaction,
        availability,
        publishStatus,
        priceOnRequest ? 1 : 0,
        isNegotiable ? 1 : 0,
        maintenanceCharges || null,
        Number(area) || 0,
        areaUnit || 'sqft',
        carpetArea || null,
        builtUpArea || null,
        superBuiltUpArea || null,
        plotArea || null,
        Number(bedrooms) || 0,
        Number(bathrooms) || 0,
        Number(balconies) || 0,
        furnishing,
        floorNumber || null,
        totalFloors || null,
        facing || null,
        propertyAge || null,
        possessionDate || null,
        Number(parking) || 0,
        JSON.stringify(Array.isArray(amenities) ? amenities : []),
        reraNumber || null,
        ownershipType || 'Freehold',
        JSON.stringify(Array.isArray(approvals) ? approvals : []),
        featured ? 1 : 0,
        effectiveCoverImage,
        effectiveCoverImage,
        JSON.stringify(imageList),
        JSON.stringify(imageAlts || {}),
        description || '',
        yearBuilt || new Date().getFullYear(),
        metaTitle || `${title.trim()} for ${status} in ${location} | Veer Real Estate`,
        metaDescription || description.substring(0, 160) || null,
        primaryKeyword || `${type} in ${location}, buy property Ahmedabad`,
        canonicalUrl || null,
        listingPurpose || 'Sell',
        propertyCategory || 'Residential',
        propertySubtype || null,
        monthlyRent || null,
        securityDeposit || null,
        leaseDuration || null,
        lockInPeriod || null,
        preferredTenant || null,
        plotFrontage || null,
        plotDepth || null,
        roadWidth || null,
        zoning || null,
        landUse || null,
        naNocStatus || null,
        isCornerPlot ? 1 : 0,
        boundaryWall ? 1 : 0,
        washrooms || null,
        powerLoad || null,
        fitOutStatus || null,
        permittedUse || null,
        irrigationType || null,
        waterAccess ? 1 : 0,
        electricityConnection ? 1 : 0,
        landRecordDetails || null,
        contactPerson || null,
        contactPhone || null,
        contactEmail || null,
        societyName || null,
        highlights || null,
        pricePerUnit || null,
      ]
    );

    const newId = result.insertId;

    // Set standard property code if none provided: VRE-0001
    if (!propertyCode) {
      await pool.query('UPDATE properties SET propertyCode = ? WHERE id = ?', [
        `VRE-${String(newId).padStart(4, '0')}`,
        newId,
      ]);
    }

    return NextResponse.json(
      {
        id: newId,
        title,
        slug: cleanSlug,
        propertyCode: propertyCode || `VRE-${String(newId).padStart(4, '0')}`,
        images: imageList,
        ...body,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[properties] Error creating property:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}
