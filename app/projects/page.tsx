'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import { projects } from "@/lib/projects";

export default function ProjectPage() {
    

    


    

    
    return (
        <>

            {/* Page Header */}
            <div className="bg-linear-to-br from-secondary to-secondary-light text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Browse Projects</h1>
                    <p className="text-xl opacity-90">
                        Find your perfect project from our collection
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-secondary">Filters</h2>
                                
                            </div>

                           
                        </div>
                    </aside>

                    {/* Projects Grid */}
                    

                </div>
            </div>


        </>
    );
}
