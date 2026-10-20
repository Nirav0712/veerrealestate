import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-16 pb-4">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* About Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/">
                            <div className="pt-2 pb-2 inline-block rounded-2xl bg-white mb-6 cursor-pointer" >
                                <Image
                                    src="/images/veer-logo-old.png"
                                    alt="Veer Logo"
                                    width={200}
                                    height={200}
                                    className="object-contain w-40 md:w-52"
                                />
                            </div>
                        </Link>

                        <div className="space-y-4 w-full">
                            <div>
                                <span className="text-white/70 font-medium mb-2 block">East Ahmedabad</span>
                                <div className="flex justify-center md:justify-start gap-3">
                                    <SocialLink href="https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/" icon="fab fa-facebook-f" bgColor="#1877F2" />
                                    <SocialLink href="https://www.youtube.com/@VeerRealEstate" icon="fab fa-youtube" bgColor="#FF0000" />
                                    <SocialLink href="https://www.instagram.com/veerrealestateeastahmedabad/?hl=en" icon="fab fa-instagram" bgColor="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" />
                                    <SocialLink href="https://g.page/r/CcSCOVV14JRdEAI/review" icon="fab fa-google" bgColor="#fff" iconColor="#4285F4" />
                                </div>
                            </div>

                            <div>
                                <span className="text-white/70 font-medium mb-2 block">West Ahmedabad</span>
                                <div className="flex justify-center md:justify-start gap-3">
                                    <SocialLink href="https://www.facebook.com/people/Veer-Real-Estate/61558935522154/" icon="fab fa-facebook-f" bgColor="#1877F2" />
                                    <SocialLink href="https://www.youtube.com/@VeerRealEstate" icon="fab fa-youtube" bgColor="#FF0000" />
                                    <SocialLink href="https://www.instagram.com/veer.real_estate/" icon="fab fa-instagram" bgColor="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" />
                                    <SocialLink href="https://g.page/r/CcSCOVV14JRdEAI/review" icon="fab fa-google" bgColor="#fff" iconColor="#4285F4" />
                                    <SocialLink href="https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true" icon="fab fa-linkedin-in" bgColor="#0A66C2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links - Hidden on Mobile */}
                    <div className="hidden md:block text-left items-left justify-left pl-0 lg:pl-20">
                        <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/about-us">About Us</FooterLink>
                            <FooterLink href="/builder-consultation">
                                <span className="text-[#F1B33B] font-semibold flex items-center gap-1.5">
                                    <span>Builder Consultation</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1B33B]/20 text-[#F1B33B] uppercase font-bold tracking-wider">New</span>
                                </span>
                            </FooterLink>
                            <FooterLink href="/properties">Properties</FooterLink>
                            <FooterLink href="/projects/east">East Projects</FooterLink>
                            <FooterLink href="/projects/west">West Projects</FooterLink>
                            <FooterLink href="/blog">Blogs</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* Property Types - Hidden on Mobile */}
                    <div className="hidden md:block">
                        <h4 className="text-xl font-semibold mb-4">Property Types</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/properties?type=Apartment">Apartments</FooterLink>
                            <FooterLink href="/properties?type=Plot">Plots</FooterLink>
                            <FooterLink href="/properties?type=Land">Lands</FooterLink>
                            <FooterLink href="/properties?type=Bunglows">Bunglows</FooterLink>
                            <FooterLink href="/properties?type=Industrial">Industrial</FooterLink>
                            <FooterLink href="/properties?type=Commercial">Commercial Shops</FooterLink>
                            <FooterLink href="/properties?type=Office">Commercial Office</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-2 lg:col-span-1">
                        {/* <h4 className="text-xl font-semibold mb-8 text-center md:text-left">
                            Contact Info
                        </h4> */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5 text-white/80">
                            {/* East Ahmedabad */}
                            <ContactSection
                                title="East Ahmedabad"
                                address="C-238, Sumel 7, Odhav, Ahmedabad - 382415"
                                phones={["+91 93769 96179", "+91 97270 27052"]}
                                email="horseveer@gmail.com"
                            />

                            {/* West Ahmedabad */}
                            <ContactSection
                                title="West Ahmedabad"
                                address="431, Yash Arian Complex, Memnagar, Ahmedabad - 380052"
                                phones={["+91 88661 13391", "+91 90672 30240"]}
                                email="horseveer@gmail.com"
                            />
                            {/* Bopal Branch */}
                            <ContactSection
                                title="Bopal Branch"
                                address="1120, STC, Opp. Saraswati Hospital, Ambli, Ahmedabad - 380058"
                                phones={["+91 81601 53208"]}
                                email="horseveer@gmail.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Builder Consultation Special Banner */}
                <div className="border-t border-white/10 pt-8 pb-4">
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#031326] via-[#09223f] to-[#031326] border border-[#E8AA38]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left transition-all hover:border-[#E8AA38]/60">
                        <div className="flex items-center gap-4 flex-col sm:flex-row">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E8AA38] shrink-0 shadow-md relative bg-[#041221]">
                                <Image
                                    src="/images/sudhir-about-final.jpg"
                                    alt="Sudhir Prajapati"
                                    fill
                                    sizes="56px"
                                    className="object-cover object-top"
                                />
                            </div>
                            <div>
                                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8AA38]/15 border border-[#E8AA38]/30 text-[#E8AA38] text-[11px] font-bold uppercase tracking-wider mb-1">
                                    For Builders &amp; Developers
                                </div>
                                <h4 className="text-lg sm:text-xl font-bold text-white">
                                    Builder Bhai — Let’s Build a Stronger Real Estate Business
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                                    Get expert project positioning, marketing strategy, site visits &amp; sales consultation with Sudhir Prajapati.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/builder-consultation"
                            className="shrink-0 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#F9C354] via-[#F1B33B] to-[#D89423] hover:from-[#fcd37a] hover:to-[#e59d28] text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#E8AA38]/20 transition-all transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                        >
                            <span>Book Consultation</span>
                            <i className="fas fa-arrow-right text-xs"></i>
                        </Link>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-6 text-center text-white/70 text-xs md:text-sm">
                    <p>
                        &copy; 2026 Veer Real Estate. All rights reserved. | <Link href="/builder-consultation" className="text-[#E8AA38] hover:underline font-semibold">Builder Bhai Consultation</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}

// Helper Components for Cleaner Code
function SocialLink({ href, icon, bgColor, iconColor = "#fff" }: { href: string; icon: string; bgColor: string; iconColor?: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            style={{ background: bgColor, color: iconColor }}
        >
            <i className={icon}></i>
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-white/80 hover:text-primary transition-colors">
                {children}
            </Link>
        </li>
    );
}

function ContactSection({ title, address, phones, email }: { title: string; address: string; phones: string[]; email: string }) {
    return (
        <div className="space-y-3">
            <h5 className="text-lg font-semibold text-white border-b border-white/20 pb-2 text-center md:text-left">
                {title}
            </h5>
            <ul className="space-y-4 text-sm leading-relaxed">
                <li className="flex gap-3 justify-center md:justify-start text-center md:text-left">
                    <i className="fas fa-map-marker-alt mt-1 shrink-0 text-white"></i>
                    <span>{address}</span>
                </li>
                <li className="flex items-start gap-3">
    <i className="fas fa-phone shrink-0 text-white mt-1"></i>

    <div className="flex items-center gap-2 flex-wrap">
        {phones.map((phone, idx) => (
            <span key={idx}>
                <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-primary transition-colors"
                >
                    {phone}
                </a>

                {idx < phones.length - 1 && (
                    <span className="mx-2 text-white/50">|</span>
                )}
            </span>
        ))}
    </div>
</li>
                {/* <li className="flex gap-3 items-center justify-center md:justify-start">
                    <i className="fas fa-envelope shrink-0 text-white"></i>
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors break-all">
                        {email}
                    </a>
                </li> */}
            </ul>
        </div>
    );
}
