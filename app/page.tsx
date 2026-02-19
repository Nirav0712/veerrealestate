'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertyCard from './components/PropertyCard';
import { formatPrice, type Property } from '@/lib/properties';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchStatus, setSearchStatus] = useState<string>('For Sale');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbWV8ZW58MHx8MHx8fDA%3D'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Filter featured properties from the fetched data
  const featuredProperties = properties.filter(p => p.featured).slice(0, 6);
  const displayedProperties = activeTab === 'all'
    ? featuredProperties
    : featuredProperties.filter(p => p.type === activeTab);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    params.set('status', searchStatus);
    if (formData.get('location')) params.set('location', formData.get('location') as string);
    if (formData.get('type') && formData.get('type') !== 'all') params.set('type', formData.get('type') as string);
    if (formData.get('bhk') && formData.get('bhk') !== 'all') params.set('bedrooms', formData.get('bhk') as string);
    if (formData.get('minBudget')) params.set('minPrice', formData.get('minBudget') as string);
    if (formData.get('maxBudget')) params.set('maxPrice', formData.get('maxBudget') as string);
    if (formData.get('transaction')) params.set('transaction', formData.get('transaction') as string);

    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <Header />

      {/* Hero Section with Auto-Scrolling Background */}
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <Image
                src={image}
                alt={`Property ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-r from-secondary/80 to-secondary/40 opacity-70"></div>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl mb-20 opacity-95 drop-shadow">
              Discover the perfect property from our extensive listings of homes, apartments, and commercial spaces
            </p>

            {/* Search Widget with Glassmorphism Effect */}
            <div className="backdrop-blur-lg bg-white/20 rounded-xl p-6 shadow-2xl border border-white/30">
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b-2 border-white/30">
                <button
                  onClick={() => setSearchStatus('For Sale')}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === 'For Sale'
                    ? 'text-primary'
                    : 'text-white hover:text-primary'
                    }`}
                >
                  For Sale
                  {searchStatus === 'For Sale' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setSearchStatus('For Rent')}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === 'For Rent'
                    ? 'text-primary'
                    : 'text-white hover:text-primary'
                    }`}
                >
                  For Rent
                  {searchStatus === 'For Rent' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>


              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-lg"
              >
                {/* Property Type */}
                <select
                  name="type"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">Property Types</option>
                  <option value="Land">Land</option>
                  <option value="Plot">Plot</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Banglow">Banglow</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Commercial">Commercial Shops</option>
                  <option value="Commercial">Commercial Office</option>
                </select>

                {/* Location */}
                <select
                  name="location"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">Location</option>
                  {Array.from(new Set(properties.map(p => p.location))).sort().map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>

                {/* BHK */}
                <select
                  name="bhk"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>

                {/* Min Budget */}
                <select
                  name="minBudget"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">Min Budget</option>
                  {Array.from(new Set(properties
                    .filter(p => p.status === searchStatus)
                    .map(p => p.price)))
                    .sort((a, b) => a - b)
                    .map((price, index) => (
                      <option key={index} value={price}>{formatPrice(price)}</option>
                    ))}
                </select>

                {/* Max Budget */}
                <select
                  name="maxBudget"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">Max Budget</option>
                  {Array.from(new Set(properties
                    .filter(p => p.status === searchStatus)
                    .map(p => p.price)))
                    .sort((a, b) => a - b)
                    .map((price, index) => (
                      <option key={index} value={price}>{formatPrice(price)}</option>
                    ))}
                </select>

                {/* Transaction */}
                <select
                  name="transaction"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">Transaction</option>
                  <option value="new">New Property</option>
                  <option value="resale">Resale</option>
                  <option value="underconstruction">Under Construction</option>
                </select>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md col-span-1 md:col-span-3"
                >
                  Search
                </button>
              </form>

            </div>

          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                ? 'bg-primary w-8'
                : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Property Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Property Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2 relative h-80 rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
                    alt="Luxury Property"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top small image with customer badge */}
                <div className="relative">
                  <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
                      alt="Property 1"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Happy Customer Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="text-center mb-2">
                      <p className="text-sm font-semibold text-secondary">Our Happy Customer</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[
                        'https://randomuser.me/api/portraits/women/32.jpg',
                        'https://randomuser.me/api/portraits/men/45.jpg',
                        'https://randomuser.me/api/portraits/women/68.jpg',
                        'https://randomuser.me/api/portraits/men/52.jpg'
                      ].map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Customer ${i + 1}`}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white"
                        />
                      ))}
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-secondary text-xs font-bold border-2 border-white">
                        2k+
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <div className="mb-4">
                <span className="text-primary font-semibold">About Veer Real Estate</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                Embrace the Elegance<br />Our Exclusive Property
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Veer Real Estate, we're redefining the way people find, sell, and invest in properties.
                Our mission is to simplify real estate by providing innovative solutions, expert guidance,
                and personalized service.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {/* <div>
                  <div className="text-4xl font-bold text-secondary mb-1">10K</div>
                  <div className="text-sm text-gray-600">Homes Sold</div>
                </div> */}
                <div>
                  <div className="text-4xl font-bold text-secondary mb-1">5K</div>
                  <div className="text-sm text-gray-600">Happy Client</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-1">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                See All Properties
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      {/* <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary text-center mb-8">Find Your Perfect Property</h2>

            <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
              <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
                <button
                  onClick={() => setSearchStatus('For Sale')}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === 'For Sale'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                    }`}
                >
                  For Sale
                  {searchStatus === 'For Sale' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setSearchStatus('For Rent')}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === 'For Rent'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                    }`}
                >
                  For Rent
                  {searchStatus === 'For Rent' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="location"
                  placeholder="Location or keyword"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                />

                <select
                  name="type"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                >
                  <option value="all">All Types</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Land">Land</option>
                </select>

                <select
                  name="bedrooms"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                >
                  <option value="all">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>

                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fas fa-search"></i>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section> */}


      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our finest properties available for sale and rent
            </p>
          </div>

          {/* Property Type Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['all', 'Villa', 'Apartment', 'House', 'Condo', 'Commercial', 'Industrial', 'Plot'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === type
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                {type === 'all' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>

          {/* Property Grid */}
          {displayedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600">No properties found in this category.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-block bg-transparent border-2 border-secondary text-secondary px-10 py-4 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all text-lg"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Properties Sold</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">5K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Expert Agents</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Cities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Explore Properties by City</h2>
            <p className="text-xl text-gray-600">Premium real estate across India's top metro cities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Mumbai', count: '2,500+ Properties', icon: 'fa-building' },
              { name: 'Bangalore', count: '1,800+ Properties', icon: 'fa-laptop' },
              { name: 'Delhi NCR', count: '3,200+ Properties', icon: 'fa-landmark' },
              { name: 'Pune', count: '1,200+ Properties', icon: 'fa-graduation-cap' },
              { name: 'Goa', count: '450+ Properties', icon: 'fa-umbrella-beach' },
              { name: 'Hyderabad', count: '900+ Properties', icon: 'fa-city' }
            ].map((city, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <i className={`fas ${city.icon} text-3xl text-primary`}></i>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Property Types</h2>
            <p className="text-xl text-gray-600">Find the perfect property type for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { type: 'Luxury Villas', desc: 'Exclusive villas with premium amenities', icon: 'fa-home', color: 'from-blue-500 to-blue-600' },
              { type: 'Apartments', desc: 'Modern apartments in prime locations', icon: 'fa-building', color: 'from-green-500 to-green-600' },
              { type: 'Commercial', desc: 'Office spaces and retail properties', icon: 'fa-briefcase', color: 'from-purple-500 to-purple-600' },
              { type: 'Land/Plots', desc: 'Residential and commercial land', icon: 'fa-map', color: 'from-orange-500 to-orange-600' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`h-32 bg-linear-to-br ${item.color} flex items-center justify-center`}>
                  <i className={`fas ${item.icon} text-6xl text-white`}></i>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{item.type}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                  <button className="mt-4 text-primary font-medium hover:text-primary-dark transition-colors">
                    View Properties <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your perfect property</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Search Property</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through our extensive database of properties using advanced filters to find exactly what you need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Schedule Visit</h3>
              <p className="text-gray-600 leading-relaxed">
                Book a convenient time to visit the property and get a comprehensive tour from our expert agents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-key"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Get Your Keys</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete the paperwork and move into your dream home with our hassle-free process.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Why Choose Veer Real Estate?</h2>
            <p className="text-xl text-gray-600">India's most trusted real estate platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Verified Listings', desc: 'All properties are verified by our expert team', icon: 'fa-check-circle' },
              { title: 'Best Prices', desc: 'Competitive pricing and exclusive deals', icon: 'fa-tag' },
              { title: 'Expert Guidance', desc: 'Professional agents to help you', icon: 'fa-user-tie' },
              { title: 'Legal Support', desc: 'Complete documentation assistance', icon: 'fa-file-contract' }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <i className={`fas ${benefit.icon} text-4xl text-primary`}></i>
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real stories from satisfied property owners and renters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Villa Owner',
                image: 'https://randomuser.me/api/portraits/men/43.jpg',
                text: 'Veer RealEstate helped us find our dream villa in Mumbai. The team was professional and understood our requirements perfectly!'
              },
              {
                name: 'Priya Sharma',
                role: 'Apartment Owner',
                image: 'https://randomuser.me/api/portraits/women/68.jpg',
                text: 'Excellent service! Found the perfect 3BHK in Bangalore within two weeks. Highly recommend their platform.'
              },
              {
                name: 'Amit Patel',
                role: 'Commercial Investor',
                image: 'https://randomuser.me/api/portraits/men/79.jpg',
                text: 'As a commercial investor, I appreciated the detailed listings and responsive agents. Great experience with land purchase!'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4 border-4 border-primary"
                />
                <div className="text-yellow-400 mb-4 text-xl">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="font-semibold text-secondary">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
