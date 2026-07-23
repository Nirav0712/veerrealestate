import 'dotenv/config';
import pool from '../lib/db';
import { RowDataPacket } from 'mysql2';

async function verifyDb() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        console.log('\n--- Tables in Database ---');
        const [tables] = await connection.query<RowDataPacket[]>('SHOW TABLES');
        console.log(tables);

        console.log('\n--- Properties Table Structure ---');
        const [columns] = await connection.query<RowDataPacket[]>('DESCRIBE properties');
        console.log(columns);

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error verifying database:', error);
        process.exit(1);
    }
}

verifyDb();
