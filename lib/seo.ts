import type { Metadata } from 'next';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  canonicalDomain: string;
  googleSiteVerification: string;
  googleAnalyticsId: string;
  defaultOgImage: string;
  robotsDefault: string;
  organizationName: string;
  organizationPhone: string;
  organizationEmail: string;
  organizationAddress: string;
}

export const DEFAULT_SEO_CONFIG: SeoSettings = {
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

/**
 * App Router Metadata helper for clean, standard, deduplicated metadata.
 */
export function constructMetadata({
  title,
  description,
  canonicalUrl,
  image,
  robots,
  keywords,
  type = 'website',
  publishedTime,
  authors,
}: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  robots?: string;
  keywords?: string | string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
}): Metadata {
  const baseTitle = title
    ? `${title} | Veer Real Estate`
    : DEFAULT_SEO_CONFIG.siteTitle;
  const baseDesc = description || DEFAULT_SEO_CONFIG.metaDescription;
  const ogImg = image || DEFAULT_SEO_CONFIG.defaultOgImage;
  const parsedRobots = robots || DEFAULT_SEO_CONFIG.robotsDefault;
  const isNoIndex = parsedRobots.toLowerCase().includes('noindex');

  const metaKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords;

  return {
    title: baseTitle,
    description: baseDesc,
    keywords: metaKeywords,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: {
      index: !isNoIndex,
      follow: !parsedRobots.toLowerCase().includes('nofollow'),
      googleBot: {
        index: !isNoIndex,
        follow: !parsedRobots.toLowerCase().includes('nofollow'),
      },
    },
    openGraph: {
      title: baseTitle,
      description: baseDesc,
      type: type,
      url: canonicalUrl,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: baseTitle,
        },
      ],
      publishedTime: publishedTime,
      authors: authors,
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: baseDesc,
      images: [ogImg],
    },
  };
}

/**
 * Schema.org RealEstateAgent / Organization structured data
 */
export function generateOrganizationJsonLd(settings: SeoSettings = DEFAULT_SEO_CONFIG) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: settings.organizationName,
    url: settings.canonicalDomain,
    logo: `${settings.canonicalDomain}/images/logo.png`,
    image: `${settings.canonicalDomain}${settings.defaultOgImage}`,
    description: settings.metaDescription,
    telephone: settings.organizationPhone,
    email: settings.organizationEmail,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Ahmedabad',
    },
  };
}

/**
 * Schema.org WebSite with SearchAction
 */
export function generateWebSiteJsonLd(siteUrl: string = 'https://veerrealestate.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Veer Real Estate',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/properties?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Schema.org Article / BlogPosting structured data
 */
export function generateArticleJsonLd(blog: any, siteUrl: string = 'https://veerrealestate.com') {
  const blogUrl = `${siteUrl}/blog/${blog.slug || blog.id}`;
  const imgUrl = blog.featuredImage?.startsWith('http')
    ? blog.featuredImage
    : `${siteUrl}${blog.featuredImage || DEFAULT_SEO_CONFIG.defaultOgImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.metaDescription || blog.title,
    url: blogUrl,
    datePublished: blog.publishedAt || blog.created_at,
    dateModified: blog.updated_at || blog.publishedAt || blog.created_at,
    author: {
      '@type': 'Person',
      name: blog.author || 'Veer Real Estate Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Veer Real Estate',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    image: [imgUrl],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
  };
}

/**
 * Generates Schema.org JSON-LD structured data for a property listing.
 */
export function generatePropertyJsonLd(property: any, siteUrl: string = 'https://veerrealestate.com') {
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : property.image
    ? [property.image]
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || property.title,
    url: `${siteUrl}/properties/${property.id}`,
    datePosted: property.created_at,
    offers: property.priceOnRequest
      ? undefined
      : {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'INR',
          businessFunction: property.status === 'For Rent' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
          availability: property.availability === 'Sold' ? 'https://schema.org/Sold' : 'https://schema.org/InStock',
        },
    mainEntity: {
      '@type': property.type === 'Apartment' ? 'Apartment' : 'SingleFamilyResidence',
      name: property.title,
      numberOfBedrooms: property.bedrooms || undefined,
      numberOfBathroomsTotal: property.bathrooms || undefined,
      floorSize: property.area
        ? {
            '@type': 'QuantitativeValue',
            value: property.area,
            unitCode: property.areaUnit === 'sqyard' ? 'YRD' : 'FTK',
          }
        : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address || property.locality || property.location,
        addressLocality: property.location || 'Ahmedabad',
        addressRegion: 'Gujarat',
        postalCode: property.pincode || undefined,
        addressCountry: 'IN',
      },
      geo: property.latitude && property.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: property.latitude,
            longitude: property.longitude,
          }
        : undefined,
      image: images.map((img: string) => (img.startsWith('http') ? img : `${siteUrl}${img}`)),
    },
  };
}

/**
 * Generates Schema.org JSON-LD structured data for a Project development.
 */
export function generateProjectJsonLd(project: any, siteUrl: string = 'https://veerrealestate.com') {
  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : project.image
    ? [project.image]
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.title,
    description: project.description || project.title,
    url: `${siteUrl}/projects/${project.zone?.toLowerCase() || 'east'}/${project.slug}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: project.price || undefined,
      offerCount: project.totalUnits || undefined,
    },
    mainEntity: {
      '@type': 'ApartmentComplex',
      name: project.title,
      description: project.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: project.address || project.location,
        addressLocality: project.location || 'Ahmedabad',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      image: images.map((img: string) => (img.startsWith('http') ? img : `${siteUrl}${img}`)),
      numberOfAccommodationUnits: project.totalUnits || undefined,
      numberOfAvailableAccommodationUnits: project.availableUnits || undefined,
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[], siteUrl: string = 'https://veerrealestate.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generates intelligent keyword suggestions based on real listing attributes.
 */
export function generateKeywordSuggestions(params: {
  title?: string;
  type?: string;
  location?: string;
  bedrooms?: number | string;
  status?: string;
  transaction?: string;
}): string {
  const parts: string[] = [];
  const loc = params.location ? params.location.trim() : 'Ahmedabad';
  const type = params.type || 'Property';
  const bhk = params.bedrooms ? `${params.bedrooms} BHK` : '';
  const action = params.status === 'For Rent' ? 'for rent' : 'for sale';

  if (params.title) parts.push(params.title);
  if (bhk) parts.push(`${bhk} in ${loc}`);
  if (bhk) parts.push(`${bhk} ${type} in ${loc}`);
  parts.push(`${type} ${action} in ${loc}`);
  parts.push(`Buy property in ${loc}`);
  if (params.transaction && params.transaction !== 'resale') {
    parts.push(`${params.transaction} projects in ${loc}`);
  }
  parts.push(`Real Estate Ahmedabad`);

  return Array.from(new Set(parts)).slice(0, 6).join(', ');
}
