import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'veer-realestate-jwt-secret-key-2026';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING ACCEPTANCE TESTS FOR BRANCHES, FOOTER, CRM');
  console.log('====================================================\n');

  // 1. Generate Admin JWT for testing protected endpoints (User ID 4 is admin@gmail.com)
  const adminToken = jwt.sign(
    { id: 4, email: 'admin@gmail.com', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // ----------------------------------------------------
  // TEST GROUP 1: Public Branches API
  // ----------------------------------------------------
  console.log('1. Testing Public Branches API (/api/branches)...');
  try {
    const res = await fetch(`${BASE_URL}/api/branches`);
    assert(res.status === 200, 'Public /api/branches returns HTTP 200');
    const data = await res.json();
    assert(data.success === true, 'Response contains success: true');
    assert(Array.isArray(data.branches), 'Returns branches array');
    assert(data.branches.length >= 3, `Returns at least 3 seeded branches (got ${data.branches.length})`);
    
    // Check fields of first branch
    const b1 = data.branches[0];
    assert(typeof b1.id === 'string' && b1.id.length > 0, `Branch has ID: ${b1.id}`);
    assert(typeof b1.name === 'string' && b1.name.length > 0, `Branch has name: ${b1.name}`);
    assert(typeof b1.address === 'string' && b1.address.length > 0, `Branch has address`);
    assert(Array.isArray(b1.phones) && b1.phones.length > 0, `Branch has parsed phones array`);
    assert(b1.isActive === true || b1.isActive === 1, 'Only active branches returned in public API');
  } catch (err) {
    console.error('Error testing public branches:', err);
    failedTests++;
  }

  // ----------------------------------------------------
  // TEST GROUP 2: Security & Admin Branch Protection
  // ----------------------------------------------------
  console.log('\n2. Testing Security & Admin Branch Endpoints...');
  try {
    // Unauthenticated request should be rejected (401)
    const unauthRes = await fetch(`${BASE_URL}/api/admin/branches`);
    assert(unauthRes.status === 401, 'Unauthenticated request to /api/admin/branches returns HTTP 401');

    // Authenticated request
    const authRes = await fetch(`${BASE_URL}/api/admin/branches`, {
      headers: { Cookie: `token=${adminToken}` },
    });
    assert(authRes.status === 200, 'Authenticated admin request to /api/admin/branches returns HTTP 200');
    const authData = await authRes.json();
    assert(Array.isArray(authData.branches), 'Admin receives all branches');
  } catch (err) {
    console.error('Error testing security:', err);
    failedTests++;
  }

  // ----------------------------------------------------
  // TEST GROUP 3: Branch CRUD Lifecycle
  // ----------------------------------------------------
  console.log('\n3. Testing Branch CRUD Operations...');
  const testBranchId = 'branch_test_south_' + Date.now();
  try {
    // A. Create Branch with multiple phones
    const createRes = await fetch(`${BASE_URL}/api/admin/branches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({
        id: testBranchId,
        name: 'South Ahmedabad Office',
        displayTitle: 'South Ahmedabad Branch',
        address: '501, South City Mall, Maninagar, Ahmedabad - 380008',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380008',
        country: 'India',
        phones: [
          { number: '+91 99999 88888', label: 'Office' },
          { number: '+91 77777 66666', label: 'Sales' },
        ],
        email: 'south@veerrealestate.com',
        whatsapp: '919999988888',
        mapUrl: 'https://maps.google.com/?q=Maninagar+Ahmedabad',
        facebook: 'https://facebook.com/veersouth',
        isActive: 1,
        displayOrder: 99,
      }),
    });
    assert(createRes.status === 201, 'POST /api/admin/branches creates new branch (HTTP 201)');
    const createData = await createRes.json();
    assert(createData.success === true, 'Creation confirmed with success: true');

    // B. Verify branch in Admin list
    const getSingleRes = await fetch(`${BASE_URL}/api/admin/branches/${testBranchId}`, {
      headers: { Cookie: `token=${adminToken}` },
    });
    assert(getSingleRes.status === 200, 'GET /api/admin/branches/[id] returns created branch');
    const singleData = await getSingleRes.json();
    assert(singleData.branch.name === 'South Ahmedabad Office', 'Branch name matches');
    assert(singleData.branch.phones.length === 2, 'Multiple phones stored and returned');

    // C. Edit Branch
    const updateRes = await fetch(`${BASE_URL}/api/admin/branches/${testBranchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({
        displayTitle: 'Updated South Ahmedabad Hub',
        phones: [{ number: '+91 99999 88888', label: 'Direct Line' }],
      }),
    });
    assert(updateRes.status === 200, 'PUT /api/admin/branches/[id] updates branch');

    // D. Deactivate Branch and verify Public API excludes it
    await fetch(`${BASE_URL}/api/admin/branches/${testBranchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({ isActive: 0 }),
    });
    const pubCheckRes = await fetch(`${BASE_URL}/api/branches`);
    const pubCheckData = await pubCheckRes.json();
    const foundInPub = pubCheckData.branches.some((b) => b.id === testBranchId);
    assert(!foundInPub, 'Deactivated branch immediately disappears from public website API');

    // E. Re-activate Branch and test Reorder
    await fetch(`${BASE_URL}/api/admin/branches/${testBranchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({ isActive: 1 }),
    });

    const reorderRes = await fetch(`${BASE_URL}/api/admin/branches/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${adminToken}`,
      },
      body: JSON.stringify({ orderedIds: [testBranchId, 'branch_east', 'branch_west', 'branch_bopal'] }),
    });
    assert(reorderRes.status === 200, 'PUT /api/admin/branches/reorder succeeds');

    // F. Delete Test Branch
    const delRes = await fetch(`${BASE_URL}/api/admin/branches/${testBranchId}`, {
      method: 'DELETE',
      headers: { Cookie: `token=${adminToken}` },
    });
    assert(delRes.status === 200, 'DELETE /api/admin/branches/[id] deletes test branch');
  } catch (err) {
    console.error('Error testing branch CRUD:', err);
    failedTests++;
  }

  // ----------------------------------------------------
  // TEST GROUP 4: Footer and Contact Form Configurations
  // ----------------------------------------------------
  console.log('\n4. Testing Footer & Contact Form Settings in DB...');
  try {
    const footerRes = await fetch(`${BASE_URL}/api/content?key=footer_config`);
    assert(footerRes.status === 200, 'GET /api/content?key=footer_config returns HTTP 200');
    const footerJson = await footerRes.json();
    assert(footerJson.contentData?.quickLinks?.length >= 8, 'Footer config contains Quick Links array');
    assert(footerJson.contentData?.propertyTypes?.length >= 5, 'Footer config contains Property Types array');
    assert(typeof footerJson.contentData?.copyright === 'string', 'Footer config contains editable copyright text');

    const contactSettingsRes = await fetch(`${BASE_URL}/api/content?key=contact_form_settings`);
    assert(contactSettingsRes.status === 200, 'GET /api/content?key=contact_form_settings returns HTTP 200');
    const contactSettingsJson = await contactSettingsRes.json();
    assert(contactSettingsJson.contentData?.subjects?.length >= 4, 'Contact form settings contains dynamic subjects');
  } catch (err) {
    console.error('Error testing content settings:', err);
    failedTests++;
  }

  // ----------------------------------------------------
  // TEST GROUP 5: Contact Inquiry Form Submission & CRM Persistence
  // ----------------------------------------------------
  console.log('\n5. Testing Inquiry Form Submission & CRM Database Persistence...');
  let testInquiryId = null;
  try {
    // Validation Test 1: Empty name should be rejected
    const badNameRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.101',
      },
      body: JSON.stringify({ name: '', phone: '+91 98765 43210' }),
    });
    assert(badNameRes.status === 400, 'Inquiry with empty name rejected with HTTP 400');

    // Validation Test 2: Terms consent false should be rejected
    const badTermsRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.102',
      },
      body: JSON.stringify({ name: 'Test User', phone: '+91 98765 43210', termsConsent: false }),
    });
    assert(badTermsRes.status === 400, 'Inquiry with termsConsent: false rejected with HTTP 400');

    // Valid Submission with Marketing Consent = true
    const validInquiryRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.103',
      },
      body: JSON.stringify({
        name: 'Auto Test Buyer',
        email: 'autotest@veerrealestate.com',
        phone: '+91 98250 12345',
        subject: 'Buying',
        message: 'I want to schedule a visit for 3 BHK luxury apartment in West Ahmedabad.',
        leadType: 'contact',
        source: 'Contact Page Form',
        termsConsent: true,
        marketingConsent: true,
        whatsappNumber: '919727027052',
      }),
    });
    assert(validInquiryRes.status === 201, 'Valid inquiry submitted successfully (HTTP 201)');
    const validJson = await validInquiryRes.json();
    assert(validJson.success === true, 'Response contains success: true');
    assert(typeof validJson.inquiryId === 'number', `Received inquiryId: ${validJson.inquiryId}`);
    assert(typeof validJson.whatsappUrl === 'string' && validJson.whatsappUrl.includes('wa.me'), 'Server returns verified WhatsApp click-to-chat URL');
    testInquiryId = validJson.inquiryId;

    // Direct MySQL Database Verification
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 1,
    });

    const [rows] = await pool.query('SELECT * FROM crm_inquiries WHERE id = ? LIMIT 1', [testInquiryId]);
    assert(rows.length === 1, 'Inquiry physically found in MySQL crm_inquiries table');
    const inq = rows[0];
    assert(inq.name === 'Auto Test Buyer', 'Stored name matches');
    assert(inq.source === 'Contact Page Form', 'Stored source is "Contact Page Form"');
    assert(inq.status === 'New', 'Stored initial status is "New"');
    assert(inq.leadType === 'contact', 'Stored leadType is "contact"');
    assert(inq.marketingConsent === 1, 'marketingConsent correctly persisted as 1');

    // CRM Admin API Verification (Kanban / List visibility)
    const crmRes = await fetch(`${BASE_URL}/api/admin/crm?search=Auto+Test+Buyer`, {
      headers: { Cookie: `token=${adminToken}` },
    });
    assert(crmRes.status === 200, 'GET /api/admin/crm returns HTTP 200');
    const crmData = await crmRes.json();
    const foundInCrm = crmData.inquiries.some((i) => i.id === testInquiryId);
    assert(foundInCrm, 'Inquiry is visible in CRM List & Kanban search');

    // Cleanup test record
    await pool.query('DELETE FROM crm_inquiries WHERE id = ?', [testInquiryId]);
    console.log('  ✓ Cleaned up test inquiry from CRM database');
    await pool.end();
  } catch (err) {
    console.error('Error testing inquiry submission:', err);
    failedTests++;
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
