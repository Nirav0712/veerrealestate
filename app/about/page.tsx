'use client';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-secondary to-secondary-light text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">About Veer Real Estate</h1>
                        <p className="text-lg md:text-xl lg:text-2xl opacity-95">
                            Your trusted partner in finding the perfect property for over 15 years
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-secondary mb-6">Our Story</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Founded in 2012, Veer Real Estate has grown from a small local real estate agency to one of the most trusted
                                property platforms in the country. Our journey began with a simple mission: to make property buying
                                and renting accessible, transparent, and stress-free for everyone.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Over the years, we've helped thousands of families find their dream homes, investors discover lucrative
                                opportunities, and property owners connect with the right buyers and tenants.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Today, we're proud to offer a comprehensive platform that combines cutting-edge technology with
                                personalized service, making your property journey smooth and successful.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                                alt="About Veer RealEstate"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Our Achievements</h2>
                        <p className="text-xl text-gray-600">Numbers that speak for themselves</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">10K+</div>
                            <div className="text-gray-600 text-lg">Properties Sold</div>
                        </div> */}
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">5K+</div>
                            <div className="text-gray-600 text-lg">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">100+</div>
                            <div className="text-gray-600 text-lg">Projects</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">15+</div>
                            <div className="text-gray-600 text-lg">Years Experience</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                            Core Values
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our Values, Your Confidence
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

                        {/* Integrity */}
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-handshake text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-secondary mb-4">Integrity</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We uphold the highest standards of honesty and ethics, ensuring every interaction is built on trust,
                                accountability, and long-term commitment.
                            </p>
                        </div>

                        {/* Resourceful */}
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-lightbulb text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-secondary mb-4">Resourceful</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We approach every challenge with creativity and adaptability, finding smart solutions that deliver
                                value and exceed expectations.
                            </p>
                        </div>

                        {/* Transparency */}
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-eye text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-secondary mb-4">Transparency</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We communicate openly and clearly, providing honest guidance and complete clarity at every stage
                                of the process.
                            </p>
                        </div>

                        {/* Service Excellence */}
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-award text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-secondary mb-4">Service Excellence</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We strive for excellence in every interaction, delivering exceptional service that consistently
                                exceeds client expectations.
                            </p>
                        </div>

                        {/* Knowledge */}
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <i className="fas fa-book-open text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-secondary mb-4">Knowledge</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our deep industry expertise and market understanding empower clients to make confident,
                                informed decisions.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600">Dedicated professionals committed to your success</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                        {[
                            {
                                name: 'SUDHIR PRAJAPATI',
                                role: 'FOUNDER & CEO',
                                image: '/images/team/sudhir.jpeg'
                            }
                            
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden text-center">
                                <div className="relative h-80 w-80 text-center items-center justify-center mx-auto">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-secondary mb-1">{member.name}</h3>
                                    <p className="text-gray-600">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            // {
                            //     name: 'SUDHIR PRAJAPATI',
                            //     role: 'FOUNDER & CEO',
                            //     image: '/images/team/sudhir.jpeg'
                            // },
                            {
                                name: 'ABHAY PATEL ',
                                role: 'TEAM LEADER (EAST)',
                                image: '/images/team/abhay-patel.jpeg'
                            },
                            {
                                name: 'AJAY DUBEY ',
                                role: 'TEAM LEADER (EAST AHMEDABAD)',
                                image: '/images/team/ajay-dubey.jpeg'
                            },
                             {
                                name: 'CHETAN PARMAR',
                                role: 'TEAM LEADER (EAST AHMEDABAD)',
                                image: '/images/team/chetan-parmar.jpeg'
                            },
                             {
                                name: 'RAJESHWARI BARA',
                                role: 'PRE TELE SALES EXUCUTIVE',
                                image: '/images/team/rajeshwari.jpeg'
                            },
                                 {
                                name: 'RAVI PRAJAPATI',
                                role: 'TEAM LEADER (WEST AHMEDABAD)',
                                image: '/images/team/ravi-prajapati.jpeg'
                            }, {
                                name: 'TANISHA MISTRY',
                                role: 'PRE TELE SALES EXECUTIVE',
                                image: '/images/team/tanisha-mishtry.jpeg'
                            }
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden text-center">
                                <div className="relative h-80 w-80 text-center items-center justify-center mx-auto">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-secondary mb-1">{member.name}</h3>
                                    <p className="text-gray-600">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-secondary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
                    <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
                        Join thousands of satisfied clients who found their perfect home with Veer Real Estate
                    </p>
                    <a
                        href="/properties"
                        className="inline-block bg-primary text-white px-10 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all text-lg"
                    >
                        Browse Properties
                    </a>
                </div>
            </section>


        </>
    );
}
