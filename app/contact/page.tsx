"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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

interface ContactSubject {
  id: string;
  label: string;
}

interface ContactFormSettings {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  subjects?: ContactSubject[];
  showMarketingConsent?: boolean;
  marketingConsentText?: string;
  termsLinkText?: string;
  privacyLinkText?: string;
  notificationEmail?: string;
  successMessage?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const DEFAULT_SUBJECTS: ContactSubject[] = [
  { id: 'buy', label: 'Buying' },
  { id: 'sell', label: 'Selling' },
  { id: 'rent', label: 'Renting' },
  { id: 'invest', label: 'Investment Consultation' },
  { id: 'builder', label: 'Builder Consultation' },
  { id: 'general', label: 'General Inquiry' },
];

export default function ContactPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formSettings, setFormSettings] = useState<ContactFormSettings>({
    title: 'Send Message',
    subtitle: "Have questions? We're here to help you find your dream property",
    submitButtonText: 'Send via WhatsApp',
    subjects: DEFAULT_SUBJECTS,
    showMarketingConsent: true,
    marketingConsentText:
      'I would like to receive communication via SMS, RCS SMS, Email & WhatsApp services for offers, updates & transactions.',
    successMessage: 'Thank you! Your message has been sent. Our property consultant will contact you shortly.',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false); // Unchecked by default
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedMapBranchId, setSelectedMapBranchId] = useState<string>('');

  useEffect(() => {
    // 1. Fetch live active branches
    fetch('/api/branches')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.branches) && data.branches.length > 0) {
          setBranches(data.branches);
          // Set map branch to the first branch with a mapEmbedUrl or first branch
          const withEmbed = data.branches.find((b: Branch) => b.mapEmbedUrl && b.mapEmbedUrl.trim().length > 10);
          if (withEmbed) {
            setSelectedMapBranchId(withEmbed.id);
          } else {
            setSelectedMapBranchId(data.branches[0].id);
          }
        }
      })
      .catch((err) => console.error('[ContactPage] Error fetching branches:', err));

    // 2. Fetch contact form settings
    fetch('/api/content?key=contact_form_settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contentData) {
          setFormSettings((prev) => ({
            ...prev,
            ...data.contentData,
            subjects:
              Array.isArray(data.contentData.subjects) && data.contentData.subjects.length > 0
                ? data.contentData.subjects
                : DEFAULT_SUBJECTS,
          }));
        }
      })
      .catch((err) => console.error('[ContactPage] Error fetching form settings:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!termsAccepted) {
      setStatusMessage({ type: 'error', text: 'Please accept the Terms & Privacy Policy to proceed.' });
      return;
    }

    setLoading(true);

    try {
      // Pick WhatsApp number from the first branch or fallback
      const primaryBranch = branches[0];
      const targetWhatsApp = primaryBranch?.whatsapp || '919727027052';

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          leadType: 'contact',
          source: 'Contact Page Form',
          marketingConsent: marketingAccepted,
          termsConsent: termsAccepted,
          recaptchaToken: captchaToken,
          whatsappNumber: targetWhatsApp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Unable to submit inquiry. Please check your information and try again.',
        });
        setLoading(false);
        return;
      }

      // Success: Persistence confirmed by CRM
      setStatusMessage({
        type: 'success',
        text: formSettings.successMessage || 'Thank you! Your message has been sent. Our team will contact you shortly.',
      });

      // Clear form inputs
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTermsAccepted(false);
      setMarketingAccepted(false);

      // Open WhatsApp click-to-chat if server returned url
      const finalWaUrl =
        data.whatsappUrl ||
        `https://wa.me/${targetWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          `*New Contact Form Message*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message}`
        )}`;

      try {
        window.open(finalWaUrl, '_blank');
      } catch (e) {
        console.warn('Popup blocked, url:', finalWaUrl);
      }
    } catch (err: any) {
      console.error('[ContactPage] Submission failed:', err);
      setStatusMessage({
        type: 'error',
        text: 'Network error submitting form. Please verify your connection or contact us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedBranch = branches.find((b) => b.id === selectedMapBranchId) || branches[0];

  return (
    <>
      {/* FontAwesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-secondary-light text-white py-12 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg md:text-2xl opacity-95">
            {formSettings.subtitle || "Have questions? We're here to help you find your dream property"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* LEFT SIDE: DYNAMIC MULTI-BRANCH CONTACT INFO */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {branches.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading branch information...</p>
                ) : (
                  branches.map((b) => {
                    const phoneList = Array.isArray(b.phones)
                      ? b.phones.map((p) => (typeof p === 'string' ? { number: p, label: 'Office' } : p))
                      : [];

                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <h3 className="font-bold text-secondary text-base sm:text-lg flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                            <span>{b.displayTitle || b.name}</span>
                          </h3>
                          {b.whatsapp && (
                            <a
                              href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 transition"
                            >
                              <i className="fab fa-whatsapp"></i>
                              <span>Chat</span>
                            </a>
                          )}
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <i className="fas fa-map-marker-alt text-primary text-xs"></i>
                          </div>
                          <div>
                            <p className="leading-relaxed">{b.address}</p>
                            {b.mapUrl && (
                              <a
                                href={b.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                              >
                                <span>Get Directions</span>
                                <i className="fas fa-external-link-alt text-[10px]"></i>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Phone numbers with clickable tel: links and labels */}
                        {phoneList.length > 0 && (
                          <div className="flex items-start gap-3 text-sm">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <i className="fas fa-phone text-primary text-xs"></i>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {phoneList.map((ph, idx) => {
                                const cleanDigits = ph.number.replace(/[^0-9+]/g, '');
                                return (
                                  <span key={idx} className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md text-xs font-medium text-gray-700">
                                    {ph.label && (
                                      <span className="text-[10px] text-gray-500 uppercase font-semibold">
                                        {ph.label}:
                                      </span>
                                    )}
                                    <a
                                      href={`tel:${cleanDigits}`}
                                      className="text-secondary hover:text-primary transition font-bold"
                                    >
                                      {ph.number}
                                    </a>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Email */}
                        {b.email && (
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                              <i className="fas fa-envelope text-primary text-xs"></i>
                            </div>
                            <a
                              href={`mailto:${b.email}`}
                              className="hover:text-primary transition font-medium"
                            >
                              {b.email}
                            </a>
                          </div>
                        )}

                        {/* Branch-Specific Social Icons */}
                        {(b.facebook || b.youtube || b.instagram || b.googleReview || b.linkedin) && (
                          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] text-gray-400 font-semibold uppercase mr-1">
                              Connect:
                            </span>
                            {b.facebook && (
                              <SocialLink href={b.facebook} icon="fab fa-facebook-f" bgColor="#1877F2" />
                            )}
                            {b.youtube && (
                              <SocialLink href={b.youtube} icon="fab fa-youtube" bgColor="#FF0000" />
                            )}
                            {b.instagram && (
                              <SocialLink
                                href={b.instagram}
                                icon="fab fa-instagram"
                                bgColor="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)"
                              />
                            )}
                            {b.googleReview && (
                              <SocialLink
                                href={b.googleReview}
                                icon="fab fa-google"
                                bgColor="#fff"
                                iconColor="#4285F4"
                              />
                            )}
                            {b.linkedin && (
                              <SocialLink href={b.linkedin} icon="fab fa-linkedin-in" bgColor="#0A66C2" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* FORM */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
                  {formSettings.title || 'Send Message'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Fill in your details below and our property expert will assist you.
                </p>

                {statusMessage && (
                  <div
                    className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    <i
                      className={`fas ${
                        statusMessage.type === 'success' ? 'fa-check-circle text-emerald-600' : 'fa-exclamation-circle text-red-600'
                      } mt-0.5`}
                    ></i>
                    <div>{statusMessage.text}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Inquiry Subject <span className="text-primary">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input"
                      >
                        <option value="">Select Subject</option>
                        {(formSettings.subjects || DEFAULT_SUBJECTS).map((sub) => (
                          <option key={sub.id} value={sub.label}>
                            {sub.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Please specify your requirements, budget, preferred location..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="mb-4 text-xs sm:text-sm text-gray-600 space-y-3 pt-2">
                    {/* Terms & Privacy: REQUIRED */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded accent-primary cursor-pointer shrink-0"
                        required
                      />
                      <span>
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                          Terms &amp; Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                          Privacy Policy
                        </Link>
                        . <span className="text-primary">*</span>
                      </span>
                    </label>

                    {/* Marketing Consent: OPTIONAL & UNCHECKED BY DEFAULT */}
                    {formSettings.showMarketingConsent !== false && (
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketingAccepted}
                          onChange={(e) => setMarketingAccepted(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded accent-primary cursor-pointer shrink-0"
                        />
                        <span className="text-gray-500 text-xs leading-relaxed">
                          {formSettings.marketingConsentText ||
                            'I would like to receive communication via SMS, RCS SMS, Email & WhatsApp services for offers, updates & transactions.'}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* ReCAPTCHA */}
                  <div className="my-2">
                    <ReCAPTCHA
                      sitekey="6Ld-smwtAAAAACpHfqzximAkOuosxs6XQnejz2Ki"
                      onChange={(token: string | null) => setCaptchaToken(token)}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3.5 px-6 rounded-xl hover:bg-secondary transition-all font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Saving &amp; Connecting...</span>
                      </>
                    ) : (
                      <>
                        <i className="fab fa-whatsapp text-lg"></i>
                        <span>{formSettings.submitButtonText || 'Send via WhatsApp'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-secondary">Visit Our Offices</h3>
              <p className="text-xs text-gray-500">Locate our branches across Ahmedabad</p>
            </div>
            {/* Branch selector tabs if multiple branches have map embed */}
            {branches.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedMapBranchId(b.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedBranch?.id === b.id
                        ? 'bg-secondary text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {b.displayTitle || b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100">
            {selectedBranch?.mapEmbedUrl ? (
              <iframe
                src={selectedBranch.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title={`${selectedBranch.name} Location Map`}
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
                <i className="fas fa-map-marked-alt text-4xl text-gray-300 mb-2"></i>
                <p className="font-semibold text-sm text-gray-700">{selectedBranch?.name || 'Office Location'}</p>
                <p className="text-xs text-gray-500 max-w-sm mt-1">{selectedBranch?.address}</p>
                {selectedBranch?.mapUrl && (
                  <a
                    href={selectedBranch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 px-4 py-2 bg-primary text-white text-xs rounded-lg font-bold hover:bg-secondary transition inline-flex items-center gap-1.5"
                  >
                    <span>Open in Google Maps</span>
                    <i className="fas fa-external-link-alt text-[10px]"></i>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tailwind helper */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #e31e24;
        }
      `}</style>
    </>
  );
}

// Helper Components for Cleaner Code
function SocialLink({
  href,
  icon,
  bgColor,
  iconColor = '#fff',
}: {
  href: string;
  icon: string;
  bgColor: string;
  iconColor?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xs text-xs cursor-pointer"
      style={{ background: bgColor, color: iconColor }}
    >
      <i className={icon}></i>
    </a>
  );
}
