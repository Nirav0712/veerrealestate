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
    featured: boolean;
    image: string;
    description: string;
    yearBuilt?: number;
    parking?: number;
    amenities?: string[];
    transaction?: 'new' | 'resale' | 'underconstruction';
}

export const sampleProperties: Property[] = [
    {
        id: 1,
        title: 'Luxury Beachfront Villa',
        price: 45000000,
        location: 'Juhu, Mumbai',
        type: 'Villa',
        status: 'For Sale',
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        featured: true,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        description: 'Stunning beachfront villa with panoramic Arabian Sea views, infinity pool, and modern amenities.',
        yearBuilt: 2020,
        parking: 3,
        amenities: ['Swimming Pool', 'Arabian Sea View', 'Smart Home', 'Security System', 'Private Beach'],
        transaction: 'resale'
    },
    {
        id: 2,
        title: 'Modern Tech Park Apartment',
        price: 12500000,
        location: 'Whitefield, Bangalore',
        type: 'Apartment',
        status: 'For Sale',
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        featured: true,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        description: 'Sleek modern apartment near tech parks with city skyline views and premium amenities.',
        yearBuilt: 2021,
        parking: 2,
        amenities: ['Club House', 'Gym', 'Swimming Pool', 'Power Backup', '24/7 Security'],
        transaction: 'new'
    },
    {
        id: 3,
        title: 'Spacious Family Villa',
        price: 85000,
        location: 'Sector 50, Gurgaon',
        type: 'House',
        status: 'For Rent',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        featured: true,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        description: 'Beautiful family home in gated community with excellent schools nearby.',
        yearBuilt: 2018,
        parking: 2,
        amenities: ['Gated Community', 'Children Play Area', 'Garden', 'Modular Kitchen'],
        transaction: 'resale'
    },
    {
        id: 4,
        title: 'Luxury Golf Course Penthouse',
        price: 35000000,
        location: 'DLF Phase 5, Gurgaon',
        type: 'Condo',
        status: 'For Sale',
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        featured: true,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        description: 'Exclusive penthouse with golf course views, private elevator, and world-class finishes.',
        yearBuilt: 2022,
        parking: 3,
        amenities: ['Golf Course View', 'Private Elevator', 'Terrace Garden', 'Club Access', 'Wine Cellar'],
        transaction: 'new'
    },
    {
        id: 5,
        title: 'Charming Hill Station Cottage',
        price: 8500000,
        location: 'Lonavala, Maharashtra',
        type: 'House',
        status: 'For Sale',
        bedrooms: 3,
        bathrooms: 2,
        area: 1600,
        featured: true,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
        description: 'Serene cottage with valley views, surrounded by nature and trekking trails.',
        yearBuilt: 2017,
        parking: 2,
        amenities: ['Valley View', 'Mountain Air', 'Fireplace', 'Private Garden', 'Water Supply'],
        transaction: 'resale'
    },
    {
        id: 6,
        title: 'Urban Loft in Koramangala',
        price: 55000,
        location: 'Koramangala, Bangalore',
        type: 'Apartment',
        status: 'For Rent',
        bedrooms: 2,
        bathrooms: 2,
        area: 1400,
        featured: true,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        description: 'Modern loft with contemporary design, high ceilings, and premium amenities.',
        yearBuilt: 2020,
        parking: 1,
        amenities: ['High Ceilings', 'Gym', 'Cafeteria', 'Pet Friendly', 'Wi-Fi'],
        transaction: 'resale'
    },
    {
        id: 7,
        title: 'Goa Beachfront Villa',
        price: 75000000,
        location: 'Candolim, Goa',
        type: 'Villa',
        status: 'For Sale',
        bedrooms: 6,
        bathrooms: 5,
        area: 5500,
        featured: false,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        description: 'Direct beach access, infinity pool, home theater, and wine cellar.',
        yearBuilt: 2021,
        parking: 4,
        amenities: ['Beach Access', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Outdoor Kitchen'],
        transaction: 'new'
    },
    {
        id: 8,
        title: 'Himalayan View Estate',
        price: 22000000,
        location: 'Dehradun, Uttarakhand',
        type: 'House',
        status: 'For Sale',
        bedrooms: 5,
        bathrooms: 4,
        area: 3800,
        featured: false,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        description: 'Breathtaking Himalayan views with modern architecture and eco-friendly design.',
        yearBuilt: 2019,
        parking: 3,
        amenities: ['Mountain View', 'Solar Panels', 'Rainwater Harvesting', 'Fireplace', 'Large Terrace'],
        transaction: 'resale'
    },
    {
        id: 9,
        title: 'Studio in Cyber City',
        price: 28000,
        location: 'Cyber City, Pune',
        type: 'Apartment',
        status: 'For Rent',
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        featured: false,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        description: 'Efficient studio apartment perfect for young professionals near IT parks.',
        yearBuilt: 2020,
        parking: 1,
        amenities: ['Fully Furnished', 'Wi-Fi', 'Gym', 'Near Metro', 'Power Backup'],
        transaction: 'resale'
    },
    {
        id: 10,
        title: 'Eco-Friendly Row House',
        price: 15500000,
        location: 'Aundh, Pune',
        type: 'House',
        status: 'For Sale',
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        featured: false,
        image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&q=80',
        description: 'Sustainable row house with solar panels, rainwater harvesting, and beautiful garden.',
        yearBuilt: 2020,
        parking: 2,
        amenities: ['Solar Panels', 'Rainwater Harvesting', 'Organic Garden', 'Compost Pit', 'Energy Efficient'],
        transaction: 'resale'
    },
    {
        id: 11,
        title: 'Prime Commercial Land - Noida',
        price: 28000000,
        location: 'Sector 62, Noida',
        type: 'Land',
        status: 'For Sale',
        bedrooms: 0,
        bathrooms: 0,
        area: 15000,
        featured: false,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        description: 'Premium commercial land in high-growth IT corridor, approved for mixed-use development.',
        amenities: ['Commercial Zone', 'Wide Road Frontage', 'All Utilities', 'Metro Connectivity', 'High FAR'],
        transaction: 'new'
    },
    {
        id: 12,
        title: 'Residential Plot - Hyderabad',
        price: 18500000,
        location: 'Gachibowli, Hyderabad',
        type: 'Land',
        status: 'For Sale',
        bedrooms: 0,
        bathrooms: 0,
        area: 8000,
        featured: false,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        description: 'HMDA approved residential plot near HITEC City, all utilities available.',
        amenities: ['HMDA Approved', 'Clear Title', 'Gated Layout', 'Water & Electricity', 'Near IT Hub'],
        transaction: 'new'
    }
];

// Property management functions
export const getProperties = (): Property[] => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('properties');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing stored properties:", e);
                return sampleProperties;
            }
        }
    }
    return sampleProperties;
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
        return `Γé╣${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) { // 1 Lakh or more
        return `Γé╣${(price / 100000).toFixed(2)} L`;
    } else {
        return `Γé╣${price.toLocaleString('en-IN')}`;
    }
};
