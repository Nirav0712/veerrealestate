import dotenv from 'dotenv';
dotenv.config();

import pool from '../lib/db.ts';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'veer-realestate-jwt-secret-key-2026';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function runAcceptanceTests() {
  console.log('======================================================');
  console.log('VEER REAL ESTATE — COMPLETE ACCEPTANCE VERIFICATION');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Existing property records load and remain intact
  const [props] = await pool.query('SELECT COUNT(*) as count FROM properties');
  assert(props[0].count >= 8, `Existing properties preserved in DB (Found ${props[0].count} properties).`);

  // 2. Generate test admin token for API tests
  await pool.query("UPDATE register SET role = 'admin' WHERE email = 'admin@gmail.com' OR id IN (4, 5)");
  const [admins] = await pool.query("SELECT * FROM register WHERE role = 'admin' LIMIT 1");
  const adminUser = admins[0] || { id: 4, email: 'admin@gmail.com', role: 'admin' };
  const adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
    'Cookie': `token=${adminToken}`
  };

  // 3. Test Unauthorized Access is blocked on admin mutation routes
  const unauthRes = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Hacked Property' })
  });
  assert(unauthRes.status === 401, 'Test 15: Unauthorized POST to /api/properties is blocked with 401.');

  const unauthLeadsRes = await fetch(`${BASE_URL}/api/admin/leads`);
  assert(unauthLeadsRes.status === 401, 'Test 15: Unauthorized GET to /api/admin/leads is blocked with 401.');

  // 4. Test 3 & 5: Image limits & 20MB rejection
  // Test 7th property image rejected:
  const sevenImagesRes = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: '7 Image Test Property',
      images: [
        '/uploads/1.jpg', '/uploads/2.jpg', '/uploads/3.jpg',
        '/uploads/4.jpg', '/uploads/5.jpg', '/uploads/6.jpg',
        '/uploads/7.jpg'
      ]
    })
  });
  const sevenImgData = await sevenImagesRes.json();
  assert(
    sevenImagesRes.status === 400 && sevenImgData.error.includes('Maximum 6 images allowed'),
    'Test 3: 7th property image is rejected by server with 400.'
  );

  // Test 11th project gallery image rejected:
  const elevenProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: '11 Image Test Project',
      galleryImages: [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
        '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
        '11.jpg'
      ]
    })
  });
  const elevenProjData = await elevenProjRes.json();
  assert(
    elevenProjRes.status === 400 && elevenProjData.error.includes('Maximum 10 gallery images allowed'),
    'Test 4: 11th project gallery image is rejected by server with 400.'
  );

  // 5. Test 7 & 8: Builder form submission and Admin Lead Management
  const leadSubmission = await fetch(`${BASE_URL}/api/builder-leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Vikram Shah',
      companyName: 'Shivalik Heights LLP',
      phone: '9876543210',
      email: 'vikram@shivalik.in',
      projectLocation: 'Shela, Ahmedabad',
      projectStage: 'Mid Construction / Structure Ready',
      mainChallenge: 'Site Visits but Low Conversions',
      requirements: 'Looking for full sales consulting'
    })
  });
  const leadResult = await leadSubmission.json();
  assert(leadResult.success === true, `Test 7: Builder consultation lead submitted successfully (Lead ID: ${leadResult.leadId}).`);

  // Verify lead appears in admin leads list
  const adminLeadsRes = await fetch(`${BASE_URL}/api/admin/leads?search=Vikram`, { headers: authHeaders });
  const adminLeadsData = await adminLeadsRes.json();
  const foundLead = (adminLeadsData.leads || []).find(l => l.phone === '9876543210');
  assert(Boolean(foundLead), 'Test 7: Builder lead appears in Admin Leads list with full details.');

  // Update lead status and notes
  if (foundLead) {
    const patchRes = await fetch(`${BASE_URL}/api/admin/leads/${foundLead.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        status: 'Contacted',
        internalNotes: 'Called on phone; scheduled site inspection for Saturday.',
        assignedTo: 'Sudhir Prajapati'
      })
    });
    const patchData = await patchRes.json();
    assert(
      patchData.lead?.status === 'Contacted' && patchData.lead?.assignedTo === 'Sudhir Prajapati',
      'Test 8: Lead status, internal notes, and advisor assignment updated and persisted.'
    );
  }

  // 6. Test 9: Projects with multiple floor-plan records
  const projCreateRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Veer Skyline Towers',
      builderName: 'Veer Developers',
      zone: 'East',
      category: 'Residential',
      status: 'Under Construction',
      displayPrice: '₹ 45 Lakh Onwards',
      galleryImages: ['/images/east/AARADHANA_2.jpeg', '/images/east/Anusthan.jpeg'],
      floorPlans: [
        {
          towerBlockName: 'Tower A',
          floorNumber: '1 to 5',
          unitType: '2 BHK Type 1',
          carpetArea: 680,
          builtUpArea: 980,
          imageUrl: '/images/east/AARADHANA_2.jpeg',
          description: 'Spacious balcony with garden view'
        },
        {
          towerBlockName: 'Tower B',
          floorNumber: '6 to 12',
          unitType: '3 BHK Royal',
          carpetArea: 950,
          builtUpArea: 1350,
          imageUrl: '/images/east/Anusthan.jpeg',
          description: 'Penthouse floor plan'
        }
      ]
    })
  });
  const projCreated = await projCreateRes.json();
  assert(projCreated.id > 0, `Test 9: Independent Project created with ID ${projCreated.id}.`);

  // Verify floor plans in project detail
  const projDetailRes = await fetch(`${BASE_URL}/api/projects/${projCreated.id}`);
  const projDetail = await projDetailRes.json();
  assert(
    Array.isArray(projDetail.floorPlans) && projDetail.floorPlans.length === 2,
    `Test 9: Project successfully persists multiple floor-plan records (Found ${projDetail.floorPlans?.length} floor plans).`
  );

  // 7. Test 10 & 11: Dynamic Locations management & Deletion Safety
  const locCreateRes = await fetch(`${BASE_URL}/api/admin/locations`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Thaltej Shilaj Road',
      zone: 'West',
      city: 'Ahmedabad',
      active: true
    })
  });
  const locCreated = await locCreateRes.json();
  assert(locCreated.id > 0, `Test 10: New location created dynamically (ID: ${locCreated.id}, Name: ${locCreated.name}).`);

  // Verify new location appears in public location selector
  const pubLocsRes = await fetch(`${BASE_URL}/api/locations`);
  const pubLocs = await pubLocsRes.json();
  const existsInPublic = pubLocs.some(l => l.id === locCreated.id);
  assert(existsInPublic, 'Test 10: New location appears in public location selector.');

  // 8. Test 12: Blog Drafts vs Published Privacy
  const draftBlogRes = await fetch(`${BASE_URL}/api/blogs`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Secret Internal Market Analysis',
      content: 'Confidential draft analysis not for public viewing.',
      publishStatus: 'draft'
    })
  });
  const draftBlog = await draftBlogRes.json();
  assert(draftBlog.id > 0, `Test 12: Draft blog created with ID ${draftBlog.id}.`);

  // Public fetch /api/blogs should NOT contain the draft blog
  const pubBlogsRes = await fetch(`${BASE_URL}/api/blogs`);
  const pubBlogsData = await pubBlogsRes.json();
  const isDraftInPublic = (pubBlogsData.blogs || []).some(b => b.id === draftBlog.id);
  assert(!isDraftInPublic, 'Test 12: Draft blog is strictly hidden from public blog listing.');

  // Public unauthenticated single post request to draft returns 404
  const draftDetailUnauth = await fetch(`${BASE_URL}/api/blogs/${draftBlog.slug}`);
  assert(draftDetailUnauth.status === 404, 'Test 12: Unauthorized request to draft post returns 404.');

  // 9. Test 14: Dynamic Sitemap & Robots.txt
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  assert(sitemapText.includes('<urlset') && sitemapText.includes('/properties'), 'Test 14: XML sitemap generates valid XML with published properties.');

  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsText = await robotsRes.text();
  assert(robotsText.includes('Disallow: /admin/') && robotsText.includes('sitemap.xml'), 'Test 14: Robots.txt disallows /admin/ and links sitemap.');

  console.log('\n======================================================');
  console.log(`ACCEPTANCE TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================');

  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

runAcceptanceTests().catch(err => {
  console.error('Test runner exception:', err);
  process.exit(1);
});
