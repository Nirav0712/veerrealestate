import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const initialBranches = [
  {
    id: 'branch_east',
    name: 'East Ahmedabad',
    displayTitle: 'East Ahmedabad',
    address: 'C-238, Sumel 7, Odhav, Ahmedabad - 382415',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '382415',
    country: 'India',
    phones: [
      { number: '+91 93769 96179', label: 'Office' },
      { number: '+91 97270 27052', label: 'Sales' }
    ],
    email: 'horseveer@gmail.com',
    whatsapp: '919727027052',
    mapUrl: 'https://maps.google.com/?q=Sumel+7+Odhav+Ahmedabad',
    mapEmbedUrl: '',
    facebook: 'https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/',
    instagram: 'https://www.instagram.com/veerrealestateeastahmedabad/?hl=en',
    youtube: 'https://www.youtube.com/@VeerRealEstate',
    googleReview: 'https://g.page/r/CcSCOVV14JRdEAI/review',
    linkedin: '',
    isActive: 1,
    displayOrder: 1
  },
  {
    id: 'branch_west',
    name: 'West Ahmedabad',
    displayTitle: 'West Ahmedabad',
    address: '431, Yash Arian Complex, Memnagar, Ahmedabad - 380052',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380052',
    country: 'India',
    phones: [
      { number: '+91 88661 13391', label: 'Office' },
      { number: '+91 90672 30240', label: 'Support' }
    ],
    email: 'horseveer@gmail.com',
    whatsapp: '918866113391',
    mapUrl: 'https://maps.google.com/?q=Yash+Arian+Complex+Memnagar+Ahmedabad',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.217236267724!2d72.53583687600862!3d23.052496015209492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e856a804a4f6b%3A0x5d94e075553982c4!2sVeer%20Real%20Estate!5e0!3m2!1sen!2sin!4v1788493973064!5m2!1sen!2sin',
    facebook: 'https://www.facebook.com/people/Veer-Real-Estate/61558935522154/',
    instagram: 'https://www.instagram.com/veer.real_estate/',
    youtube: 'https://www.youtube.com/@VeerRealEstate',
    googleReview: 'https://g.page/r/CcSCOVV14JRdEAI/review',
    linkedin: 'https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true',
    isActive: 1,
    displayOrder: 2
  },
  {
    id: 'branch_bopal',
    name: 'Bopal Branch',
    displayTitle: 'Bopal Branch',
    address: '1120, STC, Opp. Saraswati Hospital, Ambli, Ahmedabad - 380058',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380058',
    country: 'India',
    phones: [
      { number: '+91 81601 53208', label: 'Direct' }
    ],
    email: 'horseveer@gmail.com',
    whatsapp: '918160153208',
    mapUrl: 'https://maps.google.com/?q=STC+Opp+Saraswati+Hospital+Ambli+Ahmedabad',
    mapEmbedUrl: '',
    facebook: '',
    instagram: '',
    youtube: '',
    googleReview: '',
    linkedin: '',
    isActive: 1,
    displayOrder: 3
  }
];

const defaultFooterConfig = {
  logoUrl: '/images/veer-logo-old.png',
  logoAlt: 'Veer Real Estate Logo',
  companyName: 'Veer Real Estate',
  tagline: 'Your Trusted Partner in Real Estate',
  description: 'Veer Real Estate — Your trusted property partner in Ahmedabad since 2012.',
  quickLinks: [
    { id: 'ql_1', label: 'Home', url: '/', is_active: true, is_new: false, order: 1 },
    { id: 'ql_2', label: 'About Us', url: '/about-us', is_active: true, is_new: false, order: 2 },
    { id: 'ql_3', label: 'Builder Consultation', url: '/builder-consultation', is_active: true, is_new: true, order: 3 },
    { id: 'ql_4', label: 'Properties', url: '/properties', is_active: true, is_new: false, order: 4 },
    { id: 'ql_5', label: 'All Projects', url: '/projects', is_active: true, is_new: false, order: 5 },
    { id: 'ql_6', label: 'East Projects', url: '/projects/east', is_active: true, is_new: false, order: 6 },
    { id: 'ql_7', label: 'West Projects', url: '/projects/west', is_active: true, is_new: false, order: 7 },
    { id: 'ql_8', label: 'Blogs', url: '/blog', is_active: true, is_new: false, order: 8 },
    { id: 'ql_9', label: 'Contact', url: '/contact', is_active: true, is_new: false, order: 9 }
  ],
  propertyTypes: [
    { id: 'pt_1', label: 'Apartments', url: '/properties?type=Apartment', is_active: true, order: 1 },
    { id: 'pt_2', label: 'Plots', url: '/properties?type=Plot', is_active: true, order: 2 },
    { id: 'pt_3', label: 'Lands', url: '/properties?type=Land', is_active: true, order: 3 },
    { id: 'pt_4', label: 'Bunglows', url: '/properties?type=Bunglows', is_active: true, order: 4 },
    { id: 'pt_5', label: 'Industrial', url: '/properties?type=Industrial', is_active: true, order: 5 },
    { id: 'pt_6', label: 'Commercial Shops', url: '/properties?type=Commercial', is_active: true, order: 6 },
    { id: 'pt_7', label: 'Commercial Office', url: '/properties?type=Office', is_active: true, order: 7 }
  ],
  builderBanner: {
    enabled: true,
    title: 'Builder Bhai — Let’s Build a Stronger Real Estate Business',
    subtitle: 'Get expert project positioning, marketing strategy, site visits & sales consultation with Sudhir Prajapati.',
    badgeText: 'For Builders & Developers',
    consultantName: 'Sudhir Prajapati',
    consultantImage: '/images/sudhir-about-final.jpg',
    buttonText: 'Book Consultation',
    buttonUrl: '/builder-consultation'
  },
  copyright: '© 2026 Veer Real Estate. All rights reserved.',
  reraDisclaimer: 'All project information, amenities, and floor plans are subject to change as per developer specifications and RERA guidelines.',
  builderLinkText: 'Builder Bhai Consultation'
};

const defaultContactFormSettings = {
  title: 'Send Message',
  subtitle: 'Have questions? We\'re here to help you find your dream property',
  submitButtonText: 'Send via WhatsApp',
  subjects: [
    { id: 'buy', label: 'Buying' },
    { id: 'sell', label: 'Selling' },
    { id: 'rent', label: 'Renting' },
    { id: 'invest', label: 'Investment Consultation' },
    { id: 'builder', label: 'Builder Consultation' },
    { id: 'general', label: 'General Inquiry' }
  ],
  showMarketingConsent: true,
  marketingConsentText: 'I would like to receive communication via SMS, RCS SMS, Email & WhatsApp services for offers, updates & transactions.',
  termsLinkText: 'Terms',
  privacyLinkText: 'Privacy Policy',
  notificationEmail: 'horseveer@gmail.com',
  successMessage: 'Thank you! Your message has been sent. Our property consultant will contact you shortly.',
  requirePhone: true,
  requireEmail: true,
  requireMessage: true
};

async function main() {
  console.log('Running Migration & Seeding for Branches, Footer, and Contact Form...');

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,
    connectTimeout: 30000,
  });

  try {
    // 1. Create branches table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        displayTitle VARCHAR(200) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) DEFAULT 'Ahmedabad',
        state VARCHAR(100) DEFAULT 'Gujarat',
        postalCode VARCHAR(20) DEFAULT '380052',
        country VARCHAR(50) DEFAULT 'India',
        phones JSON NOT NULL,
        email VARCHAR(150),
        whatsapp VARCHAR(50),
        mapUrl TEXT,
        mapEmbedUrl TEXT,
        facebook TEXT,
        instagram TEXT,
        youtube TEXT,
        googleReview TEXT,
        linkedin TEXT,
        isActive TINYINT(1) DEFAULT 1,
        displayOrder INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_branches_order (displayOrder),
        INDEX idx_branches_active (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Verified table: branches');

    // 2. Seed initial branches if empty
    const [branchCount] = await pool.query('SELECT COUNT(*) as count FROM branches');
    if (branchCount[0].count === 0) {
      for (const b of initialBranches) {
        await pool.query(
          `INSERT INTO branches (
            id, name, displayTitle, address, city, state, postalCode, country,
            phones, email, whatsapp, mapUrl, mapEmbedUrl,
            facebook, instagram, youtube, googleReview, linkedin,
            isActive, displayOrder
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            b.id,
            b.name,
            b.displayTitle,
            b.address,
            b.city,
            b.state,
            b.postalCode,
            b.country,
            JSON.stringify(b.phones),
            b.email,
            b.whatsapp,
            b.mapUrl,
            b.mapEmbedUrl,
            b.facebook,
            b.instagram,
            b.youtube,
            b.googleReview,
            b.linkedin,
            b.isActive,
            b.displayOrder,
          ]
        );
        console.log(`+ Seeded branch: ${b.name}`);
      }
    } else {
      console.log(`= Branches table already contains ${branchCount[0].count} records.`);
    }

    // 3. Upsert footer_config in website_content
    await pool.query(
      `INSERT INTO website_content (sectionKey, title, contentData, updatedBy)
       VALUES ('footer_config', 'Footer Configuration', ?, 'System Seed')
       ON DUPLICATE KEY UPDATE contentData = VALUES(contentData), updated_at = NOW()`,
      [JSON.stringify(defaultFooterConfig)]
    );
    console.log('✓ Upserted footer_config in website_content');

    // 4. Upsert contact_form_settings in website_content
    await pool.query(
      `INSERT INTO website_content (sectionKey, title, contentData, updatedBy)
       VALUES ('contact_form_settings', 'Contact Form Settings', ?, 'System Seed')
       ON DUPLICATE KEY UPDATE contentData = VALUES(contentData), updated_at = NOW()`,
      [JSON.stringify(defaultContactFormSettings)]
    );
    console.log('✓ Upserted contact_form_settings in website_content');

    // 5. Add marketingConsent column to crm_inquiries if missing
    const [colCheck] = await pool.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'crm_inquiries' AND COLUMN_NAME = 'marketingConsent'
    `, [process.env.DB_NAME]);

    if (colCheck.length === 0) {
      await pool.query(`ALTER TABLE crm_inquiries ADD COLUMN marketingConsent TINYINT(1) DEFAULT 0 AFTER userAgent`);
      console.log('+ Added column marketingConsent to crm_inquiries');
    } else {
      console.log('= Column marketingConsent already exists in crm_inquiries');
    }

    console.log('Migration & Seeding finished successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main();

