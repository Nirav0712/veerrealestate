import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// GET single property
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
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
        const { id } = await params;
        const body = await request.json();
        const {
            title, price, location, type, status, bedrooms, bathrooms, area,
            featured, image, description, yearBuilt, parking
        } = body;

        await pool.query<ResultSetHeader>(
            `UPDATE properties SET
        title = ?, price = ?, location = ?, type = ?, status = ?,
        bedrooms = ?, bathrooms = ?, area = ?, featured = ?,
        image = ?, description = ?, yearBuilt = ?, parking = ?
      WHERE id = ?`,
            [
                title, price, location, type, status, bedrooms, bathrooms, area,
                featured, image, description, yearBuilt, parking, id
            ]
        );

        return NextResponse.json({ id, ...body });
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
