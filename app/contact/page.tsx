'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for contacting us! We\'ll get back to you soon.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <Header />

            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-secondary to-secondary-light text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
                        <p className="text-xl md:text-2xl opacity-95">
                            Have questions? We're here to help you find your dream property
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-bold text-secondary mb-8">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-secondary mb-1">Our Office</h3>
                                        <p className="text-gray-600"><b>East Ahmedabad :</b> C-238, Sumel 7, Near- Soni <br /> ni Chali Cross Road, Odhav, Ahmedabad-382415</p>
                                        <p className="text-gray-600 pt-2"><b>West Ahmedabad :</b>431, Yash Arian complex, <br />Near Swami Vivekanand Circle, Memnagar<br /> Ahmedabad 380052</p>

                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-phone text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-secondary mb-1">Phone</h3>
                                        <p className="text-gray-600"><b>East Ahmedabad : </b>+91 93769 96179 <span className="block pt-1 pl-37">+91 97270 27052</span> </p>
                                        <p className="text-gray-600 pt-2"><b>West Ahmedabad : </b>+91 88661 13391 <span className="block pt-1 pl-38">+91 90672 30240</span> </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-envelope text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-secondary mb-1">Email</h3>
                                        <p className="text-gray-600">horseveer@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <i className="fas fa-clock text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-secondary mb-1">Business Hours</h3>
                                        <p className="text-gray-600">
                                            Mon - Sun: 10:00 AM - 7:00 PM<br />
                                            Sun: Running
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="mt-8">
                                <h3 className="font-semibold text-secondary mb-4">Follow Us</h3>
                                <span className="text-gray-700 font-medium"><b>East Ahmedabad</b></span>
                                <div className="flex gap-3 pt-2">

                                    <a href="https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.youtube.com/@VeerRealEstate" className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                    <a href="https://www.instagram.com/veerrealestateeastahmedabad/?hl=en" className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href=" https://g.page/r/CcSCOVV14JRdEAI/review" className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                        <i className="fab fa-google"></i>
                                    </a>
                                </div>
                                <span className="text-gray-700 font-medium mt-4 block"><b>West Ahmedabad</b></span>
                                <div className="flex gap-3 pt-2">

                                    <a href=" https://www.facebook.com/people/Veer-Real-Estate/61558935522154/" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.youtube.com/@VeerRealEstate" className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                    <a href="https://www.instagram.com/veer.real_estate/" className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="https://g.page/r/CcSCOVV14JRdEAI/review" className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                        <i className="fab fa-google"></i>
                                    </a>
                                    <a href=" https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true" className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>

                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-3xl font-bold text-secondary mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                placeholder="Rajesh Kumar"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                placeholder="rajesh@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="buying">Buying a Property</option>
                                                <option value="selling">Selling a Property</option>
                                                <option value="renting">Renting a Property</option>
                                                <option value="support">Support</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Tell us how we can help you..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-lg"
                                    >
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-secondary mb-4">
                            Visit Our Office
                        </h2>
                        <p className="text-xl text-gray-600">
                            We'd love to meet you in person
                        </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden h-96 shadow-lg">
                        <iframe
                            src="https://www.google.com/maps?q=Veer+Real+Estate+Ahmedabad&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            // allowFullScreen=""
                            loading="lazy"
                            // referrerPolicy="no-referrer-when-downgrade"
                            title="Veer Real Estate Location"
                        ></iframe>
                    </div>
                </div>
            </section>
            {/* <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Visit Our Office</h2>
                        <p className="text-xl text-gray-600">We'd love to meet you in person</p>
                    </div>
                    <div className="bg-gray-300 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
                        <div className="text-center">
                            <i className="fas fa-map-marked-alt text-6xl text-gray-500 mb-4"></i>
                            <p className="text-gray-600">Map integration would go here</p>
                            <p className="text-sm text-gray-500">(Google Maps / Mapbox)</p>
                        </div>
                    </div>
                </div>
            </section> */}

            <Footer />
        </>
    );
}
