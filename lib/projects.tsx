export type Project = {
  id: number;
  title: string;
  slug: string;
  price: number;
  displayPrice: string;
  image: string;
  images?: string[];  // up to 3 images for the card carousel
  status: string;
  bedrooms: number;
  location: string;
  PlotArea?: string;
  address: string;
  featured?: boolean;
  description: string;
  zone: "East" | "West";
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Aaradhana Sky 2",
    slug: "aaradhana-sky-2",
    price: 260000,
    displayPrice: "₹ 26 Lakh",
    image: "/images/east/AARADHANA_2.jpeg",
    images: ["/images/east/AARADHANA_2.jpeg"],
    status: "For Sale",
    bedrooms: 2,
    location: "Ahmedabad",
    PlotArea: "110 SQ.YRD & 115 SQ.YRD",
    address: "Beside Avadh Green Bungalows, Narol-Aslali Highway, Behind Pooja Farm Road, Narol, Ahmedabad - 382405",
    featured: true,
    description: "Aaradhana Sky 2 offers luxurious 2 BHK flats in Narol, Ahmedabad with FREE furniture and modular kitchen. Limited project of only 56 premium units designed with modern amenities and quality construction for comfortable living.",
    zone: "East"
  },
  {
    id: 2,
    title: " Anushtan Bungalows",
    slug: "anushtan-bungalows",
    price: 12000000,
    displayPrice: "₹ 1.20 Cr",
    image: "/images/east/Anusthan.jpeg",
    images: ["/images/east/Anusthan.jpeg"],
    status: "For Sale",
    bedrooms: 4,
    location: "Ahmedabad",
    PlotArea: "150 Sq. Yards",
    address: " B/h Parijat Vishwas, Nr. Vatva-Gamdi Circle, S.P.Ring Road, Ahmedabad-382440.",
    featured: true,
    description: "Anushtan Bungalows offers a complete modern lifestyle and a true sanctuary of luxury and comfort. Located near Vatva-Gamdi Circle, this exclusive residential project presents bigger and better 4 BHK homes designed for premium living, fresh open air, and an elevated lifestyle experience.",
    zone: "East"
  },
  {
    id: 3,
    title: "Avalon DHS Floora",
    slug: "avalon-dhs-floora",
    price: 2065000,
    displayPrice: "₹ 20.65 Lakh Onwards",
    image: "/images/east/Avalon-DHS.jpeg",
    images: ["/images/east/Avalon-DHS.jpeg"],
    status: "Ready Possession",
    bedrooms: 2,
    location: "Vatva, Ahmedabad",
    PlotArea: "1.5 BHK, 2 BHK & 2.5 BHK Options Available",
    address: "Avalon DHS Floora, Beside Avalon Park, Near Ayodhya Apartment, Near Water Tank, Vatva-Gamdi Road, Vatva, Ahmedabad - 382445",
    featured: true,
    description: "Experience the WOW factor at Avalon DHS Floora, Vatva. Ready possession 1.5, 2 & 2.5 BHK homes starting from ₹20.65 Lakh with FREE fixed furniture, 100% loan assistance, modern amenities, 24x7 security, lifts, parking, CCTV surveillance, fire safety and premium construction quality.",
    zone: "East"
  },
  {
    id: 4,
    title: "Eleven 04 Homes",
    slug: "eleven-04-homes",
    price: 3265000,
    displayPrice: "₹ 32.65 Lakh Onwards",
    image: "/images/east/Eleven.jpeg",
    images: ["/images/east/Eleven.jpeg"],
    status: "For Sale",
    bedrooms: 2,
    location: "New Vatva, Ahmedabad",
    PlotArea: "2 BHK (141 Sq.Yrd) & 3 BHK (160 Sq.Yrd)",
    address: "Near Krishnam International School, S.P. Ring Road, New Vatva, Ahmedabad - 382445, Gujarat",
    featured: true,
    description: "Eleven 04 Homes offers spacious and luxurious 2 & 3 BHK flats in New Vatva, Ahmedabad. Starting from ₹32.65 Lakh, this premium residential project features large room sizes, modern amenities, solar-powered common services, 24x7 security, basement parking, personal EV charging points, and vastu-compliant design. Sample flat ready with early possession and special booking discounts available.",
    zone: "East"
  },
  {
    id: 5,
    title: "Sahajanand Exotica",
    slug: "sahajanand-exotica",
    price: 3699000,
    displayPrice: "₹ 36.99 Lakh Onwards",
    image: "/images/east/sahajanand-exotica.jpeg",
    images: ["/images/east/sahajanand-exotica.jpeg"],
    status: "Ready Possession",
    bedrooms: 2 & 3,
    location: "Ghodasar, South East Ahmedabad",
    PlotArea: "131 – 165 Sq. Yards (131, 132, 134, 135, 142, 151, 165 Options)",
    address: "FP No. 16/1, TPS No. 88, Opp. Zeal Apartment, 80 Ft Road, Near Nigam Society, Vatva, South East Ahmedabad - 382440, Gujarat",
    featured: true,
    description: "Sahajanand Exotica offers premium 2 & 3 BHK luxurious flats in Ghodasar, Ahmedabad. A ready possession project with B.U. permission, featuring only 70 exclusive flats, modern amenities, solar-powered common services, basement parking, gym, community hall, and excellent AMTS connectivity. Book your dream home today with just ₹51,000.",
    zone: "East"
  },
  {
    id: 6,
    title: "Sahajanand Harmony",
    slug: "sahajanand-harmony",
    price: 2751000,
    displayPrice: "₹ 27.51 Lakh Onwards",
    image: "/images/east/Sahajanand-harmony.jpeg",
    images: ["/images/east/Sahajanand-harmony.jpeg"],
    status: "Ready Possession",
    bedrooms: 2,
    location: "New Vatva, Ahmedabad",
    PlotArea: "118, 120, 125, 131 Sq. Yards",
    address: "Beside Ayodhya Apartment, Vatva-Gamdi Road, S.P. Ring Road, New Vatva, Ahmedabad, Gujarat",
    featured: true,
    description: "Sahajanand Harmony offers luxurious 2 BHK ready possession flats in New Vatva, Ahmedabad. A premium 100 ft road-touch scheme with only 84 exclusive units, B.U. permission, FREE fixed furniture and modular kitchen. Starting from ₹27.51 Lakh with just ₹51,000 booking amount. Solar-powered common services ensure low maintenance living.",
    zone: "East"
  },
  {
    id: 7,
    title: "Swara Premium Bungalows",
    slug: "swara-premium-bungalows",
    price: 0,
    displayPrice: "Price On Request",
    image: "/images/east/Swara.jpeg",
    images: ["/images/east/Swara.jpeg"],
    status: "For Sale",
    bedrooms: 4,
    location: "Narol-Aslali, Ahmedabad",
    PlotArea: "120 to 313 Sq. Yards",
    address: "Near Bharat Petrol Pump, Narol-Aslali Highway Touch, Aslali Bridge Service Road, Narol-Aslali, Ahmedabad",
    featured: true,
    description: "Swara by Swarg Bhagirath presents 4 BHK premium bungalows near Ring Road, Narol-Aslali, Ahmedabad. A thoughtfully planned scheme with only 63 exclusive units spread across 9600 sq. yards land, offering 53% open space, 25 ft wide internal roads, personal solar panels, private terrace gardens, and modern lifestyle amenities. Experience luxury, comfort, and fresh living in New Ahmedabad.",
    zone: "East"
  },
  {
    id: 8,
    title: "Sona Siddhi Premium Living",
    slug: "sona-siddhi-premium-living",
    price: 2051000,
    displayPrice: "₹ 20.51 Lakh* Onwards",
    image: "/images/east/sona-sidhhi.jpeg",
    images: ["/images/east/sona-sidhhi.jpeg"],
    status: "For Sale",
    bedrooms: 1,
    location: "New Vatva, Ahmedabad",
    PlotArea: "Large Room Size Flats",
    address: "100 Ft Road, Near Osiya Hyper Mart, Vatva-Ropda Road, New Vatva, Ahmedabad - 382440",
    featured: true,
    description: "Sona Siddhi Premium Living offers ready possession 1 & 2 BHK apartments with B.U. permission near S.P. Ring Road, New Vatva, Ahmedabad. Limited flats available with FREE fixed furniture, modern amenities, large room sizes, and excellent connectivity. A perfect blend of comfort, convenience, and affordability starting from ₹20.51 Lakh onwards.",
    zone: "East"
  },
  {
    id: 9,
    title: "Sunrise Homes 1",
    slug: "sunrise-homes-1",
    price: 2025000,
    displayPrice: "₹ 20.25 Lakh* Onwards",
    image: "/images/east/Sanrise-home.jpeg",
    images: ["/images/east/Sanrise-home.jpeg"],
    status: "For Sale",
    bedrooms: 1,
    location: "New Vatva, Ahmedabad",
    PlotArea: "85 / 90 SQ.YRD",
    address: "New Vatva, Ahmedabad, Gujarat",
    featured: true,
    description: "Sunrise Homes 1 offers super spacious 1 BHK flats in New Vatva with FREE fixed furniture and modular kitchen. Ready possession homes designed for comfort, security, and convenience at a prime location. Starting from ₹20.25 Lakh onwards with maximum loan assistance available.",
    zone: "East"
  },
  {
    id: 10,
    title: "Omkar Enclave",
    slug: "omkar-enclave-ranip",
    price: 7000000,
    displayPrice: "₹ 70 Lakh* Onwards",
    image: "/images/west/omkar.jpeg",
    images: ["/images/west/omkar.jpeg", "/images/west/omkar.jpeg", "/images/west/omkar.jpeg"],
    status: "For Sale",
    bedrooms: 3,
    location: "Ranip, Ahmedabad",
    PlotArea: "2 BHK – 165 Sq.Yrd | 3 BHK – 195 Sq.Yrd",
    address: "Behind Ranip Bus Terminal, Radha Swami Road, Ranip, Ahmedabad - 382480",
    featured: true,
    description: "Omkar Enclave offers premium 2 & 3 BHK luxury flats in the heart of Ranip, Ahmedabad. Strategically located near D-Mart, PVR, Ranip ST Bus Terminal, BRTS, RTO Circle, and Sabarmati Railway Station. Designed for modern urban living with landscaped gardens, mini club house, gated security, and premium amenities. Starting from ₹70 Lakh onwards with limited units available.",
    zone: "West"
  },
  {
    id: 11,
    title: "Shubh Greens",
    slug: "shubh-greens-zundal",
    price: 7000000,
    displayPrice: "₹ 70 Lakh* Onwards",
    image: "/images/west/subh-green.jpeg",
    images: ["/images/west/subh-green.jpeg", "/images/west/omkar.jpeg", "/images/west/subh-green.jpeg"],
    status: "For Sale",
    bedrooms: 3,
    location: "Zundal, Ahmedabad",
    PlotArea: "210 Sq. Yards",
    address: "Shubh Greens, Behind Lubi Corporate, Near Vaishnodevi Circle, S.P. Ring Road, Ahmedabad - 382470",
    featured: true,
    description: "Shubh Greens offers premium 3 BHK ready-to-move flats in Zundal, Ahmedabad. Limited to just 70 exclusive units with only 3 flats per floor, this project ensures privacy, comfort, and modern luxury living. Located near Vaishnodevi Circle and S.P. Ring Road, it provides excellent connectivity along with premium amenities and high-quality construction. Starting from ₹70 Lakh onwards.",
    zone: "West"
  },

];
