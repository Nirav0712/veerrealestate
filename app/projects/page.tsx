'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { projects as staticProjects } from '@/lib/projects';

interface ProjectItem {
  id: number;
  title: string;
  name?: string;
  slug: string;
  projectCode?: string;
  price: number;
  displayPrice: string;
  image: string;
  images: string[];
  status: string;
  projectCategory?: string;
  bedrooms?: number;
  configurations?: string;
  location: string;
  locationName?: string;
  locationId?: number;
  PlotArea?: string;
  address?: string;
  featured?: boolean;
  description?: string;
  zone: string;
  reraNumber?: string;
  isReraExempt?: boolean;
  developer?: string;
}

function ProjectCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const displayImages = images && images.length > 0 ? images.slice(0, 4) : ['/images/east/AARADHANA_2.jpeg'];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c - 1 + displayImages.length) % displayImages.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c + 1) % displayImages.length);
  };

  return (
    <div className="relative h-56 overflow-hidden rounded-t-xl bg-gray-100 group">
      <Image
        src={displayImages[current]}
        alt={title}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full w-7 h-7 flex items-center justify-center z-10 transition opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full w-7 h-7 flex items-center justify-center z-10 transition opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            &#8250;
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AllProjectsContent() {
  const searchParams = useSearchParams();

  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // 1. Fetch dynamic locations
    fetch('/api/locations')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setLocations(data.filter((l) => l.active !== false));
      })
      .catch((err) => console.error('Error fetching locations:', err));

    // 2. Load static projects + database projects
    const mappedStatic: ProjectItem[] = staticProjects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      displayPrice: p.displayPrice,
      image: p.image,
      images: p.images || [p.image],
      status: p.status,
      bedrooms: p.bedrooms,
      configurations: `${p.bedrooms} BHK`,
      location: p.location,
      address: p.address,
      featured: p.featured,
      description: p.description,
      zone: p.zone,
      projectCategory: 'Residential',
    }));

    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : []))
      .then((dbData) => {
        if (Array.isArray(dbData) && dbData.length > 0) {
          const mappedDb: ProjectItem[] = dbData.map((p: any) => ({
            id: p.id,
            title: p.name || p.title,
            slug: p.slug,
            projectCode: p.projectCode,
            price: Number(p.priceMin) || Number(p.price) || 0,
            displayPrice:
              p.displayPrice ||
              (p.priceMin ? `₹ ${(p.priceMin / 100000).toFixed(2)} Lakh` : 'Price on Request'),
            image:
              p.coverImage ||
              (Array.isArray(p.galleryImages) && p.galleryImages[0]) ||
              '/images/east/AARADHANA_2.jpeg',
            images:
              Array.isArray(p.galleryImages) && p.galleryImages.length > 0
                ? p.galleryImages
                : [p.coverImage || '/images/east/AARADHANA_2.jpeg'],
            status: p.status || 'Under Construction',
            projectCategory: p.projectCategory || 'Residential',
            bedrooms: parseInt(p.configurations) || undefined,
            configurations: p.configurations || undefined,
            location: p.locationName || p.location || (p.zone ? `${p.zone} Ahmedabad` : 'Ahmedabad'),
            locationName: p.locationName,
            locationId: p.locationId,
            PlotArea: p.landArea,
            address: p.fullAddress || p.address || p.locationName || 'Ahmedabad',
            featured: Boolean(p.featured),
            description: p.description || '',
            zone: p.zone || 'East',
            reraNumber: p.reraNumber,
            isReraExempt: Boolean(p.isReraExempt),
            developer: p.developer,
          }));

          // Merge: use DB projects, and complement with static if not already in DB
          const existingSlugs = new Set(mappedDb.map((p) => p.slug));
          const uniqueStatic = mappedStatic.filter((p) => !existingSlugs.has(p.slug));
          setAllProjects([...mappedDb, ...uniqueStatic]);
        } else {
          setAllProjects(mappedStatic);
        }
      })
      .catch((err) => {
        console.error('Error fetching DB projects:', err);
        setAllProjects(mappedStatic);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter & sort logic
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesDev = p.developer ? p.developer.toLowerCase().includes(q) : false;
        const matchesAddress = p.address ? p.address.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesLoc && !matchesDev && !matchesAddress) return false;
      }

      // Location filter
      if (selectedLocation !== 'all') {
        const locLower = selectedLocation.toLowerCase();
        const pLoc = p.location.toLowerCase();
        const pZone = p.zone ? p.zone.toLowerCase() : '';
        if (locLower === 'east' || locLower === 'east ahmedabad') {
          if (!pLoc.includes('east') && pZone !== 'east') return false;
        } else if (locLower === 'west' || locLower === 'west ahmedabad') {
          if (!pLoc.includes('west') && pZone !== 'west') return false;
        } else {
          if (!pLoc.includes(locLower)) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (!p.projectCategory || p.projectCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (p.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // Price filter
      if (minPrice && p.price > 0 && p.price < parseFloat(minPrice)) return false;
      if (maxPrice && p.price > 0 && p.price > parseFloat(maxPrice)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [allProjects, searchQuery, selectedLocation, selectedCategory, selectedStatus, minPrice, maxPrice, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  const getDetailUrl = (p: ProjectItem) => {
    if (p.zone && p.zone.toLowerCase() === 'west') {
      return `/projects/west/${p.slug}`;
    }
    return `/projects/east/${p.slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-secondary via-secondary-light to-secondary text-white py-12 md:py-16 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase bg-primary/20 px-3 py-1 rounded-full">
              Verified Developments
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-3">
              Explore All Projects
            </h1>
            <p className="text-gray-200 text-base sm:text-lg">
              Discover residential townships, luxury apartments, commercial complexes, and plotted developments across Ahmedabad.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Search & Filter
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Search */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Keyword</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Project or locality..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Zone</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="East">East Ahmedabad</option>
                    <option value="West">West Ahmedabad</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plotted Development">Plotted Development</option>
                    <option value="Mixed Use">Mixed Use</option>
                    <option value="Township">Township</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Construction Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Pre-launch">Pre-launch</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="For Sale">For Sale</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Listings */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-200 gap-3">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-bold text-secondary">{filteredProjects.length}</span> projects
                {selectedLocation !== 'all' && <span> in <strong className="text-secondary">{selectedLocation}</strong></span>}
              </p>
              <div className="flex gap-2">
                <Link
                  href="/projects/east"
                  className="text-xs bg-white border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-3 py-1.5 rounded-lg transition"
                >
                  East Ahmedabad
                </Link>
                <Link
                  href="/projects/west"
                  className="text-xs bg-white border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-3 py-1.5 rounded-lg transition"
                >
                  West Ahmedabad
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : paginatedProjects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">No Projects Match Your Search</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Try clearing your filters or searching for another location or project category.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden flex flex-col group"
                    >
                      <div className="relative">
                        <ProjectCarousel images={project.images} title={project.title} />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                          {project.featured && (
                            <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                              Featured
                            </span>
                          )}
                          <span className="bg-secondary/90 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-md shadow">
                            {project.status}
                          </span>
                        </div>

                        {/* RERA Badge */}
                        <div className="absolute bottom-2 right-2 z-10">
                          {project.reraNumber ? (
                            <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                              RERA: {project.reraNumber.slice(0, 10)}...
                            </span>
                          ) : project.isReraExempt ? (
                            <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded shadow">
                              RERA Exempt
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {project.projectCategory || 'Residential'}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {project.zone ? `${project.zone} Zone` : ''}
                          </span>
                        </div>

                        <h3 className="font-bold text-secondary text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>

                        <div className="flex items-center text-gray-500 text-xs mb-3">
                          <svg className="w-3.5 h-3.5 text-primary mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{project.location}</span>
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-gray-400 block">Starting From</span>
                            <span className="text-primary font-extrabold text-base">
                              {project.displayPrice}
                            </span>
                          </div>

                          <Link
                            href={getDetailUrl(project)}
                            className="bg-secondary hover:bg-primary text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          currentPage === num ? 'bg-primary text-white' : 'border hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AllProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Projects...</div>}>
      <AllProjectsContent />
    </Suspense>
  );
}
