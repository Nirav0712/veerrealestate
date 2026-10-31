import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3000';
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

async function run() {
  console.log('====================================================');
  console.log('TESTING SERVERLESS-SAFE DATABASE-BACKED FILE UPLOAD');
  console.log('====================================================\n');

  const adminToken = jwt.sign(
    { id: 4, email: 'admin@gmail.com', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 1. Create a minimal valid 1x1 PNG image buffer (magic bytes: 89 50 4E 47 0D 0A 1A 0A)
  const png1x1 = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82,
  ]);

  console.log('1. Testing POST /api/upload with PNG image...');
  const formData = new FormData();
  const blob = new Blob([png1x1], { type: 'image/png' });
  formData.append('file', blob, 'project_test_sample.png');
  formData.append('type', 'image');

  let uploadedUrl = '';
  let filename = '';

  try {
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Cookie: `token=${adminToken}`,
      },
      body: formData,
    });

    assert(res.status === 200, `POST /api/upload returns HTTP 200 (got ${res.status})`);
    const data = await res.json();
    assert(data.success === true, 'Upload response contains success: true');
    assert(typeof data.url === 'string' && data.url.startsWith('/uploads/'), `Valid url returned: ${data.url}`);
    uploadedUrl = data.url;
    filename = uploadedUrl.replace('/uploads/', '');
  } catch (err) {
    console.error('Upload failed:', err);
    failed++;
  }

  // 2. Direct MySQL check
  console.log('\n2. Verifying File Record in MySQL uploaded_files table...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1,
  });

  try {
    const [rows] = await pool.query('SELECT filename, mimeType, size, LENGTH(data) as datalen FROM uploaded_files WHERE filename = ?', [filename]);
    assert(rows.length === 1, 'File record physically exists in MySQL uploaded_files table');
    assert(rows[0].mimeType === 'image/png', 'Stored mimeType is image/png');
    assert(rows[0].datalen === png1x1.length, `Stored binary data length matches original buffer (${rows[0].datalen} bytes)`);
  } catch (err) {
    console.error('DB query error:', err);
    failed++;
  }

  // 3. Testing Dynamic File Serving via GET /uploads/:filename
  console.log(`\n3. Testing Dynamic File Serving via GET ${uploadedUrl}...`);
  try {
    const serveRes = await fetch(`${BASE_URL}${uploadedUrl}`);
    assert(serveRes.status === 200, `GET ${uploadedUrl} returns HTTP 200`);
    const contentType = serveRes.headers.get('content-type');
    assert(contentType === 'image/png', `Content-Type header is image/png (got ${contentType})`);
    const cacheControl = serveRes.headers.get('cache-control');
    assert(cacheControl && cacheControl.includes('public'), 'Cache-Control header configured for optimal performance');
    const returnedBytes = Buffer.from(await serveRes.arrayBuffer());
    assert(returnedBytes.equals(png1x1), 'Returned binary payload matches uploaded PNG image exactly');
  } catch (err) {
    console.error('File serve error:', err);
    failed++;
  }

  // 4. Testing Media Library Listing via GET /api/admin/media
  console.log('\n4. Testing GET /api/admin/media...');
  try {
    const mediaRes = await fetch(`${BASE_URL}/api/admin/media`, {
      headers: { Cookie: `token=${adminToken}` },
    });
    assert(mediaRes.status === 200, 'GET /api/admin/media returns HTTP 200');
    const mediaData = await mediaRes.json();
    assert(Array.isArray(mediaData.files), 'Media library returns files array');
    const foundFile = mediaData.files.some((f) => f.name === filename);
    assert(foundFile, 'Uploaded file is listed in Media Library');
  } catch (err) {
    console.error('Media listing error:', err);
    failed++;
  }

  // 5. Testing File Deletion via DELETE /api/admin/media
  console.log('\n5. Testing DELETE /api/admin/media...');
  try {
    const delRes = await fetch(`${BASE_URL}/api/admin/media?filename=${encodeURIComponent(filename)}&folder=uploads`, {
      method: 'DELETE',
      headers: { Cookie: `token=${adminToken}` },
    });
    assert(delRes.status === 200, 'DELETE /api/admin/media returns HTTP 200');

    // Verify deleted from MySQL
    const [checkRows] = await pool.query('SELECT id FROM uploaded_files WHERE filename = ?', [filename]);
    assert(checkRows.length === 0, 'File record deleted from MySQL uploaded_files table');

    // Verify subsequent GET returns 404
    const checkServeRes = await fetch(`${BASE_URL}${uploadedUrl}`);
    assert(checkServeRes.status === 404, `GET ${uploadedUrl} now returns HTTP 404 after deletion`);
  } catch (err) {
    console.error('Media deletion error:', err);
    failed++;
  }

  await pool.end();

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
  else process.exit(0);
}

run();
