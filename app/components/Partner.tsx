"use client";

import Image from "next/image";

const Partner = () => {
  const partners = [
    { name: "Digital", logo: "/images/Partner/1.png" },
    { name: "Imperia Group", logo: "/images/Partner/2.png" },
    { name: "K3 Vision", logo: "/images/Partner/3.png" },
    { name: "MBA Group", logo: "/images/Partner/4.png" },
    { name: "Rajshree Group", logo: "/images/Partner/5.png" },
    { name: "Reneev Dev Group", logo: "/images/Partner/6.png" },
    { name: "Royal Group", logo: "/images/Partner/7.png" },
    { name: "Saket Group", logo: "/images/Partner/8.png" },
    { name: "Satyagrah Group", logo: "/images/Partner/9.png" },
    { name: "Shilp Group", logo: "/images/Partner/10.png" },
    { name: "Shivalik Group", logo: "/images/Partner/11.png" },
    { name: "Shridhar Group", logo: "/images/Partner/12.png" },
    { name: "Shyphram Group", logo: "/images/Partner/13.png" },
    { name: "Signature Group", logo: "/images/Partner/14.png" },
    { name: "Sudarshan Group", logo: "/images/Partner/15.png" },
    { name: "Swastik Group", logo: "/images/Partner/16.png" },
    { name: "Vandematram Group", logo: "/images/Partner/17.png" },
    { name: "Vishakha Group", logo: "/images/Partner/18.png" },
    { name: "Vivaan Group", logo: "/images/Partner/19.png" },
    { name: "Vyapti Group", logo: "/images/Partner/20.png" },
  ];

  const duplicated = [...partners, ...partners];

  return (
    <section className="bg-white py-4 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Main Flex Row */}
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          {/* LEFT SIDE TEXT */}
          <div className="lg:w-1/3 text-left">
            <h2 className="text-5xl md:text-5xl font-bold text-[#162544] leading-tight">
              Our Partners
            </h2>
          </div>

          {/* RIGHT SIDE SLIDER */}
          <div className="lg:w-2/3 relative w-full overflow-hidden">
            {/* Fade Left */}
            <div className="absolute left-0 top-0 h-full w-20 bg-linear-to-r from-gray-100 to-transparent z-10" />

            {/* Fade Right */}
            <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-gray-100 to-transparent z-10" />

            {/* Moving Track */}
            <div className="flex w-max animate-scroll gap-10 items-center">
              {duplicated.map((partner, index) => (
                <div
                  key={index}
                  className="shrink-0 flex justify-center items-center group"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={200}
                    height={120}
                    className="
                      object-contain
                        h-20
                        md:h-32
                        w-auto
                      transition-all duration-300
                      opacity-70
                      scale-95
                      group-hover:opacity-100
                      group-hover:scale-110
                    "
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default Partner;
