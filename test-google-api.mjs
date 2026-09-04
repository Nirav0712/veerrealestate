import fs from 'fs';

async function test() {
    const envStr = fs.readFileSync('.env', 'utf-8');
    const placeId = envStr.match(/GOOGLE_PLACE_ID=(.*)/)[1].trim();
    const apiKey = envStr.match(/GOOGLE_MAPS_API_KEY=(.*)/)[1].trim();

    console.log("Place ID present:", !!placeId);
    console.log("API Key present:", !!apiKey);

    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    try {
        const res = await fetch(url, {
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri"
            }
        });

        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
