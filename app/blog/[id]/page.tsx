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
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: 'Top 10 Emerging Real Estate Locations in Mumbai for 2024',
        excerpt: 'Discover the most promising areas in Mumbai where property values are set to rise significantly in the coming years.',
        content: `Mumbai continues to evolve with new infrastructure projects and development zones. In this comprehensive guide, we explore the top 10 emerging locations that are set to become the next real estate hotspots.

**1. Wadala-Sewri Corridor**
With the upcoming Metro Line 4 and improved connectivity, this area is witnessing a surge in residential projects. Prices are still reasonable compared to South Mumbai, making it an attractive investment option.

**2. Andheri East**
The upcoming metro connectivity and proximity to the International Airport make Andheri East a prime location for both residential and commercial investments.

**3. Thane-Ghodbunder Road**
Infrastructure development along this corridor has made it one of the fastest-growing residential markets in the Mumbai Metropolitan Region.

**4. Mulund**
Often called Mumbai's greenest suburb, Mulund offers excellent connectivity via the Eastern Express Highway and Central Line, with property values expected to rise by 15-20% in the next two years.

**5. Kalyan-Dombivli**
Affordable housing combined with improving infrastructure makes this twin city an excellent option for first-time homebuyers.

These locations offer a perfect blend of connectivity, infrastructure development, and investment potential. Investors should act now before prices surge with ongoing development projects.`,
        author: 'Priya Sharma',
        date: 'January 2, 2024',
        category: 'Market Trends',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
        readTime: '5 min read'
    },
    {
        id: 2,
        title: 'Complete Guide to Home Loans in India: Everything You Need to Know',
        excerpt: 'Navigate the complexities of home loans with our comprehensive guide covering interest rates, eligibility, and documentation.',
        content: `Getting a home loan in India involves understanding various factors that can significantly impact your borrowing capacity and repayment terms. Here's everything you need to know.

**Understanding Interest Rates**
Home loan interest rates in India currently range from 8.5% to 9.5% per annum for most borrowers. These rates depend on your credit score, loan amount, and the lender's policies.

**Eligibility Criteria**
- Minimum age: 21 years
- Maximum age at loan maturity: 65-70 years
- Minimum income: ₹25,000 per month for salaried individuals
- Credit score: 750 or above for best rates

**Documentation Required**
1. Identity proof (Aadhaar, PAN Card)
2. Address proof
3. Income proof (salary slips, ITR)
4. Property documents
5. Bank statements (6 months)

**Loan-to-Value Ratio**
Most banks offer up to 90% LTV for properties under ₹30 lakhs, and 80% LTV for higher-value properties. A higher down payment can help you secure better interest rates.

**Tax Benefits**
Under Section 80C, you can claim deduction of up to ₹1.5 lakh on principal repayment, and up to ₹2 lakh on interest payment under Section 24(b).

**Tips for Better Loan Terms**
- Maintain a high credit score (750+)
- Keep debt-to-income ratio below 40%
- Make a larger down payment
- Compare offers from multiple lenders`,
        author: 'Rajesh Kumar',
        date: 'December 28, 2023',
        category: 'Finance',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        readTime: '8 min read'
    },
    {
        id: 3,
        title: 'Luxury Villas vs Apartments: Making the Right Choice',
        excerpt: 'Explore the pros and cons of investing in luxury villas versus high-end apartments in India\'s metro cities.',
        content: `The decision between a luxury villa and an apartment depends on various lifestyle factors, investment goals, and personal preferences. Let's break down both options.

**Luxury Villas: Pros**
- Complete privacy and independence
- Larger living spaces and outdoor areas
- Customization opportunities
- Higher appreciation potential
- Prestige and status symbol

**Luxury Villas: Cons**
- Higher maintenance costs
- Security responsibilities
- Limited amenities compared to apartment complexes
- Higher property taxes
- Less liquidity in resale market

**High-End Apartments: Pros**
- Comprehensive security features
- Extensive amenities (gym, pool, clubhouse)
- Lower maintenance effort
- Better location options in city centers
- Easier to rent out
- More affordable than comparable villas

**High-End Apartments: Cons**
- Shared walls and common areas
- Parking limitations
- Association fees and rules
- Less privacy
- Limited customization options

**Investment Perspective**
Villas typically appreciate better in the long term but require higher upfront investment. Apartments offer better rental yields and are easier to liquidate.

**Making Your Choice**
Consider your lifestyle needs, family size, maintenance capacity, and investment timeline. If privacy and space are paramount, choose a villa. If convenience and amenities matter more, opt for a luxury apartment.`,
        author: 'Amit Patel',
        date: 'December 25, 2023',
        category: 'Buying Guide',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        readTime: '6 min read'
    },
    {
        id: 4,
        title: 'Real Estate Investment Trusts (REITs) in India: A Beginner\'s Guide',
        excerpt: 'Learn how REITs are revolutionizing real estate investment in India and how you can start investing.',
        content: `REITs have opened new avenues for investors to participate in the real estate market without directly owning property. Here's your complete guide to getting started.

**What are REITs?**
Real Estate Investment Trusts are companies that own, operate, or finance income-generating real estate. They allow you to invest in real estate portfolios just like you would invest in stocks.

**Benefits of REITs**
- Low entry barrier (minimum investment ~₹10,000-15,000)
- Regular dividend income (90% of income distributed)
- Portfolio diversification
- Professional management
- High liquidity compared to physical property
- Transparency and regulation by SEBI

**Types of REITs in India**
1. **Equity REITs**: Own and operate income-generating properties
2. **Mortgage REITs**: Provide financing for real estate
3. **Hybrid REITs**: Combination of both

**Current REITs in India**
- Embassy Office Parks REIT
- Mindspace Business Parks REIT
- Brookfield India Real Estate Trust

**How to Invest**
1. Open a Demat account
2. Complete KYC verification
3. Choose your REIT through your broker
4. Place buy order like a stock

**Tax Treatment**
- Dividend income: Taxed at slab rate
- Capital gains: LTCG at 10%, STCG at 15%

**Things to Consider**
- Occupancy rates of properties
- Quality of tenants
- Rental yield
- Management track record
- Economic outlook

REITs are an excellent way to gain real estate exposure with lower capital and better liquidity than traditional property investment.`,
        author: 'Vikram Malhotra',
        date: 'December 20, 2023',
        category: 'Investment',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        readTime: '7 min read'
    },
    {
        id: 5,
        title: 'Bangalore Tech Parks: Best Areas for IT Professionals to Buy Property',
        excerpt: 'Find out which areas near Bangalore\'s major tech hubs offer the best value for IT professionals.',
        content: `Bangalore's IT boom has created unique real estate opportunities around major tech parks. Here are the best areas for IT professionals to invest in property.

**Whitefield & ITPL Area**
Properties near the IT corridor offer excellent rental yields and capital appreciation. Average prices: ₹6,500-8,500 per sq ft.

**Electronic City**
South Bangalore's tech hub offers more affordable options with good appreciation potential. Average prices: ₹4,500-6,000 per sq ft.

**Outer Ring Road**
Connects multiple IT parks and offers excellent connectivity. Bellandur, Marathahalli, and Sarjapur are prime locations.

**Hebbal-Manyata Tech Park**
North Bangalore's emerging IT destination with improving infrastructure. Average prices: ₹5,000-7,000 per sq ft.

**ORR-Sarjapur**
Rapidly developing area with good connectivity to major tech parks. More affordable with high growth potential.

**Key Factors to Consider**
- Proximity to your workplace (within 5-10 km ideal)
- Metro connectivity (current or planned)
- Social infrastructure (schools, hospitals, shopping)
- Traffic conditions during peak hours
- Future development plans

**Investment Tips**
1. Buy near upcoming metro lines
2. Look for established builders with good track record
3. Check RERA registration
4. Verify all approvals and clearances
5. Consider both rental yield and capital appreciation

The best time to invest is now, before the upcoming Infrastructure projects further drive up prices.`,
        author: 'Anjali Deshmukh',
        date: 'December 15, 2023',
        category: 'Location Guide',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        readTime: '5 min read'
    },
    {
        id: 6,
        title: 'Understanding RERA: How It Protects Homebuyers in India',
        excerpt: 'A detailed look at the Real Estate Regulatory Authority and how it safeguards your property investment.',
        content: `RERA has brought transparency and accountability to India's real estate sector, protecting homebuyers' interests like never before.

**What is RERA?**
The Real Estate (Regulation and Development) Act, 2016 is a landmark legislation that regulates the real estate sector and protects consumer interests.

**Key Provisions for Homebuyers**
1. **Mandatory Registration**: All projects above 500 sq m or 8 apartments must be RERA registered
2. **Separate Bank Account**: 70% of funds collected must be kept in separate escrow account
3. **Carpet Area Definition**: Standardized definition across India
4. **Timely Delivery**: Penalties for delays
5. **Quality Standards**: Defect liability period of 5 years

**Your Rights Under RERA**
- Access to all project information online
- Transparent pricing and payment schedule
- Right to timely possession
- Compensation for delays
- Right to exit with refund

**How to Verify RERA Registration**
1. Visit your state's RERA website
2. Search for project name or registration number
3. Verify developer details
4. Check project timeline and approvals
5. Review complaints and status

**Filing a Complaint**
If a developer violates RERA provisions:
1. Approach RERA authority directly
2. File complaint online within 3 years
3. No legal fees required
4. Fast-track resolution (within 60 days)

**Red Flags to Watch For**
- No RERA registration number
- Incomplete project details on RERA website
- Promoter with multiple pending complaints
- Unrealistic delivery timelines

**Impact on Market**
RERA has significantly reduced project delays, improved transparency, and restored buyer confidence in the real estate market.

Always verify RERA registration before making any payment or booking a property.`,
        author: 'Arjun Nair',
        date: 'December 10, 2023',
        category: 'Legal',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        readTime: '6 min read'
    },
    {
        id: 7,
        title: 'Goa Property Market: Investment Opportunities in Paradise',
        excerpt: 'Explore why Goa is becoming a hotspot for real estate investors and retirees alike.',
        content: `Goa's unique lifestyle and growing infrastructure make it an attractive investment destination for both end-users and investors.

**Why Invest in Goa?**
- Tourism-driven rental income
- High quality of life
- Favorable climate year-round
- Growing infrastructure
- Strong appreciation potential
- Popular retirement destination

**Best Areas to Invest**
1. **North Goa** (Candolim, Calangute, Baga): Higher rental yields from tourism
2. **South Goa** (Palolem, Agonda): Peaceful, luxury segment
3. **Panaji**: Capital city, commercial hub
4. **Vasco**: Industrial area, rental demand from workers
5. **Assagao & Anjuna**: Premium villas, expat community

**Property Types**
- **Villas**: ₹2-10 Cr, high rental yields
- **Apartments**: ₹50 L - ₹2 Cr, easier maintenance
- **Land**: ₹15,000 - ₹50,000 per sq m

**Investment Returns**
- Rental Yield: 5-8% annually
- Capital Appreciation: 8-12% annually
- Tourism season: Oct-March (peak rental income)

**Legal Considerations**:
- Check land ownership (NA vs agricultural)
- Verify CRZ clearances
- Understand tenancy laws
- Capital Gains Tax implications

**Challenges**
- Monsoon season affects rentals
- Property management if not residing
- Liquidity concerns
- Regulatory restrictions on certain land types

**Future Outlook**
With Mopa International Airport operational and improving infrastructure, Goa's property market is poised for significant growth.

Ideal for those seeking lifestyle + investment returns.`,
        author: 'Priya Sharma',
        date: 'December 5, 2023',
        category: 'Market Trends',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        readTime: '5 min read'
    },
    {
        id: 8,
        title: 'Smart Homes in India: The Future of Residential Real Estate',
        excerpt: 'Discover how smart home technology is transforming modern living and adding value to properties.',
        content: `Smart home features are no longer a luxury but an expectation in premium properties. Here's how technology is reshaping Indian homes.

**Essential Smart Home Features**
1. **Smart Lighting**: Automated, energy-efficient LED systems
2. **Climate Control**: Smart ACs and thermostats
3. **Security Systems**: Video doorbells, CCTV, smart locks
4. **Voice Assistants**: Alexa, Google Home integration
5. **Smart Appliances**: Refrigerators, washing machines, ovens

**Popular Smart Home Brands in India**
- Xiaomi Mi Home
- Amazon Alexa-compatible devices
- Philips Hue
- Wipro Smart
- Syska Smart

**Cost Breakdown**
- Basic Setup: ₹50,000 - ₹1 lakh
- Mid-Range: ₹1-3 lakhs
- Premium Installation: ₹5+ lakhs

**Energy Savings**
Smart homes can reduce electricity bills by 20-30% through:
- Automated lighting control
- Smart power management
- Optimized HVAC usage
- Solar panel integration

**Impact on Property Value**
- Smart homes command 5-10% premium
- Faster sales in competitive markets
- Higher rental yields (10-15% more)
- Attractive to tech-savvy buyers

**Security Benefits**
- Real-time monitoring from anywhere
- Instant alerts for intrusions
- Integration with local security
- Video recording evidence

**Future Trends**
- AI-powered home management
- IoT integration across all devices
- Predictive maintenance alerts
- Energy optimization using machine learning

**Retrofit vs New Installation**
Existing homes can be retrofitted for ₹1-2 lakhs, making smart technology accessible to all homeowners.

**Things to Consider**
- Internet reliability
- Power backup systems
- Privacy and data security
- Compatibility between devices
- After-sales service

Smart homes are not just about convenience—they're about efficiency, security, and future-proofing your investment.`,
        author: 'Rajesh Kumar',
        date: 'November 30, 2023',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        readTime: '7 min read'
    },
    {
        id: 9,
        title: 'Commercial Real Estate: Office Spaces in Post-Pandemic India',
        excerpt: 'How the commercial real estate landscape has changed after COVID-19 and what it means for investors.',
        content: `The pandemic has permanently altered how we view office spaces and work culture. Here's what's changed in commercial real estate.

**The Hybrid Work Revolution**
Companies are adopting flexible work models:
- 3-2 model (3 days office, 2 days home)
- Hot-desking and shared spaces
- Smaller but better-quality offices
- Focus on employee experience

**New Office Space Requirements**
1. **Touchless Technology**: Motion sensors, voice controls
2. **Better Ventilation**: HVAC upgrades, air purification
3. **Flexible Layouts**: Modular, reconfigurable spaces
4. **Collaboration Zones**: Meeting rooms, brainstorming areas
5. **Wellness Amenities**: Gyms, meditation rooms, cafeterias

**Market Dynamics**
- Grade A office rents: ₹80-150 per sq ft (varies by city)
- Vacancy rates improving to pre-pandemic levels
- Flight to quality—premium spaces in demand
- Suburban office hubs gaining traction

**Investment Opportunities**
**Co-working Spaces**: Growing at 15-20% annually
- WeWork, Awfis, 91springboard expanding
- Flexible lease terms attracting startups
- Managed office spaces popular

**Tier 2 Cities**
Pune, Ahmedabad, Kochi seeing strong demand:
- Lower rentals (30-40% less than metros)
- Talent availability
- Better quality of life packages

**Technology Hubs**
Bangalore, Hyderabad, Pune continue to lead:
- IT/ITeS driving 70% of demand
- Build-to-suit projects trending
- Long-term lease commitments

**Returns & Metrics**
- Rental Yield: 7-9% in prime locations
- Capital Appreciation: 5-8% annually
- Lease periods: 5-9 years typical
- Lock-in periods reducing

**Challenges**
- Work-from-home reducing demand
- Surplus supply in some micro-markets
- Tenant bargaining power increased
- Longer lease negotiation cycles

**Future Outlook**
Despite challenges, quality office spaces in prime locations will continue to command premium. Focus is shifting from quantity to quality.

**Investment Tips**
- Invest in Grade A buildings only
- Prefer locations near Metro/transport hubs
- Check tenant profile and lease terms
- Consider co-working conversion potential

Commercial real estate remains attractive for long-term investors willing to focus on quality over quantity.`,
        author: 'Amit Patel',
        date: 'November 25, 2023',
        category: 'Commercial',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        readTime: '8 min read'
    },
    {
        id: 10,
        title: 'Vastu Shastra and Modern Architecture: Finding the Balance',
        excerpt: 'How contemporary developers are incorporating Vastu principles into modern property designs.',
        content: `Vastu Shastra continues to influence property buyers in India, and modern developers are finding innovative ways to blend ancient principles with contemporary design.

**Key Vastu Principles**
1. **Main Entrance**: East or north-facing preferred
2. **Master Bedroom**: Southwest corner
3. **Kitchen**: Southeast corner
4. **Pooja Room**: Northeast corner
5. **Bathrooms**: South or west directions

**Modern Interpretation**
Today's architects integrate Vastu without compromising on aesthetics:
- Open floor plans allowing positive energy flow
- Large windows for natural light ( especially east)
- Cross-ventilation systems
- Water features in the northeast
- Balanced color schemes per direction

**Impact on Property Values**
- Vastu-compliant homes sell 10-15% faster
- Premium of 5-8% in smaller cities
- Essential for resale value
- Important for traditional buyers

**Developer Strategies**
**Flexible Layouts**: Allowing customization per Vastu
**Vastu Consultants**: On-site during planning phase
**Directional Clarity**: Clear north marking in plans
**Marketing**: Highlighting Vastu compliance

**Common Vastu Adjustments**
- Entrance lobbies in northeast
- Servant quarters in northwest
- Staircase placement in south/west
- Balcony orientations considered
- Septic tank locations planned

**Challenges in High-Rises**
- Limited directional choices per flat
- Common areas constraining individual units
- Structural limitations
- Cost implications of customization

**Solutions**
- Multiple entrance options
- Remedial measures (colors, mirrors, lighting)
- Floor-wise direction variations
- Vastu-friendly amenity placement

**Scientific Perspective**
While debatable, certain Vastu principles align with:
- Natural light optimization
- Ventilation science
- Privacy considerations
- Functional space planning

**Buyer Psychology**
- 60-70% buyers consult Vastu
- Critical in tier 2/3 cities
- Even skeptics consider resale value
- Millennials blend Vastu with aesthetics

**Balance is Key**
Modern living requires practical spaces. The trend is toward "Vastu-inspired" rather than "Vastu-strict" designs, allowing flexibility while respecting traditional wisdom.

**For Buyers**
- Don't compromise functionality for strict Vastu
- Focus on major principles (entrance, bedroom, kitchen)
- Use remedial measures where needed
- Consult reputable Vastu experts

Vastu-compliance adds value but shouldn't overshadow practical living needs and budget considerations.`,
        author: 'Vikram Malhotra',
        date: 'November 20, 2023',
        category: 'Design',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        readTime: '6 min read'
    }
];

export default function BlogPostPage() {
    const params = useParams();
    const postId = Number(params.id);
    const post = blogPosts.find(p => p.id === postId);

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
            <article className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-8 font-medium"
                        >
                            <i className="fas fa-arrow-left"></i>
                            Back to Blog
                        </Link>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {post.content}
                            </div>
                        </div>

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-secondary mb-4">Share this article</h3>
                            <div className="flex gap-3">
                                <button className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button className="w-12 h-12 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button className="w-12 h-12 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                                <button className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors">
                                    <i className="fab fa-whatsapp"></i>
                                </button>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <i className="fas fa-user text-3xl text-primary"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-secondary mb-2">{post.author}</h4>
                                    <p className="text-gray-600">
                                        Real estate expert and content writer with over 10 years of experience in the Indian property market.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            <section className="py-16 bg-gray-50">
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


        </>
    );
}
