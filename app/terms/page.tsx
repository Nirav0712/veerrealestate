"use client";

import Link from "next/link";

const sections = [
  { id: "about", title: "About Veer Real Estate" },
  { id: "use", title: "Use of the Website" },
  { id: "property-information", title: "Property Information" },
  { id: "images", title: "Property Images & Representations" },
  { id: "prices", title: "Property Prices & Availability" },
  { id: "third-party", title: "Third-Party Developers & Property Owners" },
  { id: "enquiries", title: "Enquiries & Contact Forms" },
  { id: "transaction", title: "No Guarantee of Transaction" },
  { id: "verification", title: "Independent Verification" },
  { id: "intellectual", title: "Intellectual Property" },
  { id: "links", title: "Third-Party Links" },
  { id: "availability", title: "Website Availability" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to Website Content" },
  { id: "privacy", title: "Privacy" },
  { id: "law", title: "Governing Law" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <main className="bg-white text-gray-700">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#064B91] to-[#1768B5]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              Legal Information
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
              Please read these terms carefully before using the Veer Real
              Estate website and its services.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[#f8fafc] py-10 sm:py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Intro Card */}
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#07529A]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6.586a1 1 0 01.707.293l4.414 4.414A1 1 0 0119 8.414V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#064B91] sm:text-2xl">
                  Terms of Use
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Effective for visitors and users of Veer Real Estate
                </p>
              </div>
            </div>

            <p className="leading-7 text-gray-600">
              Welcome to Veer Real Estate. These Terms and Conditions govern
              your access to and use of the Veer Real Estate website,
              including its property listings, project information, enquiry
              forms, services, and other content available through the website.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              By accessing or using this website, you acknowledge that you
              have read, understood, and agreed to these Terms and Conditions.
              If you do not agree with any part of these terms, please
              discontinue using the website.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">

            {/* Table of Contents */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#064B91]">
                  On This Page
                </h3>

                <nav className="max-h-[65vh] overflow-y-auto">
                  <ul className="space-y-1">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="group flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-[#07529A]"
                        >
                          <span className="min-w-[22px] font-semibold text-gray-400 group-hover:text-[#07529A]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Terms Content */}
            <article className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">

              {/* 1 */}
              <section id="about" className="scroll-mt-24">
                <SectionTitle number="01" title="About Veer Real Estate" />

                <p>
                  Veer Real Estate is a real estate consultancy based in
                  Ahmedabad, Gujarat, providing property-related assistance
                  and information for residential, commercial, industrial,
                  land and other real estate opportunities.
                </p>

                <p>
                  The website provides information about properties and
                  projects to help users explore available real estate
                  opportunities. The website currently includes property
                  categories such as apartments, bungalows, plots, lands,
                  industrial properties, commercial shops and commercial
                  offices.
                </p>
              </section>

              <Divider />

              {/* 2 */}
              <section id="use" className="scroll-mt-24">
                <SectionTitle number="02" title="Use of the Website" />

                <p>You agree to use this website only for lawful purposes.</p>

                <p className="mt-4 font-semibold text-gray-800">
                  You must not:
                </p>

                <BulletList
                  items={[
                    "Use the website for fraudulent or unlawful activities.",
                    "Submit false, misleading or inaccurate information.",
                    "Attempt to gain unauthorized access to the website or its systems.",
                    "Copy, reproduce or distribute website content without permission.",
                    "Interfere with the security, functionality or operation of the website.",
                    "Use website information for purposes that may cause harm to Veer Real Estate or any third party.",
                  ]}
                />
              </section>

              <Divider />

              {/* 3 */}
              <section id="property-information" className="scroll-mt-24">
                <SectionTitle number="03" title="Property Information" />

                <p>
                  Veer Real Estate makes reasonable efforts to provide accurate
                  and useful property information. However, property details
                  may change from time to time.
                </p>

                <p className="mt-4 font-semibold text-gray-800">
                  Information displayed on the website may include:
                </p>

                <BulletList
                  items={[
                    "Property prices",
                    "Property availability",
                    "Property sizes",
                    "Location details",
                    "Property specifications",
                    "Amenities",
                    "Project information",
                    "Images and videos",
                    "Floor plans",
                    "Possession-related information",
                    "Developer or project details",
                  ]}
                />

                <p className="mt-5">
                  Such information may be updated, modified or withdrawn
                  without prior notice.
                </p>

                <p className="mt-4">
                  Users should independently verify important property details,
                  including price, availability, carpet/built-up area,
                  specifications, approvals, possession status, title,
                  ownership, RERA details and other legal or technical
                  information before making any purchase, investment or other
                  financial decision.
                </p>
              </section>

              <Divider />

              {/* 4 */}
              <section id="images" className="scroll-mt-24">
                <SectionTitle
                  number="04"
                  title="Property Images and Representations"
                />

                <p>
                  Images, photographs, illustrations, renders, floor plans and
                  other visual materials displayed on the website are provided
                  for informational and illustrative purposes.
                </p>

                <p className="mt-4">
                  Actual property appearance, specifications, dimensions,
                  finishes, fixtures, amenities and surroundings may differ
                  from the images or representations shown on the website.
                </p>

                <p className="mt-4">
                  Where applicable, the final specifications shall be subject
                  to the relevant property documents, agreements and
                  information provided by the concerned developer, owner or
                  authorized party.
                </p>
              </section>

              <Divider />

              {/* 5 */}
              <section id="prices" className="scroll-mt-24">
                <SectionTitle
                  number="05"
                  title="Property Prices and Availability"
                />

                <p>
                  Property prices and availability are subject to change
                  without prior notice.
                </p>

                <p className="mt-4">
                  A property displayed on the website should not be considered
                  reserved, booked or guaranteed merely because it appears on
                  the website.
                </p>

                <p className="mt-4">
                  Availability, pricing, payment schedules, offers and other
                  commercial terms should be confirmed with Veer Real Estate
                  and/or the concerned developer or property owner before
                  proceeding with a transaction.
                </p>
              </section>

              <Divider />

              {/* 6 */}
              <section id="third-party" className="scroll-mt-24">
                <SectionTitle
                  number="06"
                  title="Third-Party Developers and Property Owners"
                />

                <p>
                  Veer Real Estate may display information relating to
                  properties and projects developed, marketed or owned by third
                  parties.
                </p>

                <p className="mt-4">
                  Information supplied by developers, builders, property owners
                  or other third parties may be reproduced on the website for
                  informational purposes.
                </p>

                <p className="mt-4">
                  Veer Real Estate does not guarantee that all third-party
                  information will remain unchanged or that every property or
                  project will remain available.
                </p>

                <p className="mt-4">
                  Users should conduct appropriate due diligence before
                  entering into any transaction.
                </p>
              </section>

              <Divider />

              {/* 7 */}
              <section id="enquiries" className="scroll-mt-24">
                <SectionTitle number="07" title="Enquiries and Contact Forms" />

                <p>
                  When you submit an enquiry through the website, you agree to
                  provide accurate and genuine information.
                </p>

                <p className="mt-4">
                  By submitting your contact details, you may be contacted by
                  Veer Real Estate or an authorized representative regarding
                  your enquiry, property requirements, project information or
                  related services.
                </p>

                <p className="mt-4">
                  Submitting an enquiry does not create a contract, booking,
                  agency relationship or guarantee of property availability.
                </p>
              </section>

              <Divider />

              {/* 8 */}
              <section id="transaction" className="scroll-mt-24">
                <SectionTitle number="08" title="No Guarantee of Transaction" />

                <p>
                  Information provided on this website should not be
                  interpreted as a guarantee that a particular property
                  transaction will be completed.
                </p>

                <p className="mt-4">
                  The final terms of any property transaction will depend on
                  the relevant parties, property documentation, negotiations,
                  approvals, agreements and applicable laws.
                </p>
              </section>

              <Divider />

              {/* 9 */}
              <section id="verification" className="scroll-mt-24">
                <SectionTitle number="09" title="Independent Verification" />

                <p>
                  Before purchasing, renting, leasing or investing in any
                  property, users are advised to independently verify all
                  relevant information.
                </p>

                <p className="mt-4 font-semibold text-gray-800">
                  This may include:
                </p>

                <BulletList
                  items={[
                    "Ownership and title documents",
                    "Property approvals",
                    "RERA registration, where applicable",
                    "Land records",
                    "Building permissions",
                    "Property taxes",
                    "Encumbrances",
                    "Measurements and specifications",
                    "Developer credentials",
                    "Agreement terms",
                    "Payment schedules",
                    "Possession details",
                  ]}
                />

                <p className="mt-5">
                  Users may seek independent legal, financial, taxation or
                  professional advice before entering into a property
                  transaction.
                </p>
              </section>

              <Divider />

              {/* 10 */}
              <section id="intellectual" className="scroll-mt-24">
                <SectionTitle number="10" title="Intellectual Property" />

                <p>
                  Unless otherwise stated, the content available on this
                  website, including:
                </p>

                <BulletList
                  items={[
                    "Text",
                    "Logos",
                    "Graphics",
                    "Images",
                    "Photographs",
                    "Videos",
                    "Designs",
                    "Website layout",
                    "Branding",
                    "Written materials",
                  ]}
                />

                <p className="mt-5">
                  is owned by or licensed to Veer Real Estate or its respective
                  content providers.
                </p>

                <p className="mt-4">
                  You may not reproduce, modify, distribute, publish, sell or
                  commercially exploit website content without prior written
                  permission.
                </p>
              </section>

              <Divider />

              {/* 11 */}
              <section id="links" className="scroll-mt-24">
                <SectionTitle number="11" title="Third-Party Links" />

                <p>
                  The website may contain links or references to third-party
                  websites, developers, service providers or other external
                  resources.
                </p>

                <p className="mt-4">
                  These third-party websites are operated independently from
                  Veer Real Estate.
                </p>

                <p className="mt-4">
                  Veer Real Estate does not control and is not responsible for
                  the content, privacy practices, availability, security or
                  policies of third-party websites.
                </p>

                <p className="mt-4">
                  Users should review the terms and privacy policies of
                  third-party websites before using them.
                </p>
              </section>

              <Divider />

              {/* 12 */}
              <section id="availability" className="scroll-mt-24">
                <SectionTitle number="12" title="Website Availability" />

                <p>
                  Veer Real Estate makes reasonable efforts to keep the website
                  accessible and operational.
                </p>

                <p className="mt-4">
                  However, we do not guarantee that the website will always be:
                </p>

                <BulletList
                  items={[
                    "Available without interruption",
                    "Free from technical errors",
                    "Free from viruses or harmful components",
                    "Completely accurate or up to date",
                  ]}
                />

                <p className="mt-5">
                  The website may occasionally be unavailable because of
                  maintenance, technical issues, updates or circumstances
                  beyond our reasonable control.
                </p>
              </section>

              <Divider />

              {/* 13 */}
              <section id="liability" className="scroll-mt-24">
                <SectionTitle number="13" title="Limitation of Liability" />

                <p>
                  To the extent permitted by applicable law, Veer Real Estate
                  shall not be responsible for losses or damages arising from
                  reliance on inaccurate, outdated or incomplete information
                  displayed on the website.
                </p>

                <p className="mt-4">
                  This includes, where applicable, losses resulting from:
                </p>

                <BulletList
                  items={[
                    "Property price changes",
                    "Property availability changes",
                    "Changes in project specifications",
                    "Delays",
                    "Third-party information",
                    "Technical interruptions",
                    "Decisions made solely on the basis of website content",
                  ]}
                />

                <p className="mt-5">
                  Users are responsible for conducting their own due diligence
                  before entering into any property transaction.
                </p>
              </section>

              <Divider />

              {/* 14 */}
              <section id="changes" className="scroll-mt-24">
                <SectionTitle
                  number="14"
                  title="Changes to Website Content"
                />

                <p>
                  Veer Real Estate reserves the right to modify, update,
                  remove or add website content, property listings, services,
                  prices, projects or other information at any time without
                  prior notice.
                </p>

                <p className="mt-4">
                  We may also update these Terms and Conditions from time to
                  time.
                </p>

                <p className="mt-4">
                  The updated version will become effective once published on
                  this page.
                </p>
              </section>

              <Divider />

              {/* 15 */}
              <section id="privacy" className="scroll-mt-24">
                <SectionTitle number="15" title="Privacy" />

                <p>
                  Any personal information submitted through the website may
                  be handled in accordance with our Privacy Policy.
                </p>

                <p className="mt-4">
                  Users are encouraged to review the{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-[#07529A] hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  to understand how their information may be collected, used
                  and protected.
                </p>
              </section>

              <Divider />

              {/* 16 */}
              <section id="law" className="scroll-mt-24">
                <SectionTitle number="16" title="Governing Law" />

                <p>
                  These Terms and Conditions shall be governed by and
                  interpreted in accordance with the applicable laws of India.
                </p>

                <p className="mt-4">
                  Any dispute arising in connection with the use of this
                  website or services provided by Veer Real Estate shall be
                  subject to the jurisdiction of the appropriate courts in
                  Ahmedabad, Gujarat, unless otherwise required by applicable
                  law.
                </p>
              </section>

              <Divider />

              {/* 17 */}
              <section id="contact" className="scroll-mt-24">
                <SectionTitle number="17" title="Contact Us" />

                <p>
                  If you have questions regarding these Terms and Conditions,
                  you can contact Veer Real Estate using the following details:
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* East Office */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                    <h3 className="text-lg font-bold text-[#064B91]">
                      Veer Real Estate
                    </h3>

                    <p className="mt-4 font-semibold text-gray-800">
                      East Ahmedabad Office
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      C-238, Sumel 7, Near Soni Ni Chali Cross Road,
                      <br />
                      Odhav, Ahmedabad – 382415
                    </p>

                    <p className="mt-3 text-sm text-gray-700">
                      <strong>Phone:</strong>{" "}
                      <a
                        href="tel:+919376996179"
                        className="text-[#07529A] hover:underline"
                      >
                        +91 93769 96179
                      </a>{" "}
                      /{" "}
                      <a
                        href="tel:+919727027052"
                        className="text-[#07529A] hover:underline"
                      >
                        +91 97270 27052
                      </a>
                    </p>
                  </div>

                  {/* West Office */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                    <h3 className="text-lg font-bold text-[#064B91]">
                      West Ahmedabad Office
                    </h3>

                    <p className="mt-4 font-semibold text-gray-800">
                      Office Address
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      431, Yash Arian Complex, Near Swami Vivekanand Circle,
                      <br />
                      Memnagar, Ahmedabad – 380052
                    </p>

                    <p className="mt-3 text-sm text-gray-700">
                      <strong>Phone:</strong>{" "}
                      <a
                        href="tel:+918866113391"
                        className="text-[#07529A] hover:underline"
                      >
                        +91 88661 13391
                      </a>{" "}
                      /{" "}
                      <a
                        href="tel:+919067230240"
                        className="text-[#07529A] hover:underline"
                      >
                        +91 90672 30240
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Email:
                    </span>{" "}
                    <a
                      href="mailto:horseveer@gmail.com"
                      className="text-[#07529A] hover:underline"
                    >
                      horseveer@gmail.com
                    </a>
                  </p>
                </div>

                <div className="mt-8 rounded-xl border-l-4 border-[#07529A] bg-blue-50 p-5">
                  <p className="text-sm leading-6 text-gray-600">
                    These contact details correspond with the information
                    currently published on the website.
                  </p>
                </div>
              </section>

            </article>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-[#064B91] sm:text-3xl">
            Have Questions About Our Terms?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            If you need clarification regarding these Terms & Conditions,
            please feel free to contact our team.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#07529A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#06447F]"
          >
            Contact Veer Real Estate
          </Link>
        </div>
      </section>
    </main>
  );
}

/* Reusable Section Heading */
function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="mt-1 flex h-9 min-w-9 items-center justify-center rounded-lg bg-blue-50 px-2 text-xs font-bold text-[#07529A]">
        {number}
      </span>

      <h2 className="text-xl font-bold leading-tight text-[#064B91] sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

/* Reusable Divider */
function Divider() {
  return <div className="my-9 border-t border-gray-100" />;
}

/* Reusable Bullet List */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-gray-600"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#07529A]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}