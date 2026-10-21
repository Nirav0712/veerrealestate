export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { requireAdmin, getAuthenticatedAdmin } from '@/lib/auth';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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

// GET /api/projects - Public project listing with filters
export async function GET(req: NextRequest) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);

    const zone = searchParams.get('zone');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const locationId = searchParams.get('locationId');
    const search = searchParams.get('search')?.trim();
    const featured = searchParams.get('featured');
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    let allowDrafts = false;
    if (includeDrafts) {
      const admin = await getAuthenticatedAdmin(req);
      if (admin) allowDrafts = true;
    }

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (!allowDrafts) {
      whereClauses.push("(publishStatus = 'published' OR publishStatus IS NULL)");
    }

    if (zone && zone !== 'all') {
      whereClauses.push('zone = ?');
      params.push(zone);
    }

    if (category && category !== 'all') {
      whereClauses.push('category = ?');
      params.push(category);
    }

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (locationId) {
      whereClauses.push('locationId = ?');
      params.push(locationId);
    }

    if (featured === 'true' || featured === '1') {
      whereClauses.push('featured = 1');
    }

    if (search) {
      whereClauses.push(
        '(name LIKE ? OR builderName LIKE ? OR locationName LIKE ? OR fullAddress LIKE ?)'
      );
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `SELECT * FROM projects ${whereSql} ORDER BY featured DESC, created_at DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);

    const projects = rows.map((p) => {
      const gallery = parseJsonArray(p.galleryImages);
      return {
        ...p,
        galleryImages: gallery.length > 0 ? gallery : (p.coverImage ? [p.coverImage] : []),
        amenities: parseJsonArray(p.amenities),
        approvals: parseJsonArray(p.approvals),
        featured: Boolean(p.featured),
      };
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('[projects] Error listing projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Protected: Admin create project & floor plans
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    await ensureSchema();
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
      floorPlans = [], // array of floor plans
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // 1. Enforce strict 10 gallery image limit
    const gallery = Array.isArray(galleryImages) ? galleryImages : [];
    if (gallery.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 gallery images allowed per project. Please remove excess images.' },
        { status: 400 }
      );
    }

    // 2. Strict RERA Validation for published projects
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

    // 3. Clean unique slug
    let cleanSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const effectiveCover = coverImage || (gallery.length > 0 ? gallery[0] : null);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [res] = await conn.query<ResultSetHeader>(
        `INSERT INTO projects (
          name, slug, projectCode, builderName, tagline, description, category, status, zone,
          locationId, locationName, fullAddress, pincode, latitude, longitude,
          priceMin, priceMax, displayPrice, landArea, totalTowers, totalFloors, totalUnits, availableUnits,
          areaMin, areaMax, areaUnit,
          configurations, launchDate, possessionDate, expectedPossession, actualCompletion,
          reraNumber, isReraExempt, reraExemptionReason, reraApprovedBy, reraPhases,
          amenities, approvals, nearbyFacilities, specifications, constructionMilestones,
          coverImage, galleryImages, masterPlanImage, sitePlanImage, brochureUrl,
          featured, publishStatus, metaTitle, metaDescription, primaryKeyword, canonicalUrl
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )`,
        [
          name.trim(),
          cleanSlug,
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
          metaTitle || `${name.trim()} by ${builderName} in ${locationName || zone} | Veer Real Estate`,
          metaDescription || description.substring(0, 160) || null,
          primaryKeyword || `${name.trim()}, projects in ${locationName || zone}`,
          canonicalUrl || null,
        ]
      );

      const projectId = res.insertId;

      // Auto-assign project code if not provided: VPR-0001
      if (!projectCode) {
        await conn.query('UPDATE projects SET projectCode = ? WHERE id = ?', [
          `VPR-${String(projectId).padStart(4, '0')}`,
          projectId,
        ]);
      }

      // 3. Insert floor plans if provided
      if (Array.isArray(floorPlans) && floorPlans.length > 0) {
        for (let i = 0; i < floorPlans.length; i++) {
          const fp = floorPlans[i];
          if (fp.imageUrl) {
            await conn.query(
              `INSERT INTO project_floor_plans (
                projectId, towerBlockName, floorNumber, unitType,
                carpetArea, builtUpArea, areaUnit, imageUrl, documentUrl, description, displayOrder
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                projectId,
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

      return NextResponse.json(
        {
          id: projectId,
          name: name.trim(),
          slug: cleanSlug,
          galleryImages: gallery,
          ...body,
        },
        { status: 201 }
      );
    } catch (txError) {
      await conn.rollback();
      throw txError;
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('[projects] Error creating project:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create project' }, { status: 500 });
  }
}
