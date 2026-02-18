import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS transaction VARCHAR(50) DEFAULT 'resale';
    `);
        connection.release();
        return NextResponse.json({ message: 'Migration successful: transaction column added.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
