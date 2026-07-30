"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export default function ContactPage() {

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!termsAccepted) {
            alert("Please accept the Terms & Privacy Policy.");
            return;
        }

        if (!marketingAccepted) {
            alert("Please accept the communication consent.");
            return;
        }

        setLoading(true);

        const phoneNumber = "919727027052";

        const message =
            `*New Contact Form Message*%0A%0A` +
            `*Name:* ${formData.name}%0A` +
            `*Email:* ${formData.email}%0A` +
            `*Phone:* ${formData.phone}%0A` +
            `*Subject:* ${formData.subject}%0A` +
            `*Message:* ${formData.message}`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappUrl, "_blank");

        setLoading(false);

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    return (
        <>
            {/* FontAwesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />

            {/* Hero */}
            <section className="bg-linear-to-br from-secondary to-secondary-light text-white py-12 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                        Get In Touch
                    </h1>
                    <p className="text-base sm:text-lg md:text-2xl opacity-95">
                        Have questions? We're here to help you find your dream property
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-10 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                        {/* LEFT SIDE */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
                                Contact Information
                            </h2>

                            <div className="space-y-6">

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-map-marker-alt text-primary"></i>
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-600">
                                        {/* <b>East Ahmedabad:</b><br />
                                        C-238, Sumel 7, Odhav<br /><br /> */}

                                        <b>Ahmedabad:</b><br />
                                        Yash Arian Complex, Memnagar
                                    </div>
                                </div>

                                {/* Phone FIXED */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-phone text-primary"></i>
                                    </div>

                                    <div className="w-full">
                                        {/* <h3 className="font-semibold text-secondary mb-2">Phone</h3> */}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                            {/* <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                                <b>East Ahmedabad</b>
                                                <div className="mt-1 flex flex-col">
                                                    <a href="tel:+919376996179">+91 93769 96179</a>
                                                    <a href="tel:+919727027052">+91 97270 27052</a>
                                                </div>
                                            </div> */}

                                            <div className="bg-gray-50 p-1 rounded-lg text-sm">
                                                <b>Ahmedabad</b>
                                              <div className="mt-1 flex items-center whitespace-nowrap text-sm">
    <a
        href="tel:+918866113391"
        className="hover:text-primary"
    >
        +91 88661 13391
    </a>

    <span className="mx-2">|</span>

    <a
        href="tel:+919067230240"
        className="hover:text-primary"
    >
        +91 90672 30240
    </a>
</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-envelope text-primary"></i>
                                    </div>
                                    <div className="text-gray-600 text-sm sm:text-base">
                                        <b> Email</b><br />
                                        <a href="mailto:horseveer@gmail.com">
                                            horseveer@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Social */}
                                <div>
                                    <h3 className="font-semibold text-secondary mb-3">
                                        Follow Us
                                    </h3>
                                    <div className="space-y-4 w-full">
                                        <div>
                                            <span className="text-gray-600 font-medium mb-2 block">East Ahmedabad</span>
                                            <div className="flex justify-start md:justify-start gap-3">
                                                <SocialLink href="https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/" icon="fab fa-facebook-f" bgColor="#1877F2" />
                                                <SocialLink href="https://www.youtube.com/@VeerRealEstate" icon="fab fa-youtube" bgColor="#FF0000" />
                                                <SocialLink href="https://www.instagram.com/veerrealestateeastahmedabad/?hl=en" icon="fab fa-instagram" bgColor="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" />
                                                <SocialLink href="https://g.page/r/CcSCOVV14JRdEAI/review" icon="fab fa-google" bgColor="#fff" iconColor="#4285F4" />
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-gray-600 font-medium mb-2 block">West Ahmedabad</span>
                                            <div className="flex justify-start md:justify-start gap-3">
                                                <SocialLink href="https://www.facebook.com/people/Veer-Real-Estate/61558935522154/" icon="fab fa-facebook-f" bgColor="#1877F2" />
                                                <SocialLink href="https://www.youtube.com/@VeerRealEstate" icon="fab fa-youtube" bgColor="#FF0000" />
                                                <SocialLink href="https://www.instagram.com/veer.real_estate/" icon="fab fa-instagram" bgColor="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" />
                                                <SocialLink href="https://g.page/r/CcSCOVV14JRdEAI/review" icon="fab fa-google" bgColor="#fff" iconColor="#4285F4" />
                                                <SocialLink href="https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true" icon="fab fa-linkedin-in" bgColor="#0A66C2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* FORM */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">

                                <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
                                    Send Message
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-5">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            name="name"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        />
                                        <input
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            name="phone"
                                            placeholder="Phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input"
                                        />
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                        >
                                            <option value="">Select Subject</option>
                                            <option value="buy">Buying</option>
                                            <option value="sell">Selling</option>
                                        </select>
                                    </div>

                                    <textarea
                                        name="message"
                                        rows={4}
                                        placeholder="Message..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />

                                   <div className="mb-4 text-sm text-gray-600">
  <label className="flex items-start gap-2 mb-3 cursor-pointer">
    <input
      type="checkbox"
      checked={termsAccepted}
      onChange={(e) => setTermsAccepted(e.target.checked)}
      className="mt-1 h-4 w-4 accent-primary"
      required
    />
    <span>
      I agree to the{" "}
      <Link href="/terms" className="text-blue-600 hover:underline">
        Terms
      </Link>{" "}
      and{" "}
      <Link href="/privacy-policy" className="text-blue-600 hover:underline">
        Privacy Policy
      </Link>
    </span>
  </label>

  <label className="flex items-start gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={marketingAccepted}
      onChange={(e) => setMarketingAccepted(e.target.checked)}
      className="mt-1 h-4 w-4 accent-primary"
      required
    />
    <span>
      I would like to receive communication via SMS, RCS SMS, Email &
      WhatsApp services for offers, updates & transactions.
    </span>
  </label>
</div>
  <ReCAPTCHA
  sitekey="6Ld-smwtAAAAACpHfqzximAkOuosxs6XQnejz2Ki"
  onChange={(token: string | null) => setCaptchaToken(token)}
/>


<button
  disabled={loading}
  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition"
>
  {loading ? "Sending..." : "Send via WhatsApp"}
</button>

                                    {/* <button
                                        disabled={loading}
                                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition"
                                    >
                                        {loading ? "Sending..." : "Send via WhatsApp"}
                                    </button> */}

                                </form>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* Map */}
            < section className="py-10 bg-gray-50" >
                <div className="container mx-auto px-4">
                    <div className="h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                        <iframe

                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4577.525186990727!2d72.77251827597257!3d21.186300582347595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04da4d7fae1c5%3A0xfbbe068d7712bc4e!2sVeer%20Real%20Estate!5e1!3m2!1sen!2sin!4v1773926142586!5m2!1sen!2sin"

                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Veer Real Estate Location"
                            referrerPolicy="no-referrer-when-downgrade" />
                    </div>
                </div>
            </section >

            {/* Tailwind helper */}
            < style jsx > {`
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
      `}</style >
        </>
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