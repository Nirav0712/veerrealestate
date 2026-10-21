import pool from '../db';

let migrationPromise: Promise<void> | null = null;

export async function runMigrations(): Promise<void> {
  if (migrationPromise) return migrationPromise;
  migrationPromise = (async () => {
    const conn = await pool.getConnection();
    try {
      // Fast check if schema version is already up to date
      await conn.query(`
        CREATE TABLE IF NOT EXISTS _schema_migrations (
          version INT PRIMARY KEY,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [migRows]: any = await conn.query('SELECT version FROM _schema_migrations WHERE version = 2');
      if (migRows && migRows.length > 0) {
        return;
      }

      console.log('[migrations] Checking and applying database migrations...');

      // 1. Locations table
      await conn.query(`
        CREATE TABLE IF NOT EXISTS locations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          slug VARCHAR(150) NOT NULL UNIQUE,
          zone ENUM('East', 'West', 'North', 'South', 'Central', 'Other') DEFAULT 'East',
          city VARCHAR(100) DEFAULT 'Ahmedabad',
          state VARCHAR(100) DEFAULT 'Gujarat',
          pincode VARCHAR(20),
          description TEXT,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_locations_slug (slug),
          INDEX idx_locations_zone (zone),
          INDEX idx_locations_active (active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 2. Builder Consultation Leads table
      await conn.query(`
        CREATE TABLE IF NOT EXISTS builder_leads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fullName VARCHAR(200) NOT NULL,
          companyName VARCHAR(200),
          phone VARCHAR(30) NOT NULL,
          email VARCHAR(150),
          projectLocation VARCHAR(200) NOT NULL,
          projectStage VARCHAR(100) NOT NULL,
          mainChallenge VARCHAR(150) NOT NULL,
          requirements TEXT,
          source VARCHAR(100) DEFAULT 'Builder Consultation Page',
          status ENUM('New', 'Contacted', 'Qualified', 'Converted', 'Lost') DEFAULT 'New',
          assignedTo VARCHAR(150),
          internalNotes TEXT,
          followUpDate DATE,
          consentGiven BOOLEAN DEFAULT TRUE,
          ipAddress VARCHAR(60),
          userAgent VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_builder_leads_status (status),
          INDEX idx_builder_leads_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 3. Projects table (Independent from properties)
      await conn.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          builderName VARCHAR(255),
          tagline VARCHAR(255),
          description TEXT,
          category ENUM('Residential', 'Commercial', 'Mixed Use', 'Township') DEFAULT 'Residential',
          status ENUM('Upcoming', 'Pre-launch', 'Under Construction', 'Ready to Move', 'Completed') DEFAULT 'Under Construction',
          zone ENUM('East', 'West', 'North', 'South', 'Central') DEFAULT 'East',
          locationId INT NULL,
          locationName VARCHAR(200),
          fullAddress TEXT,
          pincode VARCHAR(20),
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          priceMin DECIMAL(15, 2),
          priceMax DECIMAL(15, 2),
          displayPrice VARCHAR(100),
          landArea VARCHAR(100),
          totalTowers INT DEFAULT 1,
          totalUnits INT,
          configurations VARCHAR(150), -- e.g. "2 & 3 BHK"
          possessionDate VARCHAR(100),
          reraNumber VARCHAR(100),
          amenities JSON,              -- Array of amenity strings
          approvals JSON,              -- Array of approvals
          coverImage TEXT,
          galleryImages JSON,          -- Up to 10 images
          masterPlanImage TEXT,
          sitePlanImage TEXT,
          brochureUrl TEXT,
          featured BOOLEAN DEFAULT FALSE,
          publishStatus ENUM('draft', 'published') DEFAULT 'published',
          metaTitle VARCHAR(255),
          metaDescription TEXT,
          primaryKeyword VARCHAR(150),
          canonicalUrl VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_projects_slug (slug),
          INDEX idx_projects_zone (zone),
          INDEX idx_projects_status (status),
          INDEX idx_projects_publish (publishStatus)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 4. Project Floor Plans table (Floor-wise planning with towers)
      await conn.query(`
        CREATE TABLE IF NOT EXISTS project_floor_plans (
          id INT AUTO_INCREMENT PRIMARY KEY,
          projectId INT NOT NULL,
          towerBlockName VARCHAR(100),
          floorNumber VARCHAR(50),
          unitType VARCHAR(100), -- e.g. "3 BHK Type A"
          carpetArea DECIMAL(10, 2),
          builtUpArea DECIMAL(10, 2),
          areaUnit VARCHAR(20) DEFAULT 'sqft',
          imageUrl TEXT NOT NULL,
          documentUrl TEXT,
          description TEXT,
          displayOrder INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_pfp_project (projectId),
          CONSTRAINT fk_pfp_project FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 5. Blog Posts table
      await conn.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          excerpt TEXT,
          content LONGTEXT NOT NULL,
          author VARCHAR(100) DEFAULT 'Veer Real Estate',
          category VARCHAR(100) DEFAULT 'Market Trends',
          tags JSON,                   -- Array of tags
          featuredImage TEXT,
          imageAlt VARCHAR(255),
          readTime VARCHAR(30) DEFAULT '5 min read',
          publishStatus ENUM('draft', 'published') DEFAULT 'published',
          publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          metaTitle VARCHAR(255),
          metaDescription TEXT,
          primaryKeyword VARCHAR(150),
          canonicalUrl VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_blogs_slug (slug),
          INDEX idx_blogs_status (publishStatus),
          INDEX idx_blogs_category (category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 6. Website Content Management table (Structured Key-Value blocks)
      await conn.query(`
        CREATE TABLE IF NOT EXISTS website_content (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sectionKey VARCHAR(100) NOT NULL UNIQUE,
          title VARCHAR(255),
          contentData JSON NOT NULL,
          updatedBy VARCHAR(150),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_content_section (sectionKey)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 7. Enhance properties table safely without breaking existing records
      const propColumns = [
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS propertyCode VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS locationId INT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS locality VARCHAR(150) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS address TEXT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS pincode VARCHAR(20) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS priceOnRequest BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS isNegotiable BOOLEAN DEFAULT TRUE`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS maintenanceCharges VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS carpetArea DECIMAL(10, 2) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS builtUpArea DECIMAL(10, 2) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS superBuiltUpArea DECIMAL(10, 2) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS plotArea DECIMAL(10, 2) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS balconies INT DEFAULT 0`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnishing ENUM('Unfurnished', 'Semi-Furnished', 'Fully-Furnished') DEFAULT 'Semi-Furnished'`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS floorNumber INT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS totalFloors INT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS facing VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS propertyAge VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS possessionDate VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSON NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS reraNumber VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS ownershipType VARCHAR(100) DEFAULT 'Freehold'`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS approvals JSON NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS coverImage TEXT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS imageAlts JSON NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS availability ENUM('Available', 'Sold', 'Reserved') DEFAULT 'Available'`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS publishStatus ENUM('draft', 'published') DEFAULT 'published'`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS metaTitle VARCHAR(255) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS metaDescription TEXT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS primaryKeyword VARCHAR(150) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS canonicalUrl VARCHAR(255) NULL`,
      ];

      for (const sql of propColumns) {
        try {
          await conn.query(sql);
        } catch (e: any) {
          if (!String(e.message).includes('Duplicate column')) {
            console.warn('[migrations] Notice on alter:', e.message);
          }
        }
      }

      // 7b. Additional dynamic property columns
      const dynamicPropColumns = [
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS listingPurpose VARCHAR(50) DEFAULT 'Sell'`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS propertyCategory VARCHAR(100) DEFAULT 'Residential'`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS propertySubtype VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthlyRent DECIMAL(12, 2) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS securityDeposit DECIMAL(12, 2) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS leaseDuration VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS lockInPeriod VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS preferredTenant VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS plotFrontage VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS plotDepth VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS roadWidth VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS zoning VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS landUse VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS naNocStatus VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS isCornerPlot BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS boundaryWall BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS washrooms VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS powerLoad VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS fitOutStatus VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS permittedUse VARCHAR(255) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS irrigationType VARCHAR(100) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS waterAccess BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricityConnection BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS landRecordDetails TEXT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contactPerson VARCHAR(150) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contactPhone VARCHAR(50) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contactEmail VARCHAR(150) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS societyName VARCHAR(150) NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS highlights TEXT NULL`,
        `ALTER TABLE properties ADD COLUMN IF NOT EXISTS pricePerUnit VARCHAR(50) NULL`,
      ];

      for (const sql of dynamicPropColumns) {
        try {
          await conn.query(sql);
        } catch (e: any) {
          if (!String(e.message).includes('Duplicate column')) {
            console.warn('[migrations] Notice on dynamic property alter:', e.message);
          }
        }
      }

      // 7c. Additional dynamic project columns
      const dynamicProjColumns = [
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS projectCode VARCHAR(50) NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS isReraExempt BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS reraExemptionReason TEXT NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS reraApprovedBy VARCHAR(150) NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS reraPhases JSON NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS launchDate DATE NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS expectedPossession VARCHAR(100) NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS actualCompletion DATE NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS constructionMilestones JSON NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS totalFloors INT NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS availableUnits INT NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS areaMin DECIMAL(10, 2) NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS areaMax DECIMAL(10, 2) NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS areaUnit VARCHAR(20) DEFAULT 'sqft'`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS nearbyFacilities JSON NULL`,
        `ALTER TABLE projects ADD COLUMN IF NOT EXISTS specifications JSON NULL`,
      ];

      for (const sql of dynamicProjColumns) {
        try {
          await conn.query(sql);
        } catch (e: any) {
          if (!String(e.message).includes('Duplicate column')) {
            console.warn('[migrations] Notice on dynamic project alter:', e.message);
          }
        }
      }

      // 7d. Additional locations columns
      const dynamicLocColumns = [
        `ALTER TABLE locations ADD COLUMN IF NOT EXISTS parentLocationId INT NULL`,
        `ALTER TABLE locations ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE`,
        `ALTER TABLE locations ADD COLUMN IF NOT EXISTS sortOrder INT DEFAULT 0`,
      ];

      for (const sql of dynamicLocColumns) {
        try {
          await conn.query(sql);
        } catch (e: any) {
          if (!String(e.message).includes('Duplicate column')) {
            console.warn('[migrations] Notice on dynamic location alter:', e.message);
          }
        }
      }

      // 7e. Create crm_inquiries table
      await conn.query(`
        CREATE TABLE IF NOT EXISTS crm_inquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          leadType ENUM('property', 'project', 'builder', 'contact') DEFAULT 'contact',
          name VARCHAR(200) NOT NULL,
          phone VARCHAR(40) NOT NULL,
          email VARCHAR(150),
          subject VARCHAR(255),
          message TEXT,
          propertyId INT NULL,
          propertyTitle VARCHAR(255),
          projectId INT NULL,
          projectName VARCHAR(255),
          status ENUM('New', 'Contacted', 'Qualified', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost') DEFAULT 'New',
          assignedTo VARCHAR(150),
          internalNotes TEXT,
          followUpDate DATE,
          source VARCHAR(150) DEFAULT 'Website Inquiry',
          ipAddress VARCHAR(60),
          userAgent VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_crm_leadType (leadType),
          INDEX idx_crm_status (status),
          INDEX idx_crm_created (created_at),
          INDEX idx_crm_property (propertyId),
          INDEX idx_crm_project (projectId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 8. Seed default locations if empty
      const [locCount]: any = await conn.query('SELECT COUNT(*) as count FROM locations');
      if (locCount[0].count === 0) {
        await conn.query(`
          INSERT INTO locations (name, slug, zone, city, active) VALUES
          ('East Ahmedabad', 'east-ahmedabad', 'East', 'Ahmedabad', 1),
          ('West Ahmedabad', 'west-ahmedabad', 'West', 'Ahmedabad', 1),
          ('Narol', 'narol', 'East', 'Ahmedabad', 1),
          ('Vatva', 'vatva', 'East', 'Ahmedabad', 1),
          ('Lambha', 'lambha', 'East', 'Ahmedabad', 1),
          ('Maninagar', 'maninagar', 'East', 'Ahmedabad', 1),
          ('Bopal', 'bopal', 'West', 'Ahmedabad', 1),
          ('Shela', 'shela', 'West', 'Ahmedabad', 1),
          ('Gota', 'gota', 'West', 'Ahmedabad', 1),
          ('Vaishnodevi', 'vaishnodevi', 'West', 'Ahmedabad', 1),
          ('Science City', 'science-city', 'West', 'Ahmedabad', 1),
          ('Gandhinagar', 'gandhinagar', 'Other', 'Gandhinagar', 1)
        `);
        console.log('[migrations] Default locations seeded.');
      }

      // 9. Backfill property slugs and property codes for existing records if null
      await conn.query(`
        UPDATE properties
        SET slug = CONCAT(LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-')), '-', id)
        WHERE slug IS NULL OR slug = ''
      `);

      await conn.query(`
        UPDATE properties
        SET propertyCode = CONCAT('VRE-', LPAD(id, 4, '0'))
        WHERE propertyCode IS NULL OR propertyCode = ''
      `);

      // 10. Ensure admin user has admin role
      await conn.query(`
        UPDATE register
        SET role = 'admin'
        WHERE email IN ('admin@gmail.com', 'admin2@gmail.com') OR name LIKE '%admin%'
      `);

      // Record migration version
      await conn.query('INSERT IGNORE INTO _schema_migrations (version) VALUES (2)');

      console.log('[migrations] All migrations completed successfully.');
    } catch (err) {
      console.error('[migrations] Migration failed:', err);
      throw err;
    } finally {
      conn.release();
    }
  })();

  return migrationPromise;
}
