"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface GoogleReview {
    authorAttribution: {
        displayName: string;
        photoUri?: string;
    };
    rating: number;
    text: {
        text: string;
    };
    relativePublishTimeDescription?: string;
}

interface PlaceData {
    rating?: number;
    userRatingCount?: number;
    reviews?: GoogleReview[];
    googleMapsUri?: string;
    error?: string;
}

export default function GoogleReviews() {
    const [placeData, setPlaceData] = useState<PlaceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/google-reviews")
            .then((res) => res.json())
            .then((data) => {
                if (data.reviews) {
                    setPlaceData(data);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError("No reviews found");
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

    if (error || !placeData || !placeData.reviews || placeData.reviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>Google Reviews are currently unavailable.</p>
            </div>
        );
    }

    const { reviews, rating, userRatingCount, googleMapsUri } = placeData;

    return (
        <div className="relative overflow-hidden py-10">
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                    align-items: flex-start;
                }
                .marquee:hover, .marquee.paused {
                    animation-play-state: paused;
                }
                .review-card {
                    width: 400px;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }
                @media (max-width: 640px) {
                    .review-card {
                        width: 300px;
                    }
                }
            `}</style>

            {rating && userRatingCount && googleMapsUri && (
                <div className="text-center mb-8">
                    <a href={googleMapsUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                        <span className="font-bold text-xl text-secondary">{rating}</span>
                        <div className="text-yellow-400 text-sm flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                            ))}
                        </div>
                        <span className="text-secondary font-medium">({userRatingCount} reviews on Google)</span>
                    </a>
                </div>
            )}

            <div className={`marquee gap-8 px-4 ${expandedIndex !== null ? "paused" : ""}`}>
                {[...reviews, ...reviews].map((review, index) => {
                    const originalIndex = index % reviews.length;
                    const isExpanded = expandedIndex === originalIndex;
                    const displayName = review.authorAttribution?.displayName || "Google User";
                    const photoUrl = review.authorAttribution?.photoUri || "https://randomuser.me/api/portraits/lego/1.jpg";
                    const reviewText = review.text?.text || "";
                    const publishTime = review.relativePublishTimeDescription || "";
                    const reviewRating = review.rating || 5;

                    return (
                        <div key={index} className="review-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={photoUrl}
                                        alt={displayName}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary">{displayName}</h4>
                                    <p className="text-sm text-gray-500">{publishTime}</p>
                                </div>
                            </div>

                            <div className="text-yellow-400 mb-4 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`fas fa-star ${i < reviewRating ? "text-yellow-400" : "text-gray-200"}`}
                                    ></i>
                                ))}
                            </div>

                            <div className="relative">
                                <p className="text-gray-600 leading-relaxed italic">
                                    &ldquo;{isExpanded ? reviewText : (reviewText.length > 200 ? `${reviewText.substring(0, 200)}...` : reviewText)}&rdquo;
                                </p>
                                {reviewText.length > 200 && (
                                    <button
                                        onClick={() => setExpandedIndex(isExpanded ? null : originalIndex)}
                                        className="text-primary text-xs font-bold mt-2 hover:underline cursor-pointer transition-colors"
                                    >
                                        {isExpanded ? "Show Less" : "Read More"}
                                    </button>
                                )}
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <i className="fab fa-google text-blue-500 text-sm"></i>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Posted on Google</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
