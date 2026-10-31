'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BranchPhone {
  number: string;
  label?: string;
}

interface Branch {
  id: string;
  name: string;
  displayTitle?: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phones: BranchPhone[];
  email?: string;
  whatsapp?: string;
  mapUrl?: string;
  mapEmbedUrl?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  googleReview?: string;
  linkedin?: string;
  isActive?: boolean | number;
  displayOrder?: number;
}

interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  is_active?: boolean;
  is_new?: boolean;
  order?: number;
}

interface FooterConfig {
  logoUrl?: string;
  logoAlt?: string;
  companyName?: string;
  tagline?: string;
  description?: string;
  quickLinks?: FooterLinkItem[];
  propertyTypes?: FooterLinkItem[];
  builderBanner?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    badgeText?: string;
    consultantName?: string;
    consultantImage?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  copyright?: string;
  reraDisclaimer?: string;
  builderLinkText?: string;
}

const DEFAULT_BRANCHES: Branch[] = [
  {
    id: 'branch_east',
    name: 'East Ahmedabad',
    displayTitle: 'East Ahmedabad',
    address: 'C-238, Sumel 7, Odhav, Ahmedabad - 382415',
    phones: [
      { number: '+91 93769 96179', label: 'Office' },
      { number: '+91 97270 27052', label: 'Sales' },
    ],
    email: 'horseveer@gmail.com',
    mapUrl: 'https://maps.google.com/?q=Sumel+7+Odhav+Ahmedabad',
    facebook: 'https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/',
    instagram: 'https://www.instagram.com/veerrealestateeastahmedabad/?hl=en',
    youtube: 'https://www.youtube.com/@VeerRealEstate',
    googleReview: 'https://g.page/r/CcSCOVV14JRdEAI/review',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'branch_west',
    name: 'West Ahmedabad',
    displayTitle: 'West Ahmedabad',
    address: '431, Yash Arian Complex, Memnagar, Ahmedabad - 380052',
    phones: [
      { number: '+91 88661 13391', label: 'Office' },
      { number: '+91 90672 30240', label: 'Support' },
    ],
    email: 'horseveer@gmail.com',
    mapUrl: 'https://maps.google.com/?q=Yash+Arian+Complex+Memnagar+Ahmedabad',
    facebook: 'https://www.facebook.com/people/Veer-Real-Estate/61558935522154/',
    instagram: 'https://www.instagram.com/veer.real_estate/',
    youtube: 'https://www.youtube.com/@VeerRealEstate',
    googleReview: 'https://g.page/r/CcSCOVV14JRdEAI/review',
    linkedin: 'https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'branch_bopal',
    name: 'Bopal Branch',
    displayTitle: 'Bopal Branch',
    address: '1120, STC, Opp. Saraswati Hospital, Ambli, Ahmedabad - 380058',
    phones: [{ number: '+91 81601 53208', label: 'Direct' }],
    email: 'horseveer@gmail.com',
    mapUrl: 'https://maps.google.com/?q=STC+Opp+Saraswati+Hospital+Ambli+Ahmedabad',
    isActive: true,
    displayOrder: 3,
  },
];

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  logoUrl: '/images/veer-logo-old.png',
  logoAlt: 'Veer Real Estate Logo',
  companyName: 'Veer Real Estate',
  description: 'Veer Real Estate — Your trusted property partner in Ahmedabad since 2012.',
  quickLinks: [
    { id: 'ql_1', label: 'Home', url: '/', is_active: true, is_new: false, order: 1 },
    { id: 'ql_2', label: 'About Us', url: '/about-us', is_active: true, is_new: false, order: 2 },
    { id: 'ql_3', label: 'Builder Consultation', url: '/builder-consultation', is_active: true, is_new: true, order: 3 },
    { id: 'ql_4', label: 'Properties', url: '/properties', is_active: true, is_new: false, order: 4 },
    { id: 'ql_5', label: 'All Projects', url: '/projects', is_active: true, is_new: false, order: 5 },
    { id: 'ql_6', label: 'East Projects', url: '/projects/east', is_active: true, is_new: false, order: 6 },
    { id: 'ql_7', label: 'West Projects', url: '/projects/west', is_active: true, is_new: false, order: 7 },
    { id: 'ql_8', label: 'Blogs', url: '/blog', is_active: true, is_new: false, order: 8 },
    { id: 'ql_9', label: 'Contact', url: '/contact', is_active: true, is_new: false, order: 9 },
  ],
  propertyTypes: [
    { id: 'pt_1', label: 'Apartments', url: '/properties?type=Apartment', is_active: true, order: 1 },
    { id: 'pt_2', label: 'Plots', url: '/properties?type=Plot', is_active: true, order: 2 },
    { id: 'pt_3', label: 'Lands', url: '/properties?type=Land', is_active: true, order: 3 },
    { id: 'pt_4', label: 'Bunglows', url: '/properties?type=Bunglows', is_active: true, order: 4 },
    { id: 'pt_5', label: 'Industrial', url: '/properties?type=Industrial', is_active: true, order: 5 },
    { id: 'pt_6', label: 'Commercial Shops', url: '/properties?type=Commercial', is_active: true, order: 6 },
    { id: 'pt_7', label: 'Commercial Office', url: '/properties?type=Office', is_active: true, order: 7 },
  ],
  builderBanner: {
    enabled: true,
    title: 'Builder Bhai — Let’s Build a Stronger Real Estate Business',
    subtitle: 'Get expert project positioning, marketing strategy, site visits & sales consultation with Sudhir Prajapati.',
    badgeText: 'For Builders & Developers',
    consultantName: 'Sudhir Prajapati',
    consultantImage: '/images/sudhir-about-final.jpg',
    buttonText: 'Book Consultation',
    buttonUrl: '/builder-consultation',
  },
  copyright: '© 2026 Veer Real Estate. All rights reserved.',
  reraDisclaimer: 'All project information, amenities, and floor plans are subject to change as per developer specifications and RERA guidelines.',
  builderLinkText: 'Builder Bhai Consultation',
};

export default function Footer() {
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);

  useEffect(() => {
    // 1. Fetch live active branches
    fetch('/api/branches')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.branches) && data.branches.length > 0) {
          setBranches(data.branches);
        }
      })
      .catch((err) => console.warn('[Footer] Failed to fetch branches, using fallback:', err));

    // 2. Fetch live footer configuration
    fetch('/api/content?key=footer_config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contentData) {
          setConfig((prev) => ({
            ...prev,
            ...data.contentData,
            builderBanner: {
              ...prev.builderBanner,
              ...(data.contentData.builderBanner || {}),
            },
          }));
        }
      })
      .catch((err) => console.warn('[Footer] Failed to fetch footer_config, using fallback:', err));
  }, []);

  const activeQuickLinks = (config.quickLinks || DEFAULT_FOOTER_CONFIG.quickLinks || []).filter(
    (l) => l.is_active !== false
  );

  const activePropertyTypes = (config.propertyTypes || DEFAULT_FOOTER_CONFIG.propertyTypes || []).filter(
    (pt) => pt.is_active !== false
  );

  const banner = config.builderBanner || DEFAULT_FOOTER_CONFIG.builderBanner;

  return (
    <footer className="bg-secondary text-white pt-16 pb-4">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: About & Social Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" aria-label="Veer Real Estate Home">
              <div className="pt-2 pb-2 inline-block rounded-2xl bg-white mb-6 cursor-pointer shadow-sm hover:opacity-95 transition-opacity">
                <Image
                  src={config.logoUrl || '/images/veer-logo-old.png'}
                  alt={config.logoAlt || 'Veer Logo'}
                  width={200}
                  height={200}
                  className="object-contain w-40 md:w-52"
                />
              </div>
            </Link>

            {config.description && (
              <p className="text-white/75 text-xs sm:text-sm mb-6 leading-relaxed max-w-sm">
                {config.description}
              </p>
            )}

            {/* Branch Social Links dynamically rendered */}
            <div className="space-y-4 w-full">
              {branches.map((b) => {
                const hasSocial = b.facebook || b.youtube || b.instagram || b.googleReview || b.linkedin;
                if (!hasSocial) return null;
                return (
                  <div key={b.id}>
                    <span className="text-white/70 font-medium mb-2 block text-xs uppercase tracking-wider">
                      {b.displayTitle || b.name}
                    </span>
                    <div className="flex justify-center md:justify-start gap-2.5 flex-wrap">
                      {b.facebook && (
                        <SocialLink
                          href={b.facebook}
                          icon="fab fa-facebook-f"
                          bgColor="#1877F2"
                          ariaLabel={`${b.name} Facebook`}
                        />
                      )}
                      {b.youtube && (
                        <SocialLink
                          href={b.youtube}
                          icon="fab fa-youtube"
                          bgColor="#FF0000"
                          ariaLabel={`${b.name} YouTube`}
                        />
                      )}
                      {b.instagram && (
                        <SocialLink
                          href={b.instagram}
                          icon="fab fa-instagram"
                          bgColor="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)"
                          ariaLabel={`${b.name} Instagram`}
                        />
                      )}
                      {b.googleReview && (
                        <SocialLink
                          href={b.googleReview}
                          icon="fab fa-google"
                          bgColor="#fff"
                          iconColor="#4285F4"
                          ariaLabel={`${b.name} Google Reviews`}
                        />
                      )}
                      {b.linkedin && (
                        <SocialLink
                          href={b.linkedin}
                          icon="fab fa-linkedin-in"
                          bgColor="#0A66C2"
                          ariaLabel={`${b.name} LinkedIn`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links - Hidden on Mobile */}
          <div className="hidden md:block text-left items-left justify-left pl-0 lg:pl-16">
            <h4 className="text-xl font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3.5">
              {activeQuickLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="text-white/80 hover:text-primary transition-colors inline-flex items-center gap-2 group text-sm"
                  >
                    {item.is_new ? (
                      <span className="text-[#F1B33B] font-semibold flex items-center gap-1.5">
                        <span>{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1B33B]/20 text-[#F1B33B] uppercase font-bold tracking-wider">
                          New
                        </span>
                      </span>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Property Types - Hidden on Mobile */}
          <div className="hidden md:block">
            <h4 className="text-xl font-semibold mb-4 text-white">Property Types</h4>
            <ul className="space-y-3.5">
              {activePropertyTypes.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="text-white/80 hover:text-primary transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Dynamic Contact Info / Branches */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="text-xl font-semibold mb-4 text-center md:text-left text-white">
              Contact Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5 text-white/80">
              {branches.map((branch) => {
                const phoneList = Array.isArray(branch.phones)
                  ? branch.phones.map((p) => (typeof p === 'string' ? p : p.number)).filter(Boolean)
                  : [];

                return (
                  <div key={branch.id} className="space-y-2.5">
                    <h5 className="text-base sm:text-lg font-semibold text-white border-b border-white/20 pb-1.5 text-center md:text-left">
                      {branch.displayTitle || branch.name}
                    </h5>
                    <ul className="space-y-3 text-xs sm:text-sm leading-relaxed">
                      {/* Address with optional Map link */}
                      <li className="flex gap-2.5 justify-center md:justify-start text-center md:text-left items-start">
                        <i className="fas fa-map-marker-alt mt-1 shrink-0 text-[#E8AA38]"></i>
                        {branch.mapUrl ? (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#E8AA38] hover:underline transition-colors"
                            title="Open in Google Maps"
                          >
                            {branch.address}
                          </a>
                        ) : (
                          <span>{branch.address}</span>
                        )}
                      </li>

                      {/* Multiple Phone Numbers with Clickable tel: Links */}
                      {phoneList.length > 0 && (
                        <li className="flex items-start gap-2.5 justify-center md:justify-start">
                          <i className="fas fa-phone shrink-0 text-[#E8AA38] mt-1"></i>
                          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                            {phoneList.map((ph, idx) => {
                              const cleanDigits = ph.replace(/[^0-9+]/g, '');
                              return (
                                <span key={idx} className="inline-flex items-center">
                                  <a
                                    href={`tel:${cleanDigits}`}
                                    className="hover:text-[#E8AA38] transition-colors font-medium whitespace-nowrap"
                                  >
                                    {ph}
                                  </a>
                                  {idx < phoneList.length - 1 && (
                                    <span className="mx-1.5 text-white/40">|</span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </li>
                      )}

                      {/* Optional Email */}
                      {branch.email && (
                        <li className="flex gap-2.5 items-center justify-center md:justify-start text-xs">
                          <i className="fas fa-envelope shrink-0 text-[#E8AA38]"></i>
                          <a
                            href={`mailto:${branch.email}`}
                            className="hover:text-[#E8AA38] transition-colors break-all"
                          >
                            {branch.email}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Builder Consultation Special Banner */}
        {banner && banner.enabled !== false && (
          <div className="border-t border-white/10 pt-8 pb-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#031326] via-[#09223f] to-[#031326] border border-[#E8AA38]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left transition-all hover:border-[#E8AA38]/60">
              <div className="flex items-center gap-4 flex-col sm:flex-row">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E8AA38] shrink-0 shadow-md relative bg-[#041221]">
                  <Image
                    src={banner.consultantImage || '/images/sudhir-about-final.jpg'}
                    alt={banner.consultantName || 'Sudhir Prajapati'}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8AA38]/15 border border-[#E8AA38]/30 text-[#E8AA38] text-[11px] font-bold uppercase tracking-wider mb-1">
                    {banner.badgeText || 'For Builders & Developers'}
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {banner.title || 'Builder Bhai — Let’s Build a Stronger Real Estate Business'}
                  </h4>
                  <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                    {banner.subtitle ||
                      'Get expert project positioning, marketing strategy, site visits & sales consultation with Sudhir Prajapati.'}
                  </p>
                </div>
              </div>
              <Link
                href={banner.buttonUrl || '/builder-consultation'}
                className="shrink-0 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#F9C354] via-[#F1B33B] to-[#D89423] hover:from-[#fcd37a] hover:to-[#e59d28] text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#E8AA38]/20 transition-all transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>{banner.buttonText || 'Book Consultation'}</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-6 text-center text-white/70 text-xs md:text-sm space-y-2">
          {config.reraDisclaimer && (
            <p className="text-[11px] text-white/50 max-w-4xl mx-auto leading-relaxed">
              {config.reraDisclaimer}
            </p>
          )}
          <p>
            {config.copyright || `© ${new Date().getFullYear()} Veer Real Estate. All rights reserved.`}{' '}
            |{' '}
            <Link
              href="/builder-consultation"
              className="text-[#E8AA38] hover:underline font-semibold"
            >
              {config.builderLinkText || 'Builder Bhai Consultation'}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Helper Components for Cleaner Code
function SocialLink({
  href,
  icon,
  bgColor,
  iconColor = '#fff',
  ariaLabel,
}: {
  href: string;
  icon: string;
  bgColor: string;
  iconColor?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg text-sm sm:text-base cursor-pointer"
      style={{ background: bgColor, color: iconColor }}
    >
      <i className={icon}></i>
    </a>
  );
}
