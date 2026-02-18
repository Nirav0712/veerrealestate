'use client';

import { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProjectPage() {

    const [filters, setFilters] = useState({
        status: "all",
        type: "all",
        minPrice: "",
        maxPrice: "",
        bedrooms: "all",
        location: "",
    });

    const properties = [
        {
            id: 1,
            title: "SATYAMEV LUXOR",
            price: 30500000,
            displayPrice: "₹ 3.05 Cr",
            image: "/property1.jpg",
            status: "For Sale",
            bedrooms: 3,
            location: "Ahmedabad",
            featured: true,
        },
        {
            id: 2,
            title: "Rhythm Aura",
            price: 6692000,
            displayPrice: "₹ 66.92 Lac",
            image: "/property2.jpg",
            status: "For Sale",
            bedrooms: 2,
            location: "Bopal",
            featured: true,
        },
    ];

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const clearFilters = () => {
        setFilters({
            status: "all",
            type: "all",
            minPrice: "",
            maxPrice: "",
            bedrooms: "all",
            location: "",
        });
    };

    const filteredProperties = properties.filter((property) => {
        if (filters.status !== "all" && property.status !== filters.status)
            return false;

        if (
            filters.bedrooms !== "all" &&
            property.bedrooms < parseInt(filters.bedrooms)
        )
            return false;

        if (
            filters.minPrice &&
            property.price < parseInt(filters.minPrice)
        )
            return false;

        if (
            filters.maxPrice &&
            property.price > parseInt(filters.maxPrice)
        )
            return false;

        if (
            filters.location &&
            !property.location
                .toLowerCase()
                .includes(filters.location.toLowerCase())
        )
            return false;

        return true;
    });

    return (
        <>
            <Header />

            {/* Header Section */}
            <div className="bg-gradient-to-r from-secondary to-secondary-light text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Browse Projects</h1>
                    <p className="opacity-90">
                        Find your perfect project from our collection
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
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
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
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="all">All</option>
                                            <option value="1">1+</option>
                                            <option value="2">2+</option>
                                            <option value="3">3+</option>
                                        </select>
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
                                                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                                            />
                                            <input
                                                type="number"
                                                name="maxPrice"
                                                placeholder="Max"
                                                value={filters.maxPrice}
                                                onChange={handleFilterChange}
                                                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="City..."
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </form>
                            </div>
                        </aside>

                        {/* PROJECT GRID */}
                        <div className="flex-1">
                            <p className="mb-6 text-gray-600">
                                <span className="font-semibold text-secondary">
                                    {filteredProperties.length}
                                </span>{" "}
                                projects found
                            </p>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition border"
                                    >
                                        <div className="relative h-56">
                                            <Image
                                                src={property.image}
                                                alt={property.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <p className="text-red-600 font-bold">
                                                {property.displayPrice}
                                            </p>
                                            <h3 className="font-semibold text-secondary mb-3">
                                                {property.title}
                                            </h3>

                                            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition">
                                                SEE DETAILS
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
