export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates Schema.org JSON-LD structured data for a property listing.
 * Strictly adheres to real facts represented in the database record.
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
 * Admins can edit or customize these keywords in the CMS form.
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
