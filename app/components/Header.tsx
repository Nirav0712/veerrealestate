'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>

            {/* Main Header */}
            <header className="bg-white/30 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold text-secondary">
                            {/* Veer<span className="text-primary">RealEstate</span> */}
                            <img src="/images/veer-logo.png" alt="veer-logo" className="w-40" />
                        </Link>
                        {/* Desktop Menu */}
                        <ul className="hidden lg:flex items-center gap-8">
                            <li>
                                <Link href="/" className="text-secondary hover:text-primary font-medium transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about-us" className="text-secondary hover:text-primary font-medium transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-secondary hover:text-primary font-medium transition-colors">
                                    Properties
                                </Link>
                            </li>
                            <li className="relative group">
                                <Link
                                    href="#"
                                    className="text-secondary hover:text-primary font-medium transition-colors"
                                >
                                    Projects
                                </Link>
                                {/* Dropdown */}
                                <ul className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50">
                                    <li>
                                        <Link
                                            href="/projects/east"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                                        >
                                            East Ahmedabad Projects
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/projects/west"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary"
                                        >
                                            West Ahmedabad Projects
                                        </Link>
                                    </li>
                                </ul>
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
                                className=" text-secondary border border-secondary px-6 py-2.5 rounded-lg font-medium hover:bg-secondary hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Search Properties
                            </Link>
                            {/* <Link
                                href="/login"
                                className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Login
                            </Link> */}
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
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-150 border-t py-4' : 'max-h-0'}`}>
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
                                    href="/about"
                                    className="block text-secondary hover:text-primary font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
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
                            <li className="border-b border-gray-100 pb-2">
                                <div className="text-secondary font-medium mb-2">Projects</div>
                                <ul className="pl-4 flex flex-col gap-2">
                                    <li>
                                        <Link
                                            href="/projects/east"
                                            className="block text-gray-600 hover:text-primary transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            East Ahmedabad
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/projects/west"
                                            className="block text-gray-600 hover:text-primary transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            West Ahmedabad
                                        </Link>
                                    </li>
                                </ul>
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
                            <li className="flex flex-col gap-3 mt-2">
                                <Link
                                    href="/properties"
                                    className="block bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors "
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Search Properties
                                </Link>
                                <Link
                                    href="/login"
                                    className="block border-2 border-primary text-primary px-6 py-2.5 rounded-lg font-medium text-center hover:bg-primary hover:text-white transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );
}
