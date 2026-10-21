import dotenv from 'dotenv';
dotenv.config();

import pool from '../lib/db.ts';

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('[seed] Seeding initial projects, blogs, and website content...');

    // 1. Seed Projects from lib/projects.tsx if projects table is empty
    const [projectCount] = await conn.query('SELECT COUNT(*) as count FROM projects');
    if (projectCount[0].count === 0) {
      const { projects } = await import('../lib/projects.tsx');
      console.log(`[seed] Found ${projects.length} static projects to import into database.`);

      for (const p of projects) {
        // Find or map location
        const locationName = p.location || (p.zone === 'East' ? 'East Ahmedabad' : 'West Ahmedabad');
        const [loc] = await conn.query('SELECT id FROM locations WHERE name = ? LIMIT 1', [locationName]);
        const locationId = loc.length > 0 ? loc[0].id : null;

        const gallery = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
        const cleanSlug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        await conn.query(
          `INSERT INTO projects (
            name, slug, builderName, tagline, description, category, status, zone,
            locationId, locationName, fullAddress, priceMin, priceMax, displayPrice,
            landArea, configurations, coverImage, galleryImages, featured, publishStatus,
            metaTitle, metaDescription, primaryKeyword
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.title.trim(),
            cleanSlug,
            'Veer Real Estate & Associates',
            p.title.trim() + ' in ' + locationName,
            p.description,
            'Residential',
            p.status === 'Ready to Move' ? 'Ready to Move' : 'Under Construction',
            p.zone || 'East',
            locationId,
            locationName,
            p.address || p.location,
            p.price || 0,
            p.price ? p.price * 1.5 : 0,
            p.displayPrice || '₹ ' + (p.price ? (p.price / 100000).toFixed(2) + ' Lakh' : 'On Request'),
            p.PlotArea || '1200 sqft',
            p.bedrooms ? `${p.bedrooms} BHK` : '2 & 3 BHK',
            p.image || (gallery.length > 0 ? gallery[0] : null),
            JSON.stringify(gallery.slice(0, 10)),
            p.featured ? 1 : 0,
            'published',
            `${p.title.trim()} in ${locationName} | Veer Real Estate`,
            p.description.substring(0, 160),
            `${p.title.trim()}, Property in ${locationName}, Real Estate Ahmedabad`
          ]
        );
      }
      console.log(`[seed] Imported static projects into database successfully.`);
    }

    // 2. Seed Blogs if blogs table is empty
    const [blogCount] = await conn.query('SELECT COUNT(*) as count FROM blogs');
    if (blogCount[0].count === 0) {
      const sampleBlogs = [
        {
          title: "Aaradhana Sky 2 in Narol Ahmedabad: Affordable 2 BHK Flats for Modern Families",
          slug: "aaradhana-sky-2-narol-ahmedabad-2-bhk-flats",
          excerpt: "Aaradhana Sky 2 in Narol Ahmedabad delivers modern living spaces at a budget-friendly price. For families looking for a quality home in East Ahmedabad, this project presents a smart opportunity.",
          content: `<h2>Modern Living at Affordable Pricing</h2><p>Aaradhana Sky 2 in Narol Ahmedabad delivers modern living spaces at a budget-friendly price. For families looking for a quality home in East Ahmedabad, this project presents a smart opportunity with complete amenities, modern infrastructure, and easy connectivity to major highways.</p><h3>Key Highlights:</h3><ul><li>Prime location near Narol-Aslali Highway</li><li>2 BHK spacious layouts with modern finishings</li><li>Gated community with 24/7 security</li><li>Vastu compliant floor designs</li></ul>`,
          author: "Sudhir Prajapati",
          category: "Market Trends",
          tags: JSON.stringify(["Narol", "2 BHK", "East Ahmedabad", "Affordable Housing"]),
          featuredImage: "/images/east/AARADHANA_2.jpeg",
          imageAlt: "Aaradhana Sky 2 Narol",
          readTime: "5 min read",
          publishStatus: "published",
          metaTitle: "Aaradhana Sky 2 in Narol Ahmedabad | Veer Real Estate",
          metaDescription: "Discover Aaradhana Sky 2 in Narol Ahmedabad: premium 2 BHK apartments offering convenience, comfort and strategic connectivity.",
          primaryKeyword: "Aaradhana Sky 2 Narol, 2 BHK in Narol"
        },
        {
          title: "Anushtan Bungalows in Ahmedabad: Premium 4 BHK Luxury Homes for Modern Family Living",
          slug: "anushtan-bungalows-ahmedabad-premium-4-bhk-luxury-homes",
          excerpt: "Located near Vatva-Gamdi Circle, this exclusive residential project offers beautifully designed 4 BHK bungalows in Ahmedabad that are ideal for families targeting premium living.",
          content: `<h2>Luxury Redefined in East Ahmedabad</h2><p>Located near Vatva-Gamdi Circle, Anushtan Bungalows offers an exclusive living experience. Each bungalow features private parking, sprawling garden areas, and expansive living rooms suited for multi-generational families.</p>`,
          author: "Sudhir Prajapati",
          category: "Luxury Living",
          tags: JSON.stringify(["Vatva", "Bungalows", "4 BHK", "Luxury"]),
          featuredImage: "/images/east/Anusthan.jpeg",
          imageAlt: "Anushtan Bungalows Ahmedabad",
          readTime: "8 min read",
          publishStatus: "published",
          metaTitle: "Anushtan Bungalows 4 BHK Luxury Homes | Veer Real Estate",
          metaDescription: "Explore Anushtan Bungalows near Vatva-Gamdi Circle. Experience the pinnacle of 4 BHK luxury residences.",
          primaryKeyword: "Anushtan Bungalows, 4 BHK Bungalows Ahmedabad"
        },
        {
          title: "Avalon DHS Floora in Vatva Ahmedabad: Ready Possession Flats for Smart Buyers",
          slug: "avalon-dhs-floora-vatva-ahmedabad-ready-possession",
          excerpt: "Avalon DHS Floora in Vatva Ahmedabad is a residential project attracting homebuyers looking for budget-friendly homes with ready possession benefits.",
          content: `<h2>Move in Without the Wait</h2><p>Instead of waiting for years for project completion, buyers at Avalon DHS Floora can take immediate possession and save substantially on rental costs.</p>`,
          author: "Admin",
          category: "Buying Guide",
          tags: JSON.stringify(["Ready Possession", "Vatva", "Flats"]),
          featuredImage: "/images/east/Avalon-DHS.jpeg",
          imageAlt: "Avalon DHS Floora Vatva",
          readTime: "6 min read",
          publishStatus: "published",
          metaTitle: "Avalon DHS Floora Vatva Ahmedabad | Ready Possession",
          metaDescription: "Ready possession 2 BHK & 3 BHK flats at Avalon DHS Floora in Vatva, Ahmedabad. Move in today.",
          primaryKeyword: "Avalon DHS Floora, Ready possession flats Vatva"
        }
      ];

      for (const b of sampleBlogs) {
        await conn.query(
          `INSERT INTO blogs (
            title, slug, excerpt, content, author, category, tags,
            featuredImage, imageAlt, readTime, publishStatus, metaTitle, metaDescription, primaryKeyword
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            b.title, b.slug, b.excerpt, b.content, b.author, b.category, b.tags,
            b.featuredImage, b.imageAlt, b.readTime, b.publishStatus, b.metaTitle, b.metaDescription, b.primaryKeyword
          ]
        );
      }
      console.log('[seed] Seeded initial blog posts.');
    }

    // 3. Seed Website Content if empty
    const [contentCount] = await conn.query('SELECT COUNT(*) as count FROM website_content');
    if (contentCount[0].count === 0) {
      const defaultSections = [
        {
          sectionKey: 'hero_slides',
          title: 'Homepage Hero Slides',
          contentData: JSON.stringify({
            slides: [
              {
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
                title: 'Find Your Dream Property in Ahmedabad',
                subtitle: 'Verified residential flats, luxury bungalows, plots and commercial spaces.'
              },
              {
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
                title: 'Premier East & West Ahmedabad Projects',
                subtitle: 'Direct developer pricing, transparent paperwork, and zero hidden charges.'
              },
              {
                image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
                title: 'Trusted Real Estate Consultancy',
                subtitle: 'Helping 500+ happy families achieve their property dreams.'
              }
            ]
          })
        },
        {
          sectionKey: 'company_info',
          title: 'Company & Contact Information',
          contentData: JSON.stringify({
            companyName: 'Veer Real Estate',
            phone: '+91 97270 27052',
            whatsapp: '919727027052',
            email: 'info@veerrealestate.com',
            address: 'Ahmedabad, Gujarat, India',
            experienceYears: '12+',
            propertiesSold: '500+',
            happyClients: '1200+',
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            youtube: 'https://youtube.com',
            linkedin: 'https://linkedin.com'
          })
        },
        {
          sectionKey: 'about_us',
          title: 'About Us Content',
          contentData: JSON.stringify({
            heading: 'Building Trust, Delivering Excellence in Real Estate',
            description: 'Veer Real Estate is Ahmedabad’s premier real estate consultancy, specializing in East and West Ahmedabad properties. Founded with a vision to provide transparent, honest, and client-first real estate guidance, we help buyers discover dream homes and assist developers in strategizing high-impact projects.',
            founderName: 'Sudhir Prajapati',
            founderRole: 'Founder & Principal Consultant',
            founderBio: 'Over a decade of hands-on expertise in Ahmedabad real estate, builder marketing strategy, and investment consulting.'
          })
        }
      ];

      for (const s of defaultSections) {
        await conn.query(
          `INSERT INTO website_content (sectionKey, title, contentData, updatedBy) VALUES (?, ?, ?, ?)`,
          [s.sectionKey, s.title, s.contentData, 'System Seed']
        );
      }
      console.log('[seed] Seeded initial website content.');
    }

    console.log('[seed] All initial seeding finished successfully!');
  } catch (err) {
    console.error('[seed] Error seeding:', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
