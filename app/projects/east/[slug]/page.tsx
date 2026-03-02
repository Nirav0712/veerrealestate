
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

  useEffect(() => {

    if (!params.slug) return;

    const slug =
      typeof params.slug === "string"
        ? params.slug
        : params.slug[0];

    // ✅ ONLY EAST PROJECTS
    const foundProject = projects.find(
      (p) => p.slug === slug && p.zone === "East"
    );

    if (!foundProject) {
      router.push("/projects/east");
      return;
    }

    setProject(foundProject);

    // ✅ Similar East Projects
    const similar = projects
      .filter(p => p.slug !== slug && p.zone === "East")
      .slice(0, 3);

    setSimilarProjects(similar);

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
            <a href="/projects/east" className="hover:text-primary">
              East Projects
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
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">

                {/* Title + Price */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-4xl font-bold text-secondary">
                    {project.title}
                  </h1>

                  <div className="text-3xl font-bold text-primary">
                    {project.displayPrice}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-6">
                  <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                  <span className="text-lg">{project.location}</span>
                </div>

                {/* Quick Features */}
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

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-secondary mb-4">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Property Details */}
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

              </div>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-secondary mb-6">
                  Request Information
                </h3>

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <textarea
                    rows={4}
                    placeholder="Message"
                    className="w-full px-4 py-3 border rounded-lg"
                    defaultValue={`I'm interested in ${project.title}`}
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* Similar West Projects */}
          {similarProjects.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-secondary mb-8">
                Similar East Projects
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
