'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import PropertyCard from '../../components/PropertyCard';
import { type Property, getPropertyFallbackImage } from '@/lib/properties';
import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loader from '@/app/components/Loader';

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    // Gallery state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;
            const id = parseInt(params.id as string);

            try {
                // Fetch current property
                const res = await fetch(`/api/properties/${id}`);
                if (!res.ok) {
                    router.push('/properties');
                    return;
                }
                const prop = await res.json();
                setProperty(prop);

                // Fetch all properties for "Similar Properties"
                const resAll = await fetch('/api/properties');
                if (resAll.ok) {
                    const allProps: Property[] = await resAll.json();
                    const similar = allProps
                        .filter(p => p.id !== id && p.type === prop.type)
                        .slice(0, 3);
                    setSimilarProperties(similar);
                }

                // Check if favorite
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                setIsFavorite(favorites.includes(id));

            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        fetchData();
    }, [params.id, router]);

    // Auto-scroll logic
    const images = property?.images && property.images.length > 0
        ? property.images
        : [getPropertyFallbackImage(property?.type || '')];

    const goToNext = useCallback(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Reset auto-scroll timer
    const resetAutoScroll = useCallback(() => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        if (isAutoScrolling && images.length > 1) {
            autoScrollRef.current = setInterval(goToNext, 4000);
        }
    }, [goToNext, isAutoScrolling, images.length]);

    useEffect(() => {
        if (images.length > 1) {
            autoScrollRef.current = setInterval(goToNext, 4000);
        }
        return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
    }, [goToNext, images.length]);

    const handlePrev = () => {
        goToPrev();
        resetAutoScroll();
    };

    const handleNext = () => {
        goToNext();
        resetAutoScroll();
    };

    const handleDotClick = (index: number) => {
        setCurrentImageIndex(index);
        resetAutoScroll();
    };

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;

        if (favorites.includes(property!.id)) {
            newFavorites = favorites.filter((id: number) => id !== property!.id);
            setIsFavorite(false);
        } else {
            newFavorites = [...favorites, property!.id];
            setIsFavorite(true);
        }

        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString('en-IN')}`;
    };

    if (!property) {
        return <div className='flex justify-center items-center py-20'><Loader /></div>;
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                        <a href="/" className="hover:text-primary">Home</a>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <a href="/properties" className="hover:text-primary">Properties</a>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span className="text-secondary font-medium">{property.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">

                            {/* ── Auto-Scroll Image Gallery ── */}
                            <div className="relative rounded-2xl overflow-hidden mb-4 bg-black" style={{ height: '420px' }}>

                                {/* Images */}
                                {images.map((src, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`${property.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                ))}

                                {/* Dark gradient overlays */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-10" />

                                {/* Status badges */}
                                <div className="absolute top-5 left-5 flex gap-2 z-20">
                                    {property.featured && (
                                        <span className="bg-primary text-secondary px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide shadow-lg">
                                            Featured
                                        </span>
                                    )}
                                    <span className={`${property.status === 'For Sale' ? 'bg-green-500' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide shadow-lg`}>
                                        {property.status}
                                    </span>
                                </div>

                                {/* Favorite button */}
                                <button
                                    onClick={toggleFavorite}
                                    className={`absolute top-5 right-5 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg z-20 ${isFavorite
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-primary hover:text-secondary'
                                        }`}
                                >
                                    <FaHeart className={`text-xl transition ${isFavorite ? 'text-white' : 'text-gray-400'}`} />
                                </button>

                                {/* Prev / Next arrows — only show if multiple images */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrev}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                            aria-label="Previous image"
                                        >
                                            <FaChevronLeft className="text-secondary text-sm" />
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                            aria-label="Next image"
                                        >
                                            <FaChevronRight className="text-secondary text-sm" />
                                        </button>
                                    </>
                                )}

                                {/* Image counter */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-14 right-5 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                )}

                                {/* Dot indicators */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                        {images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDotClick(index)}
                                                aria-label={`Go to image ${index + 1}`}
                                                className={`transition-all duration-300 rounded-full ${index === currentImageIndex
                                                    ? 'bg-primary w-6 h-2.5'
                                                    : 'bg-white/60 hover:bg-white/90 w-2.5 h-2.5'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail strip — only if multiple images */}
                            {images.length > 1 && (
                                <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
                                    {images.map((src, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDotClick(index)}
                                            className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${index === currentImageIndex
                                                ? 'ring-2 ring-primary ring-offset-1 scale-105'
                                                : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <Image
                                                src={src}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Property Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-4xl font-bold text-secondary">{property.title}</h1>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">
                                            {formatPrice(property.price)}
                                            {property.status === 'For Rent' && <span className="text-lg text-gray-600">/mo</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-600 mb-6">
                                    <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                                    <span className="text-lg">{property.location}</span>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-200">
                                    {property.bedrooms > 0 && (
                                        <div className="text-center">
                                            <i className="fas fa-bed text-3xl text-primary mb-2"></i>
                                            <div className="font-semibold text-secondary">{property.bedrooms}</div>
                                            <div className="text-sm text-gray-600">Bedrooms</div>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <i className="fas fa-bath text-3xl text-primary mb-2"></i>
                                        <div className="font-semibold text-secondary">{property.bathrooms}</div>
                                        <div className="text-sm text-gray-600">Bathrooms</div>
                                    </div>
                                    <div className="text-center">
                                        <i className="fas fa-ruler-combined text-3xl text-primary mb-2"></i>
                                        <div className="font-semibold text-secondary">{property.area.toLocaleString()}</div>
                                        <div className="text-sm text-gray-600">{property.areaUnit || 'sqft'}</div>
                                    </div>
                                    {property.parking && property.parking > 0 && (
                                        <div className="text-center">
                                            <i className="fas fa-car text-3xl text-primary mb-2"></i>
                                            <div className="font-semibold text-secondary">{property.parking}</div>
                                            <div className="text-sm text-gray-600">Parking</div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-secondary mb-4">Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                                </div>

                                {/* Property Details */}
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-secondary mb-4">Property Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600">Property Type:</span>
                                            <span className="font-semibold text-secondary">{property.type}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="font-semibold text-secondary">{property.status}</span>
                                        </div>
                                        {property.yearBuilt && (
                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Year Built:</span>
                                                <span className="font-semibold text-secondary">{property.yearBuilt}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600">Area:</span>
                                            <span className="font-semibold text-secondary">{property.area.toLocaleString()} {property.areaUnit || 'sqft'}</span>
                                        </div>
                                        {property.transaction && (
                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Transaction:</span>
                                                <span className="font-semibold text-secondary capitalize">{property.transaction}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Amenities */}
                                {property.amenities && property.amenities.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-2xl font-bold text-secondary mb-4">Amenities</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {property.amenities.map((amenity, index) => (
                                                <div key={index} className="flex items-center gap-2 text-gray-700">
                                                    <i className="fas fa-check-circle text-primary"></i>
                                                    {amenity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Contact Form */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 sticky top-24">
                                <h3 className="text-xl font-bold text-secondary mb-6">Request Information</h3>
                                <form className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <textarea
                                        rows={4}
                                        placeholder="Message"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        defaultValue={`I'm interested in ${property.title}`}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                    >
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            {/* Share */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-xl font-bold text-secondary mb-4">Share Property</h3>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                        <i className="fab fa-facebook-f"></i>
                                    </button>
                                    <button className="flex-1 bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors">
                                        <i className="fab fa-twitter"></i>
                                    </button>
                                    <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                                        <i className="fab fa-whatsapp"></i>
                                    </button>
                                    <button className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors">
                                        <i className="fas fa-link"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Properties */}
                    {similarProperties.length > 0 && (
                        <div className="mt-20">
                            <h2 className="text-3xl font-bold text-secondary mb-8">Similar Properties</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {similarProperties.map((prop) => (
                                    <PropertyCard key={prop.id} property={prop} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
