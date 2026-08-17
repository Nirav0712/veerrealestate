'use client';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-secondary to-secondary-light text-white py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">About Veer Real Estate</h1>
                        <p className="text-lg md:text-xl lg:text-xl opacity-95">
                            Trusted Real Estate Broker in Ahmedabad
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-10 md:py-20">

                <div className="container mx-auto px-4">

                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-16 items-center">
                        <div className="p-6 md:p-12 lg:p-16 order-2 md:order-1">
                            <p className="text-secondary font-bold mb-3">
                                Meet Our Founder
                            </p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#16243E] mb-6">
                                SUDHIR PRAJAPATI
                            </h2>
                            <p className="text-gray-500 leading-relaxed mb-4 text-base md:text-lg lg:text-xl">
                                Our founder continues to guide the company with strategic insight and a client-first approach — ensuring that every real estate transaction delivers exceptional value and long-term success.
                            </p>
                            <p className="text-gray-500 leading-relaxed text-base md:text-lg lg:text-xl">
                                With a strong focus on integrity and innovation, we aim to redefine the property experience for buyers, sellers, and investors alike.
                            </p>
                        </div>
                        <div className="relative w-full h-[350px] md:h-[500px] order-1 md:order-2 rounded-2xl overflow-hidden border-2 border-[#e4c272] shadow-xl group transform transition duration-500 hover:-translate-y-3">
                            <img
                                src="/images/team/sudhir.jpeg"
                                alt="sudhir"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-10 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Our Achievements</h2>
                        <p className="text-xl text-gray-600">Numbers that speak for themselves</p>
                    </div>
                    <section className="py-8 md:py-16 bg-gray-50">
                        <div className="container mx-auto px-4">
                            {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                                <div className='w-50 h-50 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-primary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
                                    <div className="text-5xl font-bold text-primary mb-2">5K+</div>
                                    <div className="text-gray-600">Happy Customers</div>
                                </div>
                                <div className='w-50 h-50 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-primary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
                                    <div className="text-5xl font-bold text-primary mb-2">100+</div>
                                    <div className="text-gray-600">Projects</div>
                                </div>
                                <div className='w-50 h-50 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-primary hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
                                    <div className="text-5xl font-bold text-primary mb-2">15+</div>
                                    <div className="text-gray-600">Years Experience</div>
                                </div>
                            </div> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">

                                {/* Card */}
                                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-primary hover:scale-105 transition-transform duration-300 mx-auto">
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                                        5K+
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Happy Customers
                                    </div>
                                </div>

                                {/* Card */}
                                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-primary hover:scale-105 transition-transform duration-300 mx-auto">
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                                        100+
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Projects
                                    </div>
                                </div>

                                {/* Card */}
                                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-primary hover:scale-105 transition-transform duration-300 mx-auto">
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                                        15+
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Years Experience
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-10 md:py-20">
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
            <section className="py-10 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600">Dedicated professionals committed to your success</p>
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                        {[
                            {
                                name: 'SUDHIR PRAJAPATI',
                                role: 'FOUNDER & CEO',
                                image: '/images/team/sudhir.jpeg'
                            }

                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden text-center mb-10 hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto border border-gray-800">
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
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            // {
                            //     name: 'SUDHIR PRAJAPATI',
                            //     role: 'FOUNDER & CEO',
                            //     image: '/images/team/sudhir.jpeg'
                            // },
                            {
                                name: 'ABHAY PATEL ',
                                role: 'TEAM LEADER (EAST AHMEDABAD)',
                                image: '/images/team/abhay-patel.png'
                            },
                            {
                                name: 'AJAY DUBEY ',
                                role: 'TEAM LEADER (EAST AHMEDABAD)',
                                image: '/images/team/ajay-dubey.png'
                            },
                            {
                                name: 'CHETAN PARMAR',
                                role: 'TEAM LEADER (EAST AHMEDABAD)',
                                image: '/images/team/chetan-parmar.png'
                            },
                            {
                                name: 'RAJESHWARI BARA',
                                role: 'PRE-TELE SALES EXUCUTIVE',
                                image: '/images/team/rajeshwari.png'
                            },
                            {
                                name: 'RAVI PRAJAPATI',
                                role: 'TEAM LEADER (WEST AHMEDABAD)',
                                image: '/images/team/ravi-prajapati.png'
                            }, {
                                name: 'TANISHA MISTRY',
                                role: 'PRE-TELE SALES EXECUTIVE',
                                image: '/images/team/tanisha-mishtry.png'
                            },
                            {
                                name: 'YOGITA RAWAL',
                                role: 'PRE-TELE SALES EXECUTIVE \n(WEST AHMEDABAD)',
                                image: '/images/team/yogita-rawal.png'
                            },
                            {
                                name: 'PAYAL PANSURIYA',
                                role: 'PRE-TELE SALES EXECUTIVE \n(WEST AHMEDABAD)',
                                image: '/images/team/payal.png'
                            }
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden text-center hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto border border-secondary">
                                <div className="relative h-80 w-80 text-center items-center justify-center mx-auto">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-contain w-full h-full object-center"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-secondary mb-1">{member.name}</h3>
                                    <p className="text-gray-600" style={{ whiteSpace: "pre-line" }}>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-10 md:py-20 bg-secondary text-white">
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
