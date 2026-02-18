'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/properties';

interface Property {
    id: number;
    title: string;
    price: number;
    location: string;
    type: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    featured: boolean;
    image: string;
    description?: string;
}

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Check if property is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(property.id));
    }, [property.id]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;

        if (favorites.includes(property.id)) {
            newFavorites = favorites.filter((id: number) => id !== property.id);
            setIsFavorite(false);
        } else {
            newFavorites = [...favorites, property.id];
            setIsFavorite(true);
        }

        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-IN');
    };

    return (
        <Link href={`/properties/${property.id}`} className="block">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                        {property.featured && (
                            <span className="bg-primary text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide">
                                Featured
                            </span>
                        )}
                        <span className={`${property.status === 'For Sale' ? 'bg-green-500' : 'bg-blue-500'
                            } text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide`}>
                            {property.status}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={toggleFavorite}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-primary hover:text-secondary'
                            }`}
                    >
                        <i className="fas fa-heart"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Price */}
                    <div className="text-2xl font-bold text-primary mb-2">
                        {formatPrice(property.price)}
                        {property.status === 'For Rent' && <span className="text-base text-gray-600">/mo</span>}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                        <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                        {property.location}
                    </div>

                    {/* Features */}
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                        {property.bedrooms > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                                <i className="fas fa-bed text-primary mr-2"></i>
                                {property.bedrooms} Beds
                            </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                            <i className="fas fa-bath text-primary mr-2"></i>
                            {property.bathrooms} Baths
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <i className="fas fa-ruler-combined text-primary mr-2"></i>
                            {formatNumber(property.area)} sqft
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
