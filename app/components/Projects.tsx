"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";


export default function Projects() {
  const duplicated = [...projects, ...projects];

  return (
    <section className="bg-white py-10 md:py-20 overflow-hidden">

      <div className=" items-center gap-16">


        <h2 className="text-5xl font-bold text-secondary leading-tight text-center ">
          Exclusive  Luxury Projects
        </h2>
        <p className="text-gray-600 text-center pt-3">  Discover thoughtfully designed residences that blend elegance, comfort, and modern living.</p>

        {/* RIGHT SLIDER */}
        <div className=" relative w-full overflow-hidden mt-10">

          {/* Left Fade */}
          <div className="absolute left-0 top-0 h-full w-20 bg-linear-to-r from-[#0f1f3d] to-transparent z-10"></div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#0f1f3d] to-transparent z-10"></div>

          {/* Slider Track */}
          <div className="flex w-max animate-scroll gap-8">

            {duplicated.map((project, index) => (
              <Link
                key={index}
                href={`/projects/${project.zone.toLowerCase()}/${project.slug}`}
                className="min-w-[320px] rounded-xl overflow-hidden shadow-lg relative group cursor-pointer"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={600}
                  className="w-100 h-137.5 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Project Name */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-2xl">
                  {project.title}
                </div>
              </Link>
            ))}

          </div>

        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 200s linear infinite;
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
}