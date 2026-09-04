export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function GET() {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey || !placeId) {
        return NextResponse.json({ error: "Missing Google Places API configuration." }, { status: 500 });
    }

    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    try {
        const res = await fetch(url, {
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri"
            },
            next: { revalidate: 3600 }
        });

        const data = await res.json();

        if (data.error) {
            return NextResponse.json({ error: data.error.message || "Failed to fetch from Google API" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
