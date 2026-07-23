import { filterPropertiesHelper, Property } from '../lib/properties';

// Test with empty array - real data comes from the database API
const testProperties: Property[] = [];

console.log('Total properties:', testProperties.length);

// Test 1: Filter by Transaction 'resale'
const resaleProps = filterPropertiesHelper(testProperties, { transaction: 'resale' });
console.log('Resale properties:', resaleProps.length);
resaleProps.forEach(p => {
    if (p.transaction !== 'resale') console.error('FAILED: Found non-resale property in resale filter');
});

// Test 2: Filter by Transaction 'new'
const newProps = filterPropertiesHelper(testProperties, { transaction: 'new' });
console.log('New properties:', newProps.length);
newProps.forEach(p => {
    if (p.transaction !== 'new') console.error('FAILED: Found non-new property in new filter');
});

// Test 3: Filter by Location (case insensitive)
const mumbaiProps = filterPropertiesHelper(testProperties, { location: 'mumbai' });
console.log('Mumbai properties:', mumbaiProps.length);
mumbaiProps.forEach(p => {
    if (!p.location.toLowerCase().includes('mumbai') && !p.title.toLowerCase().includes('mumbai')) {
        console.error('FAILED: Found non-Mumbai property in Mumbai filter');
    }
});

// Test 4: Combined Filter
const complexFilter = filterPropertiesHelper(testProperties, {
    transaction: 'resale',
    minPrice: 5000000,
    bedrooms: 2
});
console.log('Complex filter (Resale, >50L, 2+ BHK):', complexFilter.length);
complexFilter.forEach(p => {
    if (p.transaction !== 'resale' || p.price < 5000000 || p.bedrooms < 2) {
        console.error('FAILED: Complex filter failed');
    }
});

console.log('Verification Complete');
