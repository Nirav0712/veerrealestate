export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST() {
    return logout();
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('callbackUrl') || '/login';
    return logout(redirectUrl);
}

async function logout(redirectUrl?: string) {
    const response = redirectUrl
        ? NextResponse.redirect(new URL(redirectUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
        : NextResponse.json({ message: 'Logged out successfully' });

    response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
