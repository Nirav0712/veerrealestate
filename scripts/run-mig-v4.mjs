import mysql from 'mysql2/promise';

async function main() {
  console.log('Running Migration v4 directly...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  });

  const conn = await pool.getConnection();
  try {
    // 1. Roles Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255),
        permissions JSON NOT NULL,
        is_system BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_roles_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Roles table created/verified.');

    // Seed Default Roles if empty
    const [roleCount] = await conn.query('SELECT COUNT(*) as count FROM roles');
    if (roleCount[0].count === 0) {
      const defaultRoles = [
        {
          name: 'Super Admin',
          description: 'Full unconstrained system access across all modules',
          permissions: JSON.stringify({
            dashboard: ['view'],
            properties: ['view', 'create', 'edit', 'delete'],
            projects: ['view', 'create', 'edit', 'delete'],
            locations: ['view', 'create', 'edit', 'delete'],
            blogs: ['view', 'create', 'edit', 'delete'],
            crm: ['view', 'create', 'edit', 'delete', 'export'],
            seo: ['view', 'edit'],
            social_videos: ['view', 'create', 'edit', 'delete'],
            users: ['view', 'create', 'edit', 'delete'],
            roles: ['view', 'create', 'edit', 'delete'],
          }),
          is_system: 1,
        },
        {
          name: 'Sales Executive',
          description: 'View properties, projects, and manage CRM leads & follow-ups',
          permissions: JSON.stringify({
            dashboard: ['view'],
            properties: ['view'],
            projects: ['view'],
            locations: ['view'],
            blogs: ['view'],
            crm: ['view', 'create', 'edit'],
            seo: [],
            social_videos: ['view'],
            users: [],
            roles: [],
          }),
          is_system: 1,
        },
        {
          name: 'Content Writer',
          description: 'Draft and edit blog articles and project-linked content',
          permissions: JSON.stringify({
            dashboard: ['view'],
            properties: ['view'],
            projects: ['view'],
            locations: ['view'],
            blogs: ['view', 'create', 'edit'],
            crm: [],
            seo: ['view'],
            social_videos: ['view'],
            users: [],
            roles: [],
          }),
          is_system: 1,
        },
        {
          name: 'SEO Manager',
          description: 'Manage SEO metadata, sitemaps, robots, and tracking IDs',
          permissions: JSON.stringify({
            dashboard: ['view'],
            properties: ['view', 'edit'],
            projects: ['view', 'edit'],
            locations: ['view', 'edit'],
            blogs: ['view', 'edit'],
            crm: [],
            seo: ['view', 'edit'],
            social_videos: ['view'],
            users: [],
            roles: [],
          }),
          is_system: 1,
        },
      ];

      for (const r of defaultRoles) {
        await conn.query(
          `INSERT INTO roles (name, description, permissions, is_system) VALUES (?, ?, ?, ?)`,
          [r.name, r.description, r.permissions, r.is_system]
        );
      }
      console.log('Default roles seeded successfully.');
    }

    // 2. Add RBAC & Active Status Columns to register Table
    const [regCols] = await conn.query('SHOW COLUMNS FROM register');
    const regColNames = regCols.map(c => c.Field);
    if (!regColNames.includes('is_active')) {
      await conn.query('ALTER TABLE register ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
      console.log('Added is_active to register.');
    }
    if (!regColNames.includes('role_id')) {
      await conn.query('ALTER TABLE register ADD COLUMN role_id INT NULL');
      await conn.query('ALTER TABLE register ADD INDEX idx_register_role_id (role_id)');
      console.log('Added role_id to register.');
    }

    // Link existing admin users to Super Admin role
    const [superAdminRole] = await conn.query("SELECT id FROM roles WHERE name = 'Super Admin' LIMIT 1");
    if (superAdminRole && superAdminRole.length > 0) {
      await conn.query(
        "UPDATE register SET role_id = ?, is_active = 1 WHERE (role = 'admin' OR email IN ('admin@gmail.com', 'admin2@gmail.com')) AND (role_id IS NULL OR role_id = 0)",
        [superAdminRole[0].id]
      );
      console.log('Existing admins mapped to Super Admin role.');
    }

    // 3. Add Project-Wise Association & SEO fields to blogs Table
    const [blogCols] = await conn.query('SHOW COLUMNS FROM blogs');
    const blogColNames = blogCols.map(c => c.Field);
    if (!blogColNames.includes('projectId')) {
      await conn.query('ALTER TABLE blogs ADD COLUMN projectId INT NULL');
      await conn.query('ALTER TABLE blogs ADD INDEX idx_blogs_project (projectId)');
      console.log('Added projectId to blogs.');
    }
    if (!blogColNames.includes('relatedProjects')) {
      await conn.query('ALTER TABLE blogs ADD COLUMN relatedProjects JSON NULL');
      console.log('Added relatedProjects to blogs.');
    }
    if (!blogColNames.includes('relatedProperties')) {
      await conn.query('ALTER TABLE blogs ADD COLUMN relatedProperties JSON NULL');
      console.log('Added relatedProperties to blogs.');
    }
    if (!blogColNames.includes('metaRobots')) {
      await conn.query("ALTER TABLE blogs ADD COLUMN metaRobots VARCHAR(100) DEFAULT 'index, follow'");
      console.log('Added metaRobots to blogs.');
    }

    // 4. Add is_archived to crm_inquiries Table
    const [crmCols] = await conn.query('SHOW COLUMNS FROM crm_inquiries');
    const crmColNames = crmCols.map(c => c.Field);
    if (!crmColNames.includes('is_archived')) {
      await conn.query('ALTER TABLE crm_inquiries ADD COLUMN is_archived BOOLEAN DEFAULT FALSE');
      await conn.query('ALTER TABLE crm_inquiries ADD INDEX idx_crm_archived (is_archived)');
      console.log('Added is_archived to crm_inquiries.');
    }

    // 5. Seed default seo_settings into website_content
    const [seoSettings] = await conn.query("SELECT id FROM website_content WHERE sectionKey = 'seo_settings'");
    if (!seoSettings || seoSettings.length === 0) {
      const defaultSeo = {
        siteTitle: 'Veer Real Estate | Leading Real Estate Consultant in Ahmedabad',
        metaDescription: 'Discover luxury apartments, commercial showrooms, corporate offices, and premium bungalows across East & West Ahmedabad with Veer Real Estate.',
        canonicalDomain: 'https://veerrealestate.com',
        googleSiteVerification: '',
        googleAnalyticsId: '',
        defaultOgImage: '/images/og-default.jpg',
        robotsDefault: 'index, follow',
        organizationName: 'Veer Real Estate',
        organizationPhone: '+91 98250 00000',
        organizationEmail: 'info@veerrealestate.com',
        organizationAddress: 'Ahmedabad, Gujarat, India',
      };
      await conn.query(
        "INSERT INTO website_content (sectionKey, contentData) VALUES ('seo_settings', ?)",
        [JSON.stringify(defaultSeo)]
      );
      console.log('Default SEO settings seeded.');
    }

    // Record migration version
    await conn.query('INSERT IGNORE INTO _schema_migrations (version) VALUES (4)');
    console.log('Schema migration v4 recorded!');

    // Verification queries
    const [roles] = await conn.query('SELECT id, name, is_system FROM roles');
    console.log('Verified Roles in DB:', roles);

    const [admins] = await conn.query('SELECT id, name, email, role, role_id, is_active FROM register');
    console.log('Verified Users in DB:', admins);

    conn.release();
    await pool.end();
    console.log('MIGRATION V4 COMPLETE AND CLEAN!');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    if (conn) conn.release();
    await pool.end();
    process.exit(1);
  }
}

main();
