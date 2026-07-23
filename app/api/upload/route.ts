export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, message: 'File too large. Max size is 5MB.' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: 'Invalid file type. Only JPG, PNG, GIF, and WEBP allowed.' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
        const uniqueFilename = `${Date.now()}-${filename}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure upload directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const path = join(uploadDir, uniqueFilename);
        await writeFile(path, buffer);

        // Construct URL
        const url = `/uploads/${uniqueFilename}`;

        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            url: url
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Error uploading file' },
            { status: 500 }
        );
    }
}
