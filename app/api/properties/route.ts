export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper: parse images from DB row (handles JSON string, old single image string, or null)
function parseImages(row: any): string[] {
    if (Array.isArray(row.images)) return row.images;
    if (row.images && typeof row.images === 'string') {
        try { return JSON.parse(row.images); } catch { return [row.images]; }
    }
    if (row.image && typeof row.image === 'string') return [row.image];
    return [];
}

// GET all properties
export async function GET() {
    try {
        await ensureSchema();
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties ORDER BY created_at DESC');
        const properties = rows.map(row => ({
            ...row,
            images: parseImages(row),
            featured: Boolean(row.featured),
        }));
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

// POST new property
export async function POST(request: NextRequest) {
    try {
        // Ensure all columns exist before insert
        await ensureSchema();

        const body = await request.json();
        const {
            title, price, location, type, status, bedrooms, bathrooms, area, areaUnit,
            featured, images, description, yearBuilt, parking, transaction
        } = body;

        const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO properties (
                title, price, location, type, status, bedrooms, bathrooms, area, areaUnit,
                featured, images, description, yearBuilt, parking, transaction
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, price, location, type, status,
                bedrooms, bathrooms, area, areaUnit || 'sqft',
                featured ? 1 : 0, imagesJson,
                description, yearBuilt, parking,
                transaction || 'resale'
            ]
        );

        return NextResponse.json(
            { id: result.insertId, ...body, images: Array.isArray(images) ? images : [] },
            { status: 201 }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
