'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Top Bar */}
            {/* <div className="bg-secondary text-white/50 py-2.5 text-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <div className="flex gap-6">
                            <a href="mailto:info@veerrealstate.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <i className="fas fa-envelope"></i>
                                info@veerrealstate.com
                            </a>
                            <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <i className="fas fa-phone"></i>
                                +91 00000 00000
                            </a>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <i className="fas fa-user"></i>
                                Login
                            </Link>
                            <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <i className="fas fa-tachometer-alt"></i>
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Main Header */}
            <header className="bg-white/30 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold text-secondary">
                            {/* Veer<span className="text-primary">RealEstate</span> */}
                            <img src="/veer-logo.png" alt="veer-logo" className="w-32" />
                        </Link>

                        {/* Desktop Menu */}
                        <ul className="hidden lg:flex items-center gap-8">
                            <li>
                                <Link href="/" className="text-secondary hover:text-primary font-medium transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-secondary hover:text-primary font-medium transition-colors">
                                    Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-secondary hover:text-primary font-medium transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-secondary hover:text-primary font-medium transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-secondary hover:text-primary font-medium transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/properties"
                                className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Search Properties
                            </Link>
                            <Link
                                href="/login"
                                className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden text-2xl text-secondary"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </nav>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-4 border-t">
                            <ul className="flex flex-col gap-4">
                                <li>
                                    <Link
                                        href="/"
                                        className="block text-secondary hover:text-primary font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/properties"
                                        className="block text-secondary hover:text-primary font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Properties
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="block text-secondary hover:text-primary font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/blog"
                                        className="block text-secondary hover:text-primary font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="block text-secondary hover:text-primary font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/properties"
                                        className="block bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-center hover:bg-primary-dark transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Browse Properties
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}
