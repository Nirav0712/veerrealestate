
'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { projects, Project } from "@/lib/projects";
import { FaHeart } from "react-icons/fa";

// Full-height carousel for the detail page
function DetailImageCarousel({ project }: { project: Project }) {
  const images = project.images && project.images.length > 0
    ? project.images.slice(0, 3)
    : [project.image];
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <div className="relative h-96 md:h-125 rounded-2xl overflow-hidden mb-8 bg-gray-100">
      <Image
        src={images[current]}
        alt={project.title}
        fill
        className="object-cover transition-opacity duration-300"
        priority
      />

      {/* Badges overlay */}
      <div className="absolute top-6 left-6 flex gap-2 z-10">
        {project.featured && (
          <span className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold uppercase shadow-lg">
            Featured
          </span>
        )}
        <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold uppercase shadow-lg">
          {project.status}
        </span>
      </div>

      {images.length > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 text-xl transition"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          {/* Next */}
          <button
            onClick={next}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 text-xl transition"
            aria-label="Next image"
          >
            &#8250;
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`w-2.5 h-2.5 rounded-full transition ${i === current ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          {/* Counter */}
          <div className="absolute bottom-4 right-16 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full z-10">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function WestProjectDetailsPage() {

  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Inquiry form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setInquiryLoading(true);
    setInquiryError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          message: inquiryMessage || `Interested in project: ${project.title}`,
          leadType: 'project',
          projectTitle: project.title,
          projectSlug: project.slug,
          source: `Project Detail: ${project.title} (West)`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setInquirySuccess(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMessage('');
    } catch (err: any) {
      setInquiryError(err.message || 'Submission error. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  useEffect(() => {

    if (!params.slug) return;

    const slug =
      typeof params.slug === "string"
        ? params.slug
        : params.slug[0];

    // Check static projects first, then query database API
    const foundProject = projects.find(
      (p) => p.slug === slug && p.zone === "West"
    );

    if (foundProject) {
      setProject(foundProject);
      const similar = projects
        .filter(p => p.slug !== slug && p.zone === "West")
        .slice(0, 3);
      setSimilarProjects(similar);
    } else {
      fetch(`/api/projects/${slug}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && !data.error) {
            const mapped: Project = {
              id: data.id,
              title: data.name || data.title,
              slug: data.slug,
              price: Number(data.priceMin) || 0,
              displayPrice: data.displayPrice || 'On Request',
              image: data.coverImage || (Array.isArray(data.galleryImages) && data.galleryImages[0]) || '/images/west/default.jpeg',
              images: Array.isArray(data.galleryImages) && data.galleryImages.length > 0 ? data.galleryImages : [data.coverImage || '/images/west/default.jpeg'],
              status: data.status || 'For Sale',
              bedrooms: parseInt(data.configurations) || 2,
              location: data.locationName || 'West Ahmedabad',
              PlotArea: data.landArea || '1200 sqft',
              address: data.fullAddress || data.locationName || 'West Ahmedabad',
              featured: Boolean(data.featured),
              description: data.description || '',
              zone: 'West',
            };
            setProject(mapped);
          } else {
            router.push("/projects/west");
          }
        })
        .catch(() => router.push("/projects/west"));
    }

  }, [params.slug, router]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!project) {
    return (
      <>
        <div className="py-32 text-center text-xl">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <a href="/" className="hover:text-primary">Home</a>
            <span>/</span>
            <a href="/projects/west" className="hover:text-primary">
              West Projects
            </a>
            <span>/</span>
            <span className="text-secondary font-medium">
              {project.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">

              {/* Carousel + Heart */}
              <div className="relative">
                <DetailImageCarousel project={project} />
                <button
                  onClick={toggleFavorite}
                  className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20 transition ${isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600"
                    }`}
                >
                  <FaHeart className="text-lg" />
                </button>
              </div>


              {/* Info Section */}
              {/* <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">

                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-4xl font-bold text-secondary">
                    {project.title}
                  </h1>

                  <div className="text-3xl font-bold text-primary">
                    {project.displayPrice}
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                  <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                  <span className="text-lg">{project.location}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-gray-200">

                  <div className="text-center">
                    <i className="fas fa-bed text-3xl text-primary mb-2"></i>
                    <div className="font-semibold text-secondary">
                      {project.bedrooms} BHK
                    </div>
                    <div className="text-sm text-gray-600">Configuration</div>
                  </div>

                  <div className="text-center">
                    <i className="fas fa-building text-3xl text-primary mb-2"></i>
                    <div className="font-semibold text-secondary">
                      {project.status}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>

                  <div className="text-center">
                    <i className="fas fa-map text-3xl text-primary mb-2"></i>
                    <div className="font-semibold text-secondary capitalize">
                      {project.zone}
                    </div>
                    <div className="text-sm text-gray-600">Zone</div>
                  </div>

                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-secondary mb-4">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-secondary mb-4">
                    Property Details
                  </h2>

                  <div className="grid grid-cols-1 gap-4">

                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Plot Area:</span>
                      <span className="font-semibold text-secondary">
                        {project.PlotArea}
                      </span>
                    </div>

                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold text-secondary text-right">
                        {project.address}
                      </span>
                    </div>

                  </div>
                </div>

              </div> */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mb-8">

                {/* Title + Price */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
                    {project.title}
                  </h1>

                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {project.displayPrice}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-6">
                  <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                  <span className="text-sm sm:text-base md:text-lg">
                    {project.location}
                  </span>
                </div>

                {/* Quick Features */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 py-6 border-y border-gray-200">

                  <div className="text-center">
                    <i className="fas fa-bed text-2xl sm:text-3xl text-primary mb-2"></i>
                    <div className="font-semibold text-secondary text-sm sm:text-base">
                      {project.bedrooms} BHK
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Configuration</div>
                  </div>

                  <div className="text-center">
                    <i className="fas fa-building text-2xl sm:text-3xl text-primary mb-2"></i>
                    <div className="font-semibold text-secondary text-sm sm:text-base">
                      {project.status}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Status</div>
                  </div>

                  <div className="text-center col-span-2 sm:col-span-1">
                    <i className="fas fa-map text-2xl sm:text-3xl text-primary mb-2"></i>
                    <div className="font-semibold text-secondary text-sm sm:text-base capitalize">
                      {project.zone}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Zone</div>
                  </div>

                </div>

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-3 sm:mb-4">
                    Description
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Property Details */}
                <div className="mt-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-4">
                    Property Details
                  </h2>

                  <div className="space-y-3">

                    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-1">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Plot Area:
                      </span>
                      <span className="font-semibold text-secondary text-sm sm:text-base">
                        {project.PlotArea}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-1">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Address:
                      </span>
                      <span className="font-semibold text-secondary text-sm sm:text-base sm:text-right break-words">
                        {project.address}
                      </span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  Request Information
                </h3>

                {inquirySuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-emerald-900 mb-1">Inquiry Submitted!</h4>
                    <p className="text-emerald-700 text-sm mb-4">
                      Thank you for your interest in {project.title}. Our project specialist will contact you shortly.
                    </p>
                    <button
                      onClick={() => setInquirySuccess(false)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                    >
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                        {inquiryError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        rows={3}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder={`I am interested in ${project.title}. Please share floor plans and pricing.`}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={inquiryLoading}
                      className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-lg font-semibold cursor-pointer transition disabled:opacity-50 text-sm shadow-md"
                    >
                      {inquiryLoading ? 'Submitting...' : 'Send Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Similar West Projects */}
          {similarProjects.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-secondary mb-8">
                Similar West Projects
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarProjects.map((item) => (
                  <div key={item.id} className="bg-white shadow rounded-xl p-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={250}
                      className="rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-secondary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-primary font-bold">
                      {item.displayPrice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>


    </>
  );
}
