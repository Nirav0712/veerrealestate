'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

// Small carousel component for up to 3 images per card
function ProjectImageCarousel({ project }: { project: (typeof projects)[number] }) {
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
    <div className="relative h-56 overflow-hidden rounded-t-xl bg-gray-100">
      <Image
        src={images[current]}
        alt={project.title}
        fill
        className="object-cover transition-opacity duration-300"
      />

      {images.length > 1 && (
        <>
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center z-10 transition"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center z-10 transition"
            aria-label="Next image"
          >
            &#8250;
          </button>
          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          {/* Image counter */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
            {current + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function EastProjectPage() {

  const [filters, setFilters] = useState({
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    location: "",
  });

  // ✅ Only WEST projects
  const westProjects = projects.filter(
    (project) => project.zone === "West"
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all",
      location: "",
    });
  };

  const filteredProjects = westProjects.filter((project) => {

    if (filters.status !== "all" && project.status !== filters.status)
      return false;

    if (
      filters.bedrooms !== "all" &&
      project.bedrooms < parseInt(filters.bedrooms)
    )
      return false;
    if (filters.location && !project.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    if (
      filters.minPrice &&
      project.price < parseInt(filters.minPrice)
    )
      return false;

    if (
      filters.maxPrice &&
      project.price > parseInt(filters.maxPrice)
    )
      return false;

    return true;
  });

  return (
    <>

      {/* Header Section */}
      <div className="bg-linear-to-r from-secondary to-secondary-light text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            West Projects
          </h1>
          <p className="opacity-90">
            Explore premium projects in West zone
          </p>
        </div>
      </div>

      <div className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* SIDEBAR */}
            <aside className="lg:w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">

                <div className="flex justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary">
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Clear All
                  </button>
                </div>

                <form className="space-y-6">

                  {/* Status */}
                  <div>
                    <label className="block text-sm mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border rounded-lg"
                    >
                      <option value="all">All</option>
                      <option value="For Sale">For Sale</option>
                      <option value="For Rent">For Rent</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm mb-2">
                      Bedrooms
                    </label>
                    <select
                      name="bedrooms"
                      value={filters.bedrooms}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border rounded-lg"
                    >
                      <option value="all">All</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  {/* location */}
                  <div>
                    <label className="block text-sm mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="px-4 py-3 border rounded-lg"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="px-4 py-3 border rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <i className="fas fa-search mr-2"></i>
                    Apply Filters
                  </button>

                </form>
              </div>
            </aside>

            {/* PROJECT GRID */}
            <div className="flex-1">
              <p className="mb-6 text-gray-600">
                <span className="font-semibold text-secondary">
                  {filteredProjects.length}
                </span>{" "}
                west projects found
              </p>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition "
                  >
                    <ProjectImageCarousel project={project} />

                    <div className="p-4">
                      <p className="text-red-600 font-bold">
                        {project.displayPrice}
                      </p>
                      <h3 className="font-semibold text-secondary mb-3">
                        {project.title}
                      </h3>

                      {/* ✅ IMPORTANT: West Slug */}
                      <Link href={`/projects/west/${project.slug}`}>
                        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition">
                          SEE DETAILS
                        </button>
                      </Link>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>


    </>
  );
}
