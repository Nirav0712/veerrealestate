import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-16 pb-4">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About Section */}
                    <div>
                        {/* <h4 className="text-xl font-semibold mb-4">About Veer Real Estate</h4> */}
                        <div className="bg-white/30 backdrop-blur-xl p-2 rounded-2xl 
                border border-white/40 shadow-xl 
                inline-block">
                            <img
                                src="/images/veer-logo.png"
                                alt="Veer Real Estate Logo"
                                className="w-50 h-30 object-contain"
                            />
                        </div>
                        {/* <p className="text-white/80 mb-4 leading-relaxed text-justify">
                            Your trusted partner in finding the perfect property in Ahmedabad. Discover Omkar Enclave, Ranip (West Ahmedabad) – premium 2 & 3 BHK residences thoughtfully designed for modern urban living with excellent connectivity and secure gated amenities.
                        </p> */}
                        <span className="text-white/70 font-medium mb-2 block mt-5"><b>East Ahmedabad</b></span>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href=" https://www.youtube.com/@VeerRealEstate"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a
                                href=" https://www.instagram.com/veerrealestateeastahmedabad/?hl=en"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href=" https://g.page/r/CcSCOVV14JRdEAI/review"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-google"></i>
                            </a>
                        </div>
                        <span className="text-white/70 font-medium mb-2 block mt-5"><b>West Ahmedabad</b></span>
                        <div className="flex gap-3">
                            <a
                                href=" https://www.facebook.com/people/Veer-Real-Estate/61558935522154/"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href=" https://www.youtube.com/@VeerRealEstate"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a
                                href=" https://www.instagram.com/veer.real_estate/"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="https://g.page/r/CcSCOVV14JRdEAI/review"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-google"></i>
                            </a>
                            <a
                                href=" https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-secondary transition-all"
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-left items-left justify-left pl-0 lg:pl-20">
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
                                <Link href="/blog" className="text-white/80 hover:text-primary transition-colors">
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
                        <ul className="space-y-4">
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
                                <Link href="/properties?type=Land" className="text-white/80 hover:text-primary transition-colors">
                                    Lands
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties?type=Bunglow" className="text-white/80 hover:text-primary transition-colors">
                                    Bunglow
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


                    <div className="md:col-span-2 lg:col-span-1">
                        <h4 className="text-xl font-semibold mb-8 text-center lg:text-left">
                            Contact Info
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white/80">

                            {/* East Ahmedabad */}
                            <div className="space-y-3">
                                <h5 className="text-lg font-semibold text-primary border-b border-white/20 pb-2">
                                    East Ahmedabad
                                </h5>

                                <ul className="space-y-4 text-sm leading-relaxed">
                                    <li className="flex gap-3">
                                        <i className="fas fa-map-marker-alt text-primary mt-1 shrink-0"></i>
                                        <span>
                                            C-238, Sumel 7, Near Soni ni Chali Cross Road,
                                            Odhav, Ahmedabad - 382415
                                        </span>
                                    </li>

                                    <li className="flex gap-3 items-center">
                                        <i className="fas fa-phone text-primary shrink-0"></i>
                                        <a
                                            href="tel:+919376996179"
                                            className="hover:text-primary transition-colors"
                                        >
                                            +91 93769 96179
                                        </a>
                                    </li>

                                    <li className="flex gap-3 items-center">
                                        <i className="fas fa-phone text-primary shrink-0"></i>
                                        <a
                                            href="tel:+919727027052"
                                            className="hover:text-primary transition-colors"
                                        >
                                            +91 97270 27052
                                        </a>
                                    </li>

                                    <li className="flex gap-3 items-center">
                                        <i className="fas fa-envelope text-primary shrink-0"></i>
                                        <a
                                            href="mailto:horseveer@gmail.com"
                                            className="hover:text-primary transition-colors break-all"
                                        >
                                            horseveer@gmail.com
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* West Ahmedabad */}
                            <div className="space-y-2">
                                <h5 className="text-lg font-semibold text-primary border-b border-white/20 pb-2">
                                    West Ahmedabad
                                </h5>

                                <ul className="space-y-4 text-sm leading-relaxed">
                                    <li className="flex gap-3">
                                        <i className="fas fa-map-marker-alt text-primary mt-1 shrink-0"></i>
                                        <span>
                                            431, Yash Arian Complex, Near Swami Vivekanand Circle,
                                            Memnagar, Ahmedabad - 380052
                                        </span>
                                    </li>

                                    <li className="flex gap-3 items-center">
                                        <i className="fas fa-phone text-primary shrink-0"></i>
                                        <a
                                            href="tel:+918866113391"
                                            className="hover:text-primary transition-colors"
                                        >
                                            +91 88661 13391
                                        </a>
                                    </li>

                                    <li className="flex gap-3 items-center">
                                        <i className="fas fa-phone text-primary shrink-0"></i>
                                        <a
                                            href="tel:+919067230240"
                                            className="hover:text-primary transition-colors"
                                        >
                                            +91 90672 30240
                                        </a>
                                    </li>

                                    <li className="flex gap-3 items-center">
                                        <i className="fas fa-envelope text-primary shrink-0"></i>
                                        <a
                                            href="mailto:horseveer@gmail.com"
                                            className="hover:text-primary transition-colors break-all"
                                        >
                                            horseveer@gmail.com
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-6 text-center text-white/70 text-sm">
                    <p>
                        &copy; 2024 Veer RealEstate. All rights reserved.| Developed By <a href="https://thedigitalconnect.in/">The Digital Connect</a> | Designed with{' '}
                        <i className="fas fa-heart text-primary"></i> for Real Estate
                    </p>
                </div>
            </div>
        </footer>
    );
}
