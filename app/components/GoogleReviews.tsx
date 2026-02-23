"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
    author_name: string;
    rating: number;
    text: string;
    profile_photo_url?: string;
    relative_time_description?: string;
}

export default function GoogleReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/google-reviews")
            .then((res) => res.json())
            .then((data) => {
                if (data.reviews) {
                    setReviews(data.reviews);
                } else if (data.error) {
                    setError(data.error);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch reviews:", err);
                setError("Failed to load reviews.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>{error}</p>
                <p className="mt-2 font-mono opacity-50 text-xs">Verify your API Key and Place ID in .env</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No reviews found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-12 h-12">
                            <Image
                                src={review.profile_photo_url || "https://randomuser.me/api/portraits/men/1.jpg"}
                                alt={review.author_name}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-secondary">{review.author_name}</h4>
                            <p className="text-sm text-gray-500">{review.relative_time_description}</p>
                        </div>
                    </div>

                    <div className="text-yellow-400 mb-4 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className={`fas fa-star ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                            ></i>
                        ))}
                    </div>

                    <p className="text-gray-600 leading-relaxed italic">
                        &ldquo;{review.text.length > 200 ? `${review.text.substring(0, 200)}...` : review.text}&rdquo;
                    </p>

                    <div className="mt-6 flex items-center gap-2">
                        <i className="fab fa-google text-blue-500 text-sm"></i>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Posted on Google</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
