'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import Header from "../components/Header";
import Footer from "../components/Footer";
import { projects } from "@/lib/projects";

export default function ProjectPage() {
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        status: searchParams.get('status') || 'all',
        type: searchParams.get('type') || 'all',
        minPrice: '',
        maxPrice: '',
        bedrooms: searchParams.get('bedrooms') || 'all',
        location: searchParams.get('location') || '',
        transaction: searchParams.get('transaction') || 'all',
    });

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };


    const clearFilters = () => {
        const clearedFilters = {
            status: 'all',
            type: 'all',
            minPrice: '',
            maxPrice: '',
            bedrooms: 'all',
            location: '',
            transaction: 'all',
        };
        setFilters(clearedFilters);
    };

    const filteredProjects = projects.filter((project) => {

        if (filters.status !== "all" && project.status !== filters.status)
            return false;

        if (
            filters.bedrooms !== "all" &&
            project.bedrooms < parseInt(filters.bedrooms)
        )
            return false;

        if (
            filters.minPrice &&
            project.price < parseFloat(filters.minPrice)
        )
            return false;

        if (
            filters.maxPrice &&
            project.price > parseFloat(filters.maxPrice)
        )
            return false;

        if (
            filters.location &&
            !project.location
                .toLowerCase()
                .includes(filters.location.toLowerCase())
        )
            return false;

        return true;
    });

    return (
        <>
            <Header />

            {/* Page Header */}
            <div className="bg-linear-to-br from-secondary to-secondary-light text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Browse Projects</h1>
                    <p className="text-xl opacity-90">
                        Find your perfect project from our collection
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-secondary">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:text-primary-dark font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="all">All</option>
                                        <option value="For Sale">For Sale</option>
                                        <option value="For Rent">For Rent</option>
                                    </select>
                                </div>

                                {/* Property Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                    <select
                                        name="type"
                                        value={filters.type}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Condo">Condo</option>
                                        <option value="Land">Land</option>
                                        <option value="Retail">Retail</option>
                                    </select>
                                </div>

                                {/* Transaction */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction</label>
                                    <select
                                        name="transaction"
                                        value={filters.transaction}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="all">All</option>
                                        <option value="new">New Property</option>
                                        <option value="resale">Resale</option>
                                        <option value="underconstruction">Under Construction</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            name="minPrice"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Min"
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Max"
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                    <select
                                        name="bedrooms"
                                        value={filters.bedrooms}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="all">All</option>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                        <option value="5">5+</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="City, State..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    <i className="fas fa-search mr-2"></i>
                                    Apply Filters
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* Projects Grid */}
                    <div className="flex-1">

                        <div className="mb-6">
                            <p className="text-gray-600">
                                <span className="font-semibold text-secondary">
                                    {filteredProjects.length}
                                </span>{" "}
                                projects found
                            </p>
                        </div>

                        {filteredProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition "
                                    >
                                        <div className="relative h-56">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <p className="text-red-600 font-bold">
                                                {project.displayPrice}
                                            </p>

                                            <h3 className="font-semibold text-secondary mb-3">
                                                {project.title}
                                            </h3>

                                            <Link href={`/projects/${project.slug}`}>
                                                <button className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary-dark transition">
                                                    SEE DETAILS
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                    No Projects Found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}
