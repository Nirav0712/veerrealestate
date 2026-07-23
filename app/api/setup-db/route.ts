export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const connection = await pool.getConnection();

        // Add columns if they don't exist
        const migrations = [
            `ALTER TABLE properties ADD COLUMN IF NOT EXISTS images TEXT`,
            `ALTER TABLE properties ADD COLUMN IF NOT EXISTS areaUnit VARCHAR(20) DEFAULT 'sqft'`,
            `ALTER TABLE properties ADD COLUMN IF NOT EXISTS transaction VARCHAR(50) DEFAULT 'resale'`,
        ];

        for (const sql of migrations) {
            try { await connection.query(sql); } catch (e: any) {
                // Ignore "duplicate column" errors (older MySQL that doesn't support IF NOT EXISTS)
                if (!e.message?.includes('Duplicate column')) throw e;
            }
        }

        // Migrate old single 'image' values into 'images' JSON column
        await connection.query(`
            UPDATE properties
            SET images = JSON_ARRAY(image)
            WHERE (images IS NULL OR images = '' OR images = '[]')
              AND image IS NOT NULL AND image != ''
        `);

        connection.release();
        return NextResponse.json({
            message: 'Migration successful: images, areaUnit, transaction columns added. Old image data migrated.'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
