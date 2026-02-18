'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        title: 'Top 10 Emerging Real Estate Locations in Mumbai for 2024',
        excerpt: 'Discover the most promising areas in Mumbai where property values are set to rise significantly in the coming years.',
        content: 'Mumbai continues to evolve with new infrastructure projects and development zones...',
        author: 'Priya Sharma',
        date: 'January 2, 2024',
        category: 'Market Trends',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
        readTime: '5 min read'
    },
    {
        id: 2,
        title: 'Complete Guide to Home Loans in India: Everything You Need to Know',
        excerpt: 'Navigate the complexities of home loans with our comprehensive guide covering interest rates, eligibility, and documentation.',
        content: 'Getting a home loan in India involves understanding various factors...',
        author: 'Rajesh Kumar',
        date: 'December 28, 2023',
        category: 'Finance',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        readTime: '8 min read'
    },
    {
        id: 3,
        title: 'Luxury Villas vs Apartments: Making the Right Choice',
        excerpt: 'Explore the pros and cons of investing in luxury villas versus high-end apartments in India\'s metro cities.',
        content: 'The decision between a luxury villa and an apartment depends on various lifestyle factors...',
        author: 'Amit Patel',
        date: 'December 25, 2023',
        category: 'Buying Guide',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        readTime: '6 min read'
    },
    {
        id: 4,
        title: 'Real Estate Investment Trusts (REITs) in India: A Beginner\'s Guide',
        excerpt: 'Learn how REITs are revolutionizing real estate investment in India and how you can start investing.',
        content: 'REITs have opened new avenues for investors to participate in the real estate market...',
        author: 'Vikram Malhotra',
        date: 'December 20, 2023',
        category: 'Investment',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        readTime: '7 min read'
    },
    {
        id: 5,
        title: 'Bangalore Tech Parks: Best Areas for IT Professionals to Buy Property',
        excerpt: 'Find out which areas near Bangalore\'s major tech hubs offer the best value for IT professionals.',
        content: 'Bangalore\'s IT boom has created unique real estate opportunities...',
        author: 'Anjali Deshmukh',
        date: 'December 15, 2023',
        category: 'Location Guide',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        readTime: '5 min read'
    },
    {
        id: 6,
        title: 'Understanding RERA: How It Protects Homebuyers in India',
        excerpt: 'A detailed look at the Real Estate Regulatory Authority and how it safeguards your property investment.',
        content: 'RERA has brought transparency and accountability to India\'s real estate sector...',
        author: 'Arjun Nair',
        date: 'December 10, 2023',
        category: 'Legal',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        readTime: '6 min read'
    },
    {
        id: 7,
        title: 'Goa Property Market: Investment Opportunities in Paradise',
        excerpt: 'Explore why Goa is becoming a hotspot for real estate investors and retirees alike.',
        content: 'Goa\'s unique lifestyle and growing infrastructure make it an attractive investment destination...',
        author: 'Priya Sharma',
        date: 'December 5, 2023',
        category: 'Market Trends',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        readTime: '5 min read'
    },
    {
        id: 8,
        title: 'Smart Homes in India: The Future of Residential Real Estate',
        excerpt: 'Discover how smart home technology is transforming modern living and adding value to properties.',
        content: 'Smart home features are no longer a luxury but an expectation in premium properties...',
        author: 'Rajesh Kumar',
        date: 'November 30, 2023',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        readTime: '7 min read'
    },
    {
        id: 9,
        title: 'Commercial Real Estate: Office Spaces in Post-Pandemic India',
        excerpt: 'How the commercial real estate landscape has changed after COVID-19 and what it means for investors.',
        content: 'The pandemic has permanently altered how we view office spaces and work culture...',
        author: 'Amit Patel',
        date: 'November 25, 2023',
        category: 'Commercial',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        readTime: '8 min read'
    },
    {
        id: 10,
        title: 'Vastu Shastra and Modern Architecture: Finding the Balance',
        excerpt: 'How contemporary developers are incorporating Vastu principles into modern property designs.',
        content: 'Vastu Shastra continues to influence property buyers in India...',
        author: 'Vikram Malhotra',
        date: 'November 20, 2023',
        category: 'Design',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        readTime: '6 min read'
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

            <Header />

            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-secondary to-secondary-light text-white py-24">
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
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-20 bg-gray-50">
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
                        <div className="text-center py-20">
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
                                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
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

            <Footer />
        </>
    );
}
