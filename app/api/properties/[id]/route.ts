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

    const finalTitle = (body.title !== undefined ? body.title : (current.title || '')).trim();
    if (!finalTitle) {
      return NextResponse.json({ error: 'Property title is required' }, { status: 400 });
    }

    const finalLocation = (body.location !== undefined ? body.location : (current.location || current.locality || 'Ahmedabad')).trim();

    // Preserve images unless explicitly updated
    const currentImages = parseJsonArray(current.images);
    const imageList = body.images !== undefined
      ? (Array.isArray(body.images) ? body.images : (typeof body.images === 'string' && body.images.trim() ? [body.images.trim()] : []))
      : (currentImages.length > 0 ? currentImages : (current.image ? [current.image] : []));

    // Strict 6-image limit enforcement
    if (imageList.length > 6) {
      return NextResponse.json(
        { error: 'Maximum 6 images allowed per property. Please remove excess images.' },
        { status: 400 }
      );
    }

    const {
      price = current.price,
      type = current.type,
      status = current.status,
      bedrooms = current.bedrooms,
      bathrooms = current.bathrooms,
      area = current.area,
      areaUnit = current.areaUnit || 'sqft',
      featured = current.featured,
      description = current.description || '',
      yearBuilt = current.yearBuilt || new Date().getFullYear(),
      parking = current.parking || 0,
      transaction = current.transaction || 'resale',
      // Phase 3 Enhanced Fields
      slug = current.slug,
      propertyCode = current.propertyCode,
      locationId = current.locationId,
      locality = current.locality,
      address = current.address,
      pincode = current.pincode,
      latitude = current.latitude,
      longitude = current.longitude,
      priceOnRequest = current.priceOnRequest,
      isNegotiable = current.isNegotiable,
      maintenanceCharges = current.maintenanceCharges,
      carpetArea = current.carpetArea,
      builtUpArea = current.builtUpArea,
      superBuiltUpArea = current.superBuiltUpArea,
      plotArea = current.plotArea,
      balconies = current.balconies || 0,
      furnishing = current.furnishing || 'Semi-Furnished',
      floorNumber = current.floorNumber,
      totalFloors = current.totalFloors,
      facing = current.facing,
      propertyAge = current.propertyAge,
      possessionDate = current.possessionDate,
      amenities = body.amenities !== undefined ? body.amenities : parseJsonArray(current.amenities),
      reraNumber = current.reraNumber,
      ownershipType = current.ownershipType || 'Freehold',
      approvals = body.approvals !== undefined ? body.approvals : parseJsonArray(current.approvals),
      coverImage = current.coverImage,
      imageAlts = body.imageAlts !== undefined ? body.imageAlts : current.imageAlts,
      availability = current.availability || 'Available',
      publishStatus = current.publishStatus || 'published',
      metaTitle = current.metaTitle,
      metaDescription = current.metaDescription,
      primaryKeyword = current.primaryKeyword,
      canonicalUrl = current.canonicalUrl,
      // Dynamic Category & Purpose
      listingPurpose = current.listingPurpose || 'Sell',
      propertyCategory = current.propertyCategory || 'Residential',
      propertySubtype = current.propertySubtype,
      // Rental
      monthlyRent = current.monthlyRent,
      securityDeposit = current.securityDeposit,
      leaseDuration = current.leaseDuration,
      lockInPeriod = current.lockInPeriod,
      preferredTenant = current.preferredTenant,
      // Plot
      plotFrontage = current.plotFrontage,
      plotDepth = current.plotDepth,
      roadWidth = current.roadWidth,
      zoning = current.zoning,
      landUse = current.landUse,
      naNocStatus = current.naNocStatus,
      isCornerPlot = current.isCornerPlot,
      boundaryWall = current.boundaryWall,
      // Commercial
      washrooms = current.washrooms,
      powerLoad = current.powerLoad,
      fitOutStatus = current.fitOutStatus,
      permittedUse = current.permittedUse,
      // Agricultural
      irrigationType = current.irrigationType,
      waterAccess = current.waterAccess,
      electricityConnection = current.electricityConnection,
      landRecordDetails = current.landRecordDetails,
      // Contact & Misc
      contactPerson = current.contactPerson,
      contactPhone = current.contactPhone,
      contactEmail = current.contactEmail,
      societyName = current.societyName,
      highlights = current.highlights,
      pricePerUnit = current.pricePerUnit,
    } = body;

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
        finalTitle,
        slug || null,
        propertyCode || null,
        priceOnRequest ? 0 : Number(price) || 0,
        finalLocation,
        locationId ? Number(locationId) : null,
        locality || null,
        address || null,
        pincode || null,
        latitude ? Number(latitude) : null,
        longitude ? Number(longitude) : null,
        type || 'House',
        status || 'For Sale',
        transaction || 'resale',
        availability || 'Available',
        publishStatus || 'published',
        priceOnRequest ? 1 : 0,
        isNegotiable ? 1 : 0,
        maintenanceCharges || null,
        Number(area) || 0,
        areaUnit || 'sqft',
        carpetArea ? Number(carpetArea) : null,
        builtUpArea ? Number(builtUpArea) : null,
        superBuiltUpArea ? Number(superBuiltUpArea) : null,
        plotArea ? Number(plotArea) : null,
        Number(bedrooms) || 0,
        Number(bathrooms) || 0,
        Number(balconies) || 0,
        furnishing || 'Semi-Furnished',
        floorNumber !== '' && floorNumber !== null && floorNumber !== undefined ? Number(floorNumber) : null,
        totalFloors !== '' && totalFloors !== null && totalFloors !== undefined ? Number(totalFloors) : null,
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
        JSON.stringify(typeof imageAlts === 'string' ? (() => { try { return JSON.parse(imageAlts); } catch { return {}; } })() : (imageAlts || {})),
        description || '',
        yearBuilt ? Number(yearBuilt) : new Date().getFullYear(),
        metaTitle || null,
        metaDescription || null,
        primaryKeyword || null,
        canonicalUrl || null,
        listingPurpose || 'Sell',
        propertyCategory || 'Residential',
        propertySubtype || null,
        monthlyRent ? Number(monthlyRent) : null,
        securityDeposit ? Number(securityDeposit) : null,
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

    const [updatedRows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties WHERE id = ?', [id]);
    const updated = updatedRows[0] || { id, ...current, ...body, images: imageList };
    if (typeof updated.images === 'string') {
      try { updated.images = JSON.parse(updated.images); } catch { updated.images = []; }
    }
    if (typeof updated.amenities === 'string') {
      try { updated.amenities = JSON.parse(updated.amenities); } catch { updated.amenities = []; }
    }
    if (typeof updated.approvals === 'string') {
      try { updated.approvals = JSON.parse(updated.approvals); } catch { updated.approvals = []; }
    }
    return NextResponse.json(updated);
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

    // Check if property exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, title FROM properties WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Safely detach any CRM inquiries referencing this property so historical lead data is retained
    await pool.query(
      "UPDATE crm_inquiries SET propertyId = NULL, propertyTitle = CONCAT(IFNULL(propertyTitle, 'Deleted Property'), ' (Archived)') WHERE propertyId = ?",
      [id]
    );

    await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error: any) {
    console.error('[properties/[id]] Error deleting property:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete property' }, { status: 500 });
  }
}
