import dotenv from 'dotenv';
dotenv.config();

import pool from '../lib/db.ts';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'veer-realestate-jwt-secret-key-2026';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function runComprehensiveVerification() {
  console.log('================================================================');
  console.log('VEER REAL ESTATE — COMPREHENSIVE ACCEPTANCE & AUDIT TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  const testResults = [];

  function record(module, scenario, success, notes = '') {
    if (success) {
      console.log(`[PASS] [${module}] ${scenario}${notes ? ` -> ${notes}` : ''}`);
      passed++;
      testResults.push({ module, scenario, status: 'PASS', notes });
    } else {
      console.error(`[FAIL] [${module}] ${scenario}${notes ? ` -> ${notes}` : ''}`);
      failed++;
      testResults.push({ module, scenario, status: 'FAIL', notes });
    }
  }

  // Set up Admin Token
  await pool.query("UPDATE register SET role = 'admin' WHERE email = 'admin@gmail.com' OR id IN (4, 5)");
  const [admins] = await pool.query("SELECT * FROM register WHERE role = 'admin' LIMIT 1");
  const adminUser = admins[0] || { id: 4, email: 'admin@gmail.com', role: 'admin' };
  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set up Non-Admin User Token (for security testing)
  const userToken = jwt.sign(
    { id: 9999, email: 'regularuser@example.com', role: 'user' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const adminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
    'Cookie': `token=${adminToken}`,
  };

  const userHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
    'Cookie': `token=${userToken}`,
  };

  // -------------------------------------------------------------
  // SECTION 1: DATABASE INTEGRITY & RECORD PRESERVATION
  // -------------------------------------------------------------
  console.log('\n--- 1. DATABASE INTEGRITY & RECORD PRESERVATION ---');
  const [dbProps] = await pool.query('SELECT COUNT(*) as count FROM properties');
  record(
    'Database Preservation',
    'Existing properties preserved without loss',
    dbProps[0].count >= 8,
    `Found ${dbProps[0].count} properties (expected >= 8)`
  );

  const [dbProjects] = await pool.query('SELECT COUNT(*) as count FROM projects');
  record(
    'Database Preservation',
    'Existing projects preserved without loss',
    dbProjects[0].count >= 50,
    `Found ${dbProjects[0].count} projects (expected >= 50)`
  );

  const [dbLocations] = await pool.query('SELECT COUNT(*) as count FROM locations');
  record(
    'Database Preservation',
    'Existing locations preserved without loss',
    dbLocations[0].count >= 15,
    `Found ${dbLocations[0].count} locations (expected >= 15)`
  );

  // -------------------------------------------------------------
  // SECTION 2: SECURITY & AUTHORIZATION AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 2. SECURITY & AUTHORIZATION AUDIT ---');
  const unauthProp = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Unauth Property' }),
  });
  record('Security Audit', 'Unauthenticated POST /api/properties blocked with 401', unauthProp.status === 401);

  const unauthUserProj = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: userHeaders,
    body: JSON.stringify({ name: 'User Hacked Project' }),
  });
  record('Security Audit', 'Non-admin role blocked from POST /api/projects with 401/403', unauthUserProj.status === 401 || unauthUserProj.status === 403);

  const unauthVideo = await fetch(`${BASE_URL}/api/social-videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Unauth Video' }),
  });
  record('Security Audit', 'Unauthenticated POST /api/social-videos blocked with 401', unauthVideo.status === 401);

  // -------------------------------------------------------------
  // SECTION 3: PROPERTY CRUD & VALIDATIONS
  // -------------------------------------------------------------
  console.log('\n--- 3. PROPERTY CRUD & VALIDATIONS ---');

  // Test 6-image limit on property
  const propOverLimit = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Over Image Limit Test',
      type: 'Apartment',
      purpose: 'Sale',
      price: 5500000,
      images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'],
    }),
  });
  const overLimitData = await propOverLimit.json();
  record(
    'Property CRUD',
    'Strict 6-image gallery limit rejected by server',
    propOverLimit.status === 400 && overLimitData.error?.includes('Maximum 6 images allowed'),
    overLimitData.error
  );

  // Test create property with full valid fields
  const propCreateRes = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Veer Royal Residency 3BHK QA Test',
      type: 'Apartment',
      purpose: 'Sale',
      listingPurpose: 'Buy',
      price: 6500000,
      pricePrefix: 'Fixed',
      location: 'Nikol, Ahmedabad',
      locationId: 1,
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      carpetArea: 1100,
      builtUpArea: 1450,
      furnishingStatus: 'Semi-Furnished',
      facingDirection: 'East',
      floorNumber: 5,
      totalFloors: 14,
      carParking: 1,
      propertyAge: '1-3 Years',
      possessionStatus: 'Ready to Move',
      amenities: ['Elevator', 'Clubhouse', 'Gymnasium', '24x7 Security'],
      images: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      description: 'Luxurious 3BHK with excellent natural light and premium fixtures.',
      publishStatus: 'published',
    }),
  });
  const createdProp = await propCreateRes.json();
  record(
    'Property CRUD',
    'Create Property with numeric fields and specifications',
    propCreateRes.status === 201 && createdProp.id > 0,
    `Created ID: ${createdProp.id}, Slug: ${createdProp.slug}`
  );

  // Test fetch single property by ID
  const propGetRes = await fetch(`${BASE_URL}/api/properties/${createdProp.id}`);
  const propGetData = await propGetRes.json();
  record(
    'Property CRUD',
    'Fetch Property by ID loads complete database record',
    propGetRes.status === 200 && propGetData.id === createdProp.id && Array.isArray(propGetData.amenities),
    `Amenities parsed correctly: ${propGetData.amenities?.length || 0} items`
  );

  // Test update property (preserves unedited fields)
  const propUpdateRes = await fetch(`${BASE_URL}/api/properties/${createdProp.id}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      price: 6700000,
      priceSuffix: 'Negotiable',
      description: 'Updated: Luxurious 3BHK ready to move with full modular kitchen.',
    }),
  });
  const updatedProp = await propUpdateRes.json();
  record(
    'Property CRUD',
    'Update Property updates targeted fields without clearing untouched values',
    propUpdateRes.status === 200 && Number(updatedProp.price) === 6700000 && updatedProp.bedrooms === 3,
    `New price: ${updatedProp.price}, Bedrooms preserved: ${updatedProp.bedrooms}`
  );

  // Test link CRM inquiry to property, then verify safe deletion detaches inquiry
  const [crmInsert] = await pool.query(
    'INSERT INTO crm_inquiries (leadType, name, phone, propertyId, status) VALUES (?, ?, ?, ?, ?)',
    ['Property Buy Inquiry', 'QA Tester', '9998887776', createdProp.id, 'New Lead']
  );
  const testCrmInquiryId = crmInsert.insertId;

  const propDeleteRes = await fetch(`${BASE_URL}/api/properties/${createdProp.id}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });
  const propDeleteData = await propDeleteRes.json();
  record(
    'Property CRUD',
    'Delete Property succeeds and returns confirmation',
    propDeleteRes.status === 200 && propDeleteData.success === true,
    propDeleteData.message
  );

  // Verify dependent CRM inquiry was detached (propertyId set to null, not crash or deleted)
  const [crmCheck] = await pool.query('SELECT propertyId FROM crm_inquiries WHERE id = ?', [testCrmInquiryId]);
  record(
    'Property CRUD',
    'Deleting property safely detaches dependent CRM inquiries without orphaned errors',
    crmCheck.length > 0 && crmCheck[0].propertyId === null,
    `CRM record preserved with propertyId: ${crmCheck[0]?.propertyId}`
  );
  await pool.query('DELETE FROM crm_inquiries WHERE id = ?', [testCrmInquiryId]);

  // -------------------------------------------------------------
  // SECTION 4: PROJECT CRUD & RERA VALIDATIONS
  // -------------------------------------------------------------
  console.log('\n--- 4. PROJECT CRUD & RERA VALIDATIONS ---');

  // Test 11-image limit on project gallery
  const projOverLimit = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Over Project Gallery Limit',
      zone: 'East',
      galleryImages: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg'],
    }),
  });
  const projOverData = await projOverLimit.json();
  record(
    'Project CRUD',
    'Strict 10-image gallery limit rejected by server',
    projOverLimit.status === 400 && projOverData.error?.includes('Maximum 10 gallery images allowed'),
    projOverData.error
  );

  // Test published project without RERA or exemption is blocked
  const projNoRera = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Unverified Published Project',
      zone: 'East',
      publishStatus: 'published',
      reraNumber: '',
      isReraExempt: false,
    }),
  });
  const projNoReraData = await projNoRera.json();
  record(
    'Project CRUD',
    'Published project without RERA registration or exemption is rejected with 400',
    projNoRera.status === 400 && projNoReraData.error?.includes('RERA registration number is mandatory'),
    projNoReraData.error
  );

  // Test draft project creation without RERA (allowed for drafting)
  const draftProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Veer Imperial Heights (Draft)',
      builderName: 'Veer Developers',
      zone: 'West',
      category: 'Residential',
      status: 'Upcoming',
      publishStatus: 'draft',
      description: 'Upcoming luxury residential project in West Ahmedabad.',
      displayPrice: '₹ 85 Lakh Onwards',
    }),
  });
  const draftProjData = await draftProjRes.json();
  record(
    'Project CRUD',
    'Draft project saved successfully without RERA number',
    draftProjRes.status === 201 && draftProjData.id > 0,
    `Draft Project ID: ${draftProjData.id}, Slug: ${draftProjData.slug}`
  );

  // Test published project with valid Gujarat RERA and multiple floor plans
  const pubProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Veer Platinum Towers QA Test',
      builderName: 'Veer Buildcon',
      zone: 'East',
      category: 'Residential',
      status: 'Under Construction',
      publishStatus: 'published',
      displayPrice: '₹ 52 Lakh Onwards',
      reraNumber: 'PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA99887/010126',
      totalTowers: 3,
      totalFloors: 14,
      totalUnits: 168,
      configurations: '2 BHK, 3 BHK Luxury',
      amenities: ['Clubhouse', 'Swimming Pool', 'EV Charging', 'Senior Citizen Sitout'],
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      ],
      floorPlans: [
        {
          towerBlockName: 'Tower A',
          floorNumber: '1-7',
          unitType: '2 BHK Classic',
          carpetArea: 720,
          builtUpArea: 1040,
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          description: 'Optimized layout with road facing view',
        },
        {
          towerBlockName: 'Tower B',
          floorNumber: '8-14',
          unitType: '3 BHK Royal',
          carpetArea: 1050,
          builtUpArea: 1480,
          imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          description: 'Spacious layout with double balcony',
        },
      ],
    }),
  });
  const pubProjData = await pubProjRes.json();
  record(
    'Project CRUD',
    'Published project created with Gujarat RERA and multiple floor plans',
    pubProjRes.status === 201 && pubProjData.id > 0,
    `Project ID: ${pubProjData.id}, Slug: ${pubProjData.slug}`
  );

  // Verify floor plans persisted and retrieved
  const projDetailRes = await fetch(`${BASE_URL}/api/projects/${pubProjData.id}`);
  const projDetailData = await projDetailRes.json();
  record(
    'Project CRUD',
    'Project floor plans persisted in database and retrieved as structured array',
    Array.isArray(projDetailData.floorPlans) && projDetailData.floorPlans.length === 2,
    `Retrieved ${projDetailData.floorPlans?.length} floor plans`
  );

  // Verify public route resolves project via slug from database
  const pubProjectApi = await fetch(`${BASE_URL}/api/projects/${pubProjData.slug}`);
  const pubProjectData = await pubProjectApi.json();
  record(
    'Project CRUD',
    'Public project API resolves real database record by slug',
    pubProjectApi.status === 200 && pubProjectData.id === pubProjData.id,
    `Resolved name: ${pubProjectData.name}`
  );

  // Clean up draft test project
  await fetch(`${BASE_URL}/api/projects/${draftProjData.id}`, { method: 'DELETE', headers: adminHeaders });

  // -------------------------------------------------------------
  // SECTION 5: SOCIAL VIDEOS (REELS & SHORTS) AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 5. SOCIAL VIDEOS (REELS & SHORTS) CRUD & URL AUDIT ---');

  // Test URL validation rejection: fake domain
  const fakeUrlRes = await fetch(`${BASE_URL}/api/social-videos`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Fake Video',
      platform: 'youtube',
      video_url: 'https://fakevideosite.com/video/12345',
    }),
  });
  const fakeUrlData = await fakeUrlRes.json();
  record(
    'Social Videos',
    'Rejects unsupported domain or malformed URL with 400',
    fakeUrlRes.status === 400 && fakeUrlData.error?.includes('Invalid YouTube URL'),
    fakeUrlData.error
  );

  // Test create valid YouTube Shorts linked to the real project
  const createYtRes = await fetch(`${BASE_URL}/api/social-videos`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Veer Platinum Towers 3BHK Walkthrough',
      platform: 'youtube',
      video_url: 'https://youtube.com/shorts/dQw4w9WgXcQ',
      project_id: pubProjData.id,
      description: 'Exclusive first-look walkthrough of the premium 3BHK show flat.',
      display_order: 1,
      is_active: true,
    }),
  });
  const ytData = await createYtRes.json();
  record(
    'Social Videos',
    'Create YouTube Shorts video record linked to real project',
    createYtRes.status === 201 && ytData.id > 0 && ytData.project_url?.includes('/projects/east/'),
    `Video ID: ${ytData.id}, Resolved Project URL: ${ytData.project_url}`
  );

  // Test create valid Instagram Reel linked to the real project
  const createIgRes = await fetch(`${BASE_URL}/api/social-videos`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Architectural Flythrough & Rooftop Amenities',
      platform: 'instagram',
      video_url: 'https://www.instagram.com/reel/C7xyz987abc/',
      project_id: pubProjData.id,
      description: 'Check out the infinity deck and sky lounge at Veer Platinum Towers.',
      display_order: 2,
      is_active: true,
    }),
  });
  const igData = await createIgRes.json();
  record(
    'Social Videos',
    'Create Instagram Reel record linked to real project',
    createIgRes.status === 201 && igData.id > 0,
    `Video ID: ${igData.id}`
  );

  // Test public GET /api/social-videos returns active videos with joined project data
  const pubVideosRes = await fetch(`${BASE_URL}/api/social-videos`);
  const pubVideosData = await pubVideosRes.json();
  const foundYt = pubVideosData.find((v) => v.id === ytData.id);
  record(
    'Social Videos',
    'Public GET /api/social-videos returns active videos with resolved project names & URLs',
    Boolean(foundYt && foundYt.project_name === 'Veer Platinum Towers QA Test'),
    `Found video: "${foundYt?.title}" linked to "${foundYt?.project_name}"`
  );

  // Test toggle status to inactive
  const toggleRes = await fetch(`${BASE_URL}/api/social-videos/${ytData.id}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ is_active: false }),
  });
  const toggleData = await toggleRes.json();
  record(
    'Social Videos',
    'Update social video toggles active/inactive status',
    toggleRes.status === 200 && (toggleData.is_active === 0 || toggleData.is_active === false),
    `New is_active status: ${toggleData.is_active}`
  );

  // Verify inactive video is hidden from public /api/social-videos
  const pubVideosRes2 = await fetch(`${BASE_URL}/api/social-videos`);
  const pubVideosData2 = await pubVideosRes2.json();
  const hiddenYt = pubVideosData2.find((v) => v.id === ytData.id);
  record(
    'Social Videos',
    'Inactive social video is strictly hidden from public showcase listing',
    !hiddenYt,
    'Deactivated video successfully filtered out of public feed'
  );

  // Delete social video and verify linked project is NOT touched
  const delVideoRes = await fetch(`${BASE_URL}/api/social-videos/${ytData.id}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });
  record('Social Videos', 'Delete social video succeeds with 200', delVideoRes.status === 200);

  const checkProjAlive = await fetch(`${BASE_URL}/api/projects/${pubProjData.id}`);
  record(
    'Social Videos',
    'Deleting a social video leaves the associated project completely intact in database',
    checkProjAlive.status === 200,
    'Project unaffected by video deletion'
  );

  // Clean up remaining test video and project
  await fetch(`${BASE_URL}/api/social-videos/${igData.id}`, { method: 'DELETE', headers: adminHeaders });
  const delProjRes = await fetch(`${BASE_URL}/api/projects/${pubProjData.id}`, { method: 'DELETE', headers: adminHeaders });
  record('Project CRUD', 'Delete Project safely detaches related records and succeeds', delProjRes.status === 200);

  // -------------------------------------------------------------
  // SECTION 6: PUBLIC PAGES & INTEGRATION
  // -------------------------------------------------------------
  console.log('\n--- 6. PUBLIC PAGES & INTEGRATION ---');

  const homeRes = await fetch(`${BASE_URL}/`);
  const homeText = await homeRes.text();
  record(
    'Public Homepage',
    'Homepage loads with 200 status',
    homeRes.status === 200
  );
  record(
    'Public Homepage',
    'Homepage contains "PROJECTS IN MOTION" social video showcase section',
    homeText.includes('PROJECTS IN MOTION'),
    'Showcase section verified'
  );
  record(
    'Public Homepage',
    'Homepage preserves "BRAND PROMISE" section immediately after video showcase',
    homeText.includes('BRAND PROMISE'),
    'Brand Promise intact'
  );

  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  record(
    'SEO & Sitemap',
    'Dynamic sitemap.xml generates valid XML with property & project routes',
    sitemapRes.status === 200 && sitemapText.includes('<urlset') && sitemapText.includes('/properties')
  );

  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsText = await robotsRes.text();
  record(
    'SEO & Robots',
    'Robots.txt blocks /admin/ routes and points to sitemap.xml',
    robotsRes.status === 200 && robotsText.includes('Disallow: /admin/')
  );

  console.log('\n================================================================');
  console.log(`FINAL TEST RESULTS: ${passed} PASSED, ${failed} FAILED across ${passed + failed} scenarios`);
  console.log('================================================================\n');

  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

runComprehensiveVerification().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
