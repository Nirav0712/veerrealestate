'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import { getPropertyById, getProperties, type Property } from '@/lib/properties';

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const id = parseInt(params.id as string);
        const prop = getPropertyById(id);

        if (!prop) {
            router.push('/properties');
            return;
        }

        setProperty(prop);

        // Get similar properties
        const allProps = getProperties();
        const similar = allProps
            .filter(p => p.id !== id && p.type === prop.type)
            .slice(0, 3);
        setSimilarProperties(similar);

        // Check if favorite
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));
    }, [params.id, router]);

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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (!property) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <Header />

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
                            {/* Image */}
                            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute top-6 left-6 flex gap-2">
                                    {property.featured && (
                                        <span className="bg-primary text-secondary px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide shadow-lg">
                                            Featured
                                        </span>
                                    )}
                                    <span className={`${property.status === 'For Sale' ? 'bg-green-500' : 'bg-blue-500'
                                        } text-white px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide shadow-lg`}>
                                        {property.status}
                                    </span>
                                </div>
                                <button
                                    onClick={toggleFavorite}
                                    className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${isFavorite
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-primary hover:text-secondary'
                                        }`}
                                >
                                    <i className="fas fa-heart text-lg"></i>
                                </button>
                            </div>

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
                                        <div className="text-sm text-gray-600">Sq Ft</div>
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
                                            <span className="font-semibold text-secondary">{property.area.toLocaleString()} sqft</span>
                                        </div>
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

            <Footer />
        </>
    );
}
