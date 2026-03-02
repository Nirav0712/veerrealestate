'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from './components/PropertyCard';
import Loader from './components/Loader';
import { formatPrice, type Property } from '@/lib/properties';
import { ArrowRight } from "lucide-react";
import GoogleReviews from './components/GoogleReviews';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchStatus, setSearchStatus] = useState<string>('For Sale');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
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

      {/* Hero Section with Auto-Scrolling Background */}
      <section className="relative min-h-125 md:h-150 lg:h-screen max-h-200 flex items-center justify-center overflow-hidden">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              Find Your Dream Home
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 opacity-95 drop-shadow">
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/30 shadow-lg"
              >
                {/* Property Type */}
                <select
                  name="type"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-500"
                >
                  <option value="">Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial Shops</option>
                  <option value="Commercial">Commercial Office</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Banglow">Bunglows</option>
                  <option value="Land">Land</option>
                  <option value="Plot">Plot</option>
                </select>

                {/* Location */}
                <input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  className="px-4 py-3 bg-white/80 rounded-lg 
             focus:outline-none focus:ring-2 
             focus:ring-primary text-black w-full  placeholder:text-gray-500"
                />
                {/* <select
                  name="location"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                >
                  <option value="">Location</option>
                  {Array.from(new Set(properties.map(p => p.location))).sort().map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select> */}

                {/* BHK */}
                <select
                  name="bhk"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-500"
                >
                  <option value="">BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>

                {/* Min Budget */}
                <input
                  type="number"
                  name="minBudget"
                  placeholder="Enter Min Budget"
                  className="px-4 py-3 bg-white/80 rounded-lg 
             focus:outline-none focus:ring-2 
             focus:ring-primary text-black w-full  placeholder:text-gray-500"
                />
                {/* <select
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
                </select> */}

                {/* Max Budget */}
                <input
                  type="number"
                  name="maxBudget"
                  placeholder="Enter Max Budget"
                  className="px-4 py-3 bg-white/80 rounded-lg 
             focus:outline-none focus:ring-2 
             focus:ring-primary text-black w-full  placeholder:text-gray-500"
                />
                {/* <select
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
                </select> */}

                {/* Transaction */}
                <select
                  name="transaction"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-500"
                >
                  <option value="">Transaction</option>
                  <option value="new">New Property</option>
                  <option value="resale">Resale</option>
                  <option value="underconstruction">Under Construction</option>
                </select>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md col-span-1 sm:col-span-2 lg:col-span-3 hover:bg-white hover:text-black"
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
              {/* <div className="grid grid-cols-1 gap-4"> */}
              {/* Main large image */}
              <div className="col-span-2 relative h-80 rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
                  alt="Luxury Property"
                  fill
                  className="object-cover"
                />
              </div>


              {/* Small Property Image */}
              <div className='grid grid-cols-1 gap-4 mt-6 '>
                <div className="relative">
                  <div className="flex gap-4 items-start">

                    {/* Small Image */}
                    <div className="relative h-68 w-120 rounded-3xl overflow-hidden shadow-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
                        alt="Property 1"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Logo Beside Image */}
                    <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg p-4">
                      <Image
                        src="/images/veer-logo.png"
                        alt="Veer Logo"
                        width={240}
                        height={220}
                        className="object-contain"
                      />
                    </div>

                    {/* Happy Customer Badge */}
                    <div className="absolute top-43  left-80 bg-white rounded-2xl p-4 shadow-xl">
                      <div className="text-center mb-2">
                        <p className="text-sm font-semibold text-secondary">Our Happy Customer</p>
                      </div>
                      <div className="flex -space-x-2">
                        {[
                          'https://randomuser.me/api/portraits/men/41.jpg',
                          'https://randomuser.me/api/portraits/men/39.jpg',
                          'https://randomuser.me/api/portraits/women/63.jpg',
                          'https://randomuser.me/api/portraits/men/85.jpg',
                          // 'https://randomuser.me/api/portraits/women/62.jpg',

                        ].map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt={`Customer ${i + 1}`}
                            width={45}
                            height={35}
                            className="rounded-full border-2 border-white"
                          />
                        ))}
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-secondary text-xs font-bold border-2 border-white">
                          3k+
                        </div>
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
                Established in 2012 by visionary entrepreneurs Harshad Prajapati and Sudhir Prajapati, Veer Real Estate has emerged as one of Ahmedabad's most trusted and fast-growing real estate consultancy firms. Built on strong values of integrity, transparency, and customer commitment, the company has consistently delivered excellence in the dynamic real estate market. <br /> <br />
                Veer Real Estate offers a complete spectrum of property solutions — from premium commercial spaces and luxury residences to affordable and budget-friendly homes, catering to diverse customer needs and investment goals. <br /> <br />

                Understanding that a property is not just a transaction but a lifetime decision, the team focuses on personalized guidance, market expertise, and long-term client relationships. Their client-first approach has led to the successful sale of 1,500+ residential units and the trust of 2,200+ happy customers. <br /> <br />

                Today, Veer Real Estate stands as a symbol of reliability and professionalism in Ahmedabad's real estate landscape, helping families find their dream homes and investors secure valuable opportunitie
              </p>
              <ul className="text-gray-600 mb-8 space-y-3">
                <li className="flex items-center gap-3 leading-relaxed">
                  <ArrowRight className="text-gray-600 w-4 h-4 shrink-0" />
                  <span>Quality real estate services</span>
                </li>

                <li className="flex items-center gap-3 leading-relaxed">
                  <ArrowRight className="text-gray-600 w-4 h-4 shrink-0" />
                  <span>100% Satisfaction guarantee</span>
                </li>

                <li className="flex items-center gap-3 leading-relaxed">
                  <ArrowRight className="text-gray-600 w-4 h-4 shrink-0" />
                  <span>Highly professional team</span>
                </li>

                <li className="flex items-center gap-3 leading-relaxed">
                  <ArrowRight className="text-gray-600 w-4 h-4 shrink-0" />
                  <span>Dealing always on time</span>
                </li>
              </ul>


              {/* Stats */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold text-secondary mb-1">10K</div>
                  <div className="text-sm text-gray-600">Homes Sold</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">3K+</div>
                  <div className="text-sm text-gray-600">Happy Client</div>
                </div>
                <div className="col-span-1 sm:col-span-1">
                  <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div> */}

              {/* CTA Button */}
              <Link
                href="/about"
                className=" text-secondary border border-secondary px-6 py-2.5 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
              // className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                More About Us
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className='w-40 h-40 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-secondary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-secondary mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className='w-40 h-40 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-secondary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-secondary mb-2">5K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className='w-40 h-40 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-secondary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-secondary mb-2">100+</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div className='w-40 h-40 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-secondary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-secondary mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2x2 mx-auto">
              Handpicked selection of our finest properties available for sale and rent
            </p>
          </div>

          {/* Property Type Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['all', 'Bunglow', 'Apartment', 'Commercial', 'Industrial', 'Plot', 'Land'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === type
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-secondary hover:text-white border border-gray-300'
                  }`}
              >
                {type === 'all' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>

          {/* Property Grid */}
          {loading ? (
            <Loader />
          ) : displayedProperties.length > 0 ? (
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

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">BRAND PROMISE:</h2>
            <p className="text-xl text-gray-600">100% Dream Accomplishment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Big Harry Audicious Goal (Mission)</h3>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to create a future where no family remains without a home, transforming aspirations into reality through innovative real estate solutions and unwavering commitment to customer satisfaction. <br /><br />

                By 15th August 2047, Veer Real Estate envisions positively impacting the lives of 1 million families by helping them achieve their dream of homeownership, while building a strong network of 5,000 skilled and dedicated professionals who share our passion for excellence, integrity, and service. <br /><br />

                We aim not only to build properties, but to build communities, create opportunities, and deliver lasting happiness for generations to come. <br /><br />

                “Turning Dreams into Addresses, and Houses into Homes.”
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-home"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Core Purporse :</h3>
              <p className="text-gray-600 leading-relaxed">
                Since 2012, Veer Real Estate has been committed to serving as a trusted one-stop real estate solutions provider, supported by a skilled, passionate, and dedicated team. <br /><br />

                Our core purpose is to deliver high-quality, innovative, and sustainable customized solutions that transform our clients' aspirations into reality. By understanding individual needs and providing personalized guidance, we strive to make every property journey seamless, reliable, and rewarding. <br /><br />

                We believe in building long-term relationships founded on trust, transparency, and excellence, helping our clients accomplish their dreams with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our Values, Your Confidence
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

            {/* Integrity */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-handshake text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                We uphold the highest standards of honesty, ethics, and professionalism in everything we do. Every interaction is built on trust, accountability, and a strong commitment to lasting relationships.
              </p>
            </div>

            {/* Resourceful */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-lightbulb text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Resourceful</h3>
              <p className="text-gray-600 leading-relaxed">
                We embrace creativity and adaptability in every situation. By developing smart and effective solutions, we overcome challenges and consistently deliver value that exceeds expectations.
              </p>
            </div>

            {/* Transparency */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-eye text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in open, honest, and clear communication. Our clients receive accurate information, genuine guidance, and complete clarity at every stage of the real estate journey.
              </p>
            </div>

            {/* Service Excellence */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-award text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Service Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                Excellence drives our actions. We aim to deliver exceptional service experiences through responsiveness, professionalism, and attention to detail, ensuring complete client satisfaction.
              </p>
            </div>

            {/* Knowledge */}
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-book-open text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                Our deep industry expertise and strong understanding of market trends empower clients to make confident, informed, and future-focused property decisions.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* How It Works */}
      {/* <section className="py-20 bg-gray-50">
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
      </section> */}


      {/* Why Choose Us */}
      {/* <section className="py-20">
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
      </section> */}

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real stories from satisfied property owners and renters</p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div> */}
          <GoogleReviews />
        </div>
      </section>


    </>
  );
}
