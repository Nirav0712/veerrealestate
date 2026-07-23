export interface Property {
    id: number;
    title: string;
    price: number;
    location: string;
    type: 'Villa' | 'Apartment' | 'House' | 'Condo' | 'Land' | 'Retail';
    status: 'For Sale' | 'For Rent';
    bedrooms: number;
    bathrooms: number;
    area: number;
    areaUnit?: 'sqft' | 'sqyard' | 'sqmeter';
    featured: boolean;
    images: string[];
    description: string;
    yearBuilt?: number;
    parking?: number;
    amenities?: string[];
    transaction?: 'new' | 'resale' | 'underconstruction';
}

// Property management functions
export const getProperties = (): Property[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('properties');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Data Migration: Ensure all properties use the 'images' array
                return parsed.map((p: any) => {
                    if (!p.images && p.image) {
                        return {
                            ...p,
                            images: [p.image],
                            image: undefined // Clean up old property
                        };
                    }
                    if (!p.images) {
                        return { ...p, images: [] };
                    }
                    return p;
                });
            } catch (e) {
                console.error("Error parsing stored properties:", e);
                return [];
            }
        }
    }
    return [];
};

export const getPropertyById = (id: number | string): Property | undefined => {
    const properties = getProperties();
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return properties.find(p => p.id === numericId);
};

export const saveProperties = (properties: Property[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('properties', JSON.stringify(properties));
    }
};

export const addProperty = (property: Omit<Property, 'id'>): Property => {
    const properties = getProperties();
    // Generate a proper ID - use max existing ID + 1 or Date.now()
    const maxId = properties.reduce((max, p) => Math.max(max, p.id), 0);
    const newProperty = {
        ...property,
        id: maxId + 1
    };
    properties.push(newProperty as Property);
    saveProperties(properties);
    return newProperty as Property;
};

export const updateProperty = (id: number | string, updates: Partial<Property>): Property | null => {
    const properties = getProperties();
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const index = properties.findIndex(p => p.id === numericId);
    if (index !== -1) {
        properties[index] = { ...properties[index], ...updates };
        saveProperties(properties);
        return properties[index];
    }
    return null;
};

export const deleteProperty = (id: number | string): boolean => {
    const properties = getProperties();
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const filtered = properties.filter(p => p.id !== numericId);
    if (filtered.length < properties.length) {
        saveProperties(filtered);
        return true;
    }
    return false;
};

export const filterProperties = (filters: {
    status?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    location?: string;
    transaction?: string;
}): Property[] => {
    return filterPropertiesHelper(getProperties(), filters);
};

export const filterPropertiesHelper = (properties: Property[], filters: {
    status?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    location?: string;
    transaction?: string;
}): Property[] => {

    if (filters.status && filters.status !== 'all') {
        properties = properties.filter(p => p.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
        properties = properties.filter(p => p.type === filters.type);
    }

    if (filters.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.bedrooms) {
        properties = properties.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        properties = properties.filter(p =>
            p.location.toLowerCase().includes(searchTerm) ||
            p.title.toLowerCase().includes(searchTerm)
        );
    }

    if (filters.transaction && filters.transaction !== 'all') {
        const transTerm = filters.transaction.toLowerCase().replace(/\s+/g, '');
        properties = properties.filter(p => p.transaction === transTerm || (p.transaction === 'underconstruction' && transTerm === 'underconstruction'));
    }

    return properties;
};

// Format price in Indian Rupees with Indian numbering system
export const formatPrice = (price: number): string => {
    if (price >= 10000000) { // 1 Crore or more
        return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) { // 1 Lakh or more
        return `₹${(price / 100000).toFixed(2)} L`;
    } else {
        return `₹${price.toLocaleString('en-IN')}`;
    }
};
// Helper to get fallback image based on property type
export const getPropertyFallbackImage = (type: string): string => {
    const fallbacks: Record<string, string> = {
        'Villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        'Apartment': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        'House': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        'Banglow': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
        'Condo': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        'Land': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        'Plot': 'https://images.unsplash.com/photo-1588733103629-b77afe04cbbf?w=800&q=80',
        'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        'Industrial': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'
    };
    return fallbacks[type] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
};
