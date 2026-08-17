import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Veer Real Estate Ahmedabad",
  description:
    "Read the Privacy Policy of Veer Real Estate, Ahmedabad. Learn how we collect, use, protect and manage personal information submitted through our real estate website, property enquiries and contact forms.",
  keywords: [
    "Veer Real Estate Privacy Policy",
    "Veer Real Estate Ahmedabad",
    "real estate privacy policy Ahmedabad",
    "property enquiry privacy policy",
    "real estate website privacy policy",
    "property consultation Ahmedabad",
  ],
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-collected", title: "Information We Collect" },
  { id: "property-enquiries", title: "Property Enquiries & Forms" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "communications", title: "Communication & Marketing" },
  { id: "cookies", title: "Cookies & Website Technologies" },
  { id: "analytics", title: "Analytics & Website Performance" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "sharing", title: "Information Sharing" },
  { id: "security", title: "Data Security" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Privacy Rights" },
  { id: "children", title: "Children's Privacy" },
  { id: "external-links", title: "External Links" },
  { id: "updates", title: "Updates to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicyPage() {
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
              Privacy & Data Protection
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
              Learn how Veer Real Estate collects, uses, protects and manages
              your personal information when you use our website and services.
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
                    d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4v2a4 4 0 01-8 0v-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-2.21-1.79-4-4-4s-4 1.79-4 4v2a4 4 0 008 0v-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7V3"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#064B91] sm:text-2xl">
                  Your Privacy Matters
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Veer Real Estate – Ahmedabad, Gujarat
                </p>
              </div>

            </div>

            <p className="leading-7 text-gray-600">
              At Veer Real Estate, we respect your privacy and are committed
              to protecting the personal information you share with us. This
              Privacy Policy explains how we collect, use, store and protect
              information when you visit our website, browse property
              listings, submit an enquiry, contact our team or use our
              property-related services.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              By using this website, you acknowledge that you have read and
              understood this Privacy Policy. If you do not agree with this
              policy, please discontinue using the website.
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

            {/* Privacy Content */}
            <article className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">

              {/* 01 */}
              <section id="introduction" className="scroll-mt-24">

                <SectionTitle number="01" title="Introduction" />

                <p>
                  Veer Real Estate is a real estate consultancy based in
                  Ahmedabad, Gujarat. We provide property-related information,
                  consultation and assistance for residential, commercial,
                  industrial, land and other real estate opportunities.
                </p>

                <p className="mt-4">
                  This Privacy Policy applies to information collected through
                  the Veer Real Estate website, including property enquiry
                  forms, contact forms, project enquiries, communication
                  requests and other website interactions.
                </p>

              </section>

              <Divider />

              {/* 02 */}
              <section id="information-collected" className="scroll-mt-24">

                <SectionTitle
                  number="02"
                  title="Information We Collect"
                />

                <p>
                  Depending on how you interact with our website, we may
                  collect information such as:
                </p>

                <BulletList
                  items={[
                    "Full name",
                    "Email address",
                    "Phone or mobile number",
                    "WhatsApp contact details, where provided",
                    "Property requirements and preferences",
                    "Preferred property type",
                    "Location preferences",
                    "Budget or investment preferences, where voluntarily provided",
                    "Information submitted through enquiry forms",
                    "Messages and other information you choose to provide",
                  ]}
                />

                <p className="mt-5">
                  We may also automatically receive limited technical
                  information when you visit our website, such as browser
                  information, device information, IP address, pages visited,
                  referring pages and general website usage information.
                </p>

              </section>

              <Divider />

              {/* 03 */}
              <section id="property-enquiries" className="scroll-mt-24">

                <SectionTitle
                  number="03"
                  title="Property Enquiries and Contact Forms"
                />

                <p>
                  When you submit a property enquiry or contact form, the
                  information you provide may be used to understand your
                  requirements and respond to your request.
                </p>

                <p className="mt-4">
                  This may include contacting you regarding properties,
                  projects, site visits, pricing, availability, investment
                  opportunities or other real estate services related to your
                  enquiry.
                </p>

                <p className="mt-4">
                  Please provide accurate information when submitting a form.
                  We may be unable to respond appropriately if the information
                  provided is incomplete or inaccurate.
                </p>

              </section>

              <Divider />

              {/* 04 */}
              <section id="how-we-use" className="scroll-mt-24">

                <SectionTitle
                  number="04"
                  title="How We Use Your Information"
                />

                <p>
                  Information collected through our website may be used for
                  legitimate business and service-related purposes, including:
                </p>

                <BulletList
                  items={[
                    "Responding to property enquiries",
                    "Providing information about properties and projects",
                    "Understanding your property requirements",
                    "Arranging property consultations or site visits",
                    "Communicating regarding property availability and pricing",
                    "Providing requested services or assistance",
                    "Improving our website and user experience",
                    "Managing enquiries and customer communication",
                    "Maintaining website security and preventing misuse",
                    "Complying with applicable legal and regulatory requirements",
                  ]}
                />

              </section>

              <Divider />

              {/* 05 */}
              <section id="communications" className="scroll-mt-24">

                <SectionTitle
                  number="05"
                  title="Communication and Marketing"
                />

                <p>
                  If you submit your contact information through our website,
                  Veer Real Estate or an authorized representative may contact
                  you regarding your enquiry or requested property services.
                </p>

                <p className="mt-4">
                  Where permitted by applicable law and where you have provided
                  appropriate consent, we may also send information about
                  property opportunities, projects, offers, updates or related
                  services through channels such as phone, SMS, email or
                  WhatsApp.
                </p>

                <p className="mt-4">
                  You may request that we stop sending non-essential marketing
                  communications by contacting us using the details provided
                  at the end of this Privacy Policy.
                </p>

              </section>

              <Divider />

              {/* 06 */}
              <section id="cookies" className="scroll-mt-24">

                <SectionTitle
                  number="06"
                  title="Cookies and Website Technologies"
                />

                <p>
                  Our website may use cookies and similar technologies to
                  improve website functionality, remember preferences,
                  understand website usage and improve the overall user
                  experience.
                </p>

                <p className="mt-4">
                  Cookies are small files stored on your device by your
                  browser. Depending on your browser settings, you may be able
                  to block or delete cookies.
                </p>

                <p className="mt-4">
                  Disabling certain cookies may affect some website
                  functionality.
                </p>

              </section>

              <Divider />

              {/* 07 */}
              <section id="analytics" className="scroll-mt-24">

                <SectionTitle
                  number="07"
                  title="Analytics and Website Performance"
                />

                <p>
                  We may use analytics and website performance tools to
                  understand how visitors interact with our website.
                </p>

                <p className="mt-4">
                  Such information can help us understand visitor behaviour,
                  identify technical issues, improve website navigation and
                  enhance our property browsing and enquiry experience.
                </p>

                <p className="mt-4">
                  Analytics information may generally be collected in an
                  aggregated or statistical form and may not directly identify
                  individual users.
                </p>

              </section>

              <Divider />

              {/* 08 */}
              <section id="third-party" className="scroll-mt-24">

                <SectionTitle
                  number="08"
                  title="Third-Party Services"
                />

                <p>
                  Our website may use third-party services or technologies to
                  support website functionality, analytics, communication,
                  maps, hosting, security, social media features or other
                  services.
                </p>

                <p className="mt-4">
                  These third-party providers may process information according
                  to their own privacy policies and terms.
                </p>

                <p className="mt-4">
                  Veer Real Estate does not control the privacy practices of
                  third-party services and recommends reviewing their
                  respective policies where appropriate.
                </p>

              </section>

              <Divider />

              {/* 09 */}
              <section id="sharing" className="scroll-mt-24">

                <SectionTitle
                  number="09"
                  title="Information Sharing"
                />

                <p>
                  Veer Real Estate does not sell your personal information for
                  monetary consideration.
                </p>

                <p className="mt-4">
                  Information may be shared when reasonably necessary to
                  provide requested services, respond to property enquiries,
                  coordinate with relevant property owners or developers,
                  operate our website, maintain security, or comply with legal
                  obligations.
                </p>

                <p className="mt-4">
                  Where information is shared with service providers or
                  authorized representatives, we expect them to handle the
                  information appropriately and only for relevant business or
                  service purposes.
                </p>

              </section>

              <Divider />

              {/* 10 */}
              <section id="security" className="scroll-mt-24">

                <SectionTitle
                  number="10"
                  title="Data Security"
                />

                <p>
                  We take reasonable administrative, technical and
                  organizational measures to protect personal information from
                  unauthorized access, misuse, alteration, disclosure or
                  destruction.
                </p>

                <p className="mt-4">
                  However, no method of transmission or electronic storage is
                  completely secure. Therefore, while we take reasonable steps
                  to protect information, we cannot guarantee absolute security
                  of information transmitted through the internet.
                </p>

              </section>

              <Divider />

              {/* 11 */}
              <section id="retention" className="scroll-mt-24">

                <SectionTitle
                  number="11"
                  title="Data Retention"
                />

                <p>
                  We retain personal information for as long as reasonably
                  necessary to fulfil the purposes for which it was collected,
                  provide requested services, maintain business records,
                  resolve disputes, enforce agreements or comply with legal
                  and regulatory obligations.
                </p>

                <p className="mt-4">
                  The period for which information is retained may vary
                  depending on the nature of the information and the purpose
                  for which it was collected.
                </p>

              </section>

              <Divider />

              {/* 12 */}
              <section id="rights" className="scroll-mt-24">

                <SectionTitle
                  number="12"
                  title="Your Privacy Rights"
                />

                <p>
                  Depending on applicable law, you may have rights relating to
                  your personal information, including the right to request
                  access, correction or deletion of certain information.
                </p>

                <p className="mt-4">
                  You may also request information regarding how your personal
                  information is being used or ask us to stop certain
                  communications where applicable.
                </p>

                <p className="mt-4">
                  To make a privacy-related request, please contact us using
                  the contact details provided below. We may need to verify
                  your identity before processing certain requests.
                </p>

              </section>

              <Divider />

              {/* 13 */}
              <section id="children" className="scroll-mt-24">

                <SectionTitle
                  number="13"
                  title="Children's Privacy"
                />

                <p>
                  Our website and services are intended for general audiences
                  and are not specifically directed toward children.
                </p>

                <p className="mt-4">
                  We do not knowingly seek to collect personal information from
                  children through the website. If you believe that a child has
                  provided personal information to us, please contact us so
                  that appropriate action can be considered.
                </p>

              </section>

              <Divider />

              {/* 14 */}
              <section id="external-links" className="scroll-mt-24">

                <SectionTitle
                  number="14"
                  title="External Links"
                />

                <p>
                  Our website may contain links to third-party websites,
                  property developers, service providers, social media
                  platforms or other external resources.
                </p>

                <p className="mt-4">
                  These websites operate independently and may have their own
                  privacy policies, terms and data practices.
                </p>

                <p className="mt-4">
                  Veer Real Estate is not responsible for the privacy practices
                  or content of external websites. We recommend reviewing the
                  privacy policy of any third-party website you visit.
                </p>

              </section>

              <Divider />

              {/* 15 */}
              <section id="updates" className="scroll-mt-24">

                <SectionTitle
                  number="15"
                  title="Updates to This Privacy Policy"
                />

                <p>
                  Veer Real Estate may update this Privacy Policy from time to
                  time to reflect changes in our services, website features,
                  legal requirements, technology or business practices.
                </p>

                <p className="mt-4">
                  When changes are made, the updated version will be published
                  on this page. We encourage users to review this Privacy
                  Policy periodically.
                </p>

              </section>

              <Divider />

              {/* 16 */}
              <section id="contact" className="scroll-mt-24">

                <SectionTitle
                  number="16"
                  title="Contact Us"
                />

                <p>
                  If you have questions, concerns or requests regarding this
                  Privacy Policy or the handling of your personal information,
                  please contact Veer Real Estate.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* East Office */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">

                    <h3 className="text-lg font-bold text-[#064B91]">
                      East Ahmedabad Office
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
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

                    <p className="mt-4 text-sm leading-6 text-gray-600">
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

              </section>

            </article>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-12">

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="text-2xl font-bold text-[#064B91] sm:text-3xl">
            Have Questions About Your Privacy?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            If you have any questions about this Privacy Policy or how your
            information is handled, our team is here to help.
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


/* Section Heading */
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


/* Divider */
function Divider() {
  return <div className="my-9 border-t border-gray-100" />;
}


/* Bullet List */
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