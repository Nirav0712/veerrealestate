import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-16 pb-4">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About Section */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">About Veer RealEstate</h4>
                        <p className="text-white/80 mb-4 leading-relaxed align-justify">
                            Your trusted partner in finding the perfect property in Ahmedabad. Discover Omkar Enclave, Ranip (West Ahmedabad) – premium 2 & 3 BHK residences thoughtfully designed for modern urban living with excellent connectivity and secure gated amenities.
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
                        <ul className="space-y-6">
                            <li>
                                <Link href="/" className="text-white/80 hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-white/80 hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-white/80 hover:text-primary transition-colors">
                                    Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-white/80 hover:text-primary transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/blogs" className="text-white/80 hover:text-primary transition-colors">
                                    Blogs
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
                        <ul className="space-y-1">
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
                                <Link href="/properties?type=Plot" className="text-white/80 hover:text-primary transition-colors">
                                    Plots
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
                            <li>
                                <Link href="/properties?type=House" className="text-white/80 hover:text-primary transition-colors">
                                    Houses
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Banglow" className="text-white/80 hover:text-primary transition-colors">
                                    Banglow
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Industrial" className="text-white/80 hover:text-primary transition-colors">
                                    Industrial
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Commercial" className="text-white/80 hover:text-primary transition-colors">
                                    Commercial Shops
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Office" className="text-white/80 hover:text-primary transition-colors">
                                    Commercial Office
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6 text-center ">Contact Info</h4>
                        <div className='flex items-start gap-10 text-white/80'>
                            <div>
                                <h5 className="text-md font-semibold mb-4 pl-3">East</h5>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-3 text-white/80">
                                        <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                                        <span>C-238, Sumel 7, Near- Soni ni Chali Cross Road, Odhav, Ahmedabad-382415</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="fas fa-phone text-primary"></i>
                                        <a href="tel:+91 93769 96179" className="text-white/80 hover:text-primary transition-colors">
                                            +91 93769 96179
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-3 m">
                                        <i className="fas fa-phone text-primary"></i>
                                        <a href="tel:+91 97270 27052" className="text-white/80 hover:text-primary transition-colors">
                                           +91 97270 27052
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="fas fa-envelope text-primary"></i>
                                        <a href="mailto:info@veerrealestate.com" className="text-white/80 hover:text-primary transition-colors">
                                            horseveer@gmail.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div >
                                  <h5 className="text-md font-semibold mb-4 pl-3">West</h5>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-white/80">
                                        <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                                        <span> 431, Yash Arian complex, Near Swami Vivekanand Circle. Memnagar Ahmedabad 380052</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="fas fa-phone text-primary"></i>
                                        <a href="tel:+91 88661 13391" className="text-white/80 hover:text-primary transition-colors">
                                          +91 88661 13391
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="fas fa-phone text-primary"></i>
                                        <a href="tel:+91 90672 30240" className="text-white/80 hover:text-primary transition-colors">
                                            +91 90672 30240
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="fas fa-envelope text-primary"></i>
                                        <a href="mailto:info@veerrealestate.com" className="text-white/80 hover:text-primary transition-colors">
                                            horseveer@gmail.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* <ul className="space-y-3">
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
                        </ul> */}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-6 text-center text-white/70 text-sm">
                    <p>
                        &copy; 2024 Veer RealEstate. All rights reserved. | Designed with{' '}
                        <i className="fas fa-heart text-primary"></i> for Real Estate
                    </p>
                </div>
            </div>
        </footer>
    );
}
