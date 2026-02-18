const sampleProperties = [
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
        id: 5, // Hill Station Cottage
        title: 'Charming Hill Station Cottage',
        price: 8500000,
        location: 'Lonavala, Maharashtra',
        type: 'House',
        status: 'For Sale',
        bedrooms: 3,
        bathrooms: 2,
        area: 1600,
        transaction: 'resale'
    }
];

const filterPropertiesHelper = (properties, filters) => {
    if (filters.status && filters.status !== 'all') {
        properties = properties.filter(p => p.status === filters.status);
    }
    if (filters.type && filters.type !== 'all') {
        properties = properties.filter(p => p.type === filters.type);
    }
    if (filters.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.bedrooms) {
        properties = properties.filter(p => p.bedrooms >= filters.bedrooms);
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

// Run Tests
console.log('Total sample properties:', sampleProperties.length);

// Test 1: Transaction 'resale'
const resale = filterPropertiesHelper(sampleProperties, { transaction: 'resale' });
console.log('Resale count:', resale.length); // Should be 2
if (resale.length !== 2) console.error('FAILED: expected 2 resale properties');

// Test 2: Transaction 'new'
const newProps = filterPropertiesHelper(sampleProperties, { transaction: 'new' });
console.log('New count:', newProps.length); // Should be 1
if (newProps.length !== 1) console.error('FAILED: expected 1 new property');

// Test 3: Location 'mumbai'
const mumbai = filterPropertiesHelper(sampleProperties, { location: 'mumbai' });
console.log('Mumbai count:', mumbai.length); // Should be 1
if (mumbai.length !== 1) console.error('FAILED: expected 1 Mumbai property');

// Test 4: Combined
const combined = filterPropertiesHelper(sampleProperties, { transaction: 'resale', minPrice: 10000000 });
console.log('Combined (Resale > 1Cr):', combined.length); // Should be 1 (Villa)
if (combined.length !== 1) console.error('FAILED: expected 1 property for combined filter');

console.log('Done');
