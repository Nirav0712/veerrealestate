export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
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

// GET single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const { id } = await params;

    // Support query by numeric ID or unique slug
    const isNumeric = /^\d+$/.test(id);
    const sql = isNumeric
      ? 'SELECT * FROM properties WHERE id = ? LIMIT 1'
      : 'SELECT * FROM properties WHERE slug = ? LIMIT 1';

    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const row = rows[0];
    const imageList = parseJsonArray(row.images);

    return NextResponse.json({
      ...row,
      images: imageList.length > 0 ? imageList : (row.image ? [row.image] : []),
      featured: Boolean(row.featured),
      priceOnRequest: Boolean(row.priceOnRequest),
      isNegotiable: Boolean(row.isNegotiable),
      amenities: parseJsonArray(row.amenities),
      approvals: parseJsonArray(row.approvals),
      imageAlts: typeof row.imageAlts === 'string' ? (() => { try { return JSON.parse(row.imageAlts); } catch { return {}; } })() : (row.imageAlts || {}),
    });
  } catch (error: any) {
    console.error('[properties/[id]] Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PUT /api/properties/[id] - Protected: Admin update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { id } = await params;
    const body = await request.json();

    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM properties WHERE id = ? LIMIT 1',
      [id]
    );
    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    const current = existingRows[0];

    const {
      title = current.title,
      price = current.price,
      location = current.location,
      type = current.type,
      status = current.status,
      bedrooms = current.bedrooms,
      bathrooms = current.bathrooms,
      area = current.area,
      areaUnit = current.areaUnit || 'sqft',
      featured = current.featured,
      images = [],
      description = '',
      yearBuilt = new Date().getFullYear(),
      parking = 0,
      transaction = 'resale',
      // Phase 3 Enhanced Fields
      slug,
      propertyCode,
      locationId = current.locationId,
      locality = current.locality,
      address = current.address,
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

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Property title is required' }, { status: 400 });
    }

    // Strict 6-image limit enforcement
    const imageList = Array.isArray(images) ? images : [];
    if (imageList.length > 6) {
      return NextResponse.json(
        { error: 'Maximum 6 images allowed per property. Please remove excess images.' },
        { status: 400 }
      );
    }

    const effectiveCoverImage = coverImage || (imageList.length > 0 ? imageList[0] : null);

    await pool.query(
      `UPDATE properties SET
        title = ?, slug = ?, propertyCode = ?, price = ?, location = ?, locationId = ?,
        locality = ?, address = ?, pincode = ?, latitude = ?, longitude = ?,
        type = ?, status = ?, transaction = ?, availability = ?, publishStatus = ?,
        priceOnRequest = ?, isNegotiable = ?, maintenanceCharges = ?,
        area = ?, areaUnit = ?, carpetArea = ?, builtUpArea = ?, superBuiltUpArea = ?, plotArea = ?,
        bedrooms = ?, bathrooms = ?, balconies = ?, furnishing = ?, floorNumber = ?, totalFloors = ?,
        facing = ?, propertyAge = ?, possessionDate = ?, parking = ?, amenities = ?,
        reraNumber = ?, ownershipType = ?, approvals = ?,
        featured = ?, coverImage = ?, image = ?, images = ?, imageAlts = ?,
        description = ?, yearBuilt = ?,
        metaTitle = ?, metaDescription = ?, primaryKeyword = ?, canonicalUrl = ?,
        listingPurpose = ?, propertyCategory = ?, propertySubtype = ?,
        monthlyRent = ?, securityDeposit = ?, leaseDuration = ?, lockInPeriod = ?, preferredTenant = ?,
        plotFrontage = ?, plotDepth = ?, roadWidth = ?, zoning = ?, landUse = ?, naNocStatus = ?, isCornerPlot = ?, boundaryWall = ?,
        washrooms = ?, powerLoad = ?, fitOutStatus = ?, permittedUse = ?,
        irrigationType = ?, waterAccess = ?, electricityConnection = ?, landRecordDetails = ?,
        contactPerson = ?, contactPhone = ?, contactEmail = ?, societyName = ?, highlights = ?, pricePerUnit = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title.trim(),
        slug || null,
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
        metaTitle || null,
        metaDescription || null,
        primaryKeyword || null,
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
        id,
      ]
    );

    return NextResponse.json({ success: true, id, ...body, images: imageList });
  } catch (error: any) {
    console.error('[properties/[id]] Error updating property:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update property' }, { status: 500 });
  }
}

// DELETE /api/properties/[id] - Protected: Admin delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    console.error('[properties/[id]] Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
