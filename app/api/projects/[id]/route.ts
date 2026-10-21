export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

function parseJsonArray(val: any): any[] {
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

// GET /api/projects/[id] - Fetch single project with floor plans
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const { id } = await params;

    const isNumeric = /^\d+$/.test(id);
    const sql = isNumeric
      ? 'SELECT * FROM projects WHERE id = ? LIMIT 1'
      : 'SELECT * FROM projects WHERE slug = ? LIMIT 1';

    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = rows[0];
    const gallery = parseJsonArray(project.galleryImages);

    // Fetch associated floor plans
    const [floorPlans] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM project_floor_plans WHERE projectId = ? ORDER BY displayOrder ASC, id ASC',
      [project.id]
    );

    return NextResponse.json({
      ...project,
      galleryImages: gallery.length > 0 ? gallery : (project.coverImage ? [project.coverImage] : []),
      amenities: parseJsonArray(project.amenities),
      approvals: parseJsonArray(project.approvals),
      featured: Boolean(project.featured),
      floorPlans: floorPlans || [],
    });
  } catch (error: any) {
    console.error('[projects/[id]] Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Protected: Admin update project & sync floor plans
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      slug,
      builderName = 'Veer Real Estate',
      tagline,
      description = '',
      category = 'Residential',
      status = 'Under Construction',
      zone = 'East',
      locationId,
      locationName,
      fullAddress,
      pincode,
      latitude,
      longitude,
      priceMin,
      priceMax,
      displayPrice,
      landArea,
      totalTowers = 1,
      totalUnits,
      configurations,
      possessionDate,
      reraNumber,
      amenities = [],
      approvals = [],
      coverImage,
      galleryImages = [],
      masterPlanImage,
      sitePlanImage,
      brochureUrl,
      featured = false,
      publishStatus = 'published',
      metaTitle,
      metaDescription,
      primaryKeyword,
      canonicalUrl,
      floorPlans = [],
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Strict 10 gallery image limit
    const gallery = Array.isArray(galleryImages) ? galleryImages : [];
    if (gallery.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 gallery images allowed per project. Please remove excess images.' },
        { status: 400 }
      );
    }

    const {
      isReraExempt = false,
      reraExemptionReason,
      reraApprovedBy,
      reraPhases = [],
      launchDate,
      expectedPossession,
      actualCompletion,
      constructionMilestones = [],
      totalFloors,
      availableUnits,
      areaMin,
      areaMax,
      areaUnit = 'sqft',
      nearbyFacilities = [],
      specifications = {},
      projectCode,
    } = body;

    // Strict RERA Validation for published projects
    if (publishStatus === 'published') {
      if (isReraExempt) {
        if (!reraExemptionReason || typeof reraExemptionReason !== 'string' || reraExemptionReason.trim().length < 8) {
          return NextResponse.json(
            { error: 'An approved RERA exemption reason (minimum 8 characters) is required when marking a project as RERA exempt.' },
            { status: 400 }
          );
        }
        if (!reraApprovedBy || typeof reraApprovedBy !== 'string' || !reraApprovedBy.trim()) {
          return NextResponse.json(
            { error: 'The name or designation of the approving authority/reviewer is required for RERA exemption.' },
            { status: 400 }
          );
        }
      } else {
        if (!reraNumber || typeof reraNumber !== 'string' || !reraNumber.trim()) {
          return NextResponse.json(
            { error: 'Valid RERA registration number is mandatory to publish a project. If legally exempt, an approved exemption reason and authority must be specified.' },
            { status: 400 }
          );
        }
      }
    }

    const effectiveCover = coverImage || (gallery.length > 0 ? gallery[0] : null);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE projects SET
          name = ?, slug = ?, projectCode = ?, builderName = ?, tagline = ?, description = ?,
          category = ?, status = ?, zone = ?, locationId = ?, locationName = ?,
          fullAddress = ?, pincode = ?, latitude = ?, longitude = ?,
          priceMin = ?, priceMax = ?, displayPrice = ?, landArea = ?,
          totalTowers = ?, totalFloors = ?, totalUnits = ?, availableUnits = ?,
          areaMin = ?, areaMax = ?, areaUnit = ?,
          configurations = ?, launchDate = ?, possessionDate = ?, expectedPossession = ?, actualCompletion = ?,
          reraNumber = ?, isReraExempt = ?, reraExemptionReason = ?, reraApprovedBy = ?, reraPhases = ?,
          amenities = ?, approvals = ?, nearbyFacilities = ?, specifications = ?, constructionMilestones = ?,
          coverImage = ?, galleryImages = ?, masterPlanImage = ?, sitePlanImage = ?, brochureUrl = ?,
          featured = ?, publishStatus = ?, metaTitle = ?, metaDescription = ?, primaryKeyword = ?, canonicalUrl = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          name.trim(),
          slug || null,
          projectCode || null,
          builderName.trim(),
          tagline || null,
          description || '',
          category,
          status,
          zone,
          locationId || null,
          locationName || null,
          fullAddress || null,
          pincode || null,
          latitude || null,
          longitude || null,
          priceMin || null,
          priceMax || null,
          displayPrice || null,
          landArea || null,
          Number(totalTowers) || 1,
          totalFloors ? Number(totalFloors) : null,
          totalUnits ? Number(totalUnits) : null,
          availableUnits ? Number(availableUnits) : null,
          areaMin || null,
          areaMax || null,
          areaUnit || 'sqft',
          configurations || null,
          launchDate || null,
          possessionDate || null,
          expectedPossession || null,
          actualCompletion || null,
          reraNumber ? reraNumber.trim() : null,
          isReraExempt ? 1 : 0,
          reraExemptionReason || null,
          reraApprovedBy || null,
          JSON.stringify(Array.isArray(reraPhases) ? reraPhases : []),
          JSON.stringify(Array.isArray(amenities) ? amenities : []),
          JSON.stringify(Array.isArray(approvals) ? approvals : []),
          JSON.stringify(Array.isArray(nearbyFacilities) ? nearbyFacilities : []),
          JSON.stringify(specifications || {}),
          JSON.stringify(Array.isArray(constructionMilestones) ? constructionMilestones : []),
          effectiveCover,
          JSON.stringify(gallery),
          masterPlanImage || null,
          sitePlanImage || null,
          brochureUrl || null,
          featured ? 1 : 0,
          publishStatus,
          metaTitle || null,
          metaDescription || null,
          primaryKeyword || null,
          canonicalUrl || null,
          id,
        ]
      );

      // Floor plans synchronization:
      // If floorPlans array was sent, replace existing plans
      if (Array.isArray(floorPlans)) {
        await conn.query('DELETE FROM project_floor_plans WHERE projectId = ?', [id]);
        for (let i = 0; i < floorPlans.length; i++) {
          const fp = floorPlans[i];
          if (fp.imageUrl) {
            await conn.query(
              `INSERT INTO project_floor_plans (
                projectId, towerBlockName, floorNumber, unitType,
                carpetArea, builtUpArea, areaUnit, imageUrl, documentUrl, description, displayOrder
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                fp.towerBlockName || null,
                fp.floorNumber || null,
                fp.unitType || null,
                fp.carpetArea || null,
                fp.builtUpArea || null,
                fp.areaUnit || 'sqft',
                fp.imageUrl,
                fp.documentUrl || null,
                fp.description || null,
                i,
              ]
            );
          }
        }
      }

      await conn.commit();
      return NextResponse.json({ id, ...body, galleryImages: gallery });
    } catch (txErr) {
      await conn.rollback();
      throw txErr;
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('[projects/[id]] Error updating project:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Protected: Admin delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('[projects/[id]] Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
