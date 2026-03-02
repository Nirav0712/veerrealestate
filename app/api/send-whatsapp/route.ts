export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body: {
            name: string;
            email: string;
            phone: string;
            subject: string;
            message: string;
        } = await req.json();

        const response = await fetch(
            `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: process.env.RECEIVER_NUMBER,
                    type: "text",
                    text: {
                        body: `New Contact Form Message:

Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone}
Subject: ${body.subject}
Message: ${body.message}`,
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}