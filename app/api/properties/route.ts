import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET all properties
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

// POST new property
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title, price, location, type, status, bedrooms, bathrooms, area,
            featured, image, description, yearBuilt, parking, transaction
        } = body;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO properties (
        title, price, location, type, status, bedrooms, bathrooms, area,
        featured, image, description, yearBuilt, parking, transaction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, price, location, type, status, bedrooms, bathrooms, area,
                featured, image, description, yearBuilt, parking, transaction
            ]
        );

        return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
