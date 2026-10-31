'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from './components/PropertyCard';
import Loader from './components/Loader';
import { formatPrice, type Property } from '@/lib/properties';
import { ArrowRight } from "lucide-react";
import GoogleReviews from './components/GoogleReviews';
import Partner from './components/Partner';
import Projects from './components/Projects';
import ProjectsInMotion from './components/ProjectsInMotion';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchStatus, setSearchStatus] = useState<string>('For Sale');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          const mapped: Record<string, any> = {};
          for (const [k, v] of Object.entries(data)) {
            mapped[k] = (v as any).content || {};
          }
          setSiteContent(mapped);
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
      }
    };
    fetchSiteContent();
  }, []);

  const heroData = siteContent.homepage_hero || {};
  const aboutData = siteContent.homepage_about || {};
  const statsData = siteContent.homepage_promise_stats || {};
  const brandPromiseData = siteContent.homepage_brand_promise || {};
  const coreValuesData = siteContent.homepage_core_values || {};
  const whyData = siteContent.homepage_why_choose_us || {};
  const visibility = siteContent.homepage_section_visibility || {};

  const defaultHeroImages = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbWV8ZW58MHx8MHx8fDA%3D'
  ];

  const heroImages: string[] = heroData.slides && heroData.slides.length > 0
    ? heroData.slides.map((s: any) => (typeof s === 'string' ? s : s.url))
    : defaultHeroImages;

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
      <section className="relative min-h-125 md:h-150 lg:h-screen max-h-240 flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image: string, index: number) => (
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg whitespace-pre-line">
              {heroData.title || (
                <>
                  Your Trusted Partner in <br /> Real Estate
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 opacity-95 drop-shadow">
              {heroData.subtitle || 'Find the Right Property. Make the Right Decision. Build Your Future.'}
              <br />
              <br />
              {heroData.description ||
                'Since 2012, Veer Real Estate has been helping homebuyers, property owners and investors make confident real estate decisions across Ahmedabad.'}
            </p>

            {/* Search Widget with Glassmorphism Effect */}
            <div className="backdrop-blur-lg bg-white/20 rounded-xl p-6 shadow-2xl border border-white/30">
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b-2 border-white/30">
                <button
                  onClick={() => setSearchStatus('For Sale')}
                  className={`px-6 cursor-pointer py-3 font-medium transition-colors relative ${searchStatus === 'For Sale'
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
                  className={`px-6 cursor-pointer py-3 font-medium transition-colors relative ${searchStatus === 'For Rent'
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
                  className="bg-secondary cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md col-span-1 sm:col-span-2 lg:col-span-3 hover:bg-white hover:text-black"
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
              className={`w-3 h-3 cursor-pointer rounded-full transition-all ${index === currentImageIndex
                ? 'bg-primary w-8'
                : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {visibility.partners !== false && <Partner />}

      {/* Property Showcase / About Section */}
      {visibility.about !== false && (
        <section className="py-10 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Property Images */}
              <div className="relative">
                <div className="mt-6">
                  <div className="relative flex flex-col sm:flex-row gap-4 items-start">
                    {/* Small Image / Founder Image */}
                    <div className="relative w-full sm:w-auto sm:flex-1 h-88 sm:h-130 rounded-3xl overflow-hidden shadow-lg">
                      <img
                        src={aboutData.founderImage || '/images/team/sudhir.jpeg'}
                        alt={aboutData.founderAlt || 'Founder Veer Real Estate'}
                        className="object-cover h-full w-full"
                      />
                    </div>

                    {/* Logo Beside Image */}
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-4 self-center sm:self-start shrink-0">
                      <Image
                        src={aboutData.logoImage || '/images/veer-logo-old.png'}
                        alt="Veer Logo"
                        width={160}
                        height={140}
                        className="object-contain w-32 sm:w-44 md:w-52"
                      />
                    </div>

                    {/* Happy Customer Badge */}
                    <div className="sm:absolute sm:top-56 sm:left-64 md:top-40 md:left-122 bg-white rounded-2xl p-4 shadow-xl self-center sm:self-auto w-full sm:w-auto">
                      <div className="text-center mb-2">
                        <p className="text-sm font-semibold text-secondary">{aboutData.happyCustomerTitle || 'Our Happy Customer'}</p>
                      </div>
                      <div className="flex justify-center -space-x-2">
                        {[
                          'https://randomuser.me/api/portraits/men/41.jpg',
                          'https://randomuser.me/api/portraits/men/39.jpg',
                          'https://randomuser.me/api/portraits/women/63.jpg',
                          'https://randomuser.me/api/portraits/men/85.jpg',
                        ].map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt={`Customer ${i + 1}`}
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-white"
                          />
                        ))}
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-secondary text-xs font-bold border-2 border-white">
                          {aboutData.happyCustomerCount || '3k+'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div>
                <div className="mb-4">
                  <span className="text-primary font-semibold">{aboutData.category || 'About Veer Real Estate'}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight whitespace-pre-line">
                  {aboutData.title || (
                    <>
                      Trusted Real Estate <br />Broker in Ahmedabad
                    </>
                  )}
                </h2>
                <div className="text-gray-600 mb-8 leading-relaxed space-y-4">
                  <p className="font-semibold text-secondary text-lg">
                    {aboutData.tagline || 'More Than Property. We Build Trust.'}
                  </p>
                  {(aboutData.paragraphs && aboutData.paragraphs.length > 0 ? (
                    aboutData.paragraphs.map((para: string, idx: number) => (
                      <p key={idx} className="leading-relaxed">
                        {para}
                      </p>
                    ))
                  ) : (
                    <>
                      <p>Buying or investing in real estate is one of the biggest financial decisions you make.</p>
                      <p>
                        At Veer Real Estate, we believe you deserve more than a list of properties. You deserve the right guidance, transparent information and professional support at every stage of your property journey.
                      </p>
                      <p>
                        Since 2012, we have built our reputation as a trusted Property Dealer in Ahmedabad, serving individuals, families and investors with a customer-first approach. From understanding your requirements and shortlisting suitable properties to site visits, negotiation and documentation, our team stays with you throughout the process.
                      </p>
                    </>
                  ))}
                </div>

                <ul className="text-gray-600 mb-8 space-y-3">
                  {(aboutData.bullets || [
                    'Quality real estate services',
                    '100% Satisfaction guarantee',
                    'Highly professional team',
                    'Dealing always on time',
                  ]).map((bullet: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 leading-relaxed">
                      <ArrowRight className="text-gray-600 w-4 h-4 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={aboutData.buttonUrl || '/about-us'}
                  className="text-secondary border border-secondary px-6 py-2.5 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-md inline-flex items-center gap-2"
                >
                  <span>{aboutData.buttonText || 'More About Us'}</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {visibility.stats !== false && (
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003D7A]">
                {statsData.title || 'Our Promise'}
              </h2>
              <p className="mt-2 text-base sm:text-lg md:text-xl text-gray-600">
                {statsData.subtitle || 'Right Property. Right Guidance. Right Decision.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {(statsData.stats || [
                { value: '98%', label: 'Satisfaction Rate' },
                { value: '5K+', label: 'Happy Customers' },
                { value: '100+', label: 'Projects' },
                { value: '15+', label: 'Years Experience' },
              ]).map((st: any, idx: number) => (
                <div
                  key={idx}
                  className="w-40 h-40 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-secondary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto"
                >
                  <div className="text-5xl font-bold text-secondary mb-2">{st.value}</div>
                  <div className="text-gray-600">{st.label}</div>
                </div>
              ))}
            </div>

            {/* Content below 4 boxes */}
            <div className="max-w-4xl mx-auto text-center mt-12 md:mt-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003D7A]">
                {statsData.investingTitle || 'Smart Real Estate Investing Starts Here'}
              </h2>

              {statsData.investingParagraphs && statsData.investingParagraphs.length > 0 ? (
                statsData.investingParagraphs.map((para: string, idx: number) => (
                  <p key={idx} className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600">
                    {para}
                  </p>
                ))
              ) : (
                <>
                  <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-600">
                    Successful Real Estate Investing requires market knowledge, location analysis, and future growth potential. At Veer Real Estate, we help investors identify high-potential Investment Property opportunities that align with their financial goals.
                  </p>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600">
                    Our advisors analyze factors such as infrastructure development, connectivity, rental demand, appreciation trends, and market pricing before recommending any investment. Whether you're purchasing your first investment property or expanding your portfolio, our experienced consultants are here to guide you every step of the way.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}
      {/* Featured Properties */}
      {visibility.featured_properties !== false && (
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Featured Properties</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked selection of our finest properties available for sale and rent
              </p>
            </div>

            {/* Property Type Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['all', 'Bunglow', 'Apartment', 'Commercial', 'Industrial', 'Plot', 'Land'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-6 py-2.5 cursor-pointer rounded-lg font-medium transition-colors ${
                    activeTab === type
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
      )}

      {/* Projects in Motion (Social Video Showcase) */}
      {visibility.projects_in_motion !== false && <ProjectsInMotion />}

      {/* BRAND PROMISE */}
      {visibility.brand_promise !== false && (
        <section className="py-10 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
                {brandPromiseData.title || 'BRAND PROMISE'}
              </h2>
              <p className="text-xl text-gray-600">
                {brandPromiseData.subtitle || 'Turning Property Dreams into Reality Since 2012'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="text-6xl text-primary mb-6">
                  <i className={brandPromiseData.mission?.icon || 'fas fa-bullseye'}></i>
                </div>
                <h3 className="text-2xl font-semibold text-secondary mb-4">
                  {brandPromiseData.mission?.title || 'Our (Mission)'}
                </h3>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p className="font-semibold">
                    {brandPromiseData.mission?.intro || 'Our mission is to simplify the real estate experience through:'}
                  </p>
                  <p className="font-bold text-secondary">
                    {brandPromiseData.mission?.highlights ||
                      'Honest Advice • Verified Property Solutions • Personalized Guidance • Professional Service'}
                  </p>
                  <p>
                    {brandPromiseData.mission?.body ||
                      'We aim to help families, homeowners and investors make confident property decisions while building long-term relationships based on trust, transparency and integrity. Every recommendation we make is guided by one simple principle: Your Long-Term Satisfaction Matters More Than One Transaction.'}
                  </p>
                </div>
              </div>

              {/* Core Purpose Card */}
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="text-6xl text-primary mb-6">
                  <i className={brandPromiseData.corePurpose?.icon || 'fas fa-home'}></i>
                </div>
                <h3 className="text-2xl font-semibold text-secondary mb-4">
                  {brandPromiseData.corePurpose?.title || 'Our Core Purpose'}
                </h3>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p className="font-semibold">
                    {brandPromiseData.corePurpose?.intro || 'Turning Property Dreams Into Reality Since 2012'}
                  </p>
                  <p>
                    {brandPromiseData.corePurpose?.bodyParagraph1 ||
                      'Our purpose is to provide reliable, transparent and end-to-end real estate solutions tailored to every client’s unique needs.'}
                  </p>
                  <p>
                    {brandPromiseData.corePurpose?.bodyParagraph2 ||
                      'Whether you are searching for an affordable home, a premium property, a commercial space or an investment opportunity, our experienced team is committed to helping you find the right solution.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Exclusive Luxury Projects Slider */}
      {visibility.luxury_projects !== false && <Projects />}

      {/* Core Values */}
      {visibility.core_values !== false && (
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                {coreValuesData.title || 'Core Values'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {coreValuesData.subtitle || 'Driven by Values. Focused on Your Future.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {(coreValuesData.values || [
                {
                  title: 'Integrity',
                  icon: 'fas fa-handshake',
                  description:
                    'We uphold the highest standards of honesty, ethics, and professionalism in everything we do. Every interaction is built on trust, accountability, and a strong commitment to lasting relationships.',
                },
                {
                  title: 'Resourceful',
                  icon: 'fas fa-lightbulb',
                  description:
                    'We embrace creativity and adaptability in every situation. By developing smart and effective solutions, we overcome challenges and consistently deliver value that exceeds expectations.',
                },
                {
                  title: 'Transparency',
                  icon: 'fas fa-eye',
                  description:
                    'We believe in open, honest, and clear communication. Our clients receive accurate information, genuine guidance, and complete clarity at every stage of the real estate journey.',
                },
                {
                  title: 'Service Excellence',
                  icon: 'fas fa-award',
                  description:
                    'Excellence drives our actions. We aim to deliver exceptional service experiences through responsiveness, professionalism, and attention to detail, ensuring complete client satisfaction.',
                },
                {
                  title: 'Knowledge',
                  icon: 'fas fa-book-open',
                  description:
                    'Our deep industry expertise and strong understanding of market trends empower clients to make confident, informed, and future-focused property decisions.',
                },
              ]).map((val: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-sm text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className={`${val.icon} text-4xl text-primary`}></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-secondary mb-4">{val.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {visibility.why_choose_us !== false && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
                {whyData.title || 'Why Choose Veer Real Estate?'}
              </h2>
              <p className="text-xl text-gray-600">{whyData.subtitle || 'Your Property Journey, Simplified.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(whyData.items || [
                { title: 'Verified Listings', desc: 'All properties are verified by our expert team', icon: 'fa-check-circle' },
                { title: 'Best Prices', desc: 'Competitive pricing and exclusive deals', icon: 'fa-tag' },
                { title: 'Expert Guidance', desc: 'Professional agents to help you', icon: 'fa-user-tie' },
                { title: 'Legal Support', desc: 'Complete documentation assistance', icon: 'fa-file-contract' },
              ]).map((benefit: any, index: number) => (
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
      )}

      {/* Testimonials */}
      {visibility.google_reviews !== false && (
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-600">Real stories from satisfied property owners and renters</p>
            </div>
            <GoogleReviews />
          </div>
        </section>
      )}


    </>
  );
}
