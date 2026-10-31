import mysql from 'mysql2/promise';

async function main() {
  const p = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  });

  const [rows] = await p.query("SELECT contentData FROM website_content WHERE sectionKey = 'seo_settings'");
  let data = {};
  if (rows && rows.length > 0 && rows[0].contentData) {
    data = typeof rows[0].contentData === 'string' ? JSON.parse(rows[0].contentData) : rows[0].contentData;
  }
  data.googleSiteVerification = 'MAzcA3AguIYWeVSbX2ynaRkn8iK9pwVyiPqCEwoKGCE';
  await p.query("UPDATE website_content SET contentData = ? WHERE sectionKey = 'seo_settings'", [JSON.stringify(data)]);
  console.log('Successfully updated seo_settings with existing GSC verification token:', data.googleSiteVerification);
  await p.end();
}

main();

