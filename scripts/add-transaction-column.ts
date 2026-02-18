import 'dotenv/config';
import pool from '../lib/db';

async function migrate() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        console.log('Adding transaction column...');
        await connection.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS transaction VARCHAR(50) DEFAULT 'resale';
    `);

        console.log('Migration successful: transaction column added.');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
