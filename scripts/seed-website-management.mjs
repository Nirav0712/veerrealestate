import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const defaultSections = [
  {
    sectionKey: 'homepage_hero',
    title: 'Homepage Hero Banner',
    contentData: {
      badge: 'Verified Real Estate in Ahmedabad',
      title: 'Your Trusted Partner in \nReal Estate',
      subtitle: 'Find the Right Property. Make the Right Decision. Build Your Future.',
      description: 'Since 2012, Veer Real Estate has been helping homebuyers, property owners and investors make confident real estate decisions across Ahmedabad.',
      slides: [
        { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80', alt: 'Luxury Home Ahmedabad' },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', alt: 'Modern Villa Property' },
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', alt: 'Premium Residential Apartment' },
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', alt: 'Commercial Office Space' },
        { url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1920&q=80', alt: 'Contemporary Real Estate' }
      ],
      searchTabs: ['For Sale', 'For Rent'],
      primaryButtonText: 'Search'
    }
  },
  {
    sectionKey: 'homepage_about',
    title: 'About Veer Real Estate (Homepage)',
    contentData: {
      category: 'About Veer Real Estate',
      title: 'Trusted Real Estate Broker in Ahmedabad',
      tagline: 'More Than Property. We Build Trust.',
      paragraphs: [
        'Buying or investing in real estate is one of the biggest financial decisions you make.',
        'At Veer Real Estate, we believe you deserve more than a list of properties. You deserve the right guidance, transparent information and professional support at every stage of your property journey.',
        'Since 2012, we have built our reputation as a trusted Property Dealer in Ahmedabad, serving individuals, families and investors with a customer-first approach. From understanding your requirements and shortlisting suitable properties to site visits, negotiation and documentation, our team stays with you throughout the process.'
      ],
      bullets: [
        'Quality real estate services',
        '100% Satisfaction guarantee',
        'Highly professional team',
        'Dealing always on time'
      ],
      buttonText: 'More About Us',
      buttonUrl: '/about-us',
      founderImage: '/images/team/sudhir.jpeg',
      founderName: 'Sudhir Prajapati',
      founderAlt: 'Sudhir Prajapati - Founder Veer Real Estate',
      logoImage: '/images/veer-logo-old.png',
      happyCustomerTitle: 'Our Happy Customer',
      happyCustomerCount: '3k+'
    }
  },
  {
    sectionKey: 'homepage_promise_stats',
    title: 'Our Promise & Statistics',
    contentData: {
      title: 'Our Promise',
      subtitle: 'Right Property. Right Guidance. Right Decision.',
      stats: [
        { value: '98%', label: 'Satisfaction Rate' },
        { value: '5K+', label: 'Happy Customers' },
        { value: '100+', label: 'Projects' },
        { value: '15+', label: 'Years Experience' }
      ],
      investingTitle: 'Smart Real Estate Investing Starts Here',
      investingParagraphs: [
        'Successful Real Estate Investing requires market knowledge, location analysis, and future growth potential. At Veer Real Estate, we help investors identify high-potential Investment Property opportunities that align with their financial goals.',
        'Our advisors analyze factors such as infrastructure development, connectivity, rental demand, appreciation trends, and market pricing before recommending any investment. Whether you are purchasing your first investment property or expanding your portfolio, our experienced consultants are here to guide you every step of the way.'
      ]
    }
  },
  {
    sectionKey: 'homepage_brand_promise',
    title: 'Brand Promise Section',
    contentData: {
      title: 'BRAND PROMISE',
      subtitle: 'Turning Property Dreams into Reality Since 2012',
      mission: {
        title: 'Our (Mission)',
        icon: 'fas fa-bullseye',
        intro: 'Our mission is to simplify the real estate experience through:',
        highlights: 'Honest Advice • Verified Property Solutions • Personalized Guidance • Professional Service',
        body: 'We aim to help families, homeowners and investors make confident property decisions while building long-term relationships based on trust, transparency and integrity. Every recommendation we make is guided by one simple principle: Your Long-Term Satisfaction Matters More Than One Transaction.'
      },
      corePurpose: {
        title: 'Our Core Purpose',
        icon: 'fas fa-home',
        intro: 'Turning Property Dreams Into Reality Since 2012',
        bodyParagraph1: 'Our purpose is to provide reliable, transparent and end-to-end real estate solutions tailored to every client\'s unique needs.',
        bodyParagraph2: 'Whether you are searching for an affordable home, a premium property, a commercial space or an investment opportunity, our experienced team is committed to helping you find the right solution.'
      }
    }
  },
  {
    sectionKey: 'homepage_core_values',
    title: 'Core Values Section',
    contentData: {
      title: 'Core Values',
      subtitle: 'Driven by Values. Focused on Your Future.',
      values: [
        {
          title: 'Integrity',
          icon: 'fas fa-handshake',
          description: 'We uphold the highest standards of honesty, ethics, and professionalism in everything we do. Every interaction is built on trust, accountability, and a strong commitment to lasting relationships.'
        },
        {
          title: 'Resourceful',
          icon: 'fas fa-lightbulb',
          description: 'We embrace creativity and adaptability in every situation. By developing smart and effective solutions, we overcome challenges and consistently deliver value that exceeds expectations.'
        },
        {
          title: 'Transparency',
          icon: 'fas fa-eye',
          description: 'We believe in open, honest, and clear communication. Our clients receive accurate information, genuine guidance, and complete clarity at every stage of the real estate journey.'
        },
        {
          title: 'Service Excellence',
          icon: 'fas fa-award',
          description: 'Excellence drives our actions. We aim to deliver exceptional service experiences through responsiveness, professionalism, and attention to detail, ensuring complete client satisfaction.'
        },
        {
          title: 'Knowledge',
          icon: 'fas fa-book-open',
          description: 'Our deep industry expertise and strong understanding of market trends empower clients to make confident, informed, and future-focused property decisions.'
        }
      ]
    }
  },
  {
    sectionKey: 'homepage_why_choose_us',
    title: 'Why Choose Veer Real Estate',
    contentData: {
      title: 'Why Choose Veer Real Estate?',
      subtitle: 'Your Property Journey, Simplified.',
      items: [
        { title: 'Verified Listings', desc: 'All properties are verified by our expert team', icon: 'fa-check-circle' },
        { title: 'Best Prices', desc: 'Competitive pricing and exclusive deals', icon: 'fa-tag' },
        { title: 'Expert Guidance', desc: 'Professional agents to help you', icon: 'fa-user-tie' },
        { title: 'Legal Support', desc: 'Complete documentation assistance', icon: 'fa-file-contract' }
      ]
    }
  },
  {
    sectionKey: 'homepage_section_visibility',
    title: 'Homepage Sections Visibility & Order',
    contentData: {
      hero: true,
      partners: true,
      about: true,
      stats: true,
      featured_properties: true,
      projects_in_motion: true,
      brand_promise: true,
      luxury_projects: true,
      core_values: true,
      why_choose_us: true,
      google_reviews: true
    }
  },
  {
    sectionKey: 'page_about_us',
    title: 'About Us Page Content',
    contentData: {
      heroTitle: 'About Veer Real Estate',
      heroSubtitle: 'Trusted Real Estate Broker in Ahmedabad',
      founderTitle: 'Meet Our Founder',
      founderName: 'SUDHIR PRAJAPATI',
      founderImage: '/images/team/sudhir.jpeg',
      founderParagraph1: 'Our founder continues to guide the company with strategic insight and a client-first approach — ensuring that every real estate transaction delivers exceptional value and long-term success.',
      founderParagraph2: 'With a strong focus on integrity and innovation, we aim to redefine the property experience for buyers, sellers, and investors alike.'
    }
  },
  {
    sectionKey: 'page_contact_us',
    title: 'Contact Us Page Content',
    contentData: {
      title: 'Contact Us',
      subtitle: 'Get in touch with Veer Real Estate consultants',
      phone: '+91 97270 27052',
      whatsapp: '919727027052',
      email: 'info@veerrealestate.com',
      address: 'Ahmedabad, Gujarat, India',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117534.5097227448!2d72.50294969726562!3d23.022505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000'
    }
  },
  {
    sectionKey: 'page_builder_consultation',
    title: 'Builder Consultation Page Content',
    contentData: {
      title: 'Developer Consultation & Project Marketing',
      subtitle: 'Strategic project positioning, high-conversion buyer reach, and RERA compliance guidance in Ahmedabad',
      ctaText: 'Schedule Developer Consultation'
    }
  },
  {
    sectionKey: 'header_config',
    title: 'Header & Navigation Configuration',
    contentData: {
      logoUrl: '/images/veer-logo-old.png',
      logoAlt: 'Veer Real Estate',
      phone: '+91 97270 27052',
      ctaText: 'Search Properties',
      ctaUrl: '/properties',
      navLinks: [
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about-us' },
        { label: 'Properties', url: '/properties' },
        { label: 'Projects', url: '/projects' },
        { label: 'Blog', url: '/blog' },
        { label: 'Contact', url: '/contact' }
      ]
    }
  },
  {
    sectionKey: 'footer_config',
    title: 'Footer Configuration',
    contentData: {
      logoUrl: '/images/veer-logo-old.png',
      description: 'Veer Real Estate — Your trusted property partner in Ahmedabad since 2012.',
      eastOffice: 'East Ahmedabad',
      westOffice: 'West Ahmedabad',
      copyright: '© 2026 Veer Real Estate. All rights reserved.',
      reraDisclaimer: 'All project information, amenities, and floor plans are subject to change as per developer specifications and RERA guidelines.'
    }
  },
  {
    sectionKey: 'website_settings',
    title: 'Global Website Settings',
    contentData: {
      siteName: 'Veer Real Estate',
      tagline: 'Your Trusted Partner in Real Estate',
      maintenanceMode: false,
      notificationEmail: 'info@veerrealestate.com',
      googleAnalyticsId: 'G-XXXXXXXXXX'
    }
  }
];

async function seedWebsiteManagement() {
  console.log('Seeding Website Management defaults into website_content table...');
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
    for (const sec of defaultSections) {
      const [rows] = await pool.query('SELECT id FROM website_content WHERE sectionKey = ?', [sec.sectionKey]);
      if (rows.length === 0) {
        await pool.query(
          'INSERT INTO website_content (sectionKey, title, contentData, updatedBy) VALUES (?, ?, ?, ?)',
          [sec.sectionKey, sec.title, JSON.stringify(sec.contentData), 'Super Admin Initializer']
        );
        console.log(`+ Seeded section: ${sec.sectionKey}`);
      } else {
        console.log(`= Section already exists: ${sec.sectionKey}`);
      }
    }
    console.log('Website Management seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedWebsiteManagement();
