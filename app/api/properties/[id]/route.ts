export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Helper: parse images from DB row
function parseImages(row: any): string[] {
    if (Array.isArray(row.images)) return row.images;
    if (row.images && typeof row.images === 'string') {
        try { return JSON.parse(row.images); } catch { return [row.images]; }
    }
    if (row.image && typeof row.image === 'string') return [row.image];
    return [];
}

// GET single property
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureSchema();
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const row = rows[0];
        return NextResponse.json({
            ...row,
            images: parseImages(row),
            featured: Boolean(row.featured),
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

// PUT update property
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureSchema();
        const { id } = await params;
        const body = await request.json();
        const {
            title, price, location, type, status, bedrooms, bathrooms, area, areaUnit,
            featured, images, description, yearBuilt, parking, transaction
        } = body;

        const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

        await pool.query<ResultSetHeader>(
            `UPDATE properties SET
                title = ?, price = ?, location = ?, type = ?, status = ?,
                bedrooms = ?, bathrooms = ?, area = ?, areaUnit = ?, featured = ?,
                images = ?, description = ?, yearBuilt = ?, parking = ?, transaction = ?
            WHERE id = ?`,
            [
                title, price, location, type, status,
                bedrooms, bathrooms, area, areaUnit || 'sqft', featured ? 1 : 0,
                imagesJson, description, yearBuilt, parking, transaction || 'resale',
                id
            ]
        );

        return NextResponse.json({ id, ...body, images: Array.isArray(images) ? images : [] });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

// DELETE property
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM properties WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}
