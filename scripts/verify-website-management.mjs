import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'veer-realestate-jwt-secret-key-2026';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runAcceptanceTests() {
  console.log('\n======================================================');
  console.log('VEER REAL ESTATE: WEBSITE MANAGEMENT CMS ACCEPTANCE SUITE');
  console.log('======================================================\n');

  // Test 1: Direct Database Check for website_content sections
  console.log('TEST 1: Direct Database Schema & Section Records Verification');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2,
    connectTimeout: 30000,
  });

  try {
    const [rows] = await pool.query('SELECT sectionKey FROM website_content');
    const existingKeys = rows.map((r) => r.sectionKey);

    const requiredKeys = [
      'homepage_hero',
      'homepage_about',
      'homepage_promise_stats',
      'homepage_brand_promise',
      'homepage_core_values',
      'homepage_why_choose_us',
      'homepage_section_visibility',
      'page_about_us',
      'page_contact_us',
      'page_builder_consultation',
      'header_config',
      'footer_config',
      'company_info',
      'website_settings',
    ];

    for (const rk of requiredKeys) {
      assert(existingKeys.includes(rk), `Required section key "${rk}" is present in DB.`);
    }

    // Test 2: Public API Endpoint /api/content
    console.log('\nTEST 2: Public API Endpoint /api/content');
    const allRes = await fetch(`${BASE_URL}/api/content`);
    assert(allRes.ok, `/api/content returned HTTP ${allRes.status}`);
    const allData = await allRes.json();
    assert(allData.homepage_hero !== undefined, 'Public /api/content includes homepage_hero.');
    assert(allData.homepage_about !== undefined, 'Public /api/content includes homepage_about.');
    assert(allData.homepage_promise_stats !== undefined, 'Public /api/content includes homepage_promise_stats.');
    assert(allData.homepage_brand_promise !== undefined, 'Public /api/content includes homepage_brand_promise.');
    assert(allData.homepage_core_values !== undefined, 'Public /api/content includes homepage_core_values.');
    assert(allData.homepage_section_visibility !== undefined, 'Public /api/content includes homepage_section_visibility.');

    // Test 3: Public API Endpoint by Key
    console.log('\nTEST 3: Public API Endpoint by Key (/api/content?key=...)');
    const aboutRes = await fetch(`${BASE_URL}/api/content?key=homepage_about`);
    assert(aboutRes.ok, `/api/content?key=homepage_about returned HTTP ${aboutRes.status}`);
    const aboutData = await aboutRes.json();
    assert(aboutData.contentData?.title !== undefined, 'homepage_about has valid title.');
    assert(Array.isArray(aboutData.contentData?.bullets), 'homepage_about has bullets array.');
    assert(aboutData.contentData?.bullets.length >= 4, `homepage_about has ${aboutData.contentData?.bullets.length} bullets.`);

    // Test 4: Security & Authentication Guard on /api/admin/content
    console.log('\nTEST 4: Security Guard on /api/admin/content (Unauthenticated Request)');
    const unauthRes = await fetch(`${BASE_URL}/api/admin/content`);
    assert(unauthRes.status === 401, `/api/admin/content properly blocks unauthenticated access with HTTP 401 (got ${unauthRes.status})`);

    // Test 5: Security & Authentication Guard on /api/admin/media
    console.log('\nTEST 5: Security Guard on /api/admin/media (Unauthenticated Request)');
    const unauthMedia = await fetch(`${BASE_URL}/api/admin/media`);
    assert(unauthMedia.status === 401, `/api/admin/media properly blocks unauthenticated access with HTTP 401 (got ${unauthMedia.status})`);

    // Test 6: Authenticated Admin Update
    console.log('\nTEST 6: Authenticated Admin Update via /api/admin/content/[key]');
    const [userRows] = await pool.query('SELECT id, email, role FROM register WHERE role = "admin" LIMIT 1');
    if (userRows.length > 0) {
      const adminUser = userRows[0];
      const token = jwt.sign(
        { id: adminUser.id, email: adminUser.email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Fetch current about data
      const currentAbout = aboutData.contentData;
      const testTagline = `More Than Property. We Build Trust. [Verified ${Date.now()}]`;
      const updatePayload = {
        ...currentAbout,
        tagline: testTagline,
      };

      const putRes = await fetch(`${BASE_URL}/api/admin/content/homepage_about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({
          title: 'HOMEPAGE ABOUT',
          contentData: updatePayload,
        }),
      });

      assert(putRes.ok, `PUT /api/admin/content/homepage_about succeeded with HTTP ${putRes.status}`);

      // Verify DB persistence
      const [updatedRows] = await pool.query('SELECT contentData FROM website_content WHERE sectionKey = "homepage_about"');
      const persisted = JSON.parse(updatedRows[0].contentData);
      assert(persisted.tagline === testTagline, 'Updated tagline was persisted in database.');

      // Revert to clean default tagline
      updatePayload.tagline = 'More Than Property. We Build Trust.';
      await fetch(`${BASE_URL}/api/admin/content/homepage_about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({
          title: 'HOMEPAGE ABOUT',
          contentData: updatePayload,
        }),
      });
      console.log('  ✓ Reverted test tagline to clean default.');

      // Test 7: Authenticated Media Library List
      console.log('\nTEST 7: Authenticated Media Library Access via /api/admin/media');
      const authMediaRes = await fetch(`${BASE_URL}/api/admin/media`, {
        headers: { Cookie: `token=${token}` },
      });
      assert(authMediaRes.ok, `/api/admin/media returned HTTP ${authMediaRes.status}`);
      const mediaList = await authMediaRes.json();
      assert(mediaList.success === true, 'Media library returns success: true.');
      assert(Array.isArray(mediaList.files), `Media library returned ${mediaList.files?.length || 0} media assets.`);
    } else {
      console.log('  ⚠️ Skipping authenticated tests: no admin user row in register table.');
    }

    // Test 8: Public Homepage Render Verification
    console.log('\nTEST 8: Public Homepage Render (/ route)');
    const homeRes = await fetch(`${BASE_URL}/`);
    assert(homeRes.ok, `Public homepage returned HTTP ${homeRes.status}`);
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes('Your Trusted Partner in'), 'Homepage contains Hero heading.');
    assert(homeHtml.includes('Trusted Real Estate'), 'Homepage contains About heading.');
    assert(homeHtml.includes('Our Promise'), 'Homepage contains Our Promise section.');
    assert(homeHtml.includes('BRAND PROMISE'), 'Homepage contains BRAND PROMISE section.');
    assert(homeHtml.includes('Core Values'), 'Homepage contains Core Values section.');

    // Test 9: Public About Us Page Render
    console.log('\nTEST 9: Public About Us Page Render (/about-us route)');
    const aboutPageRes = await fetch(`${BASE_URL}/about-us`);
    assert(aboutPageRes.ok, `Public /about-us returned HTTP ${aboutPageRes.status}`);
    const aboutHtml = await aboutPageRes.text();
    assert(aboutHtml.includes('About Veer Real Estate'), 'About page contains main heading.');

    // Test 10: Public Contact Page Render
    console.log('\nTEST 10: Public Contact Page Render (/contact route)');
    const contactPageRes = await fetch(`${BASE_URL}/contact`);
    assert(contactPageRes.ok, `Public /contact returned HTTP ${contactPageRes.status}`);
  } catch (err) {
    console.error('Test run failed with error:', err);
    failed++;
  } finally {
    await pool.end();
    console.log('\n======================================================');
    console.log(`TOTAL PASSED: ${passed}`);
    console.log(`TOTAL FAILED: ${failed}`);
    console.log(`SUCCESS RATE: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log('======================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runAcceptanceTests();
