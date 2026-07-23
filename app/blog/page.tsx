'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Aaradhana Sky 2 in Narol Ahmedabad: Affordable 2 BHK Flats for Modern Families",
        excerpt: "Aaradhana Sky 2 in Narol Ahmedabad delivers modern living spaces at a budget-friendly price. For families looking for a quality home in East Ahmedabad, this project presents a smart opportunity.",
        content: "Ahmedabad is a project that meets these expectations by offering bigger and better 4 BHK homes for premium living.",
        author: "Admin",
        date: "2026-03-23",
        category: "Market Trends",
        image: "/images/east/AARADHANA_2.jpeg",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Anushtan Bungalows in Ahmedabad: Premium 4 BHK Luxury Homes for Modern Family Living",
        excerpt: "Located near Vatva-Gamdi Circle, this exclusive residential project offers beautifully designed 4 BHK bungalows in Ahmedabad that are ideal for families targeting premium living.",
        content: "Luxury homes and independent-style residences usually hold strong appeal among buyers who want long-term value. ",
        author: "Admin",
        date: "2026-03-23",
        category: "Finance",
        image: "/images/east/Anusthan.jpeg",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Avalon DHS Floora in Vatva Ahmedabad: Affordable Ready Possession Flats for Modern Living",
        excerpt: "Avalon DHS Floora in Vatva Ahmedabad is a residential project attracting homebuyers looking for budget-friendly homes with ready possession benefits.",
        content: "Instead of waiting for years for project completion, buyers can make a quicker move toward homeownership.",
        author: "Admin",
        date: "2026-03-23",
        category: "Buying Guide",
        image: "/images/east/Avalon-DHS.jpeg",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Eleven 04 Homes in New Vatva Ahmedabad: Modern 2 & 3 BHK Flats for Comfortable Family Living",
        excerpt: "Eleven 04 Homes in New Vatva Ahmedabad offers a smart combination of spacious planning, practical location, and value for money.",
        content: "discover the top real estate investment opportunities in India for 2024, including emerging markets and high-growth areas...",
        author: "Admin",
        date: "2026-03-23",
        category: "Investment",
        image: "/images/east/Eleven.jpeg",
        readTime: "7 min read"
    },
    {
        id: 5,
        title: "Omkar Enclave in Ranip Ahmedabad: Premium 3 BHK Flats for Modern Family Living",
        excerpt: "Among the promising premium residential developments in West Ahmedabad, Omkar Enclave stands out as an excellent choice for families looking for spacious homes and a modern lifestyle.",
        content: "Ahmedabad's IT boom has created unique real estate opportunities...",
        author: "Admin",
        date: "2026-03-23",
        category: "Location Guide",
        image: "/images/west/omkar.jpeg",
        readTime: "5 min read"
    },
    {
        id: 6,
        title: "Shubh Greens in Zundal Ahmedabad: Premium 3 BHK Ready-to-Move Flats for Modern Family Living",
        excerpt: "Shubh Greens in Zundal Ahmedabad provides premium 3 BHK ready-to-move flats for families seeking comfort, convenience, and quality living.",
        content: "Shubh Greens in Zundal Ahmedabad is one such promising project that offers premium 3 BHK ready-to-move flats for families looking for comfort, convenience, and quality living...",
        author: "Admin",
        date: "2026-03-23",
        category: "Buying Guide",
        image: "/images/west/subh-green.jpeg",
        readTime: "6 min read"
    },
    {
        id: 7,
        title: "Royal Crown in Zundal Ahmedabad: Premium 3 BHK Ready-to-Move Flats for Modern Living",
        excerpt: "Royal Crown in Zundal Ahmedabad stands out as a premium choice for families seeking spacious homes in a well-connected location near Vaishnodevi Circle.",
        content: "Royal Crown offers well-planned 3 BHK ready-to-move flats designed for families who want comfort, convenience, and long-term value...",
        author: "Admin",
        date: "2026-03-23",
        category: "Buying Guide",
        image: "/images/west/royal-crown1.avif",
        readTime: "5 min read"
    },
    {
        id: 8,
        title: "Harnav Lavish in Zundal Ahmedabad – Modern 2 BHK Living for Smart Homebuyers",
        excerpt: "Harnav Lavish in Zundal Ahmedabad is a well-planned residential property offering thoughtfully crafted 2 BHK apartments in a growing location.",
        content: "Harnav Lavish is a premium housing project located in Zundal, North West Ahmedabad, offering a balanced lifestyle with practical layouts...",
        author: "Admin",
        date: "2026-03-23",
        category: "Buying Guide",
        image: "/images/west/harnav_lavish1.avif",
        readTime: "7 min read"
    },
    {
        id: 9,
        title: "KB Royal Zundal Ahmedabad – Premium Living in a Prime Residential Location",
        excerpt: "KB Royal Zundal Ahmedabad stands out for its premium living experience, thoughtful planning, and ready-to-move convenience.",
        content: "KB Royal is a premium residential development offering 3 BHK ready to move apartments in one of Ahmedabad's emerging zones...",
        author: "Admin",
        date: "2026-03-23",
        category: "Investment",
        image: "/images/west/kb_royal1.avif",
        readTime: "8 min read"
    },
    {
        id: 10,
        title: "Vivan Orbit in Zundal Ahmedabad: Modern 2 BHK Homes in a Fast-Growing Residential Location",
        excerpt: "Vivan Orbit in Zundal Ahmedabad is emerging as a smart choice for families searching for a comfortable, well-planned, and affordable home.",
        content: "Vivan Orbit offers thoughtfully planned 2 BHK apartments designed for modern family living in a fast-growing area...",
        author: "Admin",
        date: "2026-03-23",
        category: "Buying Guide",
        image: "/images/west/vivaan_orbit1.avif",
        readTime: "6 min read"
    }
];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Market Trends', 'Finance', 'Buying Guide', 'Investment', 'Location Guide', 'Legal', 'Technology', 'Commercial', 'Design'];

    const filteredPosts = selectedCategory === 'All'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-secondary to-secondary-light text-white py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Real Estate Insights & News</h1>
                        <p className="text-xl md:text-2xl opacity-95">
                            Stay updated with the latest trends, tips, and insights from India's real estate market
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-10 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-user text-primary"></i>
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-clock text-primary"></i>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-secondary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">{post.date}</span>
                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-2"
                                        >
                                            Read More
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-10 md:py-20">
                            <i className="fas fa-blog text-6xl text-gray-300 mb-4"></i>
                            <p className="text-xl text-gray-500">No posts found in this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-secondary text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                        <p className="text-lg mb-8 opacity-90">
                            Get the latest real estate insights delivered directly to your inbox
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary border border-white"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>


        </>
    );
}
