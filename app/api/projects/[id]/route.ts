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
      reraPhases: parseJsonArray(project.reraPhases),
      nearbyFacilities: parseJsonArray(project.nearbyFacilities),
      constructionMilestones: parseJsonArray(project.constructionMilestones),
      specifications: typeof project.specifications === 'string'
        ? (() => { try { return JSON.parse(project.specifications); } catch { return {}; } })()
        : (project.specifications || {}),
      featured: Boolean(project.featured),
      isReraExempt: Boolean(project.isReraExempt),
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

    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects WHERE id = ? LIMIT 1',
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const current = existingRows[0];

    const cleanName = (body.name !== undefined ? body.name : (current.name || '')).trim();
    if (!cleanName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const cleanBuilder = (body.builderName !== undefined ? body.builderName : (current.builderName || 'Veer Real Estate')).trim();

    // Preserve gallery images unless explicitly provided
    const currentGallery = parseJsonArray(current.galleryImages);
    const gallery = body.galleryImages !== undefined
      ? (Array.isArray(body.galleryImages) ? body.galleryImages : (typeof body.galleryImages === 'string' && body.galleryImages.trim() ? [body.galleryImages.trim()] : []))
      : (currentGallery.length > 0 ? currentGallery : (current.coverImage ? [current.coverImage] : []));

    if (gallery.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 gallery images allowed per project. Please remove excess images.' },
        { status: 400 }
      );
    }

    const {
      slug = current.slug,
      projectCode = current.projectCode,
      tagline = current.tagline,
      description = current.description !== undefined ? current.description : '',
      category = current.category || 'Residential',
      status = current.status || 'Under Construction',
      zone = current.zone || 'East',
      locationId = current.locationId,
      locationName = current.locationName,
      fullAddress = current.fullAddress,
      pincode = current.pincode,
      latitude = current.latitude,
      longitude = current.longitude,
      priceMin = current.priceMin,
      priceMax = current.priceMax,
      displayPrice = current.displayPrice,
      landArea = current.landArea,
      totalTowers = current.totalTowers || 1,
      totalFloors = current.totalFloors,
      totalUnits = current.totalUnits,
      availableUnits = current.availableUnits,
      areaMin = current.areaMin,
      areaMax = current.areaMax,
      areaUnit = current.areaUnit || 'sqft',
      configurations = current.configurations,
      launchDate = current.launchDate,
      expectedPossession = current.expectedPossession,
      actualCompletion = current.actualCompletion,
      possessionDate = current.possessionDate,
      reraNumber = current.reraNumber,
      isReraExempt = current.isReraExempt,
      reraExemptionReason = current.reraExemptionReason,
      reraApprovedBy = current.reraApprovedBy,
      reraPhases = body.reraPhases !== undefined ? body.reraPhases : parseJsonArray(current.reraPhases),
      amenities = body.amenities !== undefined ? body.amenities : parseJsonArray(current.amenities),
      approvals = body.approvals !== undefined ? body.approvals : parseJsonArray(current.approvals),
      nearbyFacilities = body.nearbyFacilities !== undefined ? body.nearbyFacilities : parseJsonArray(current.nearbyFacilities),
      specifications = body.specifications !== undefined ? body.specifications : (typeof current.specifications === 'string' ? (() => { try { return JSON.parse(current.specifications); } catch { return {}; } })() : (current.specifications || {})),
      constructionMilestones = body.constructionMilestones !== undefined ? body.constructionMilestones : parseJsonArray(current.constructionMilestones),
      coverImage = current.coverImage,
      masterPlanImage = current.masterPlanImage,
      sitePlanImage = current.sitePlanImage,
      brochureUrl = current.brochureUrl,
      featured = current.featured,
      publishStatus = current.publishStatus || 'published',
      metaTitle = current.metaTitle,
      metaDescription = current.metaDescription,
      primaryKeyword = current.primaryKeyword,
      canonicalUrl = current.canonicalUrl,
      floorPlans,
    } = body;

    const effectivePublishStatus = publishStatus || 'published';

    // Strict RERA Validation for published projects
    if (effectivePublishStatus === 'published') {
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

    const parsedReraPhases = Array.isArray(reraPhases) ? reraPhases : (typeof reraPhases === 'string' && reraPhases.trim() ? [reraPhases.trim()] : []);
    const parsedNearbyFacilities = Array.isArray(nearbyFacilities) ? nearbyFacilities : (typeof nearbyFacilities === 'string' && nearbyFacilities.trim() ? [nearbyFacilities.trim()] : []);
    const parsedConstructionMilestones = Array.isArray(constructionMilestones) ? constructionMilestones : (typeof constructionMilestones === 'string' && constructionMilestones.trim() ? [constructionMilestones.trim()] : []);
    const parsedSpecifications = typeof specifications === 'object' && specifications !== null
      ? specifications
      : (() => { try { return JSON.parse(specifications); } catch { return {}; } })();

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
          cleanName,
          slug || null,
          projectCode || null,
          cleanBuilder,
          tagline || null,
          description || '',
          category,
          status,
          zone,
          locationId ? Number(locationId) : null,
          locationName || null,
          fullAddress || null,
          pincode || null,
          latitude ? Number(latitude) : null,
          longitude ? Number(longitude) : null,
          priceMin ? Number(priceMin) : null,
          priceMax ? Number(priceMax) : null,
          displayPrice || null,
          landArea || null,
          Number(totalTowers) || 1,
          totalFloors !== '' && totalFloors !== null && totalFloors !== undefined ? Number(totalFloors) : null,
          totalUnits !== '' && totalUnits !== null && totalUnits !== undefined ? Number(totalUnits) : null,
          availableUnits !== '' && availableUnits !== null && availableUnits !== undefined ? Number(availableUnits) : null,
          areaMin ? Number(areaMin) : null,
          areaMax ? Number(areaMax) : null,
          areaUnit || 'sqft',
          configurations || null,
          launchDate && String(launchDate).trim() ? String(launchDate).trim() : null,
          possessionDate || null,
          expectedPossession || null,
          actualCompletion && String(actualCompletion).trim() ? String(actualCompletion).trim() : null,
          reraNumber ? String(reraNumber).trim() : null,
          isReraExempt ? 1 : 0,
          reraExemptionReason || null,
          reraApprovedBy || null,
          JSON.stringify(parsedReraPhases),
          JSON.stringify(Array.isArray(amenities) ? amenities : []),
          JSON.stringify(Array.isArray(approvals) ? approvals : []),
          JSON.stringify(parsedNearbyFacilities),
          JSON.stringify(parsedSpecifications),
          JSON.stringify(parsedConstructionMilestones),
          effectiveCover,
          JSON.stringify(gallery),
          masterPlanImage || null,
          sitePlanImage || null,
          brochureUrl || null,
          featured ? 1 : 0,
          effectivePublishStatus,
          metaTitle || null,
          metaDescription || null,
          primaryKeyword || null,
          canonicalUrl || null,
          id,
        ]
      );

      // Floor plans synchronization:
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
                fp.carpetArea ? Number(fp.carpetArea) : null,
                fp.builtUpArea ? Number(fp.builtUpArea) : null,
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
      const [updatedProjRows] = await pool.query<RowDataPacket[]>('SELECT * FROM projects WHERE id = ?', [id]);
      const updatedProj = updatedProjRows[0] || { id, ...current, ...body, galleryImages: gallery };
      return NextResponse.json(updatedProj);
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

    // Verify project exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, name FROM projects WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Safely detach CRM inquiries referencing this project
      await conn.query(
        "UPDATE crm_inquiries SET projectId = NULL, projectName = CONCAT(IFNULL(projectName, 'Deleted Project'), ' (Archived)') WHERE projectId = ?",
        [id]
      );

      // Safely detach social videos referencing this project
      await conn.query(
        'UPDATE social_videos SET project_id = NULL WHERE project_id = ?',
        [id]
      );

      // Delete dependent floor plans
      await conn.query('DELETE FROM project_floor_plans WHERE projectId = ?', [id]);

      // Delete the project
      await conn.query('DELETE FROM projects WHERE id = ?', [id]);

      await conn.commit();
      return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (txErr) {
      await conn.rollback();
      throw txErr;
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('[projects/[id]] Error deleting project:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete project' }, { status: 500 });
  }
}
