'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  price?: string;
  config?: string;
  area?: string;
  locationName?: string;
  zone?: 'East' | 'West';
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Aaradhana Sky 2 in Narol Ahmedabad: Affordable 2 BHK Flats for Modern Families",
    excerpt: "Aaradhana Sky 2 in Narol Ahmedabad offers affordable 2 BHK flats with modern amenities, prime location, and great investment potential.",
    content: `Ahmedabad is growing rapidly, and homebuyers are actively searching for residential projects that offer affordability, comfort, and a prime location. Aaradhana Sky 2 in Narol Ahmedabad is one such promising project that delivers modern living spaces at a budget-friendly price. For families looking for a quality home in East Ahmedabad, this project presents a smart opportunity.

Located in the developing area of Narol, this project offers thoughtfully planned 2 BHK flats in Narol Ahmedabad with modern amenities and good connectivity. Whether you are a first-time homebuyer or an investor, Aaradhana Sky 2 in Narol Ahmedabad offers a practical combination of value, comfort, and future growth potential.

Why Aaradhana Sky 2 in Narol Ahmedabad is a Smart Choice
One of the main reasons buyers are showing interest in Aaradhana Sky 2 in Narol Ahmedabad is its excellent balance of price and lifestyle. Starting at ₹26 Lakh, the project is ideal for those who want an affordable home without compromising on basic comfort and design.

This residential project offers 2 BHK homes with modern planning, making it suitable for working professionals, couples, and growing families. The project is also designed with quality construction and useful features that support everyday living.

Prime Location Advantage of Aaradhana Sky 2 in Narol Ahmedabad
Location plays a major role when buying property, and Aaradhana Sky 2 in Narol Ahmedabad enjoys a strategic address in one of the city’s developing residential areas. The project is located beside Avadh Green Bungalows, Narol-Aslali Highway, behind Pooja Farm Road, Narol, Ahmedabad – 382405.

Narol is becoming a preferred destination for buyers who want affordable flats in Ahmedabad with strong connectivity to nearby areas. The location offers easy access to daily essentials, local transport routes, and growing infrastructure, which adds long-term value to the property.

Project Highlights of Aaradhana Sky 2 in Narol Ahmedabad
Aaradhana Sky 2 in Narol Ahmedabad offers practical housing solutions for modern families. The project includes comfortable and well-designed homes that match the needs of present-day buyers.

Key Details:
- Project Name: Aaradhana Sky 2
- Location: Narol, Ahmedabad
- Configuration: 2 BHK
- Property Status: For Sale
- Zone: East Ahmedabad
- Starting Price: ₹26 Lakh
- Unit Size: 110 sq. yrd to 115 sq. yrd
- Special Features: Free furniture and modular kitchen

These features make Aaradhana Sky 2 in Narol Ahmedabad a good option for buyers looking for ready-value homes in an emerging location.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Real Estate",
    image: "/images/east/AARADHANA_2.jpeg",
    readTime: "5 min read",
    price: "₹26 Lakh",
    config: "2 BHK",
    area: "110-115 sq.yd",
    locationName: "Narol",
    zone: "East"
  },
  {
    id: 2,
    title: "Anushtan Bungalows in Ahmedabad: Premium 4 BHK Luxury Homes for Modern Family Living",
    excerpt: "Anushtan Bungalows in Ahmedabad offers spacious 4 BHK luxury homes near Vatva-Gamdi Circle with premium design, excellent connectivity, and modern family living.",
    content: `Ahmedabad is one of the fastest-growing real estate destinations in Gujarat, offering a wide range of residential opportunities for families, investors, and premium homebuyers. Among the city’s emerging luxury housing options, Anushtan Bungalows in Ahmedabad stands out as a perfect choice for those seeking spacious living, elegant design, and a prime location. If you are searching for a premium residential property that offers both comfort and lifestyle, Anushtan Bungalows in Ahmedabad deserves your attention.

Located near Vatva-Gamdi Circle, this exclusive residential project offers beautifully designed 4 BHK bungalows in Ahmedabad that are ideal for families who want larger living spaces, modern amenities, and a peaceful residential atmosphere. With premium construction, better planning, and an elevated lifestyle experience, Anushtan Bungalows in Ahmedabad is designed for buyers who value luxury and convenience.

Why Anushtan Bungalows in Ahmedabad is a Premium Residential Choice
The demand for spacious and luxury homes is increasing in Ahmedabad as modern families look beyond standard apartments and choose independent or bungalow-style living. Anushtan Bungalows in Ahmedabad is a project that meets these expectations by offering bigger and better 4 BHK homes for premium living.

This project is developed for homebuyers who want privacy, more usable space, and an upgraded lifestyle. From architectural planning to location selection, every aspect of Anushtan Bungalows in Ahmedabad reflects a focus on quality, comfort, and modern family requirements. For buyers who wish to invest in a luxury home with long-term value, this project offers a strong residential option in Ahmedabad.

Prime Location Advantage of Anushtan Bungalows in Ahmedabad
One of the biggest strengths of Anushtan Bungalows in Ahmedabad is its strategic location. The project is located at B/h Parijat Vishwas, Nr. Vatva-Gamdi Circle, S.P. Ring Road, Ahmedabad – 382440. This address adds excellent value because it connects residents to key parts of the city while still offering a peaceful environment for residential living.

The area near Vatva-Gamdi Circle is becoming increasingly attractive for homebuyers because of developing infrastructure, road connectivity, and access to important city routes. Being situated near S.P. Ring Road, Anushtan Bungalows in Ahmedabad enjoys location benefits that make everyday travel more convenient for working professionals, families, and business owners.

Location Benefits of Anushtan Bungalows in Ahmedabad:
- Well-connected to major areas of Ahmedabad
- Easy access to S.P. Ring Road
- Located near Vatva-Gamdi Circle
- Suitable for peaceful and premium family living
- Growing residential value in the surrounding area

Spacious 4 BHK Bungalows Designed for Luxury Living
The highlight of Anushtan Bungalows in Ahmedabad is its thoughtfully designed 4 BHK bungalow configuration, which is ideal for larger families and buyers who want comfort without space limitations. In today’s real estate market, many buyers are looking for homes that provide privacy, personal space, and a premium lifestyle. This is exactly where Anushtan Bungalows in Ahmedabad creates a strong impression.

The project offers homes with a plot area of 150 sq. yards, giving buyers a spacious and functional layout for modern family needs. Whether it is the living room, bedrooms, open areas, or overall planning, the property reflects a lifestyle built around convenience and elegance.

Project Highlights of Anushtan Bungalows in Ahmedabad:
- Project Name: Anushtan Bungalows
- Location: Ahmedabad
- Nearby Landmark: Near Vatva-Gamdi Circle
- Configuration: 4 BHK
- Status: For Sale
- Zone: East
- Starting Price: ₹1.20 Cr
- Plot Area: 150 Sq. Yards

Investment Potential of Anushtan Bungalows in Ahmedabad
Real estate investment decisions are often influenced by location, product quality, and future demand. Anushtan Bungalows in Ahmedabad performs well on all three fronts. Luxury homes and independent-style residences usually hold strong appeal among buyers who want long-term value.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Luxury Real Estate",
    image: "/images/east/Anusthan.jpeg",
    readTime: "8 min read",
    price: "₹1.20 Cr",
    config: "4 BHK",
    area: "150 sq.yd",
    locationName: "Ahmedabad",
    zone: "East"
  },
  {
    id: 3,
    title: "Avalon DHS Floora in Vatva Ahmedabad: Affordable Ready Possession Flats for Modern Living",
    excerpt: "Avalon DHS Floora in Vatva Ahmedabad offers affordable ready possession 1, 1.5, and 2 BHK flats with modern amenities and strong connectivity.",
    content: `Ahmedabad’s real estate market is growing rapidly, especially in developing residential areas where buyers can find affordability, connectivity, and lifestyle convenience in one place. Avalon DHS Floora in Vatva Ahmedabad is one such residential project that is attracting homebuyers looking for budget-friendly homes with ready possession benefits. For families, working professionals, and property investors, Avalon DHS Floora in Vatva Ahmedabad offers a strong combination of value, comfort, and location advantage.

Verified on the Veer Real Estate website, Avalon DHS Floora is promoted as a residential project offering 1, 1.5, and 2 BHK flats for sale in Vatva, Ahmedabad. The project is located near Ayodhya Apartments, near Avalon Park-1 & 2, Vatva-Gamdi Road, Vatva, Ahmedabad, making it a practical option for buyers who want a well-connected home in East Ahmedabad.

Why Avalon DHS Floora in Vatva Ahmedabad is a Smart Residential Choice
Homebuyers today are looking for homes that are affordable, ready for possession, and located in areas with growing infrastructure. Avalon DHS Floora in Vatva Ahmedabad matches these expectations by offering well-planned homes in a fast-developing part of the city. Starting at ₹20.65 Lakh onwards, it creates a valuable opportunity to own a home in Ahmedabad.

Prime Location Advantage of Avalon DHS Floora in Vatva Ahmedabad:
Vatva has become a preferred destination for affordable housing because it offers:
- Better pricing compared to many other Ahmedabad locations
- Good road connectivity
- Strong local residential demand
- Developing social and civic infrastructure
- Suitable environment for families and first-time buyers

Ready Possession Flats for Immediate Living
One of the biggest advantages of Avalon DHS Floora in Vatva Ahmedabad is its ready possession status. Many buyers prefer ready possession homes because they reduce waiting time and provide immediate usability. Instead of waiting for years for project completion, buyers can make a quicker move toward homeownership.

Modern Features and Lifestyle Value
The property highlights several practical lifestyle features:
- 100% loan assistance
- Modern amenities
- 24x7 security
- Lifts & Parking
- CCTV surveillance & Fire safety
- Premium construction quality

Project Highlights:
- Project Name: Avalon DHS Floora
- Location: Vatva, Ahmedabad
- Configuration: 1, 1.5, 2 BHK
- Status: Ready Possession
- Zone: East
- Starting Price: ₹20.65 Lakh`,
    author: "Admin",
    date: "2026-03-23",
    category: "Affordable Housing",
    image: "/images/east/Avalon-DHS.jpeg",
    readTime: "6 min read",
    price: "₹20.65 Lakh",
    config: "1, 1.5, 2 BHK",
    area: "Various",
    locationName: "Vatva",
    zone: "East"
  },
  {
    id: 4,
    title: "Eleven 04 Homes in New Vatva Ahmedabad: Modern 2 & 3 BHK Flats for Comfortable Family Living",
    excerpt: "Eleven 04 Homes in New Vatva Ahmedabad offers spacious 2 and 3 BHK flats near S.P. Ring Road with modern amenities and strong investment potential.",
    content: `Ahmedabad’s real estate market is growing quickly, especially in developing residential areas where buyers can find affordability, connectivity, and modern lifestyle features in one place. Eleven 04 Homes in New Vatva Ahmedabad is one such promising project that offers a smart combination of spacious planning, practical location, and value for money.

Located near Krishnam International School, S.P. Ring Road, New Vatva, Ahmedabad – 382445, Eleven 04 Homes is designed for homebuyers who want well-planned homes with strong connectivity to the city. The project offers 2 BHK and 3 BHK flats, making it suitable for all family sizes.

Why Eleven 04 Homes is a Smart Choice:
Starting from ₹32.65 lakh onwards, the project offers affordable homeownership. It includes 2 BHK units of 141 sq. yrd and 3 BHK units of 160 sq. yrd, giving buyers enough room for comfortable and practical day-to-day living.

Prime Location Advantage:
- Located in the growing residential area of New Vatva
- Easy access to S.P. Ring Road
- Better connectivity to key parts of Ahmedabad
- Suitable for family living and daily commuting

Modern Amenities:
The project responds to urban expectations by offering:
- Solar-powered common services
- 24x7 security & Basement parking
- Personal EV charging points
- Vastu-compliant design
- Sample flat ready for viewing

Investment Potential:
Apart from end-use living, Eleven 04 Homes also has good investment potential. Properties in developing areas with improving infrastructure often show healthy long-term demand. The project’s combination of location and spacious homes makes it more attractive in the market.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Residential",
    image: "/images/east/Eleven.jpeg",
    readTime: "7 min read",
    price: "₹32.65 Lakh",
    config: "2 & 3 BHK",
    area: "141-160 sq.yd",
    locationName: "New Vatva",
    zone: "East"
  },
  {
    id: 5,
    title: "Omkar Enclave in Ranip Ahmedabad: Premium 3 BHK Flats for Modern Family Living",
    excerpt: "Omkar Enclave in Ranip Ahmedabad offers premium 3 BHK flats in West Ahmedabad with excellent connectivity, modern amenities, and spacious living.",
    content: `Ahmedabad continues to grow as one of Gujarat’s most preferred real estate destinations. Among the promising premium residential developments in the western part of the city, Omkar Enclave in Ranip Ahmedabad stands out as an excellent choice for families looking for spacious homes and a prime location.

Located in the heart of Ranip, Ahmedabad, this residential project offers thoughtfully planned premium 3 BHK flats. Starting from ₹70 Lakh onwards, the project is ideal for buyers who want to move into a better residential environment.

Prime Location Advantage:
The project is located behind Ranip Bus Terminal, Radha Swami Road, Ranip, Ahmedabad – 382480.
- Close to D-Mart, PVR, and Ranip 3T Bus Terminal
- Near BRTS, RTO Circle, and Sabarmati Railway Station
- Strong connectivity in West Ahmedabad

Spacious Living:
The project offers larger configurations for buyers who value room and comfort:
- 2 BHK: 165 sq. yd
- 3 BHK: 195 sq. yd
The focus is on premium 3 BHK homes designed for comfortable family living in a well-developed neighborhood.

Lifestyle Features:
- Landscaped gardens
- Mini club house
- Gated security
- Premium amenities

Why Ideal for Families:
Families often prioritize spacious layouts, security, and transport access. Omkar Enclave performs well in all these areas, making it a future-ready home for those who want better living standards in West Ahmedabad.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Premium Housing",
    image: "/images/west/omkar.jpeg",
    readTime: "5 min read",
    price: "₹70 Lakh",
    config: "3 BHK",
    area: "165-195 sq.yd",
    locationName: "Ranip",
    zone: "West"
  },
  {
    id: 6,
    title: "Shubh Greens in Zundal Ahmedabad: Premium 3 BHK Ready-to-Move Flats for Modern Family Living",
    excerpt: "Shubh Greens in Zundal Ahmedabad offers premium 3 BHK ready-to-move flats near Vaishnodevi Circle with modern amenities and strong connectivity.",
    content: `Ahmedabad has become one of the most preferred cities for residential real estate. Among the emerging residential destinations, Zundal is gaining attention from homebuyers who want spacious homes in a peaceful yet well-connected area. Shubh Greens in Zundal Ahmedabad is a promising project that offers premium 3 BHK ready-to-move flats.

Shubh Greens brings together location, comfortable space, and modern amenities. One of its major strengths is its ready-to-move status, meaning buyers do not have to wait for project completion and can move toward homeownership with greater confidence.

Prime Location Advantage:
The project is located behind Lubi Corporate, near Vaishnodevi Circle, S.P. Ring Road, Ahmedabad – 382470.
- Close to Vaishnodevi Circle and S.P. Ring Road
- Easy road connectivity for smooth city access
- Situated in a growing residential zone with future value potential

Premium Features:
With a plot area of 210 sq. yards, Shubh Greens provides ample room for family needs. It is especially attractive because of:
- Ready-to-move status for immediate possession
- High-quality construction and modern amenities
- Limited units for a more exclusive and private feel

Project Highlights:
- Starting Price: ₹70 Lakh onwards
- Plot Area: 210 sq. yards
- Status: Ready to Move
- Zone: North West

Investment Potential:
Properties in developing yet well-connected areas often show strong long-term value. Shubh Greens has investment appeal because it offers a completed residential product in a preferred family segment near major connectivity routes.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Buying Guide",
    image: "/images/west/subh-green.jpeg",
    readTime: "6 min read",
    price: "₹70 Lakh",
    config: "3 BHK",
    area: "210 sq.yd",
    locationName: "Zundal",
    zone: "West"
  },
  {
    id: 7,
    title: "Royal Crown in Zundal Ahmedabad: Premium 3 BHK Ready-to-Move Flats for Modern Living",
    excerpt: "Royal Crown in Zundal Ahmedabad stands out as a premium choice for families seeking spacious homes in a well-connected location near Vaishnodevi Circle.",
    content: `Ahmedabad’s residential market continues to attract homebuyers who are looking for better lifestyle options and strong connectivity. Royal Crown in Zundal Ahmedabad stands out as a premium choice for families seeking spacious homes in a well-connected location near Vaishnodevi Circle.

Why Royal Crown is a Smart Choice:
Starting from ₹70 lakh to ₹75 lakh, Royal Crown offers premium family living in a competitive budget range. With its ready-to-move status, buyers can benefit from immediate possession and avoid the uncertainty of under-construction properties.

Prime Location Advantage:
The project is situated near Vaishnodevi Circle and S.P. Ring Road, among the most important connectivity points in Ahmedabad.
- Address: Shubh Greens, Behind Lubi Corporate, Near Vaishnodevi Circle, S.P. Ring Road, Ahmedabad – 382470.
- Excellent access to different parts of the city.
- Ideal for peaceful and comfortable family living in a developing area.

Spacious 3 BHK Living:
Modern homebuyers prefer larger homes that support privacy and better planning. With a plot area of 210 sq. yards, Royal Crown provides a better residential lifestyle with more room and comfort for families upgrading from smaller flats.

Investment Potential:
Properties in strategic locations often attract strong long-term interest. Royal Crown offers a good residential location, spacious homes, and strong road connectivity, making it a practical investment choice with future value potential.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Buying Guide",
    image: "/images/west/royal-crown1.avif",
    readTime: "5 min read",
    price: "₹70-75 Lakh",
    config: "3 BHK",
    area: "210 sq.yd",
    locationName: "Zundal",
    zone: "West"
  },
  {
    id: 8,
    title: "Harnav Lavish in Zundal Ahmedabad – Modern 2 BHK Living for Smart Homebuyers",
    excerpt: "Harnav Lavish in Zundal Ahmedabad is a well-planned residential property offering thoughtfully crafted 2 BHK apartments in a growing location.",
    content: `If you are searching for a well-planned residential property in Ahmedabad, Harnav Lavish in Zundal Ahmedabad is a project worth exploring. Designed for modern families, this under-construction development offers comfort, affordability, and strong connectivity.

Project Overview:
Harnav Lavish is located in Zundal, North West Ahmedabad. It is planned to offer a balanced lifestyle with practical layouts and easy access to the city.
- Configuration: 2 BHK
- Status: Under Construction
- Price Range: ₹52.80 lakh to ₹63 lakh

Why Choose Harnav Lavish:
1. Well-Designed Homes: Planned to maximize space, ventilation, and natural light.
2. Affordable Premium Living: Offers a premium lifestyle at an accessible budget.
3. Excellent Location Advantage: Zundal offers better infrastructure and a peaceful environment.
4. Investment Potential: As Ahmedabad expands, areas like Zundal gain significant attention from investors.

Location Highlights:
- Easy access to major roads and highways.
- Close to schools, hospitals, and daily conveniences.
- Peaceful residential surroundings with growing market demand.

Harnav Lavish offers the opportunity to own a home that matches modern urban requirements while staying within a practical budget.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Buying Guide",
    image: "/images/west/harnav_lavish1.avif",
    readTime: "7 min read",
    price: "₹52-63 Lakh",
    config: "2 BHK",
    area: "Various",
    locationName: "Zundal",
    zone: "West"
  },
  {
    id: 9,
    title: "KB Royal Zundal Ahmedabad – Premium Living in a Prime Residential Location",
    excerpt: "KB Royal Zundal Ahmedabad stands out for its premium living experience, thoughtful planning, and ready-to-move 3 BHK convenience.",
    content: `Finding a home that offers the perfect combination of comfort, location, and value is essential. KB Royal Zundal Ahmedabad is a residential project that stands out for its premium experience and ready-to-move convenience in North West Ahmedabad.

Project Overview:
KB Royal offers spacious 3 BHK ready-to-move apartments. Built for homebuyers who prefer immediate possession, it reduces the risk associated with under-construction projects.
- Configuration: 3 BHK
- Status: Ready to Move
- Price: Starting from ₹87 Lakhs
- Plot Area: 210 sq. yards

Prime Location Advantage:
Zundal has become a preferred destination due to its peaceful environment and improving infrastructure. KB Royal ensures better connectivity to educational institutions, healthcare facilities, and shopping zones, making it practical for families and professionals alike.

Ready to Move Benefit:
Buyers can physically inspect the property, evaluate construction quality, and shift into their new home without waiting. For investors, this means the potential for immediate rental income.

KB Royal brings together affordability, convenience, and premium residential appeal in one of Ahmedabad's most promising real estate markets.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Investment",
    image: "/images/west/kb_royal1.avif",
    readTime: "8 min read",
    price: "₹87 Lakh+",
    config: "3 BHK",
    area: "210 sq.yd",
    locationName: "Zundal",
    zone: "West"
  },
  {
    id: 10,
    title: "Vivan Orbit in Zundal Ahmedabad: Modern 2 BHK Homes in a Fast-Growing Residential Location",
    excerpt: "Vivan Orbit in Zundal Ahmedabad is emerging as a smart choice for families seeking a comfortable, well-planned, and affordable home.",
    content: `Ahmedabad’s real estate market is continuously growing. Among the promising residential projects in the western part of the city, Vivan Orbit in Zundal Ahmedabad is emerging as a smart choice for families looking for a comfortable and well-planned home.

Why Vivan Orbit is a Smart Choice:
Starting from ₹63.50 lakh, Vivan Orbit provides a strong combination of affordability and convenience. For families, the 2 BHK configuration offers enough space for daily living, privacy, and functional utility.

Prime Location Advantage:
Zundal is attracting attention due to its peaceful environment and improving urban connectivity.
- Situated in a fast-growing residential area.
- Good connectivity to major parts of Ahmedabad.
- Ideal for both end-users and investors seeking long-term value.

Under-Construction Advantage:
As Vivan Orbit is currently under construction, it offers an opportunity for buyers to invest at a stage where future appreciation can be expected.

Project Summary:
- Configuration: 2 BHK
- Status: Under Construction
- Starting Price: ₹63.50 lakh
- Plot Area: 167 sq. yards

Vivan Orbit is designed for buyers who want comfort, convenience, and future value in one well-planned project.`,
    author: "Admin",
    date: "2026-03-23",
    category: "Buying Guide",
    image: "/images/west/vivaan_orbit1.avif",
    readTime: "6 min read",
    price: "₹63.50 Lakh",
    config: "2 BHK",
    area: "167 sq.yd",
    locationName: "Zundal",
    zone: "West"
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const post = blogPosts.find(p => p.id === postId);

  const CONTACT_NUMBERS = {
    East: { wa: '919376996179', tel: '+919376996179' },
    West: { wa: '918866113391', tel: '+918866113391' }
  };

  if (!post) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary mb-4">Blog Post Not Found</h1>
            <Link href="/blog" className="text-primary hover:text-primary-dark">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


      {/* Hero Section */}
      <section className="relative h-96 bg-secondary">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              <div className="flex items-center justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user"></i>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-calendar"></i>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock"></i>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      {/* Blog Content */}
      <article className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-2">

              {/* Back Link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 font-medium"
              >
                <i className="fas fa-arrow-left"></i>
                Back to Blog
              </Link>

              {/* Main Content Card */}
              <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm">

                {/* Content */}
                <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6 text-lg">
                  {post.title && <h2 className="text-2xl font-bold text-secondary">{post.title}</h2>}
                  {post.content.replace(/\*/g, '')}
                </div>

              </div>

              {/* CTA Section */}
              <div className="mt-10 bg-primary text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Interested in this property?</h3>
                  <p className="text-white/80">Book a free site visit today!</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(`https://wa.me/${CONTACT_NUMBERS[post.zone || 'West'].wa}`, '_blank')}
                    className="bg-white text-primary px-5 py-2 rounded-lg font-medium hover:bg-gray-100"
                  >
                    Book Visit
                  </button>
                  <button
                    onClick={() => window.open(`tel:${CONTACT_NUMBERS[post.zone || 'West'].tel}`, '_blank')}
                    className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800"
                  >
                    Call Now
                  </button>
                </div>
              </div>

              {/* Share Section */}
              {/* <div className="mt-12">
          <h3 className="text-xl font-semibold text-secondary mb-4">Share this article</h3>
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center">
              <i className="fab fa-whatsapp"></i>
            </button>
          </div>
        </div> */}

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

              {/* Property Highlights */}
              <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold mb-4 text-secondary">
                  Property Highlights
                </h3>

                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span>Price</span>
                    <span className="font-semibold text-primary">{post.price || "Contact Us"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Configuration</span>
                    <span>{post.config || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Area</span>
                    <span>{post.area || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Location</span>
                    <span>{post.locationName || "Ahmedabad"}</span>
                  </li>
                </ul>

                {/* <button className="w-full mt-5 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark">
                  Get Details
                </button> */}
              </div>

              {/* Quick Contact */}
              {/* <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full mb-3 p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full mb-3 p-2 border rounded-lg"
          />

          <button className="w-full bg-primary text-white py-2 rounded-lg">
            Submit
          </button>
        </div> */}

            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {/* <section className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-secondary mb-8 text-center">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {blogPosts
                            .filter(p => p.id !== postId && p.category === post.category)
                            .slice(0, 3)
                            .map(relatedPost => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={relatedPost.image}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
 */}

    </>
  );
}
