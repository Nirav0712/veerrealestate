export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function GET() {
    const placeId = process.env.GOOGLE_PLACE_ID || "YOUR_PLACE_ID";
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "Google Places API Key is missing. Please add GOOGLE_PLACES_API_KEY to your .env file." }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK") {
            return NextResponse.json({ error: data.error_message || "Failed to fetch from Google API" }, { status: 500 });
        }

        return NextResponse.json(data.result);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
