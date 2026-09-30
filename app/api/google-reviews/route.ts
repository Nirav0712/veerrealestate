export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function GET() {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Diagnostic validation: check API Key
    if (!apiKey) {
        console.error("[Google Reviews API Error] GOOGLE_PLACES_API_KEY is not defined in environment variables.");
        return NextResponse.json(
            { error: "Google Places API Key is missing. Please configure GOOGLE_PLACES_API_KEY in your environment variables (.env.local)." },
            { status: 500 }
        );
    }

    // Diagnostic validation: check Place ID
    if (!placeId || placeId === "YOUR_PLACE_ID") {
        console.error("[Google Reviews API Error] GOOGLE_PLACE_ID is missing or set to placeholder 'YOUR_PLACE_ID'.");
        return NextResponse.json(
            { error: "Google Place ID is missing or invalid. Please configure GOOGLE_PLACE_ID in your environment variables (.env.local)." },
            { status: 500 }
        );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 } // Cache results for 1 hour to prevent quota exhaustion
        });

        if (!res.ok) {
            console.error(`[Google Reviews API Error] Google Places HTTP response error: ${res.status} ${res.statusText}`);
            return NextResponse.json(
                { error: `Google API HTTP error: ${res.statusText}` },
                { status: res.status }
            );
        }

        const data = await res.json();

        // Diagnostic validation: check Google status
        if (data.status !== "OK") {
            console.error(`[Google Reviews API Error] Google Places API Status: "${data.status}". Message: "${data.error_message || 'No error message provided'}"`);
            return NextResponse.json(
                {
                    error: data.error_message || `Google API returned status: ${data.status}`,
                    google_status: data.status
                },
                { status: 500 }
            );
        }

        return NextResponse.json(data.result);
    } catch (error: any) {
        console.error("[Google Reviews API Error] Network or fetch exception:", error?.message || error);
        return NextResponse.json(
            { error: "Failed to communicate with Google Places service. Please check network connectivity and API status." },
            { status: 500 }
        );
    }
}
