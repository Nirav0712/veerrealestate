import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-16 pb-4">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About Section */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">About VeerRealEstate</h4>
                        <p className="text-white/80 mb-4 leading-relaxed">
                            Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with their ideal real estate solutions.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-white/80 hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-white/80 hover:text-primary transition-colors">
                                    Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-white/80 hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/80 hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/admin/dashboard" className="text-white/80 hover:text-primary transition-colors">
                                    Admin Panel
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* Property Types */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Property Types</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/properties?type=Villa" className="text-white/80 hover:text-primary transition-colors">
                                    Villas
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Apartment" className="text-white/80 hover:text-primary transition-colors">
                                    Apartments
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=House" className="text-white/80 hover:text-primary transition-colors">
                                    Houses
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Condo" className="text-white/80 hover:text-primary transition-colors">
                                    Condos
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Land" className="text-white/80 hover:text-primary transition-colors">
                                    Land & Plots
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Contact Info</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-white/80">
                                <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                                <span>Phoenix Tower, Pune - 411016</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fas fa-phone text-primary"></i>
                                <a href="tel:+912025678900" className="text-white/80 hover:text-primary transition-colors">
                                    +91 00000 00000
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fas fa-envelope text-primary"></i>
                                <a href="mailto:info@veerrealestate.com" className="text-white/80 hover:text-primary transition-colors">
                                    info@veerrealestate.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-6 text-center text-white/70 text-sm">
                    <p>
                        &copy; 2024 VeerRealEstate. All rights reserved. | Designed with{' '}
                        <i className="fas fa-heart text-primary"></i> for Real Estate
                    </p>
                </div>
            </div>
        </footer>
    );
}
